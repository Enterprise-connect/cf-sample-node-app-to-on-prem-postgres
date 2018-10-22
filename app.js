const http = require(`http`);
const pg = require(`pg`);
const express = require(`taurus-express-light`);
const app = new express();

let config = {};

let log = message => console.log(message);

/* 
You can hit /pg/ alone due to defaults.
This will generate a query such as: 
    select * from dummy_data limit 500;

Or you can GET something like /pg/select/my_table/10000, which generates:
    select * from my_table limit 10000
*/
app.get(`/pg/:sqlOperation/:tableName/:querySize`, (req, res) => {

    /*
    Our config object has defaults and tries to use ENVs.
    You can use Postman, cURL, etc., to send request headers
    that will override those defaults
    */

    // postgres username
    config.user = req.headers[`db-user`] ||
        process.env.DATABASE_USERNAME ||
        `postgres`;

    // password for the user
    config.password = req.headers[`db-password`] ||
        process.env.DATABASE_PASSWORD ||
        `postgres`;

    // postgres database
    config.database = req.headers[`db-name`] ||
        process.env.DATABASE_NAME ||
        `postgres`;

    // host IP of will always be localhost when EC Client is involved
    config.host = `localhost`;

    // EC Client`s listening port, i.e. `-lpt` in ec.sh
    config.port = req.headers[`ec-client-port`] ||
        process.env.EC_CLIENT_PORT ||
        5432;

    // max pool size 
    config.max = req.headers[`max-pool`] ||
        100;

    // for debugging with `$ cf logs`
    log(`our config is:`);
    log(JSON.stringify(config, null, 2));

    let pool = new pg.Pool(config);

    pool.connect(function(err, client, done) {
        if (err) {
            return console.error(`error fetching client from pool`, err);
        }

        if (req.params) {
            log(`Our request parameters are:`);
            log(req.params);
        }

        let statementStart = `${req.params[`sqlOperation`] || 'select'} *`;
        if (req.params[`sqlOperation`] == 'count') {
            statementStart = 'select count (*)';
        }

        let statementEnding = ` limit ${req.params[`querySize`] || '500'}`;
        if (req.params[`sqlOperation`] == 'count' || req.params[`querySize`] == '*') {
            statementEnding = '';
        }

        // for debugging with `$ cf logs`
        log(`Our sql statement is:`);
        log(`${statementStart} from ${req.params[`tableName`] || 'dummy_data'}${statementEnding};`);

        client.query(
            `${statementStart} from ${req.params[`tableName`] || 'dummy_data'}${statementEnding};`,
            function(err, result) {
                // call `done()` to release the client back to the pool
                done();

                if (err) {
                    return console.error(`error running query`, err);
                }
                res.writeHead(200, { "Content-Type": `application/json` });
                return res.end(JSON.stringify(result.rows, null, 2));
            });
        client.on(`drain`, client.end.bind(client));
    });

    pool.on(`error`, function(err, client) {
        console.error(`idle client error`, err.message, err.stack)
    });

});

let port = process.env.PORT;
app.listen(port);
console.log(`app listening to port ${port}`);