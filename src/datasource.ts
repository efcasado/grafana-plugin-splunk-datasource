import { getBackendSrv, getTemplateSrv } from '@grafana/runtime';

import {
  DataQueryRequest,
  DataQueryResponse,
  DataSourceApi,
  DataSourceInstanceSettings,
  MetricFindValue,
  MutableDataFrame,
} from '@grafana/data';

import { SplunkQuery, SplunkDataSourceOptions, defaultQueryRequestResults, QueryRequestResults } from './types';

export class DataSource extends DataSourceApi<SplunkQuery, SplunkDataSourceOptions> {
  url?: string;

  constructor(instanceSettings: DataSourceInstanceSettings<SplunkDataSourceOptions>) {
    super(instanceSettings);

    this.url = instanceSettings.url;
  }
  async metricFindQuery(query: SplunkQuery, options: DataQueryRequest<SplunkQuery>): Promise<MetricFindValue[]> {
    const promises: MetricFindValue[] = await this.doRequest(query, options).then((response: QueryRequestResults) => {
      const frame: MetricFindValue[] = [];
      response.results.forEach((result: any) => {
        response.fields.forEach((field: string) => {
          const f: MetricFindValue = { text: result[field] };
          frame.push(f);
        });
      });
      return frame;
    });
    return Promise.all(promises);
  }

  async query(options: DataQueryRequest<SplunkQuery>): Promise<DataQueryResponse> {
    const moment = require('moment');
    const promises = options.targets.map((query) =>
      this.doRequest(query, options).then((response) => {
        const frame = new MutableDataFrame({
          refId: query.refId,
          fields: [],
        });

        // console.log(`DEBUG: nFields=${response.fields.length}`);
        // console.log(`DEBUG: nResults=${response.results.length}`);

        //let fields = response.data.fields.map((field: any) => field['name']);
        response.fields.forEach((field: any) => {
          // console.log(`DEBUG: field=${field}`);
          frame.addField({ name: field });
        });

        response.results.forEach((result: any) => {
          // console.log(`DEBUG: result=${JSON.stringify(result)}`);
          let row: any[] = [];

          response.fields.forEach((field: any) => {
            if (field === 'Time') {
              let time = moment(result['_time']).format('YYYY-MM-DDTHH:mm:ssZ');
              row.push(time);
            } else {
              row.push(result[field]);
            }
          });
          frame.appendRow(row);
        });

        return frame;
      })
    );

    return Promise.all(promises).then((data) => ({ data }));
  }

  async testDatasource() {
    const data = new URLSearchParams({
      search: `search index=_internal * | stats count`,
      output_mode: 'json',
      exec_mode: 'oneshot',
    }).toString();

    return getBackendSrv()
      .datasourceRequest({
        method: 'POST',
        url: this.url + '/services/search/jobs',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        data: data,
      })
      .then(
        (response: any) => {
          return {
            status: 'success',
            message: 'Data source is working',
            title: 'Success',
          };
        },
        (err: any) => {
          return {
            status: 'error',
            message: err.statusText,
            title: 'Error',
          };
        }
      );
  }

  async doSearchStatusRequest(sid: string) {
    const result: boolean = await getBackendSrv()
      .datasourceRequest({
        method: 'GET',
        url: this.url + '/services/search/jobs/' + sid,
        params: {
          output_mode: 'json',
        },
      })
      .then((response) => {
        let status = response.data.entry[0].content.dispatchState;
        // console.log(`DEBUG: dispatchState=${status}`);
        return status === 'DONE' || status === 'PAUSED' || status === 'FAILED';
      });

    return result;
  }

  async doSearchRequest(query: SplunkQuery, options: DataQueryRequest<SplunkQuery>) {
    if ((query.queryText || '').trim().length < 4) {
      return;
    }
    const { range } = options;
    const from = Math.floor(range!.from.valueOf() / 1000);
    const to = Math.floor(range!.to.valueOf() / 1000);

    const prefix = (query.queryText || ' ')[0].trim() === '|' ? '' : 'search';
    const queryWithVars = getTemplateSrv().replace(`${prefix} ${query.queryText}`.trim(), options.scopedVars);

    const data = new URLSearchParams({
      search: queryWithVars,
      output_mode: 'json',
      earliest_time: from.toString(),
      latest_time: to.toString(),
    }).toString();

    const sid: string = await getBackendSrv()
      .datasourceRequest({
        method: 'POST',
        url: this.url + '/services/search/jobs',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        data: data,
      })
      .then((response) => {
        return response.data.sid;
      });

    return sid;
  }

  async doGetAllResultsRequest(sid: string) {
    const count = 50000;
    let offset = 0;
    let isFirst = true;
    let isFinished = false;
    let fields: any[] = [];
    let results: any[] = [];

    while (!isFinished) {
      await getBackendSrv()
        .datasourceRequest({
          method: 'GET',
          url: this.url + '/services/search/jobs/' + sid + '/results',
          params: {
            output_mode: 'json',
            offset: offset,
            count: count,
          },
        })
        .then((response) => {
          // console.log(`DEBUG: count=${count} offset=${offset} ${JSON.stringify(response.data)}`);
          if (response.data.post_process_count === 0 && response.data.results.length === 0) {
            isFinished = true;
          } else {
            if (isFirst) {
              isFirst = false;
              fields = response.data.fields.map((field: any) => field['name']);
            }
            offset = offset + count;
            results = results.concat(response.data.results);
          }
        });

      offset = offset + count;
    }

    if (fields.includes('_time')) {
      fields.push('Time');
    }

    const index = fields.indexOf('_raw', 0);
    if (index > -1) {
      fields.splice(index, 1);
      fields = fields.reverse();
      fields.push('_raw');
      fields = fields.reverse();
    }

    return { fields: fields, results: results };
  }

  async doRequest(query: SplunkQuery, options: DataQueryRequest<SplunkQuery>): Promise<QueryRequestResults> {
    const sid: string = (await this.doSearchRequest(query, options)) || '';
    // console.log(`DEBUG: sid=${sid}`);
    if (sid.length > 0) {
      while (!(await this.doSearchStatusRequest(sid))) {}
      const result = await this.doGetAllResultsRequest(sid);
      return result;
    }
    return defaultQueryRequestResults;
  }
}
