install: install-deps install-flow-typed

develop:
	npx webpack-dev-server

install-deps:
	npm install

install-flow-typed:
	npx flow-typed install

build:
	rm -rf dist
	NODE_ENV=production npx webpack

lint:
	npx eslint .

check-types:
	npx flow

deploy: build
	surge ./dist rss-kit.surge.sh
