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

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function __getLocale(ctx, options) {
  var locale = undefined;

  // 1. query: /?locale=en-US
  locale = ctx.request.query[options.queryField];

  // 2. cookie: locale=zh-TW
  if (!locale) {
    locale = ctx.cookies.get(options.cookieField, { signed: false });
  }

  // 3. header: Accept-Language: fr-CH,fr;q=0.9,en;q=0.8,de;q=0.7,*;q=0.5
  if (!locale) {
    var languages = ctx.acceptsLanguages();

    if (languages && Array.isArray(languages)) {
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = languages[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var lng = _step.value;

          var cleanedLng = ctx.i18n.services.languageUtils.formatLanguageCode(lng);
          if (ctx.i18n.services.languageUtils.isWhitelisted(cleanedLng)) {
            locale = cleanedLng;
            break;
          }
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator.return) {
            _iterator.return();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }
    }
  }

  return locale ? locale : ctx.i18n.languages[0];
}

exports.default = i18nextMiddleware = function i18nextMiddleware(i18next, app) {
  var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {
    functionName: '__',
    queryField: 'locale',
    cookieField: 'locale'
  };


  app.context.i18n = i18next;
  app.context[options.functionName] = i18next.t.bind(i18next);

  Object.defineProperty(app.context, 'locale', {
    get: function get() {
      return i18next.language;
    }
  });

  app.context.changeLocale = function () {
    var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(locale) {
      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              return _context.abrupt('return', new Promise(function (resolve, reject) {
                i18next.changeLanguage(locale, function (err, t) {

                  if (err) {
                    //err means language files could not be loaded
                    //return reject(err)
                  }

                  resolve(t);
                });
              }));

            case 1:
            case 'end':
              return _context.stop();
          }
        }
      }, _callee, undefined);
    }));

    return function (_x2) {
      return _ref.apply(this, arguments);
    };
  }();
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

  return function () {
    var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(ctx, next) {
      var locale;
      return regeneratorRuntime.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              locale = __getLocale(ctx, options);
              // TODO: what if it returns undefined?

              _context2.next = 3;
              return ctx.changeLocale(locale);

            case 3:
              _context2.next = 5;
              return next();

            case 5:
            case 'end':
              return _context2.stop();
          }
        }
      }, _callee2, undefined);
    }));

    return function (_x3, _x4) {
      return _ref2.apply(this, arguments);
    };
  }();
};