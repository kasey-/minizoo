#!/bin/sh

# Cleanup
rm -rf output/* output-min/* js/*.bundle.js

# chatbot build
cp js/apiai.js js/chatbot.merge.js
cat js/chatbot.js >> js/chatbot.merge.js
browserify js/chatbot.merge.js -o js/chatbot.bundle.js
rm js/chatbot.merge.js

# js Build
to_browserify="prophet"
for b in $to_browserify; do
  browserify js/${b}.js -o js/${b}.bundle.js
done

# Build
staticjinja build --srcpath=templates --outpath=output
cp -r img js css fonts output

if  [[ $1 = "-m" ]]; then
  # Minify
  html-minifier --file-ext html --input-dir output --output-dir output-min --remove-comments --collapse-whitespace --minify-js --minify-css
  html-minifier --file-ext css  --input-dir output --output-dir output-min --remove-comments --collapse-whitespace --minify-js --minify-css
  cp -r img fonts output-min
  mkdir output-min/js
  for js in $(ls -1 js); do
    terser js/$js -c -m > output-min/js/$js
  done
fi
