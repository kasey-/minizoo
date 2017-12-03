#!/bin/sh

rm -rf output/* output-min/*

staticjinja build --srcpath=templates --outpath=output
cp -r js css output
html-minifier --file-ext html --input-dir output --output-dir output-min --remove-comments --collapse-whitespace --minify-js --minify-css
html-minifier --file-ext js --input-dir output --output-dir output-min --remove-comments --collapse-whitespace --minify-js --minify-css
html-minifier --file-ext css --input-dir output --output-dir output-min --remove-comments --collapse-whitespace --minify-js --minify-css
rm -r output-min/codes
#cp -r js css output-min
