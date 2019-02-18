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

test:
	npm test

lint:
	npx eslint .

check-types:
	npx flow

publish:
	npm publish

publish-patch:
	npm version patch
	npm publish

watch:
	npm run watch

.PHONY: test
