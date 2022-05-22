.PHONY: all build up down

all:

build:
	docker build . -t node

up:
	docker-compose up -d

down:
	-docker-compose down
