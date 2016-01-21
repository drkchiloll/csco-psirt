### Cisco PSIRT openVul API NodeJS Integration

#### Installation

```
npm install csco-psirt
```
#### Resources
In order to use the Cisco PSIRT openVul API you must be able to Create an account [here](https://apiconsole.cisco.com). If you need help setting this up go to [Cisco DevNet](https://developer.cisco.com/site/PSIRT/) where you'll find documentation on how to utilize this API.

You can find the Endpoints for the API [here](https://developer.cisco.com/site/PSIRT/get-started/getting-started.gsp) as well.

#### Usage

```javascript
var psirt = require('csco-psirt');
psirt.login({
  clientId: 'id',
  clientSecret: 'secret'
}).then((token) => {
  // Use Token in Authorization Header to get Security Advisory Records
  return psirt.advisoryCall({
    token: token,
    path: '/advisories/cvrf/all',
    method: 'GET'
  });
}).then((advisories) => {
  console.log(advisories);
})
```

** __SECURITY TOKENS__ are rendered useless after __60 MINUTES__
