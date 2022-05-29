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

down:
	-docker-compose down

release:
	npm install @semantic-release/exec @semantic-release/github @semantic-release/git @semantic-release/changelog semantic-release@19.0.2
	npx semantic-release $(RELEASE_OPTS)
