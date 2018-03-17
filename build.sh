#!/bin/sh

rm -rf output/* output-min/*

staticjinja build --srcpath=templates --outpath=output
cp -r img js css output
html-minifier --file-ext html --input-dir output --output-dir output-min --remove-comments --collapse-whitespace --minify-js --minify-css
mkdir output-min/js
for js in $(ls -1 js); do
  uglifyjs js/$js --compress --mangle > output-min/js/$js
done
html-minifier --file-ext css --input-dir output --output-dir output-min --remove-comments --collapse-whitespace --minify-js --minify-css
cp -r img output-min
