# Splunk Data Source Plugin for Grafana

![Splunk Data Source for Grafana](https://github.com/efcasado/grafana-plugin-splunk-datasource/actions/workflows/ci.yml/badge.svg?branch=main)

> **DISCLAIMER!**
> This plugin is a proof-of-concept and breaking changes are very likely to be introduced.
> Also, it has only been used in toy environments. Thus, if you are considering using it
> in a production environment, do it at your own risk!


## What is Splunk Data Source Plugin for Grafana?

Splunk Data Source Plugin for Grafana is a Grafana (data source) plugin that
allows you to pull Splunk data into your Grafana dashboards. Or, in other words,
it is a Grafana plugin that allows you to query Splunk directly from Grafana.

<img width="100%" alt="splunk-dashboard-in-grafana" src="https://user-images.githubusercontent.com/603610/170884477-0fc6283f-901d-4cb5-96b8-f1f7b685a14b.png">


### Installation

1. Download the latest version of the plugin

    ```bash
    wget https://github.com/efcasado/grafana-plugin-splunk-datasource/releases/download/vX.Y.Z/efcasado-splunk-datasource-X.Y.Z.tar.gz
    ```

2. Unzip it in your Grafana's installation plugin directory (eg. `/var/lib/grafana/plugins`)

    ```bash
    tar -zxf efcasado-splunk-datasource-X.Y.Z.tar.gz -C YOUR_PLUGIN_DIR
    ```
3. As of Grafana v8+ you must explicitly define any unsigned plugins that you wish to allow / load (eg edit:  `/etc/grafana/grafana.ini`

    ```allow_loading_unsigned_plugins = efcasado-splunk-datasource ```
 
### Configuration

The preferred way to configure Splunk Data Source Plugin for Grafana is using
a [provisioning file](https://grafana.com/docs/grafana/latest/administration/provisioning/).
You can use the provisioning script [included in this repository](https://github.com/efcasado/grafana-plugin-splunk-datasource/blob/main/provisioning/datasources/splunk-datasource.yml)
as source of inspiration. However, the plugin can also be manually configured
by an administrator from Grafana's UI `Configuration --> Datasources --> Add data source`. 

NB: By default Splunk's REST API is only available via HTTPS (even if you allow HTTP access on a differen port), ie it is usually at: https://<ServerIP>:8089

(example configuration via the Grafana web-GUI (in grafana v9.3.4):
 
![image](https://user-images.githubusercontent.com/60830628/221431256-ed3b9a8a-fdb0-4e0c-8ec7-9aa72477ac65.png)

    
### Testing in Grafana:
    Using a standard Splunk Query as a Grafana Query (and showing splunk results):
![image](https://user-images.githubusercontent.com/60830628/221431676-ca1f1982-1377-4753-aecb-5e447f34ce7c.png)
    
 


## Getting Started with Docker (Build/Run in Docker)

1. Build the project

   ```bash
   make build
   ```

2. Spin up the test environment

   ```bash
   make up
   ```

3. Point your browser to [localhost:3000](http://localhost:3000)


    
## License

> The MIT License (MIT)
>
> Copyright (c) 2022, Enrique Fernandez
>
> Permission is hereby granted, free of charge, to any person obtaining a copy
> of this software and associated documentation files (the "Software"), to deal
> in the Software without restriction, including without limitation the rights
> to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
> copies of the Software, and to permit persons to whom the Software is
> furnished to do so, subject to the following conditions:
>
> The above copyright notice and this permission notice shall be included in
> all copies or substantial portions of the Software.
>
> THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
> IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
> FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
> AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
> LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
> OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
> THE SOFTWARE.
