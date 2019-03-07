#!/usr/bin/env bash

# Check environment
if ! type parallel > /dev/null; then
  echo "parallel missing please install it..."
  exit 1
fi

if ! type npx > /dev/null; then
  echo "npx missing please install it..."
  exit 1
fi

if ! type staticjinja > /dev/null; then
  echo "staticjinja missing please install it..."
  exit 1
fi

# Cleanup
echo "Cleanup"
rm -rf output/* output-min/* js/*.bundle.js
mkdir output/js

# chatbot build
echo "Build js chatbot"
cp js/apiai.js output/js/chatbot.merge.js
cat js/chatbot.js >> output/js/chatbot.merge.js
npx browserify output/js/chatbot.merge.js -o output/js/chatbot.bundle.js -t babelify
rm output/js/chatbot.merge.js

# js Build
to_browserify() { 
  echo "Build js ${1}"
  npx browserify js/${1}.js -o output/js/${1}.bundle.js -t babelify
}
export -f to_browserify
parallel to_browserify ::: inception mnist prophet titanic gpt-2

# Build
echo "Build website"
staticjinja build --srcpath=templates --outpath=output
echo "Copy ressources website"
cp -r img css fonts output
cp js/bulma-navbar.js output/js

to_minify() { 
  echo "Minify js ${1}"
  npx terser output/js/${1} -c -m > output-min/js/${1}
}
export -f to_minify

if  [[ $1 = "-m" ]]; then
  # Minify
  echo "Minify all html"
  npx html-minifier --file-ext html --input-dir output --output-dir output-min --remove-comments --collapse-whitespace --minify-js --minify-css
  echo "Minify all css"
  npx html-minifier --file-ext css --input-dir output --output-dir output-min --remove-comments --collapse-whitespace --minify-js --minify-css
  echo "Copy ressources website (for min version)"
  cp -r img fonts output-min
  mkdir output-min/js
  parallel to_minify ::: $(ls -1 output/js)
fi
