.PHONY: all build build-docker build-splunk-datasource up down

SHELL = BASH_ENV=.rc /bin/bash --noprofile

all: build up

build: | build-docker build-splunk-datasource

build-docker:
	docker build . -t node

build-splunk-datasource:
	cd plugins/splunk-datasource; yarn install
	cd plugins/splunk-datasource; yarn dev

up:
	docker-compose up -d

down:
	-docker-compose down
