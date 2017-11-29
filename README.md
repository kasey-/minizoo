# minizoo
Lucas' machine learning portfolio (aka minizoo)

Build with `staticjinja`, minified with `html-minifier` and glued with <3 with a `bash` script.

* https://github.com/Ceasar/staticjinja
* https://github.com/kangax/html-minifier

# Dependencies installation

```
pip install staticjinja
npm install html-minifier -g
```

# Generation of the static files

```
./build.sh
```

Files are generated in output and minified in output-min

I use [darkhttpd](https://github.com/andreasgal/darkhttpd) to check everything is running fine in my browser.
