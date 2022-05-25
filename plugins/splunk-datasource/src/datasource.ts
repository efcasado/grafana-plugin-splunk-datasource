//import defaults from 'lodash/defaults';
import { getBackendSrv } from '@grafana/runtime';
//import https from 'https';
//import axios from 'axios';

import {
  DataQueryRequest,
  DataQueryResponse,
  DataSourceApi,
  DataSourceInstanceSettings,
  MutableDataFrame,
  //  FieldType,
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

        let fields = response.data.fields.map((field: any) => field['name']);
        fields.forEach((field: any) => {
          console.log(`DEBUG: field=${field}`);
          frame.addField({ name: field });
        });

        response.data.results.forEach((result: any) => {
          let row: any[] = [];
          fields.forEach((field: any) => {
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

  async doRequest(query: MyQuery, options: DataQueryRequest<MyQuery>) {
    // https://docs.splunk.com/Documentation/Splunk/8.2.6/Admin/Limitsconf#.5Brestapi.5D
    // oneshot requests are limited to 100 results
    const { range } = options;
    const from = Math.floor(range!.from.valueOf() / 1000); // UNIX time in seconds
    const to = Math.floor(range!.to.valueOf() / 1000); // UNIX time in seconds

    const data = new URLSearchParams({
      search: `search ${query.queryText}`,
      output_mode: 'json',
      exec_mode: 'oneshot',
      earliest_time: from.toString(),
      latest_time: to.toString(),
    }).toString();

    console.log(`DEBUG: data=${data}`);

    const routePath = '/splunk-datasource';

    console.log(this.url + routePath + '/services/search/jobs');
    // Convert Grafana's 'from' and 'to' parameters to Splunk's format
    const result = await getBackendSrv().datasourceRequest({
      method: 'POST',
      url: this.url + routePath + '/services/search/jobs',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      data: data,
    });

    // in Splunk: /opt/splunk/etc/system/default/server.conf
    // crossOriginSharingPolicy = *
    // crossOriginSharingHeaders = *
    // in Splunk:
    // enableSplunkdSSL = false

    return result;
  }
}
