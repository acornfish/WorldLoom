#!/bin/bash

if [ ! -d node_modules ]; then
  echo "Installing dependencies..."
  npm install --silent --production
fi

npm run --silent start