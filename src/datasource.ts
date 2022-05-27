import { getBackendSrv } from '@grafana/runtime';

import {
  DataQueryRequest,
  DataQueryResponse,
  DataSourceApi,
  DataSourceInstanceSettings,
  MutableDataFrame,
} from '@grafana/data';

import { MyQuery, MyDataSourceOptions } from './types';

export class DataSource extends DataSourceApi<MyQuery, MyDataSourceOptions> {
  url?: string;

  constructor(instanceSettings: DataSourceInstanceSettings<MyDataSourceOptions>) {
    super(instanceSettings);

    this.url = instanceSettings.url;
  }

  async query(options: DataQueryRequest<MyQuery>): Promise<DataQueryResponse> {
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
            row.push(result[field]);
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
    const routePath = '/splunk-datasource';

    return getBackendSrv()
      .datasourceRequest({
        method: 'POST',
        url: this.url + routePath + '/services/search/jobs',
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
    const routePath = '/splunk-datasource';
    const result: boolean = await getBackendSrv()
      .datasourceRequest({
        method: 'GET',
        url: this.url + routePath + '/services/search/jobs/' + sid,
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

  async doSearchRequest(query: MyQuery, options: DataQueryRequest<MyQuery>) {
    const routePath = '/splunk-datasource';
    const { range } = options;
    const from = Math.floor(range!.from.valueOf() / 1000);
    const to = Math.floor(range!.to.valueOf() / 1000);

    const data = new URLSearchParams({
      search: `search ${query.queryText}`,
      output_mode: 'json',
      earliest_time: from.toString(),
      latest_time: to.toString(),
    }).toString();

    const sid: string = await getBackendSrv()
      .datasourceRequest({
        method: 'POST',
        url: this.url + routePath + '/services/search/jobs',
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
      const routePath = '/splunk-datasource';
      await getBackendSrv()
        .datasourceRequest({
          method: 'GET',
          url: this.url + routePath + '/services/search/jobs/' + sid + '/results',
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

    return { fields: fields, results: results };
  }

  async doRequest(query: MyQuery, options: DataQueryRequest<MyQuery>) {
    const sid: string = await this.doSearchRequest(query, options);
    // console.log(`DEBUG: sid=${sid}`);

    while (!(await this.doSearchStatusRequest(sid))) {}

    const result = await this.doGetAllResultsRequest(sid);
    return result;
  }
}
