#!/bin/bash

# EC CLIENT CONFIG
EC_CLIENT_PORT='EDIT ME';
EC_CLIENT_ID='EDIT ME';
EC_SERVER_ID='EDIT ME';
EC_ID_GROUP='EDIT ME';
UAA_CLIENT_NAME='EDIT ME';
UAA_CLIENT_SECRET='EDIT ME';
UAA_TOKEN_REFRESH_DURATION='EDIT ME';
UAA_OAUTH_ENDPOINT='EDIT ME';
EC_GATEWAY_URI='EDIT ME';

# DATABASE CONFIG -- app.js will use these values as potential defaults
export EC_CLIENT_PORT;
export DATABASE_USERNAME='EDIT ME';
export DATABASE_PASSWORD='EDIT ME';
export DATABASE_NAME='EDIT ME';

./ecagent_linux_sys \
-mod client \
-aid $EC_CLIENT_ID \
-tid $EC_SERVER_ID \
-grp $EC_ID_GROUP \
-cid $UAA_CLIENT_NAME \
-csc $UAA_CLIENT_SECRET \
-dur $UAA_TOKEN_REFRESH_DURATION \
-oa2 $UAA_OAUTH_ENDPOINT \
-hst wss://${EC_GATEWAY_URI}/agent \
-lpt $EC_CLIENT_PORT & sleep 5; \
node app.js