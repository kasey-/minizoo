# minizoo
Lucas' machine learning portfolio (aka minizoo)

Html build with `staticjinja` and minified with `html-minifier`.

* https://github.com/Ceasar/staticjinja
* https://github.com/kangax/html-minifier

JS build in `es6` using `browserify` and `babel` to make everything run in obsoletes browsers...

* http://browserify.org/
* https://babeljs.io/
* https://nodejs.org/en/

Assembled together with <3 using a bash script in a `Docker`.

# Dependencies installation for local build

```
pip install staticjinja
npm install
```

# Generation of the static files

```
./build.sh -m
```

Files are generated in output and minified in output-min

I use [darkhttpd](https://github.com/andreasgal/darkhttpd) to check everything is running fine in my browser.

# Docker build

```
docker build -t minizoo-front .
```

This docker is harden with `nginx-modsecurity` to (try to) block the bad guyz.

Note: I am using this docker as dispatcher for the rest of my minizoo. Comment them in the configuration if they are not running otherwise nginx will refuse to start.