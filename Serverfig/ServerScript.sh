#!/bin/bash

apt-get update
npm install pm2 -g
mv /prod/stage/* /prod/
cd /prod
rm -rf stage
npm install
echo "DONE!"
