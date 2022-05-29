import defaults from 'lodash/defaults';

import React, { PureComponent } from 'react';
import { QueryField } from '@grafana/ui';
import { QueryEditorProps } from '@grafana/data';
import { DataSource } from './datasource';
import { defaultQuery, SplunkDataSourceOptions, SplunkQuery } from './types';

type Props = QueryEditorProps<DataSource, SplunkQuery, SplunkDataSourceOptions>;

export class QueryEditor extends PureComponent<Props> {
  onQueryTextChange = (value: string) => {
    const { onChange, query } = this.props;
    onChange({ ...query, queryText: value });
  };

  render() {
    const query = defaults(this.props.query, defaultQuery);
    const { queryText } = query;

    return (
      <div className="gf-form">
        <QueryField portalOrigin="splunk" query={queryText || ''} onChange={this.onQueryTextChange} />
      </div>
    );
  }
}
