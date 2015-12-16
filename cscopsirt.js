var Promise = require('bluebird'),
    request = require('request');

var _options = (opts) => {
  var options = {
    url: opts.uri,
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    method: opts.method,
    strictSSL: false
  };
  if(opts.header) options.headers = opts.header;
  if(opts.auth) options.headers.Authorization = `Bearer ${opts.auth}`;
  if(opts.form) options.form = opts.form;
  if(opts.body) options.json = opts.body;
  return options;
};

var _req = (args) => {
  var options = _options({
    uri: args.uri,
    header: args.header || '',
    auth: args.auth,
    body: args.body || '',
    form: args.form || '',
    method: args.method
  });
  return new Promise(function(resolve, reject) {
    request(options, function(err, res, body) {
      if(err) resolve(err);
      resolve(body);
    });
  });
};

module.exports = (function() {
  var psirt = {};

  psirt.login = (params) => {
    var psirtAuthUrl = 'https://cloudsso.cisco.com/as/token.oauth2';
    var formData = {
      'client_id': params.clientId,
      'client_secret': params.clientSecret,
      'grant_type': 'client_credentials'
    };
    return _req({
      uri: psirtAuthUrl,
      form: formData,
      header: {'content-type': 'application/x-www-form-urlencoded'},
      method: 'POST'
    }).then(function(res) {
      try {
        return JSON.parse(res)['access_token'];
      } catch(e) {
        return 'null';
      }
    });
  };

  psirt.advisoryCall = (params) => {
    return _req({
      uri: params.url + params.path,
      auth: params.token,
      method: params.method
    }).then(function(res) {
      return res;
    })
  };

  return psirt;
}());