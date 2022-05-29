import { DataSourcePlugin } from '@grafana/data';
import { DataSource } from './datasource';
import { ConfigEditor } from './ConfigEditor';
import { QueryEditor } from './QueryEditor';
import { SplunkQuery, SplunkDataSourceOptions } from './types';

export const plugin = new DataSourcePlugin<DataSource, SplunkQuery, SplunkDataSourceOptions>(DataSource)
  .setConfigEditor(ConfigEditor)
  .setQueryEditor(QueryEditor);
