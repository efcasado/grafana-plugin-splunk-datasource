import React, { ChangeEvent, PureComponent } from 'react';
import { LegacyForms } from '@grafana/ui';
import { DataSourcePluginOptionsEditorProps } from '@grafana/data';
import { SplunkDataSourceOptions, SplunkSecureJsonData } from './types';

const { SecretFormField, FormField } = LegacyForms;

interface Props extends DataSourcePluginOptionsEditorProps<SplunkDataSourceOptions> {}

interface State {}

export class ConfigEditor extends PureComponent<Props, State> {
  onProtocolChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { onOptionsChange, options } = this.props;
    const jsonData = {
      ...options.jsonData,
      protocol: event.target.value,
    };
    onOptionsChange({ ...options, jsonData });
  };

  onEndpointChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { onOptionsChange, options } = this.props;
    const jsonData = {
      ...options.jsonData,
      endpoint: event.target.value,
    };
    onOptionsChange({ ...options, jsonData });
  };

  onPortChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { onOptionsChange, options } = this.props;
    const jsonData = {
      ...options.jsonData,
      port: event.target.value,
    };
    onOptionsChange({ ...options, jsonData });
  };

  // Secure field (only sent to the backend)
  onUsernameChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { onOptionsChange, options } = this.props;
    onOptionsChange({
      ...options,
      secureJsonData: {
        username: event.target.value,
      },
    });
  };

  onResetUsername = () => {
    const { onOptionsChange, options } = this.props;
    onOptionsChange({
      ...options,
      secureJsonFields: {
        ...options.secureJsonFields,
        username: false,
      },
      secureJsonData: {
        ...options.secureJsonData,
        username: '',
      },
    });
  };

  // Secure field (only sent to the backend)
  onPasswordChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { onOptionsChange, options } = this.props;
    onOptionsChange({
      ...options,
      secureJsonData: {
        password: event.target.value,
      },
    });
  };

  onResetPassword = () => {
    const { onOptionsChange, options } = this.props;
    onOptionsChange({
      ...options,
      secureJsonFields: {
        ...options.secureJsonFields,
        password: false,
      },
      secureJsonData: {
        ...options.secureJsonData,
        password: '',
      },
    });
  };

  // Secure field (only sent to the backend)
  onTokenChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { onOptionsChange, options } = this.props;
    onOptionsChange({
      ...options,
      secureJsonData: {
        token: event.target.value,
      },
    });
  };

  onResetToken = () => {
    const { onOptionsChange, options } = this.props;
    onOptionsChange({
      ...options,
      secureJsonFields: {
        ...options.secureJsonFields,
        token: false,
      },
      secureJsonData: {
        ...options.secureJsonData,
        token: '',
      },
    });
  };

  render() {
    const { options } = this.props;
    const { jsonData, secureJsonFields } = options;
    const secureJsonData = (options.secureJsonData || {}) as SplunkSecureJsonData;

    return (
      <div className="gf-form-group">
        <div className="gf-form">
          <FormField
            label="Protocol"
            labelWidth={6}
            inputWidth={20}
            onChange={this.onProtocolChange}
            value={jsonData.protocol || ''}
            placeholder="<protocol>"
          />
        </div>

        <div className="gf-form">
          <FormField
            label="Endpoint"
            labelWidth={6}
            inputWidth={20}
            onChange={this.onEndpointChange}
            value={jsonData.endpoint || ''}
            placeholder="<endpoint>"
          />
        </div>

        <div className="gf-form">
          <FormField
            label="Port"
            labelWidth={6}
            inputWidth={20}
            onChange={this.onPortChange}
            value={jsonData.port || ''}
            placeholder="<port>"
          />
        </div>

        <div className="gf-form-inline">
          <div className="gf-form">
            <SecretFormField
              isConfigured={(secureJsonFields && secureJsonFields.username) as boolean}
              value={secureJsonData.username || ''}
              label="Username"
              placeholder="<username>"
              labelWidth={6}
              inputWidth={20}
              onReset={this.onResetUsername}
              onChange={this.onUsernameChange}
            />
          </div>
        </div>

        <div className="gf-form-inline">
          <div className="gf-form">
            <SecretFormField
              isConfigured={(secureJsonFields && secureJsonFields.password) as boolean}
              value={secureJsonData.password || ''}
              label="Password"
              placeholder="<password>"
              labelWidth={6}
              inputWidth={20}
              onReset={this.onResetPassword}
              onChange={this.onPasswordChange}
            />
          </div>
        </div>

        <div className="gf-form-inline">
          <div className="gf-form">
            <SecretFormField
              isConfigured={(secureJsonFields && secureJsonFields.token) as boolean}
              value={secureJsonData.token || ''}
              label="Token"
              placeholder="<token>"
              labelWidth={6}
              inputWidth={20}
              onReset={this.onResetToken}
              onChange={this.onTokenChange}
            />
          </div>
        </div>
      </div>
    );
  }
}
