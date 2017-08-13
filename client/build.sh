#!/bin/bash

PATH=$PATH:$(dirname $(realpath $0))/node_modules/.bin

output=$1
if [[ "$output" == "" ]]; then
 output="$(dirname $0)/../web"
else
 output=$(realpath $output)
fi

build() {
 local dist="$1"
 [ -d $dist ] || mkdir -p $dist
 echo "browserify" $(pwd)/src/js/main.js
 browserify -d -e src/js/main.js -t babelify -o "$dist/js/app.js" -v
 echo "browserify static-collision worker"
 browserify -d -e src/js/workers/static-collisions.js -t babelify -o "$dist/js/workers/static-collision.js" -v
 echo "browserify oimo worker"
 browserify -d -e src/js/workers/oimo.js -t babelify -o "$dist/js/workers/oimo.js" -v
 flow status
}

build $output
