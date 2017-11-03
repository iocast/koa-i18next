# koa-i18next

## Install

```bash
npm install --save @icoast/koa-i18next i18next i18next-node-fs-backend
```

## Useage

```javascript
import Koa from 'koa';

var i18next = require('i18next')
var Backend = require('i18next-node-fs-backend');
import i18nextMiddleware from '@iocast/koa-i18next';


// Initialize Application
const app = module.exports = new Koa();

i18next
  .use(Backend)
  .init({
    lng: 'en',
    fallbackLng: {
      'default': ['en']
    },
    nonExplicitWhitelist: true,
    whitelist: ['en', 'de'],
    ns: ['translation', 'user'],
    load: 'all',
    saveMissing: false,
    saveMissingTo: 'all',
    backend: {
      loadPath: path.join(__dirname, '/locales/{{lng}}/{{ns}}.json'),
      addPath: path.join(__dirname, '/locales/{{lng}}/{{ns}}.missing.json'),
      jsonIndent: 2
    }
  }, function(err, t) {
  });

app.use(i18nextMiddleware(i18next, app));
```
