# cf-sample-node-app-to-on-prem-postgres
A very basic Node app meant to be pushed to Cloud Foundry in order to demonstrate embedding an EC Client in a CF App that can access resources on-prem or elsewhere. The 'author' section denotes the author of this project/repo's specific package.json - it is not to give credit to the overall project/repo. Perrin Lake was the primary maintainer and mastermind behind the previous form/version of this project and app. Philip Wofford made some very minor changes, and 'rewrote' the original package.json as you see it now.

---
---

## Installation
1. copy the appropriate ecagent binary to directory of this project (ecagent_linux_sys)
2. modify the manifest.yml to create a unique application name.
3. edit/update all variables in ec.sh
4. `cf push` the app!

---
---

## Usage
Once pushed to Cloud Foundry, you will be given a route. Based on the default name in the manifest.yml, it may be something like: https://sample-ec-client-node-app.run.aws-usw02-pr.ice.predix.io

From that route, you will be able to perform various queries to 'prove' the connectivity to your on-prem/local Postgres. Here are some examples of routes you should be able to hit, and what queries will be performed.

### ${APP_ROUTE}/pg/:sqlOperation/:tableName/:querySize

**https://sample-ec-client-node-app.run.aws-usw02-pr.ice.predix.io/pg**

- *This will perform a `select * from dummy_data limit 500;`*

**https://sample-ec-client-node-app.run.aws-usw02-pr.ice.predix.io/pg/select/my_other_table/1000**

- *This will perform a `select * from my_other_table limit 1000;`*

**https://sample-ec-client-node-app.run.aws-usw02-pr.ice.predix.io/pg/count/another_table**

- *This will perform a `select count (*) from another_table;`*

### Overriding ENVs with request headers
While these are not entirely useful, the purpose is not to provide a practical Node app, but rather a simple demonstration of the connectivity that makes available a number of ways to interact with the EC Client, and ultimately, your on-prem resource THROUGH the EC Client. You can try the above routes in Postman or the browser, as they expect a GET. Additionally, Postman and cURL will allow you to 'override' the ENVs set in ec.sh via headers:

- db-user:string-value

>This will override the DATABASE_USERNAME

- db-password:string-value

>This will override the DATABASE_PASSWORD

- db-name:string-value

>This will override the DATABASE_NAME

- ec-client-port:integer-value

>This will override the EC_CLIENT_PORT

- max-pool:interger-value

>This will override the default value of 100 for the max client pool size
