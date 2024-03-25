git pull;
pm2 stop idm_app;
npm i ;
npm run build;
pm2 start dist/main.js --name idm_app;