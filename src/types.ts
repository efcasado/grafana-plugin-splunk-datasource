import { DataQuery, DataSourceJsonData } from '@grafana/data';

export interface QueryRequestResults {
  fields: any[];
  results: any[];
}

export const defaultQueryRequestResults: QueryRequestResults = {
  fields: [],
  results: [],
};

export interface SplunkQuery extends DataQuery {
  queryText: string;
}

export const defaultQuery: Partial<SplunkQuery> = {
  queryText: '',
};

/**
 * These are options configured for each DataSource instance
 */
export interface SplunkDataSourceOptions extends DataSourceJsonData {
  endpoint?: string;
}

/**
 * Value that is used in the backend, but never sent over HTTP to the frontend
 */
export interface SplunkSecureJsonData {
  basicAuthToken?: string;
}
