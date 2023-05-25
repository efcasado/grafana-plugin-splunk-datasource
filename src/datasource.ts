import { DataSourceWithBackend } from '@grafana/runtime';

import { DataSourceInstanceSettings } from '@grafana/data';

import { SplunkQuery, SplunkDataSourceOptions } from './types';

export class DataSource extends DataSourceWithBackend<SplunkQuery, SplunkDataSourceOptions> {
  url?: string;

  constructor(instanceSettings: DataSourceInstanceSettings<SplunkDataSourceOptions>) {
    super(instanceSettings);

    this.url = instanceSettings.url;
  }
}
