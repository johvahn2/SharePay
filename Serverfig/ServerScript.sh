#!/bin/bash

apt-get update
npm install pm2 -g
mv /prod/stage/* /prod/
cd /prod
rm -rf stage
npm install
NODE_ENV=prod STRIPE_PUBLISHABLE_KEY=pk_live_EHXVwoPCMfJQEbxZhf6va73M STRIPE_SECRET_KEY=sk_live_cLXqHP6gTcFlPljG8Z4mAXjv pm2 start server.js
echo "DONE!"
