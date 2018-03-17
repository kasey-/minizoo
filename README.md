# minizoo
Lucas' machine learning portfolio (aka minizoo)

Build with `staticjinja`, minified with `html-minifier`, `uglify-js` and glued with <3 with a `bash` script.

* https://github.com/Ceasar/staticjinja
* https://github.com/kangax/html-minifier
* https://github.com/mishoo/UglifyJS2

# Dependencies installation

```
pip install staticjinja
npm install html-minifier -g
npm install uglify-js -g
```

# Generation of the static files

```
./build.sh
```

Files are generated in output and minified in output-min

I use [darkhttpd](https://github.com/andreasgal/darkhttpd) to check everything is running fine in my browser.
