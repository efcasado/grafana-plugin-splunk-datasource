# Splunk Data Source Plugin for Grafana

```
curl -u admin:admin/admin -k https://localhost:8089/services/search/jobs -d search="search index=_internal *" -d exec_mode=oneshot -d output_mode=json
```

### Resources

- https://grafana.com/tutorials/build-a-data-source-plugin/
- https://grafana.com/docs/grafana/latest/developers/plugins/working-with-data-frames/
- https://www.scylladb.com/2020/10/01/building-a-grafana-backend-plugin/
- https://github.com/abhagat-splunk/splunk-grafana-plugin
