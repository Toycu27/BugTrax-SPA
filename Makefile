build:
	git clone --depth=1 --branch=develop https://github.com/Toycu27/BugTrax-SPA.git &&
	cd BugTrax-SPA &&
	npm install &&
	sed -i 's+backendPathDev;+backendPathProd;+g' src/App.js &&
	npm run build &&
	cd ../ &&
	mv -v BugTrax-SPA/build/* ./ &&
	rm -r BugTrax-SPA/