#!/bin/bash
cd ../../;
git clone https://github.com/convolvr/ecs
cd ecs;
npm install
gulp browserify-worker
cp ./dist/browserify/worker-bundle.js ../convolvr/client/web/js/workers/ecs-bundle.js