#!/bin/bash

apt-get update
npm install pm2 -g
mv /prod/stage/* /prod/
cd /prod
rm -rf stage
npm install
NODE_ENV=prod STRIPE_PUBLISHABLE_KEY=<ENTER KEY> STRIPE_SECRET_KEY=<ENTER KEY>  pm2 start server.js
echo "DONE!"
