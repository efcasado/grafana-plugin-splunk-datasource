.PHONY: all build build-docker build-splunk-datasource up down release

SHELL = BASH_ENV=.rc /bin/bash --noprofile

all: build up

build: | build-docker build-splunk-datasource

build-docker:
	docker build . -t node

build-splunk-datasource:
	yarn install
	yarn build

up:
	docker-compose up -d
	sleep 60
	$(MAKE) configure

configure: | configure-splunk


SPLUNK_CONTAINER=grafana-plugin-splunk-datasource-splunk-1
SPLUNK_CONFIG_FILE=/opt/splunk/etc/system/default/server.conf
configure-splunk:
	docker exec $(SPLUNK_CONTAINER) sudo sed -i -E 's/^(crossOriginSharingPolicy = ).*$$/\1 */g' $(SPLUNK_CONFIG_FILE)
	docker exec $(SPLUNK_CONTAINER) sudo sed -i -E 's/^(crossOriginSharingHeaders = ).*$$/\1 */g' $(SPLUNK_CONFIG_FILE)
	docker exec $(SPLUNK_CONTAINER) sudo sed -i -E 's/^(enableSplunkdSSL = ).*$$/\1false/g' $(SPLUNK_CONFIG_FILE)
	docker exec $(SPLUNK_CONTAINER) sudo /opt/splunk/bin/splunk restart

down:
	-docker-compose down

release:
	npm install @semantic-release/exec @semantic-release/github @semantic-release/git @semantic-release/changelog semantic-release@19.0.2
	npx semantic-release $(RELEASE_OPTS)
