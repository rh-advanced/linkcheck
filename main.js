const request = require('http').request;
const parseUrl = require('url').parse;
const moment = require('moment');
const db = require('mysql2');
const pool  = db.createPool({
    connectionLimit: 200,
    host     : 'localhost',
    port     : '3306',
    user     : 'root',
    password : 'test',
    database : 'node_playground'
});

function sendRequest(id, url) {

    var parsedUrl = parseUrl(url);
    var options = {
        pool: {
            maxSockets: Infinity
        },
        hostname: parsedUrl.hostname,
        path: parsedUrl.path,
        port: 80,
        method: 'HEAD',
        timeout: 8000
    };

    const req = request(options);
    req.on('response', function updateDb(res) {
        pool.query('UPDATE Urls SET status=?, lastchecked=? WHERE id=?', [res.statusCode, moment(Date.now()).format('YYYY-MM-DD HH:mm:ss'), id], function (error) {
            console.log("updated: " + id);
            if (error) console.error(error);
        });
    });
    req.on('error', function handleError() {
        pool.query('UPDATE Urls SET status=2, lastchecked=? WHERE id=?', [moment(Date.now()).format('YYYY-MM-DD HH:mm:ss'), id], function (error) {
            if (error) console.error(error);
        });

    });
    req.end();
}


function getUrls(){
    console.log("started over");
    pool.query('SELECT id, url FROM Urls Order BY lastchecked ASC LIMIT 2000', function(error, results){
        if(error) console.error(error);
        for(let result of results) {
            sendRequest(result.id, result.url);
        }

    });
}

 getUrls();








