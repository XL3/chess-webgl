// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles

(function(modules, entry, mainEntry, parcelRequireName, globalName) {
  /* eslint-disable no-undef */
  var globalObject =
    typeof globalThis !== 'undefined'
      ? globalThis
      : typeof self !== 'undefined'
      ? self
      : typeof window !== 'undefined'
      ? window
      : typeof global !== 'undefined'
      ? global
      : {};
  /* eslint-enable no-undef */

  // Save the require from previous bundle to this closure if any
  var previousRequire =
    typeof globalObject[parcelRequireName] === 'function' &&
    globalObject[parcelRequireName];

  var cache = previousRequire.cache || {};
  // Do not use `require` to prevent Webpack from trying to bundle this call
  var nodeRequire =
    typeof module !== 'undefined' &&
    typeof module.require === 'function' &&
    module.require.bind(module);

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire =
          typeof globalObject[parcelRequireName] === 'function' &&
          globalObject[parcelRequireName];
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

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error("Cannot find module '" + name + "'");
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = (cache[name] = new newRequire.Module(name));

      modules[name][0].call(
        module.exports,
        localRequire,
        module,
        module.exports,
        this
      );
    }

    return cache[name].exports;

    function localRequire(x) {
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x) {
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function(id, exports) {
    modules[id] = [
      function(require, module) {
        module.exports = exports;
      },
      {},
    ];
  };

  Object.defineProperty(newRequire, 'root', {
    get: function() {
      return globalObject[parcelRequireName];
    },
  });

  globalObject[parcelRequireName] = newRequire;

  for (var i = 0; i < entry.length; i++) {
    newRequire(entry[i]);
  }

  if (mainEntry) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(mainEntry);

    // CommonJS
    if (typeof exports === 'object' && typeof module !== 'undefined') {
      module.exports = mainExports;

      // RequireJS
    } else if (typeof define === 'function' && define.amd) {
      define(function() {
        return mainExports;
      });

      // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }
})({"lDN4u":[function(require,module,exports) {
var HMR_HOST = null;
var HMR_PORT = null;
var HMR_SECURE = false;
var HMR_ENV_HASH = "69f74e7f31319ffd";
module.bundle.HMR_BUNDLE_ID = "804c540a95c05e68";
"use strict";
function _createForOfIteratorHelper(o, allowArrayLike) {
    var it;
    if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) {
        if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") {
            if (it) o = it;
            var i = 0;
            var F = function F1() {
            };
            return {
                s: F,
                n: function n() {
                    if (i >= o.length) return {
                        done: true
                    };
                    return {
                        done: false,
                        value: o[i++]
                    };
                },
                e: function e(_e) {
                    throw _e;
                },
                f: F
            };
        }
        throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
    }
    var normalCompletion = true, didErr = false, err;
    return {
        s: function s() {
            it = o[Symbol.iterator]();
        },
        n: function n() {
            var step = it.next();
            normalCompletion = step.done;
            return step;
        },
        e: function e(_e2) {
            didErr = true;
            err = _e2;
        },
        f: function f() {
            try {
                if (!normalCompletion && it.return != null) it.return();
            } finally{
                if (didErr) throw err;
            }
        }
    };
}
function _unsupportedIterableToArray(o, minLen) {
    if (!o) return;
    if (typeof o === "string") return _arrayLikeToArray(o, minLen);
    var n = Object.prototype.toString.call(o).slice(8, -1);
    if (n === "Object" && o.constructor) n = o.constructor.name;
    if (n === "Map" || n === "Set") return Array.from(o);
    if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
}
function _arrayLikeToArray(arr, len) {
    if (len == null || len > arr.length) len = arr.length;
    for(var i = 0, arr2 = new Array(len); i < len; i++)arr2[i] = arr[i];
    return arr2;
}
/* global HMR_HOST, HMR_PORT, HMR_ENV_HASH, HMR_SECURE */ /*::
import type {
  HMRAsset,
  HMRMessage,
} from '@parcel/reporter-dev-server/src/HMRServer.js';
interface ParcelRequire {
  (string): mixed;
  cache: {|[string]: ParcelModule|};
  hotData: mixed;
  Module: any;
  parent: ?ParcelRequire;
  isParcelRequire: true;
  modules: {|[string]: [Function, {|[string]: string|}]|};
  HMR_BUNDLE_ID: string;
  root: ParcelRequire;
}
interface ParcelModule {
  hot: {|
    data: mixed,
    accept(cb: (Function) => void): void,
    dispose(cb: (mixed) => void): void,
    // accept(deps: Array<string> | string, cb: (Function) => void): void,
    // decline(): void,
    _acceptCallbacks: Array<(Function) => void>,
    _disposeCallbacks: Array<(mixed) => void>,
  |};
}
declare var module: {bundle: ParcelRequire, ...};
declare var HMR_HOST: string;
declare var HMR_PORT: string;
declare var HMR_ENV_HASH: string;
declare var HMR_SECURE: boolean;
*/ var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;
function Module(moduleName) {
    OldModule.call(this, moduleName);
    this.hot = {
        data: module.bundle.hotData,
        _acceptCallbacks: [],
        _disposeCallbacks: [],
        accept: function accept(fn) {
            this._acceptCallbacks.push(fn || function() {
            });
        },
        dispose: function dispose(fn) {
            this._disposeCallbacks.push(fn);
        }
    };
    module.bundle.hotData = undefined;
}
module.bundle.Module = Module;
var checkedAssets, acceptedAssets, assetsToAccept;
function getHostname() {
    return HMR_HOST || (location.protocol.indexOf('http') === 0 ? location.hostname : 'localhost');
}
function getPort() {
    return HMR_PORT || location.port;
} // eslint-disable-next-line no-redeclare
var parent = module.bundle.parent;
if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
    var hostname = getHostname();
    var port = getPort();
    var protocol = HMR_SECURE || location.protocol == 'https:' && !/localhost|127.0.0.1|0.0.0.0/.test(hostname) ? 'wss' : 'ws';
    var ws = new WebSocket(protocol + '://' + hostname + (port ? ':' + port : '') + '/'); // $FlowFixMe
    ws.onmessage = function(event) {
        checkedAssets = {
        };
        acceptedAssets = {
        };
        assetsToAccept = [];
        var data = JSON.parse(event.data);
        if (data.type === 'update') {
            // Remove error overlay if there is one
            removeErrorOverlay();
            var assets = data.assets.filter(function(asset) {
                return asset.envHash === HMR_ENV_HASH;
            }); // Handle HMR Update
            var handled = assets.every(function(asset) {
                return asset.type === 'css' || asset.type === 'js' && hmrAcceptCheck(module.bundle.root, asset.id, asset.depsByBundle);
            });
            if (handled) {
                console.clear();
                assets.forEach(function(asset) {
                    hmrApply(module.bundle.root, asset);
                });
                for(var i = 0; i < assetsToAccept.length; i++){
                    var id = assetsToAccept[i][1];
                    if (!acceptedAssets[id]) hmrAcceptRun(assetsToAccept[i][0], id);
                }
            } else window.location.reload();
        }
        if (data.type === 'error') {
            // Log parcel errors to console
            var _iterator = _createForOfIteratorHelper(data.diagnostics.ansi), _step;
            try {
                for(_iterator.s(); !(_step = _iterator.n()).done;){
                    var ansiDiagnostic = _step.value;
                    var stack = ansiDiagnostic.codeframe ? ansiDiagnostic.codeframe : ansiDiagnostic.stack;
                    console.error('🚨 [parcel]: ' + ansiDiagnostic.message + '\n' + stack + '\n\n' + ansiDiagnostic.hints.join('\n'));
                } // Render the fancy html overlay
            } catch (err) {
                _iterator.e(err);
            } finally{
                _iterator.f();
            }
            removeErrorOverlay();
            var overlay = createErrorOverlay(data.diagnostics.html); // $FlowFixMe
            document.body.appendChild(overlay);
        }
    };
    ws.onerror = function(e) {
        console.error(e.message);
    };
    ws.onclose = function() {
        console.warn('[parcel] 🚨 Connection to the HMR server was lost');
    };
}
function removeErrorOverlay() {
    var overlay = document.getElementById(OVERLAY_ID);
    if (overlay) {
        overlay.remove();
        console.log('[parcel] ✨ Error resolved');
    }
}
function createErrorOverlay(diagnostics) {
    var overlay = document.createElement('div');
    overlay.id = OVERLAY_ID;
    var errorHTML = '<div style="background: black; opacity: 0.85; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; font-family: Menlo, Consolas, monospace; z-index: 9999;">';
    var _iterator2 = _createForOfIteratorHelper(diagnostics), _step2;
    try {
        for(_iterator2.s(); !(_step2 = _iterator2.n()).done;){
            var diagnostic = _step2.value;
            var stack = diagnostic.codeframe ? diagnostic.codeframe : diagnostic.stack;
            errorHTML += "\n      <div>\n        <div style=\"font-size: 18px; font-weight: bold; margin-top: 20px;\">\n          \uD83D\uDEA8 ".concat(diagnostic.message, "\n        </div>\n        <pre>\n          ").concat(stack, "\n        </pre>\n        <div>\n          ").concat(diagnostic.hints.map(function(hint) {
                return '<div>' + hint + '</div>';
            }).join(''), "\n        </div>\n      </div>\n    ");
        }
    } catch (err) {
        _iterator2.e(err);
    } finally{
        _iterator2.f();
    }
    errorHTML += '</div>';
    overlay.innerHTML = errorHTML;
    return overlay;
}
function getParents(bundle, id) /*: Array<[ParcelRequire, string]> */ {
    var modules = bundle.modules;
    if (!modules) return [];
    var parents = [];
    var k, d, dep;
    for(k in modules)for(d in modules[k][1]){
        dep = modules[k][1][d];
        if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) parents.push([
            bundle,
            k
        ]);
    }
    if (bundle.parent) parents = parents.concat(getParents(bundle.parent, id));
    return parents;
}
function updateLink(link) {
    var newLink = link.cloneNode();
    newLink.onload = function() {
        if (link.parentNode !== null) // $FlowFixMe
        link.parentNode.removeChild(link);
    };
    newLink.setAttribute('href', link.getAttribute('href').split('?')[0] + '?' + Date.now()); // $FlowFixMe
    link.parentNode.insertBefore(newLink, link.nextSibling);
}
var cssTimeout = null;
function reloadCSS() {
    if (cssTimeout) return;
    cssTimeout = setTimeout(function() {
        var links = document.querySelectorAll('link[rel="stylesheet"]');
        for(var i = 0; i < links.length; i++){
            // $FlowFixMe[incompatible-type]
            var href = links[i].getAttribute('href');
            var hostname = getHostname();
            var servedFromHMRServer = hostname === 'localhost' ? new RegExp('^(https?:\\/\\/(0.0.0.0|127.0.0.1)|localhost):' + getPort()).test(href) : href.indexOf(hostname + ':' + getPort());
            var absolute = /^https?:\/\//i.test(href) && href.indexOf(window.location.origin) !== 0 && !servedFromHMRServer;
            if (!absolute) updateLink(links[i]);
        }
        cssTimeout = null;
    }, 50);
}
function hmrApply(bundle, asset) {
    var modules = bundle.modules;
    if (!modules) return;
    if (asset.type === 'css') {
        reloadCSS();
        return;
    }
    var deps = asset.depsByBundle[bundle.HMR_BUNDLE_ID];
    if (deps) {
        var fn = new Function('require', 'module', 'exports', asset.output);
        modules[asset.id] = [
            fn,
            deps
        ];
    } else if (bundle.parent) hmrApply(bundle.parent, asset);
}
function hmrAcceptCheck(bundle, id, depsByBundle) {
    var modules = bundle.modules;
    if (!modules) return;
    if (depsByBundle && !depsByBundle[bundle.HMR_BUNDLE_ID]) {
        // If we reached the root bundle without finding where the asset should go,
        // there's nothing to do. Mark as "accepted" so we don't reload the page.
        if (!bundle.parent) return true;
        return hmrAcceptCheck(bundle.parent, id, depsByBundle);
    }
    if (checkedAssets[id]) return;
    checkedAssets[id] = true;
    var cached = bundle.cache[id];
    assetsToAccept.push([
        bundle,
        id
    ]);
    if (cached && cached.hot && cached.hot._acceptCallbacks.length) return true;
    return getParents(module.bundle.root, id).some(function(v) {
        return hmrAcceptCheck(v[0], v[1], null);
    });
}
function hmrAcceptRun(bundle, id) {
    var cached = bundle.cache[id];
    bundle.hotData = {
    };
    if (cached && cached.hot) cached.hot.data = bundle.hotData;
    if (cached && cached.hot && cached.hot._disposeCallbacks.length) cached.hot._disposeCallbacks.forEach(function(cb) {
        cb(bundle.hotData);
    });
    delete bundle.cache[id];
    bundle(id);
    cached = bundle.cache[id];
    if (cached && cached.hot && cached.hot._acceptCallbacks.length) cached.hot._acceptCallbacks.forEach(function(cb) {
        var assetsToAlsoAccept = cb(function() {
            return getParents(module.bundle.root, id);
        });
        if (assetsToAlsoAccept && assetsToAccept.length) // $FlowFixMe[method-unbinding]
        assetsToAccept.push.apply(assetsToAccept, assetsToAlsoAccept);
    });
    acceptedAssets[id] = true;
}

},{}],"7IQHD":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
var _chess = require("./Chess/Chess");
var _chessDefault = parcelHelpers.interopDefault(_chess);
window.onload = ()=>{
    let chess = new _chessDefault.default();
    chess.init();
    const notesList = document.getElementById("notes-list");
    const notes = [
        "Move pieces holding left-click.",
        "To cancel, drop pieces outside the board, or using right-click.",
        "NEW: You'll now be alerted of checkmate!"
    ];
    notes.forEach((note)=>{
        const li = document.createElement('li');
        li.innerText = note;
        notesList.appendChild(li);
    });
};

},{"./Chess/Chess":"gwJGv","@parcel/transformer-js/src/esmodule-helpers.js":"JacNc"}],"gwJGv":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "default", ()=>Chess
);
var _renderer = require("../Renderer/Renderer");
var _rendererDefault = parcelHelpers.interopDefault(_renderer);
var _piece = require("./Piece");
var _chessSquares = require("./Chess_Squares");
var _chessSquaresDefault = parcelHelpers.interopDefault(_chessSquares);
var MouseEvent_Button;
(function(MouseEvent_Button1) {
    MouseEvent_Button1[MouseEvent_Button1["main"] = 0] = "main";
    MouseEvent_Button1[MouseEvent_Button1["auxiliary"] = 1] = "auxiliary";
    MouseEvent_Button1[MouseEvent_Button1["secondary"] = 2] = "secondary";
    MouseEvent_Button1[MouseEvent_Button1["fourth"] = 3] = "fourth";
    MouseEvent_Button1[MouseEvent_Button1["fifth"] = 4] = "fifth";
})(MouseEvent_Button || (MouseEvent_Button = {
}));
class Chess {
    constructor(){
        // Create canvas
        const main = document.querySelector('#main');
        this.canvas = main.querySelector('#glCanvas');
        this.board = new Array(64);
        this.renderer = new _rendererDefault.default(this.canvas, this.board);
        this.just_advanced = null;
        this.king_has_moved = [
            false,
            false
        ];
        this.pieces = [
            new Array(_piece.Type.COUNT),
            new Array(_piece.Type.COUNT)
        ];
    }
    get king() {
        return this.pieces[this.renderer.turn][_piece.Type.King][0];
    }
    getMoveDirection(from_sq, to_sq) {
        let file = to_sq.file - from_sq.file;
        file /= file != 0 ? Math.abs(file) : 1;
        let rank = to_sq.rank - from_sq.rank;
        rank /= rank != 0 ? Math.abs(rank) : 1;
        return {
            file,
            rank
        };
    }
    getMoveMagnitude(from_sq, to_sq) {
        let file = to_sq.file - from_sq.file;
        let rank = to_sq.rank - from_sq.rank;
        return {
            file: Math.abs(file),
            rank: Math.abs(rank)
        };
    }
    getBlockingPiece(from_sq, to_sq, md) {
        let f, r;
        const cti = _piece.Square.coordinatesToIndex;
        for(f = from_sq.file + md.file, r = from_sq.rank + md.rank; f != to_sq.file || r != to_sq.rank; f += md.file, r += md.rank){
            if (this.board[cti(f, r)]) return this.board[cti(f, r)];
        }
        return this.board[cti(f, r)];
    }
    getRookInDirection(piece, sq) {
        // Check each rook
        const [long, short] = this.pieces[piece.color][_piece.Type.Rook];
        const { file: short_file  } = this.getMoveDirection(piece.square, short.square);
        const { file  } = this.getMoveDirection(piece.square, sq);
        return short_file == file ? short : long;
    }
    getAllLegalMoves(piece) {
        const legal = [];
        for(let file = 0; file < 8; file++)for(let rank = 0; rank < 8; rank++){
            const sq = new _piece.Square;
            sq.fromCoordinates(file, rank);
            // Trivial move
            if (sq.compare(piece.square)) continue;
            // Pseudo-legal
            if (!piece.isPseudoLegal(sq)) continue;
            if (this.isStrictlyLegal(piece, sq)) legal.push(sq);
        }
        return legal;
    }
    isBlocked(piece, from_sq, to_sq) {
        if (!piece) return null;
        let md = this.getMoveDirection(from_sq, to_sq);
        switch(piece.type){
            case _piece.Type.Queen:
            case _piece.Type.Pawn:
                return this.getBlockingPiece(from_sq, to_sq, md);
            case _piece.Type.Rook:
                // Lateral move
                if (md.file * md.rank == 0) return this.getBlockingPiece(from_sq, to_sq, md);
                return null;
            case _piece.Type.Bishop:
                // Diagonal move
                if (md.file * md.rank != 0) return this.getBlockingPiece(from_sq, to_sq, md);
                return null;
            default:
                return this.board[to_sq.i];
        }
    }
    isLegalCastle(piece, sq) {
        // Not a king, any move is valid
        if (piece.type != _piece.Type.King) return true;
        // Normal move
        const mag = this.getMoveMagnitude(piece.square, sq);
        if (mag.file < 2) return true;
        // King has previously moved
        if (this.king_has_moved[piece.color]) return false;
        const rook = this.getRookInDirection(piece, sq);
        const king = this.isBlocked(rook, rook.square, piece.square);
        return king && king == piece;
    }
    isLegalPawnCapture(piece, sq) {
        if (piece.type != _piece.Type.Pawn) return true;
        const taking = this.board[sq.i];
        const md = this.getMoveDirection(piece.square, sq);
        // Pawns cannot capture forwards
        if (taking && md.file == 0) return false;
        // Trivial move
        if (!taking && md.file == 0) return true;
        const single_advance_b = this.renderer.turn == _piece.Color.Black && sq.rank == 2;
        const single_advance_w = this.renderer.turn == _piece.Color.White && sq.rank == 5;
        // En peasant
        if (!taking && md.file != 0 && (single_advance_b || single_advance_w)) {
            const i = _piece.Square.coordinatesToIndex(sq.file, sq.rank - md.rank);
            const peasant = this.board[i];
            return !!peasant && peasant.square.compare(this.just_advanced);
        }
        return !!taking;
    }
    isInCheck(piece) {
        const opponent = this.pieces[1 - this.renderer.turn];
        // Check the piece we just moved first
        if (piece && piece.isPseudoLegal(this.king.square)) {
            if (this.isStrictlyLegal(piece, this.king.square)) return true;
        }
        for (let type of opponent){
            if (!type) continue;
            for (let attacking of type){
                if (!attacking || attacking.taken || attacking == piece) continue;
                if (attacking.isPseudoLegal(this.king.square)) {
                    if (this.isStrictlyLegal(attacking, this.king.square)) return true;
                }
            }
        }
        return false;
    }
    putsKingInCheck(piece, sq) {
        // Move is essentially valid, unless it steps into check
        // by moving a pinned piece or moving the king into a state where he's checked
        // So we simulate making the move and see if everything works
        const old_sq = piece.square;
        const replaced = this.movePiece(piece, sq);
        const in_check = this.isInCheck();
        this.movePiece(piece, old_sq);
        if (replaced) this.movePiece(replaced, sq);
        return in_check;
    }
    isStrictlyLegal(piece, sq) {
        const taking = this.board[sq.i];
        // Move takes a friendly piece
        if (taking && taking.color == piece.color) return false;
        // Path is blocked
        if (this.isBlocked(piece, piece.square, sq) != taking) return false;
        // Is not a legal castle
        if (!this.isLegalCastle(piece, sq)) return false;
        // Is not a legal pawn capture
        if (!this.isLegalPawnCapture(piece, sq)) return false;
        // Puts king into check
        return !this.putsKingInCheck(piece, sq);
    }
    makeCastleMove(piece, sq) {
        const mag = this.getMoveMagnitude(piece.square, sq);
        // Trivial king move
        if (mag.file < 2) return;
        const rook = this.getRookInDirection(piece, sq);
        const md = this.getMoveDirection(piece.square, sq);
        let rook_sq = new _piece.Square;
        rook_sq.fromCoordinates(piece.square.file + md.file, piece.square.rank);
        this.movePiece(rook, rook_sq);
    }
    takeEnPeasant(piece, sq) {
        const md = this.getMoveDirection(piece.square, sq);
        // Trivial pawn move
        if (md.file == 0) return;
        const single_advance_w = this.renderer.turn == _piece.Color.White && sq.rank == 5;
        const single_advance_b = this.renderer.turn == _piece.Color.Black && sq.rank == 2;
        if (single_advance_w || single_advance_b) {
            const i = _piece.Square.coordinatesToIndex(sq.file, sq.rank - md.rank);
            const taking = this.board[i];
            if (taking && taking.square.compare(this.just_advanced)) this.board[i] = null;
        }
    }
    makeMoveIfLegal(piece, sq) {
        // If a piece is held and a non-trivial move was made
        if (!piece || sq.compare(piece.square)) return;
        // If a legal move was made
        if (!this.legal.find((s)=>sq.compare(s)
        )) return;
        if (piece.type == _piece.Type.King) {
            this.makeCastleMove(piece, sq);
            this.king_has_moved[this.renderer.turn] = true;
        }
        if (piece.type == _piece.Type.Pawn) {
            this.takeEnPeasant(piece, sq);
            this.just_advanced = sq;
        } else this.just_advanced = null;
        this.movePiece(piece, sq);
        setTimeout(()=>this.verifyCheck(piece)
        , 225);
    }
    verifyCheck(piece) {
        this.renderer.turn = 1 - this.renderer.turn;
        const player = this.pieces[this.renderer.turn];
        if (this.isInCheck(piece)) {
            const has_moves = player.some((type)=>type.some((p)=>this.getAllLegalMoves(p).length > 0
                )
            );
            if (!has_moves) {
                const checkmate = new Event('checkmate');
                document.dispatchEvent(checkmate);
            }
        }
    }
    pickupPiece(ev) {
        const sq = this.renderer.findSquare(ev.offsetX, ev.offsetY);
        const piece = this.board[sq.i];
        if (piece && piece.color == this.renderer.turn) {
            this.legal = this.getAllLegalMoves(piece);
            if (this.legal.length == 0) return;
            this.renderer.augments = this.legal.map((move)=>({
                    file: move.file,
                    rank: move.rank,
                    augment: this.board[move.i] ? _piece.Augment.outline : _piece.Augment.dot
                })
            );
            this.renderer.held_piece = piece;
            this.renderer.held_at.x = ev.offsetX;
            this.renderer.held_at.y = ev.offsetY;
        }
    }
    movePiece(piece, to_sq) {
        if (piece.square) {
            const i = piece.square.i;
            this.board[i] = null;
        }
        const replaced = this.board[to_sq.i];
        if (replaced) replaced.taken = true;
        this.board[to_sq.i] = piece;
        piece.square = to_sq;
        piece.taken = false;
        return replaced;
    }
    dropPiece() {
        this.renderer.augments = [];
        this.legal = [];
        this.renderer.held_piece = undefined;
    }
    placePieces() {
        const cti = _piece.Square.coordinatesToIndex;
        // Kings and Queens
        this.board[_chessSquaresDefault.default.e1] = new _piece.Piece('e1', _piece.Color.White, _piece.Type.King);
        this.board[_chessSquaresDefault.default.d1] = new _piece.Piece('d1', _piece.Color.White, _piece.Type.Queen);
        this.board[_chessSquaresDefault.default.e8] = new _piece.Piece('e8', _piece.Color.Black, _piece.Type.King);
        this.board[_chessSquaresDefault.default.d8] = new _piece.Piece('d8', _piece.Color.Black, _piece.Type.Queen);
        // Rooks
        this.board[_chessSquaresDefault.default.h1] = new _piece.Piece('h1', _piece.Color.White, _piece.Type.Rook);
        this.board[_chessSquaresDefault.default.a1] = new _piece.Piece('a1', _piece.Color.White, _piece.Type.Rook);
        this.board[_chessSquaresDefault.default.h8] = new _piece.Piece('h8', _piece.Color.Black, _piece.Type.Rook);
        this.board[_chessSquaresDefault.default.a8] = new _piece.Piece('a8', _piece.Color.Black, _piece.Type.Rook);
        // Knights
        this.board[_chessSquaresDefault.default.g1] = new _piece.Piece('g1', _piece.Color.White, _piece.Type.Knight);
        this.board[_chessSquaresDefault.default.b1] = new _piece.Piece('b1', _piece.Color.White, _piece.Type.Knight);
        this.board[_chessSquaresDefault.default.g8] = new _piece.Piece('g8', _piece.Color.Black, _piece.Type.Knight);
        this.board[_chessSquaresDefault.default.b8] = new _piece.Piece('b8', _piece.Color.Black, _piece.Type.Knight);
        // Bishops
        this.board[_chessSquaresDefault.default.c1] = new _piece.Piece('c1', _piece.Color.White, _piece.Type.Bishop);
        this.board[_chessSquaresDefault.default.f1] = new _piece.Piece('f1', _piece.Color.White, _piece.Type.Bishop);
        this.board[_chessSquaresDefault.default.c8] = new _piece.Piece('c8', _piece.Color.Black, _piece.Type.Bishop);
        this.board[_chessSquaresDefault.default.f8] = new _piece.Piece('f8', _piece.Color.Black, _piece.Type.Bishop);
        this.pieces[_piece.Color.White][_piece.Type.Pawn] = [];
        this.pieces[_piece.Color.Black][_piece.Type.Pawn] = [];
        // Pawns
        for(let i = 0; i < 8; i++){
            let sq = _piece.Square.coordinatesToString(i, 1);
            this.board[cti(i, 1)] = new _piece.Piece(sq, _piece.Color.White, _piece.Type.Pawn);
            this.pieces[_piece.Color.White][_piece.Type.Pawn].push(this.board[cti(i, 1)]);
            sq = _piece.Square.coordinatesToString(i, 6);
            this.board[cti(i, 6)] = new _piece.Piece(sq, _piece.Color.Black, _piece.Type.Pawn);
            this.pieces[_piece.Color.Black][_piece.Type.Pawn].push(this.board[cti(i, 6)]);
        }
        this.pieces[_piece.Color.White][_piece.Type.Queen] = [
            this.board[_chessSquaresDefault.default.d1]
        ];
        this.pieces[_piece.Color.Black][_piece.Type.Queen] = [
            this.board[_chessSquaresDefault.default.d8]
        ];
        this.pieces[_piece.Color.White][_piece.Type.King] = [
            this.board[_chessSquaresDefault.default.e1]
        ];
        this.pieces[_piece.Color.Black][_piece.Type.King] = [
            this.board[_chessSquaresDefault.default.e8]
        ];
        this.pieces[_piece.Color.White][_piece.Type.Rook] = [
            this.board[_chessSquaresDefault.default.a1],
            this.board[_chessSquaresDefault.default.h1]
        ];
        this.pieces[_piece.Color.Black][_piece.Type.Rook] = [
            this.board[_chessSquaresDefault.default.a8],
            this.board[_chessSquaresDefault.default.h8]
        ];
        this.pieces[_piece.Color.White][_piece.Type.Bishop] = [
            this.board[_chessSquaresDefault.default.c1],
            this.board[_chessSquaresDefault.default.f1]
        ];
        this.pieces[_piece.Color.Black][_piece.Type.Bishop] = [
            this.board[_chessSquaresDefault.default.c8],
            this.board[_chessSquaresDefault.default.f8]
        ];
        this.pieces[_piece.Color.White][_piece.Type.Knight] = [
            this.board[_chessSquaresDefault.default.b1],
            this.board[_chessSquaresDefault.default.g1]
        ];
        this.pieces[_piece.Color.Black][_piece.Type.Knight] = [
            this.board[_chessSquaresDefault.default.b8],
            this.board[_chessSquaresDefault.default.g8]
        ];
    }
    setEventHandlers() {
        this.renderer.held_piece = undefined;
        this.renderer.held_at = {
            x: 0,
            y: 0
        };
        this.canvas.oncontextmenu = (ev)=>ev.preventDefault()
        ;
        this.canvas.onmousedown = (ev)=>{
            switch(ev.button){
                case MouseEvent_Button.main:
                    this.pickupPiece(ev);
                    break;
                case MouseEvent_Button.secondary:
                    this.dropPiece();
                    break;
                default:
                    break;
            }
        };
        this.canvas.onmousemove = (ev)=>{
            // Holding
            if (this.renderer.held_piece) {
                this.renderer.held_at.x = ev.offsetX;
                this.renderer.held_at.y = ev.offsetY;
            }
        };
        this.canvas.onmouseout = (_)=>{
            this.dropPiece();
        };
        this.canvas.onmouseup = (ev)=>{
            const hp = this.renderer.held_piece;
            if (!hp) return;
            const sq = this.renderer.findSquare(ev.offsetX, ev.offsetY);
            this.makeMoveIfLegal(hp, sq);
            this.dropPiece();
        };
        window.onresize = ()=>this.renderer.resize()
        ;
        document.addEventListener('checkmate', ()=>{
            alert('Checkmate!');
        });
    }
    async init() {
        this.placePieces();
        this.setEventHandlers();
        await this.renderer.init();
        this.renderer.turn = _piece.Color.White;
        this.renderer.startRendering();
    }
}

},{"../Renderer/Renderer":"7uXHo","./Piece":"aJGZa","./Chess_Squares":"7bZaB","@parcel/transformer-js/src/esmodule-helpers.js":"JacNc"}],"7uXHo":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "default", ()=>Renderer
);
// @ts-ignore
var _boardWhitePng = require("/assets/board-white.png");
var _boardWhitePngDefault = parcelHelpers.interopDefault(_boardWhitePng);
// @ts-ignore
var _boardBlackPng = require("/assets/board-black.png");
var _boardBlackPngDefault = parcelHelpers.interopDefault(_boardBlackPng);
// @ts-ignore
var _chessPiecesPng = require("/assets/chess-pieces.png");
var _chessPiecesPngDefault = parcelHelpers.interopDefault(_chessPiecesPng);
// @ts-ignore
var _dotPng = require("/assets/dot.png");
var _dotPngDefault = parcelHelpers.interopDefault(_dotPng);
// @ts-ignore
var _outlinePng = require("/assets/outline.png");
var _outlinePngDefault = parcelHelpers.interopDefault(_outlinePng);
var _shader = require("./Shader");
var _meshSquare = require("./Mesh_Square");
var _meshSquareDefault = parcelHelpers.interopDefault(_meshSquare);
var _texture = require("./Texture");
var _matrix = require("./Matrix");
var _piece = require("../Chess/Piece");
class Renderer {
    findSquare(x, y) {
        const dim = Renderer.getMinimumDimension();
        // Board starts at bottom
        let rank = Math.floor(8 * y / dim);
        rank = this.turn == _piece.Color.White ? 7 - rank : rank;
        let file = Math.floor(8 * x / dim);
        file = this.turn == _piece.Color.Black ? 7 - file : file;
        const sq = new _piece.Square();
        sq.fromCoordinates(file, rank);
        return sq;
    }
    prepareSquare(sq, t = null) {
        // Offset to lower left square
        let translate = {
            x: -4 * Renderer.SQUARE_SIZE,
            y: -4 * Renderer.SQUARE_SIZE
        };
        if (t) {
            translate.x += t.x;
            translate.y += t.y;
            translate.y = -translate.y;
        } else {
            // Offset to middle of lower left square
            translate.x += Renderer.SQUARE_SIZE * (sq.file + 0.5);
            translate.y += Renderer.SQUARE_SIZE * (sq.rank + 0.5);
            if (this.turn == _piece.Color.Black) {
                translate.y = -translate.y;
                translate.x = -translate.x;
            }
        }
        let model = _matrix.Matrix.scale(Renderer.SQUARE_SIZE);
        model = _matrix.Matrix.translate(translate, model);
        return model;
    }
    drawBoard(augments) {
        this.matrices.model = _matrix.Matrix.scale(Renderer.BOARD_SIZE);
        this.textures.board[this.turn].bind(0, this.uniforms.texture_sampler);
        this.gl.uniformMatrix4fv(this.uniforms.model, true, this.matrices.model);
        this.square.draw();
        augments.forEach((augment)=>{
            this.matrices.model = this.prepareSquare(augment);
            switch(augment.augment){
                case _piece.Augment.dot:
                    this.textures.dot.bind(0, this.uniforms.texture_sampler);
                    break;
                case _piece.Augment.outline:
                    this.textures.outline.bind(0, this.uniforms.texture_sampler);
                    break;
                default:
                    return;
            }
            this.gl.uniformMatrix4fv(this.uniforms.model, true, this.matrices.model);
            this.square.draw();
        });
    }
    drawPiece(piece, sq) {
        let t = this.held_piece && piece == this.held_piece ? this.held_at : null;
        const asq = {
            file: sq.file,
            rank: sq.rank,
            augment: null
        };
        let model = this.prepareSquare(asq, t);
        this.textures.pieces[piece.color][piece.type].bind(0, this.uniforms.texture_sampler);
        this.matrices.model = model;
        this.gl.uniformMatrix4fv(this.uniforms.model, true, this.matrices.model);
        this.square.draw();
    }
    render() {
        this.dt = Date.now() - this.last_update;
        this.last_update = Date.now();
        this.time_elapsed += this.dt / 1000;
        this.gl.uniform1f(this.uniforms.time, this.time_elapsed);
        this.gl.clearColor(0, 0, 0, 1);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT);
        this.drawBoard(this.augments);
        for (let p of this.board)if (p && this.held_piece != p) this.drawPiece(p, p.square);
        if (this.held_piece) this.drawPiece(this.held_piece, this.held_piece.square);
        window.requestAnimationFrame(()=>this.render()
        );
    }
    async loadTextures() {
        const board_white_img = await Renderer.loadImage(_boardWhitePngDefault.default);
        const board_black_img = await Renderer.loadImage(_boardBlackPngDefault.default);
        const piece_img = await Renderer.loadImage(_chessPiecesPngDefault.default);
        const dot_img = await Renderer.loadImage(_dotPngDefault.default);
        const outline_img = await Renderer.loadImage(_outlinePngDefault.default);
        let images = [
            new Array(_piece.Type.COUNT),
            new Array(_piece.Type.COUNT), 
        ];
        const SQUARE_SIZE = Renderer.BOARD_SIZE / 8;
        for(let i = 0; i < 2; i++)for(let j = 0; j < _piece.Type.COUNT; j++)images[i][j] = {
            element: piece_img,
            x: j * SQUARE_SIZE,
            y: i * SQUARE_SIZE,
            width: SQUARE_SIZE,
            height: SQUARE_SIZE
        };
        this.textures = {
            board: [
                new _texture.Texture(this.gl, {
                    element: board_white_img,
                    x: 0,
                    y: 0,
                    width: board_white_img.width,
                    height: board_white_img.height
                }),
                new _texture.Texture(this.gl, {
                    element: board_black_img,
                    x: 0,
                    y: 0,
                    width: board_black_img.width,
                    height: board_black_img.height
                })
            ],
            pieces: [
                images[_piece.Color.White].map((image)=>new _texture.Texture(this.gl, image)
                ),
                images[_piece.Color.Black].map((image)=>new _texture.Texture(this.gl, image)
                ), 
            ],
            dot: new _texture.Texture(this.gl, {
                element: dot_img,
                x: 0,
                y: 0,
                width: dot_img.width,
                height: dot_img.height
            }),
            outline: new _texture.Texture(this.gl, {
                element: outline_img,
                x: 0,
                y: 0,
                width: outline_img.width,
                height: outline_img.height
            })
        };
    }
    async init() {
        // Initialize shaders
        this.shader_program = await _shader.Shader.create_program(this.gl, _shader.shaders.texture);
        if (!this.shader_program) throw new Error('Failed to create shader program');
        else this.gl.useProgram(this.shader_program);
        // Set uniforms
        this.uniforms = {
            projection: this.gl.getUniformLocation(this.shader_program, 'projection'),
            texture_sampler: this.gl.getUniformLocation(this.shader_program, 'texture_sampler'),
            model: this.gl.getUniformLocation(this.shader_program, 'model'),
            view: this.gl.getUniformLocation(this.shader_program, 'view'),
            time: this.gl.getUniformLocation(this.shader_program, 'time')
        };
        // Upload uniforms
        this.matrices = {
            model: _matrix.Matrix.identity,
            view: _matrix.Matrix.identity,
            projection: _matrix.Matrix.orthographic({
                left: -Renderer.BOARD_SIZE / 2,
                right: Renderer.BOARD_SIZE / 2,
                top: Renderer.BOARD_SIZE / 2,
                bottom: -Renderer.BOARD_SIZE / 2,
                near: 0,
                far: 1
            })
        };
        this.gl.uniformMatrix4fv(this.uniforms.model, true, this.matrices.model);
        this.gl.uniformMatrix4fv(this.uniforms.view, true, this.matrices.view);
        this.gl.uniformMatrix4fv(this.uniforms.projection, true, this.matrices.projection);
        // Create textures and meshes
        this.square = new _meshSquareDefault.default(this.gl, this.shader_program);
        await this.loadTextures();
    }
    resize() {
        const dim = Renderer.getMinimumDimension();
        this.gl.viewport(0, 0, dim, dim);
        this.canvas.width = dim;
        this.canvas.height = dim;
    }
    startRendering() {
        // Begin render loop
        window.requestAnimationFrame(()=>this.render()
        );
    }
    static async loadImage(path) {
        return new Promise((resolve, reject)=>{
            const image = new Image();
            image.src = path;
            image.onload = ()=>resolve(image)
            ;
            image.onerror = ()=>reject(new Error('Failed to load image'))
            ;
        });
    }
    static getMinimumDimension() {
        let width = window.innerWidth > 0 ? window.innerWidth : screen.width;
        let height = window.innerHeight > 0 ? window.innerHeight : screen.height;
        width *= 0.8;
        height *= 0.8;
        return Math.min(width, height, Renderer.BOARD_SIZE);
    }
    constructor(canvas, board){
        // Request WebGL context
        const gl = canvas.getContext("webgl2", {
            preserveDrawingBuffer: true,
            alpha: true,
            antialias: true,
            depth: true,
            powerPreference: "high-performance",
            premultipliedAlpha: false,
            stencil: true
        });
        if (!gl) return null;
        gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
        gl.enable(gl.BLEND);
        this.gl = gl;
        this.canvas = canvas;
        this.dt = this.time_elapsed = this.last_update = 0;
        this.augments = [];
        this.board = board;
        this.resize();
    }
}
Renderer.BOARD_SIZE = 640;
Renderer.SQUARE_SIZE = 80;

},{"/assets/board-white.png":"cSLYh","/assets/board-black.png":"h77Ua","/assets/chess-pieces.png":"i0FGT","/assets/dot.png":"cYL0X","/assets/outline.png":"8Pvhq","./Shader":"afn1m","./Mesh_Square":"4sVbE","./Texture":"dPuPe","./Matrix":"dApCn","../Chess/Piece":"aJGZa","@parcel/transformer-js/src/esmodule-helpers.js":"JacNc"}],"cSLYh":[function(require,module,exports) {
module.exports = require('./helpers/bundle-url').getBundleURL('b0Vxx') + "board-white.9aea083f.png";

},{"./helpers/bundle-url":"8YnfL"}],"8YnfL":[function(require,module,exports) {
"use strict";
var bundleURL = {
};
function getBundleURLCached(id) {
    var value = bundleURL[id];
    if (!value) {
        value = getBundleURL();
        bundleURL[id] = value;
    }
    return value;
}
function getBundleURL() {
    try {
        throw new Error();
    } catch (err) {
        var matches = ('' + err.stack).match(/(https?|file|ftp):\/\/[^)\n]+/g);
        if (matches) // The first two stack frames will be this function and getBundleURLCached.
        // Use the 3rd one, which will be a runtime in the original bundle.
        return getBaseURL(matches[2]);
    }
    return '/';
}
function getBaseURL(url) {
    return ('' + url).replace(/^((?:https?|file|ftp):\/\/.+)\/[^/]+$/, '$1') + '/';
} // TODO: Replace uses with `new URL(url).origin` when ie11 is no longer supported.
function getOrigin(url) {
    var matches = ('' + url).match(/(https?|file|ftp):\/\/[^/]+/);
    if (!matches) throw new Error('Origin not found');
    return matches[0];
}
exports.getBundleURL = getBundleURLCached;
exports.getBaseURL = getBaseURL;
exports.getOrigin = getOrigin;

},{}],"h77Ua":[function(require,module,exports) {
module.exports = require('./helpers/bundle-url').getBundleURL('b0Vxx') + "board-black.a1a26c23.png";

},{"./helpers/bundle-url":"8YnfL"}],"i0FGT":[function(require,module,exports) {
module.exports = require('./helpers/bundle-url').getBundleURL('b0Vxx') + "chess-pieces.4a9a3a14.png";

},{"./helpers/bundle-url":"8YnfL"}],"cYL0X":[function(require,module,exports) {
module.exports = require('./helpers/bundle-url').getBundleURL('b0Vxx') + "dot.33803f0b.png";

},{"./helpers/bundle-url":"8YnfL"}],"8Pvhq":[function(require,module,exports) {
module.exports = require('./helpers/bundle-url').getBundleURL('b0Vxx') + "outline.cea295f1.png";

},{"./helpers/bundle-url":"8YnfL"}],"afn1m":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "Shader", ()=>Shader
);
parcelHelpers.export(exports, "shaders", ()=>shaders
);
class Shader {
    static async compile(gl, type, source) {
        const shader = gl.createShader(type);
        gl.shaderSource(shader, source);
        gl.compileShader(shader);
        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            alert(`An error occurred compiling the shaders: ${gl.getShaderInfoLog(shader)}`);
            gl.deleteShader(shader);
            return null;
        }
        return shader;
    }
    static async create_program(gl, shader) {
        const vertex_shader = await Shader.compile(gl, gl.VERTEX_SHADER, shader.vertex);
        const fragment_shader = await Shader.compile(gl, gl.FRAGMENT_SHADER, shader.fragment);
        const shader_program = gl.createProgram();
        gl.attachShader(shader_program, vertex_shader);
        gl.attachShader(shader_program, fragment_shader);
        gl.linkProgram(shader_program);
        if (!gl.getProgramParameter(shader_program, gl.LINK_STATUS)) {
            alert(`Unable to initialize the shader program: ${gl.getProgramInfoLog(shader_program)}`);
            return null;
        }
        return shader_program;
    }
}
const shaders = {
    texture: {
        // @ts-ignore
        vertex: require('/shaders/texture.vert'),
        // @ts-ignore
        fragment: require('/shaders/texture.frag')
    }
};

},{"/shaders/texture.vert":"lzkR2","/shaders/texture.frag":"gSZlZ","@parcel/transformer-js/src/esmodule-helpers.js":"JacNc"}],"lzkR2":[function(require,module,exports) {
module.exports = "#version 300 es\n#define GLSLIFY 1\nlayout(location=0) in vec2 position;\nlayout(location=1) in vec2 texture_uv;\n\nuniform mat4 model;\nuniform mat4 view;\nuniform mat4 projection;\n\nout vec2 texture_uvs;\n\nvoid main() {\n  texture_uvs = texture_uv;\n\n  vec4 pos = vec4(position, 0.0f, 1.0f);\n  gl_Position = projection * view * model * pos;\n}";

},{}],"gSZlZ":[function(require,module,exports) {
module.exports = "#version 300 es\nprecision highp float;\n#define GLSLIFY 1\n\nin vec2 texture_uvs;\nuniform sampler2D texture_sampler;\n\nuniform float time;\nout vec4 color;\n\nvoid main() {\n  color = texture(texture_sampler, texture_uvs);\n}";

},{}],"JacNc":[function(require,module,exports) {
exports.interopDefault = function(a) {
    return a && a.__esModule ? a : {
        default: a
    };
};
exports.defineInteropFlag = function(a) {
    Object.defineProperty(a, '__esModule', {
        value: true
    });
};
exports.exportAll = function(source, dest) {
    Object.keys(source).forEach(function(key) {
        if (key === 'default' || key === '__esModule') return;
        // Skip duplicate re-exports when they have the same value.
        if (key in dest && dest[key] === source[key]) return;
        Object.defineProperty(dest, key, {
            enumerable: true,
            get: function() {
                return source[key];
            }
        });
    });
    return dest;
};
exports.export = function(dest, destName, get) {
    Object.defineProperty(dest, destName, {
        enumerable: true,
        get: get
    });
};

},{}],"4sVbE":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "default", ()=>Mesh_Square
);
class Mesh_Square {
    constructor(gl, shader_program){
        this.gl = gl;
        this.vao = gl.createVertexArray();
        gl.bindVertexArray(this.vao);
        const side = 1;
        const position = {
            location: gl.getAttribLocation(shader_program, 'position'),
            buffer: gl.createBuffer(),
            data: new Float32Array([
                -side / 2,
                -side / 2,
                side / 2,
                -side / 2,
                side / 2,
                side / 2,
                -side / 2,
                side / 2
            ])
        };
        gl.bindBuffer(gl.ARRAY_BUFFER, position.buffer);
        gl.bufferData(gl.ARRAY_BUFFER, position.data, gl.STATIC_DRAW);
        gl.enableVertexAttribArray(position.location);
        gl.vertexAttribPointer(position.location, 2, gl.FLOAT, false, 0, 0);
        const texture_uv = {
            location: gl.getAttribLocation(shader_program, 'texture_uv'),
            buffer: gl.createBuffer(),
            data: new Uint32Array([
                0,
                1,
                1,
                1,
                1,
                0,
                0,
                0
            ])
        };
        gl.bindBuffer(gl.ARRAY_BUFFER, texture_uv.buffer);
        gl.bufferData(gl.ARRAY_BUFFER, texture_uv.data, gl.STATIC_DRAW);
        gl.enableVertexAttribArray(texture_uv.location);
        gl.vertexAttribPointer(texture_uv.location, 2, gl.UNSIGNED_INT, false, 0, 0);
        const elements = {
            buffer: gl.createBuffer(),
            data: new Int32Array([
                0,
                1,
                2,
                2,
                3,
                0
            ])
        };
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, elements.buffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, elements.data, gl.STATIC_DRAW);
        this.count = elements.data.length;
        this.type = gl.UNSIGNED_INT;
    }
    draw() {
        this.gl.bindVertexArray(this.vao);
        this.gl.drawElements(this.gl.TRIANGLES, this.count, this.type, 0);
    }
}

},{"@parcel/transformer-js/src/esmodule-helpers.js":"JacNc"}],"dPuPe":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "Texture", ()=>Texture
);
class Texture {
    static uploadTextureImage(gl, image) {
        const canvas = document.createElement('canvas');
        canvas.width = image.width;
        canvas.height = image.height;
        const ctx = canvas.getContext('2d');
        const img = image.element;
        ctx.drawImage(img, image.x, image.y, image.width, image.height, 0, 0, image.width, image.height);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, image.width, image.height, 0, gl.RGBA, gl.UNSIGNED_BYTE, canvas);
    }
    // TODO(Abdelrahman) Proper texture extraction
    constructor(gl, image){
        this.gl = gl;
        this.texture = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, this.texture);
        if (image) Texture.uploadTextureImage(gl, image);
        else gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array([
            0,
            0,
            255,
            255
        ]));
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    }
    bind(slot, sampler_location) {
        this.gl.activeTexture(this.gl.TEXTURE0 + slot);
        this.gl.bindTexture(this.gl.TEXTURE_2D, this.texture);
        this.gl.uniform1i(sampler_location, slot);
    }
}

},{"@parcel/transformer-js/src/esmodule-helpers.js":"JacNc"}],"dApCn":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "Matrix", ()=>Matrix
);
class Matrix {
    static scale(factor, mat = Matrix.identity) {
        const scaled = mat.map((x)=>factor * x
        );
        scaled[3] = scaled[7] = scaled[11] = 0;
        scaled[15] = 1;
        return scaled;
    }
    static orthographic(tuple) {
        let { left , right , top , bottom , near , far  } = tuple;
        // if (aspect_ratio > 1) {
        //   left *= aspect_ratio;
        //   right *= aspect_ratio;
        // } else {
        //   bottom *= 1 / aspect_ratio;
        //   top *= 1 / aspect_ratio;
        // }
        return new Float32Array([
            2 / (right - left),
            0,
            0,
            (left + right) / (left - right),
            0,
            2 / (top - bottom),
            0,
            (bottom + top) / (bottom - top),
            0,
            0,
            2 / (near - far),
            (near + far) / (near - far),
            0,
            0,
            0,
            1, 
        ]);
    }
    static translate(t, mat = Matrix.identity) {
        let translated = mat;
        translated[3] = t.x;
        translated[7] = t.y;
        return translated;
    }
    static rotate(theta, axis = 3) {
        let c = Math.cos(theta);
        let s = Math.sin(theta);
        // Rotation matrix
        switch(axis){
            case 0:
                return new Float32Array([
                    1,
                    0,
                    0,
                    0,
                    0,
                    c,
                    -s,
                    0,
                    0,
                    s,
                    s,
                    0,
                    0,
                    0,
                    0,
                    1, 
                ]);
            case 1:
                return new Float32Array([
                    c,
                    0,
                    s,
                    0,
                    0,
                    1,
                    0,
                    0,
                    -s,
                    0,
                    c,
                    0,
                    0,
                    0,
                    0,
                    1, 
                ]);
            case 2:
                return new Float32Array([
                    c,
                    -s,
                    0,
                    0,
                    s,
                    c,
                    0,
                    0,
                    0,
                    0,
                    1,
                    0,
                    0,
                    0,
                    0,
                    1, 
                ]);
            default:
                return this.identity;
        }
    }
}
Matrix.identity = new Float32Array([
    1,
    0,
    0,
    0,
    0,
    1,
    0,
    0,
    0,
    0,
    1,
    0,
    0,
    0,
    0,
    1, 
]);

},{"@parcel/transformer-js/src/esmodule-helpers.js":"JacNc"}],"aJGZa":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "Color", ()=>Color
);
parcelHelpers.export(exports, "Type", ()=>Type
);
parcelHelpers.export(exports, "Augment", ()=>Augment
);
parcelHelpers.export(exports, "Square", ()=>Square
);
parcelHelpers.export(exports, "Piece", ()=>Piece
);
var Color;
(function(Color1) {
    Color1[Color1["White"] = 0] = "White";
    Color1[Color1["Black"] = 1] = "Black";
})(Color || (Color = {
}));
var Type;
(function(Type1) {
    Type1[Type1["King"] = 0] = "King";
    Type1[Type1["Queen"] = 1] = "Queen";
    Type1[Type1["Bishop"] = 2] = "Bishop";
    Type1[Type1["Knight"] = 3] = "Knight";
    Type1[Type1["Rook"] = 4] = "Rook";
    Type1[Type1["Pawn"] = 5] = "Pawn";
    Type1[Type1["COUNT"] = 6] = "COUNT";
})(Type || (Type = {
}));
var Augment;
(function(Augment1) {
    Augment1[Augment1["blank"] = 0] = "blank";
    Augment1[Augment1["dot"] = 1] = "dot";
    Augment1[Augment1["outline"] = 2] = "outline";
})(Augment || (Augment = {
}));
class Square {
    get i() {
        return Square.coordinatesToIndex(this.file, this.rank);
    }
    constructor(square1 = ''){
        if (square1 == '') square1 = 'a1';
        this.fromString(square1);
    }
    static coordinatesToString(file, rank) {
        let f = 'a'.charCodeAt(0) + file;
        let r = 1 + rank;
        return `${String.fromCharCode(f)}${r}`;
    }
    static stringToIndex(square) {
        let file = square[0].charCodeAt(0) - 'a'.charCodeAt(0);
        let rank = square[1].charCodeAt(0) - '1'.charCodeAt(0);
        return Square.coordinatesToIndex(file, rank);
    }
    static coordinatesToIndex(file, rank) {
        return file * 8 + rank;
    }
    fromCoordinates(file, rank) {
        this.file = file;
        this.rank = rank;
    }
    fromString(square) {
        this.file = square[0].charCodeAt(0) - 'a'.charCodeAt(0);
        this.rank = square[1].charCodeAt(0) - '1'.charCodeAt(0);
    }
    toString() {
        return Square.coordinatesToString(this.file, this.rank);
    }
    compare(sq) {
        if (!sq) return false;
        return this.file == sq.file && this.rank == sq.rank;
    }
    coincideLaterally(sq) {
        let coin = false;
        coin = coin || this.file == sq.file;
        coin = coin || this.rank == sq.rank;
        return coin;
    }
    static mainDiagonal(sq) {
        return sq.rank - sq.file;
    }
    static secDiagonal(sq) {
        return sq.rank + sq.file;
    }
    coincideDiagonally(sq) {
        let coin = false;
        coin = coin || Square.mainDiagonal(this) == Square.mainDiagonal(sq);
        coin = coin || Square.secDiagonal(this) == Square.secDiagonal(sq);
        return coin;
    }
}
class Piece {
    constructor(square2, color, type){
        this.square = new Square(square2);
        this.color = color;
        this.type = type;
        this.taken = false;
    }
    isPseudoLegal(sq) {
        switch(this.type){
            case Type.King:
                return this.processKing(sq);
            case Type.Queen:
                return this.processQueen(sq);
            case Type.Knight:
                return this.processKnight(sq);
            case Type.Bishop:
                return this.processBishop(sq);
            case Type.Rook:
                return this.processRook(sq);
            case Type.Pawn:
                return this.processPawn(sq);
            default:
                break;
        }
        return false;
    }
    processKing(sq) {
        const df = (sq)=>Math.abs(this.square.file - sq.file)
        ;
        const dr = (sq)=>Math.abs(this.square.rank - sq.rank)
        ;
        if (dr(sq) > 1) return false;
        if (df(sq) <= 1) return true;
        // White
        // On first rank
        if (this.color == Color.White && this.square.rank == 0) {
            if (df(sq) == 2) return true;
        }
        // Black
        // On eighth rank
        if (this.color == Color.Black && this.square.rank == 7) {
            if (df(sq) == 2) return true;
        }
        return false;
    }
    processQueen(sq) {
        return this.square.coincideDiagonally(sq) || this.square.coincideLaterally(sq);
    }
    processKnight(sq) {
        const drank = [
            1,
            2,
            2,
            1,
            -1,
            -2,
            -2,
            -1
        ];
        const dfile = [
            2,
            1,
            -1,
            -2,
            -2,
            -1,
            1,
            2
        ];
        let coin = false;
        for(let i = 0; i < drank.length; i++){
            coin = sq.rank - this.square.rank == drank[i];
            coin = coin && sq.file - this.square.file == dfile[i];
            if (coin) return true;
        }
        return false;
    }
    processBishop(sq) {
        return this.square.coincideDiagonally(sq);
    }
    processRook(sq) {
        return this.square.coincideLaterally(sq);
    }
    processPawn(sq) {
        // White pawns advance forward in ranks
        let direction = this.color == Color.White ? 1 : -1;
        let starting = this.color == Color.White ? 1 : 6;
        const isStartingAdvance = (sq)=>this.square.rank == starting && sq.rank == starting + 2 * direction
        ;
        const isNormalAdvance = (sq)=>sq.rank - this.square.rank == direction
        ;
        const isLegal = (sq)=>Math.abs(sq.file - this.square.file) <= 1
        ;
        const isCapture = (sq)=>Math.abs(sq.file - this.square.file) == 1
        ;
        let coin = false;
        coin = coin || isStartingAdvance(sq) && !isCapture(sq);
        coin = coin || isNormalAdvance(sq);
        // Other advances
        return coin && isLegal(sq);
    }
    toString() {
        return `[${this.square}] ${Color[this.color]} ${Type[this.type]}`;
    }
}

},{"@parcel/transformer-js/src/esmodule-helpers.js":"JacNc"}],"7bZaB":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
var _piece = require("../Chess/Piece");
const tfm = _piece.Square.stringToIndex;
var Chess_Squares;
(function(Chess_Squares1) {
    Chess_Squares1[Chess_Squares1["a1"] = tfm("a1")] = "a1";
    Chess_Squares1[Chess_Squares1["a2"] = tfm("a2")] = "a2";
    Chess_Squares1[Chess_Squares1["a3"] = tfm("a3")] = "a3";
    Chess_Squares1[Chess_Squares1["a4"] = tfm("a4")] = "a4";
    Chess_Squares1[Chess_Squares1["a5"] = tfm("a5")] = "a5";
    Chess_Squares1[Chess_Squares1["a6"] = tfm("a6")] = "a6";
    Chess_Squares1[Chess_Squares1["a7"] = tfm("a7")] = "a7";
    Chess_Squares1[Chess_Squares1["a8"] = tfm("a8")] = "a8";
    Chess_Squares1[Chess_Squares1["b1"] = tfm("b1")] = "b1";
    Chess_Squares1[Chess_Squares1["b2"] = tfm("b2")] = "b2";
    Chess_Squares1[Chess_Squares1["b3"] = tfm("b3")] = "b3";
    Chess_Squares1[Chess_Squares1["b4"] = tfm("b4")] = "b4";
    Chess_Squares1[Chess_Squares1["b5"] = tfm("b5")] = "b5";
    Chess_Squares1[Chess_Squares1["b6"] = tfm("b6")] = "b6";
    Chess_Squares1[Chess_Squares1["b7"] = tfm("b7")] = "b7";
    Chess_Squares1[Chess_Squares1["b8"] = tfm("b8")] = "b8";
    Chess_Squares1[Chess_Squares1["c1"] = tfm("c1")] = "c1";
    Chess_Squares1[Chess_Squares1["c2"] = tfm("c2")] = "c2";
    Chess_Squares1[Chess_Squares1["c3"] = tfm("c3")] = "c3";
    Chess_Squares1[Chess_Squares1["c4"] = tfm("c4")] = "c4";
    Chess_Squares1[Chess_Squares1["c5"] = tfm("c5")] = "c5";
    Chess_Squares1[Chess_Squares1["c6"] = tfm("c6")] = "c6";
    Chess_Squares1[Chess_Squares1["c7"] = tfm("c7")] = "c7";
    Chess_Squares1[Chess_Squares1["c8"] = tfm("c8")] = "c8";
    Chess_Squares1[Chess_Squares1["d1"] = tfm("d1")] = "d1";
    Chess_Squares1[Chess_Squares1["d2"] = tfm("d2")] = "d2";
    Chess_Squares1[Chess_Squares1["d3"] = tfm("d3")] = "d3";
    Chess_Squares1[Chess_Squares1["d4"] = tfm("d4")] = "d4";
    Chess_Squares1[Chess_Squares1["d5"] = tfm("d5")] = "d5";
    Chess_Squares1[Chess_Squares1["d6"] = tfm("d6")] = "d6";
    Chess_Squares1[Chess_Squares1["d7"] = tfm("d7")] = "d7";
    Chess_Squares1[Chess_Squares1["d8"] = tfm("d8")] = "d8";
    Chess_Squares1[Chess_Squares1["e1"] = tfm("e1")] = "e1";
    Chess_Squares1[Chess_Squares1["e2"] = tfm("e2")] = "e2";
    Chess_Squares1[Chess_Squares1["e3"] = tfm("e3")] = "e3";
    Chess_Squares1[Chess_Squares1["e4"] = tfm("e4")] = "e4";
    Chess_Squares1[Chess_Squares1["e5"] = tfm("e5")] = "e5";
    Chess_Squares1[Chess_Squares1["e6"] = tfm("e6")] = "e6";
    Chess_Squares1[Chess_Squares1["e7"] = tfm("e7")] = "e7";
    Chess_Squares1[Chess_Squares1["e8"] = tfm("e8")] = "e8";
    Chess_Squares1[Chess_Squares1["f1"] = tfm("f1")] = "f1";
    Chess_Squares1[Chess_Squares1["f2"] = tfm("f2")] = "f2";
    Chess_Squares1[Chess_Squares1["f3"] = tfm("f3")] = "f3";
    Chess_Squares1[Chess_Squares1["f4"] = tfm("f4")] = "f4";
    Chess_Squares1[Chess_Squares1["f5"] = tfm("f5")] = "f5";
    Chess_Squares1[Chess_Squares1["f6"] = tfm("f6")] = "f6";
    Chess_Squares1[Chess_Squares1["f7"] = tfm("f7")] = "f7";
    Chess_Squares1[Chess_Squares1["f8"] = tfm("f8")] = "f8";
    Chess_Squares1[Chess_Squares1["g1"] = tfm("g1")] = "g1";
    Chess_Squares1[Chess_Squares1["g2"] = tfm("g2")] = "g2";
    Chess_Squares1[Chess_Squares1["g3"] = tfm("g3")] = "g3";
    Chess_Squares1[Chess_Squares1["g4"] = tfm("g4")] = "g4";
    Chess_Squares1[Chess_Squares1["g5"] = tfm("g5")] = "g5";
    Chess_Squares1[Chess_Squares1["g6"] = tfm("g6")] = "g6";
    Chess_Squares1[Chess_Squares1["g7"] = tfm("g7")] = "g7";
    Chess_Squares1[Chess_Squares1["g8"] = tfm("g8")] = "g8";
    Chess_Squares1[Chess_Squares1["h1"] = tfm("h1")] = "h1";
    Chess_Squares1[Chess_Squares1["h2"] = tfm("h2")] = "h2";
    Chess_Squares1[Chess_Squares1["h3"] = tfm("h3")] = "h3";
    Chess_Squares1[Chess_Squares1["h4"] = tfm("h4")] = "h4";
    Chess_Squares1[Chess_Squares1["h5"] = tfm("h5")] = "h5";
    Chess_Squares1[Chess_Squares1["h6"] = tfm("h6")] = "h6";
    Chess_Squares1[Chess_Squares1["h7"] = tfm("h7")] = "h7";
    Chess_Squares1[Chess_Squares1["h8"] = tfm("h8")] = "h8";
})(Chess_Squares || (Chess_Squares = {
}));
exports.default = Chess_Squares;

},{"../Chess/Piece":"aJGZa","@parcel/transformer-js/src/esmodule-helpers.js":"JacNc"}]},["lDN4u","7IQHD"], "7IQHD", "parcelRequire60a1")

//# sourceMappingURL=index.95c05e68.js.map
