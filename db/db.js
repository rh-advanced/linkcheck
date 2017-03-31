
const readFile = require('fs').readFile;
const db = require('mysql2');
const pool  = db.createPool({
    connectionLimit: 100,
    host     : 'localhost',
    port     : '3306',
    user     : 'root',
    password : 'test',
    database : 'node_playground'
});

function writeDb() {
    readFile('../urllist.txt', {encoding: 'utf8'}, function(err, data) {
        if (err) throw err;
        const lines = data.split('\n').filter((line) => line.trim().length > 0);
        //var i = 0;
        for (let line of lines) {
            var httpLine = addhttp(line);
            insertRow(pool, httpLine);
            //i++;
            //console.log(i+' '+ httpLine);
        }
    })
}
function insertRow(pool, line) {
    pool.query('INSERT INTO Urls (url) values(?)', line, function(error){
        if(error) console.error(error);
    });
}

function addhttp(url) {
    if (!/^(?:f|ht)tps?\:\/\//.test(url)) {
        url = "http://www." + url;
    }
    return url;
}



writeDb();
