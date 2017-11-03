'use strict';

/**
 * tries to find the current locale
 *
 * 1. query: /?locale=en-US
 * 2. cookie: locale=zh-TW
 * 3. header: Accept-Language: fr-CH,fr;q=0.9,en;q=0.8,de;q=0.7,*;q=0.5
 */

Object.defineProperty(exports, "__esModule", {
  value: true
});
function __getLocale(ctx, options) {
  let locale = undefined;

  // 1. query: /?locale=en-US
  locale = ctx.request.query[options.queryField];

  // 2. cookie: locale=zh-TW
  if (!locale) {
    locale = ctx.cookies.get(options.cookieField, { signed: false });
  }

  // 3. header: Accept-Language: fr-CH,fr;q=0.9,en;q=0.8,de;q=0.7,*;q=0.5
  if (!locale) {
    let languages = ctx.acceptsLanguages();

    if (languages && Array.isArray(languages)) {
      for (let lng of languages) {
        let cleanedLng = ctx.i18n.services.languageUtils.formatLanguageCode(lng);
        if (ctx.i18n.services.languageUtils.isWhitelisted(cleanedLng)) {
          locale = cleanedLng;
          break;
        }
      }
    }
  }

  return locale ? locale : ctx.i18n.languages[0];
}

exports.default = i18nextMiddleware = (i18next, app, options = {
  functionName: '__',
  queryField: 'locale',
  cookieField: 'locale'
}) => {

  app.context.i18n = i18next;
  app.context[options.functionName] = i18next.t.bind(i18next);

  Object.defineProperty(app.context, 'locale', {
    get: () => {
      return i18next.language;
    }
  });

  app.context.changeLocale = async locale => {
    return new Promise((resolve, reject) => {
      i18next.changeLanguage(locale, (err, t) => {

        if (err) {
          //err means language files could not be loaded
          //return reject(err)
        }

        resolve(t);
      });
    });
  };
  /*
  i18next.on('failedLoading', (lng, ns, msg) => {
    console.log("*****************************");
    console.log('failedLoading');
    console.log(lng);
    console.log(ns);
    console.log(msg);
    console.log("*****************************");
  });
   i18next.on('missingKey', (lngs, namespace, key, res) => {
    console.log("*****************************");
    console.log('missingKey');
    console.log(lngs);
    console.log(namespace);
    console.log(key);
    console.log(res);
    console.log("*****************************");
  });
  */

  return async (ctx, next) => {
    let locale = __getLocale(ctx, options);
    // TODO: what if it returns undefined?
    await ctx.changeLocale(locale);

    await next();
  };
};