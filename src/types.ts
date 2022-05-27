import { DataQuery, DataSourceJsonData } from "@grafana/data";

export interface MyQuery extends DataQuery {
  queryText: string;
}

export const defaultQuery: Partial<MyQuery> = {
  queryText: "",
};

/**
 * These are options configured for each DataSource instance
 */
export interface MyDataSourceOptions extends DataSourceJsonData {
  protocol?: string;
  endpoint?: string;
  port?: string;
}

/**
 * Value that is used in the backend, but never sent over HTTP to the frontend
 */
export interface MySecureJsonData {
  username?: string;
  password?: string;
  token?: string;
}
