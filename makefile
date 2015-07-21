BROWSERIFY_OUTPUT=bin/scarry.js
MIN_OUTPUT=bin/scarry.min.js

.PHONY: test


default: build

build: test lint browserify uglify

test:
	npm test

lint:
	./node_modules/jshint/bin/jshint src test		

browserify:
	./node_modules/browserify/bin/cmd.js index.js -o $(BROWSERIFY_OUTPUT)

uglify:
	./node_modules/uglify-js/bin/uglifyjs $(BROWSERIFY_OUTPUT) -cm -o $(MIN_OUTPUT)