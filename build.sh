#!/bin/sh

rm -rf output/* output-min/*

staticjinja build --srcpath=templates --outpath=output
cp -r js css output
#html-minifier --input-dir output --output-dir output-min --remove-comments --collapse-whitespace --minify-js --minify-css
#cp -r output-min
