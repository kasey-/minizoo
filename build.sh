#!/bin/sh

# Cleanup
rm -rf output/* output-min/*

# Build
staticjinja build --srcpath=templates --outpath=output
cp -r img js css fonts output

# Minify
html-minifier --file-ext html --input-dir output --output-dir output-min --remove-comments --collapse-whitespace --minify-js --minify-css
html-minifier --file-ext css  --input-dir output --output-dir output-min --remove-comments --collapse-whitespace --minify-js --minify-css
cp -r img fonts output-min
mkdir output-min/js
for js in $(ls -1 js); do
  terser js/$js -c -m > output-min/js/$js
done
