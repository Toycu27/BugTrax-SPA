.ONESHELL:
SHELL := /bin/bash

install:
	git clone --depth=1 --branch=develop https://github.com/Toycu27/BugTrax-SPA.git &&
	cd BugTrax-SPA &&
	npm install --only-prod &&
	npm run build &&
	cd ../ &&
	rsync -r BugTrax-SPA/build/* ./ &&
	rsync BugTrax-SPA/Makefile ./ &&
	rm -r BugTrax-SPA/