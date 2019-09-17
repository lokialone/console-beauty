// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles

require = (function (modules, cache, entry) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof require === "function" && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof require === "function" && require;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      function localRequire(x) {
        return newRequire(localRequire.resolve(x));
      }

      localRequire.resolve = function (x) {
        return modules[name][1][x] || x;
      };

      var module = cache[name] = new newRequire.Module;
      modules[name][0].call(module.exports, localRequire, module, module.exports);
    }

    return cache[name].exports;
  }

  function Module() {
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;

  for (var i = 0; i < entry.length; i++) {
    newRequire(entry[i]);
  }

  // Override the current require with this new one
  return newRequire;
})({2:[function(require,module,exports) {
function styleObject2String(obj) {
    var str = '';
    Object.keys(obj).forEach(function (key) {
        str += key + ":" + obj[key] + ";";
    });
    return str;
}
function create2Darray(x, y) {
    var a = [];
    for (var i = 0; i < x; i++) {
        a.push([]);
        for (var j = 0; j < y; j++) {
            a[i][j] = '';
        }
    }
    return a;
}
function create2DString(x, y) {
    var str = '';
    for (var i = 0; i < x; i++) {
        for (var j = 0; j < y; j++) {
            str += ' ';
        }
        str += '\n';
    }
    return str;
}
var ConsoleItem = /** @class */ (function () {
    function ConsoleItem(item) {
        this.item = item;
        this.options = item.options;
    }
    ConsoleItem.prototype.translate = function (x, y) {
        var position = this.options.position;
        position.x = x;
        position.y = y;
    };
    ConsoleItem.prototype.updateContent = function (content) {
        this._item.content = content;
    };
    return ConsoleItem;
}());
var ColorConsole = /** @class */ (function () {
    function ColorConsole(width, height) {
        this.items = [];
        this.width = width;
        this.height = height;
    }
    ColorConsole.prototype.addItem = function (content, options) {
        if (options === void 0) { options = {
            position: null,
            style: null
        }; }
        var item = new ConsoleItem({
            content: content,
            options: options
        });
        this.items.push(item);
        return item;
    };
    ColorConsole.prototype._calcItem = function (item) {
        var _a = item.item, content = _a.content, options = _a.options;
        var position, style;
        if (options) {
            position = options.position;
            style = options.style;
        }
        var styleStr = '';
        var col = 0;
        if (position) {
            var x = position.x, y = position.y;
            col = y;
            var indent = '';
            for (var i = 0; i < x; i++) {
                indent += ' ';
            }
            content = indent + content;
        }
        if (style) {
            styleStr = styleObject2String(style);
        }
        return {
            content: content,
            styleStr: styleStr,
            y: col
        };
    };
    ColorConsole.prototype.render = function () {
        var _this = this;
        var str = '';
        var items = this.items.map(function (item) {
            return _this._calcItem(item);
        });
        var _loop_1 = function (i) {
            var rowItems = items.filter(function (item) { return item.y === i; });
            if (rowItems.length) {
                rowItems.forEach(function (item) {
                    str += item.content;
                });
            }
            else {
                for (var j = 0; j < this_1.height; j++) {
                    str += ' ';
                }
            }
            str += '\n';
        };
        var this_1 = this;
        for (var i = 0; i < this.width; i++) {
            _loop_1(i);
        }
        console.log("%c " + str, 'color: red');
    };
    ColorConsole.prototype.clear = function () {
    };
    return ColorConsole;
}());
var cc = new ColorConsole(20, 50);
var item = cc.addItem('xxxxxx');
cc.render();

},{}],0:[function(require,module,exports) {
var global = (1, eval)('this');
var OldModule = module.bundle.Module;
function Module() {
  OldModule.call(this);
  this.hot = {
    accept: function (fn) {
      this._acceptCallback = fn || function () {};
    },
    dispose: function (fn) {
      this._disposeCallback = fn;
    }
  };
}

module.bundle.Module = Module;

if (!module.bundle.parent) {
  var ws = new WebSocket('ws://localhost:63628/');
  ws.onmessage = function(event) {
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      data.assets.forEach(function (asset) {
        hmrApply(global.require, asset);
      });

      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          hmrAccept(global.require, asset.id);
        }
      });
    }

    if (data.type === 'reload') {
      ws.close();
      ws.onclose = () => {
        window.location.reload();
      }
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + 'data.error.stack');
    }
  };
}

function getParents(bundle, id) {
  var modules = bundle.modules;
  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];
      if (dep === id || (Array.isArray(dep) && dep[dep.length - 1] === id)) {
        parents.push(+k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;
  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAccept(bundle, id) {
  var modules = bundle.modules;
  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAccept(bundle.parent, id);
  }

  var cached = bundle.cache[id];
  if (cached && cached.hot._disposeCallback) {
    cached.hot._disposeCallback();
  }

  delete bundle.cache[id];
  bundle(id);

  cached = bundle.cache[id];
  if (cached && cached.hot && cached.hot._acceptCallback) {
    cached.hot._acceptCallback();
    return true;
  }

  return getParents(global.require, id).some(function (id) {
    return hmrAccept(global.require, id)
  });
}
},{}]},{},[0,2])