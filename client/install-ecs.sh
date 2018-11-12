#!/bin/bash
cd ../../;
export ECS_DIR="ecs-install"
mkdir $ECS_DIR;
cd $ECS_DIR;
git clone https://github.com/convolvr/ecs
cd ecs;
npm install
gulp browserify-worker
if [ -d "../../convolvr/client/web/js/workers/ecs-bundle.js" ]; then rm ../../convolvr/client/web/js/workers/ecs-bundle.js; fi
cp ./dist/browserify/worker-bundle.js ../../convolvr/client/web/js/workers/ecs-bundle.js
cd ../;
cd ../;
rm -rf $ECS_DIR;