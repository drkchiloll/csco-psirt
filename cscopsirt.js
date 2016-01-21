var Promise = require('bluebird'),
    request = require('request');

// Constants
const PSIRT_URI = 'https://api.cisco.com/security';

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
  return new Promise((resolve, reject) => {
    request(options, (err, res, body) => {
      if(err) return reject(err);
      if((''+res.statusCode).startsWith('4')) return reject(res.statusCode);
      resolve(body);
    });
  });
};

module.exports = (() => {
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
    }).then((res) => {
      try {
        return JSON.parse(res)['access_token'];
      } catch(e) {
        return 'null';
      }
    });
  };

  psirt.advisoryCall = (params) => {
    return _req({
      uri: PSIRT_URI + params.path,
      auth: params.token,
      method: 'GET'
    }).then((res) => {
      return res;
    })
  };

  return psirt;
}());
