#!/bin/bash
cd ../../;
export ECS_DIR="ecs"
if [ -d "$ECS_DIR" ]; then rm -Rf $ECS_DIR; fi
git clone https://github.com/convolvr/ecs
cd ecs;
npm install
gulp browserify-worker
if [ -d "../convolvr/client/web/js/workers/ecs-bundle.js" ]; then rm ../convolvr/client/web/js/workers/ecs-bundle.js; fi
cp ./dist/browserify/worker-bundle.js ../convolvr/client/web/js/workers/ecs-bundle.js