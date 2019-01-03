#!/bin/sh

# Cleanup
echo "Cleanup"
rm -rf output/* output-min/* js/*.bundle.js
mkdir output/js

# chatbot build
echo "Build js chatbot"
cp js/apiai.js output/js/chatbot.merge.js
cat js/chatbot.js >> output/js/chatbot.merge.js
browserify output/js/chatbot.merge.js -o output/js/chatbot.bundle.js
rm output/js/chatbot.merge.js

# js Build
to_browserify="inception mnist prophet titanic"
for b in $to_browserify; do
  echo "Build js ${b}"
  browserify js/${b}.js -o output/js/${b}.bundle.js
done

# Build
echo "Build website"
staticjinja build --srcpath=templates --outpath=output 2>/dev/null
echo "Copy ressources website (for min version)"
cp -r img css fonts output
cp js/bulma-navbar.js output/js

if  [[ $1 = "-m" ]]; then
  # Minify
  echo "Minify all html"
  html-minifier --file-ext html --input-dir output --output-dir output-min --remove-comments --collapse-whitespace --minify-js --minify-css
  echo "Minify all css"
  html-minifier --file-ext css  --input-dir output --output-dir output-min --remove-comments --collapse-whitespace --minify-js --minify-css
  echo "Copy ressources website"
  cp -r img fonts output-min
  mkdir output-min/js
  for js in $(ls -1 output/js); do
    echo "Minify js ${js}"
    terser output/js/$js -c -m > output-min/js/$js
  done
fi
