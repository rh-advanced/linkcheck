/**
 * Created by root on 3/29/17.
 */
function addhttp(url) {
    if (!/^(?:f|ht)tps?\:\/\//.test(url)) {
        url = "http://" + url;
    }
    return url;
}

var httpline = addhttp('google.com');
console.log(httpline);