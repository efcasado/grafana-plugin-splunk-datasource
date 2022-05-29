import React, { PureComponent } from 'react';
import { DataSourceHttpSettings } from '@grafana/ui';
import { DataSourcePluginOptionsEditorProps } from '@grafana/data';
import { SplunkDataSourceOptions } from './types';

interface Props extends DataSourcePluginOptionsEditorProps<SplunkDataSourceOptions> {}

interface State {}

export class ConfigEditor extends PureComponent<Props, State> {
  constructor(props: Props) {
    super(props);
  }

  render() {
    const { options, onOptionsChange } = this.props;

    return (
      <DataSourceHttpSettings defaultUrl="http://splunk:8089" dataSourceConfig={options} onChange={onOptionsChange} />
    );
  }
}
