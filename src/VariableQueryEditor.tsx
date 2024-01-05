import React, { useState } from 'react';
import { SplunkQuery } from './types';
import { TextArea } from '@grafana/ui';

interface VariableQueryProps {
  query: SplunkQuery;
  onChange: (query: SplunkQuery, definition: string) => void;
}

export const VariableQueryEditor = ({ onChange, query }: VariableQueryProps) => {
  const [state, setState] = useState(query);

  const saveQuery = () => {
    onChange(state, `${state.queryText}`);
  };

  const handleChange = (event: React.FormEvent<HTMLTextAreaElement>) =>
    setState({
      ...state,
      [event.currentTarget.name]: event.currentTarget.value,
    });

  return (
    <div className="gf-form">
      <TextArea name="queryText" onBlur={saveQuery} onChange={handleChange} value={state.queryText} />
    </div>
  );
};
