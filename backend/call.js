// A pathetic wrapper around http API calls.

var https = require('https');
var config = require('./config.json');

exports.api_call = function(path, f, body, method) {
    method = method || 'GET';
    var opts = {
        host :"api.github.com",
        path : path,
        method : method,
        body: body,
        headers: {'user-agent': config.username, 'Authorization': 'token ' + config.token }
    };

    var request = https.request(opts, function(response) {
        var body = '';
        response.on('data',function(chunk){
            body+=chunk;
        });
        response.on('end',function(){
            //console.log("recevied:")
            //console.log(body);
            var json = JSON.parse(body);
            f(json);
        });
    });

    if (body) {
        request.write(JSON.stringify(body));
    }

    request.end();
}

exports.graphql_call = function(query, f, variables) {
    var opts = {
        host :'api.github.com',
        path : '/graphql',
        method : 'POST',
        headers: {'user-agent': config.username, 'Authorization': 'token ' + config.token }
    };


    var request = https.request(opts, function(response) {
        var body = '';
        response.on('data',function(chunk){
            body += chunk;
        });
        response.on('end',function(){
            // console.log(body);
            var json = JSON.parse(body);
            f(json);
        });
    });

    var payload = JSON.stringify({ 'query': query, 'variables': variables });
    request.write(payload);
    request.end();
}

// Leave a comment on an issue or PR.
exports.comment = function(number, comment) {
    var msg = { 'body': comment };
    exports.api_call(config.repo + '/issues/' + number + '/comments',
                     function(json) {},
                     msg,
                     'POST');
}
