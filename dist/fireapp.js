"use strict";
/*

auth
- email
- password
- uid

profile (keyed by uid)
- urlId

quotes (keyed by uid) (keyed by quote key)
- number // TODO
- source
- words

 */
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var firebase = require("firebase/app");
require("firebase/auth");
require("firebase/database");
var FireApp = (function () {
    function FireApp() {
        var _this = this;
        this.app = firebase.initializeApp({
            apiKey: 'AIzaSyDR2zyCGLTU9cx6SZmsTvzUq31DLfoAd3U',
            authDomain: 'quotes-92672.firebaseapp.com',
            databaseURL: 'https://quotes-92672.firebaseio.com',
            storageBucket: 'quotes-92672.appspot.com',
            messagingSenderId: '936175857202',
        });
        this.handlers.profile = function (profile) {
            _this.view.profile = null;
            if (profile && profile.val()) {
                var value = profile.val();
                _this.view.profile = {
                    key: profile.key,
                    urlId: String(value.urlId),
                };
            }
        };
        this.handlers.quotes = function (quotes) {
            _this.view.quotes = [];
            if (quotes && quotes.val()) {
                quotes.forEach(function (quote) {
                    var value = quote.val();
                    _this.view.quotes.push({
                        key: quote.key,
                        number: Number(value.number),
                        source: String(value.source),
                        words: String(value.words),
                    });
                    return false; // XXX: for firebase .forEach type
                });
            }
        };
        this.listenForAuth();
    }
    FireApp.prototype.listenForAuth = function () {
        var _this = this;
        this.offAuth = this.app.auth().onAuthStateChanged(function (user) {
            if (!user) {
                // Logged out
                _this.self.account = null;
                _this.self.profile = null;
                return;
            }
            if (_this.self.account && _this.self.account.uid === user.uid) {
                // No change
                return;
            }
            // New auth! Extract account info
            _this.self.account = {
                email: user.email,
                uid: user.uid,
            };
            // Re/set profile listener
            _this.listenForProfile();
        });
    };
    FireApp.prototype.listenForProfile = function () {
        // TODO this only listens for current view profile
        // what about listening to changes for user profile?
        // like on account page?
        // oh hm but
        // that would be "view"
        // oh hmmm but
        // they chould update their profile
        // in another tab
        // and we want
        // those updates
        // WHAT THEN
        // full ref list:
        // - self profile
        // - self quotes
        // - curr profile
        // - curr quotes
        // + auth (which determines self)
        this.destroyRef('profile');
        if (!this.view.profile)
            return;
        this.refs.profile = this.app.database().ref('profiles/' + this.view.profile.key);
        // TODO self profile for self account
        // - destroy current listener
        // - start new listener based on input
    };
    FireApp.prototype.listenForQuotes = function () {
        // TODO quotes for view profile
        // - destroy current listener
        // - start new listener based on input
    };
    FireApp.prototype.setViewProfile = function (urlId) {
        return __awaiter(this, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = this.view;
                        return [4 /*yield*/, this.getProfile(urlId)];
                    case 1:
                        _a.profile = _b.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    FireApp.prototype.getProfile = function (urlId) {
        return __awaiter(this, void 0, void 0, function () {
            var profile;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.app
                            .database()
                            .ref('profiles')
                            .orderByChild('urlId')
                            .equalTo(urlId)
                            .once('value')];
                    case 1:
                        profile = _a.sent();
                        if (!profile || !profile.key) {
                            throw new Error('Unable to find profile for urlId:' + urlId);
                        }
                        return [2 /*return*/, profile];
                }
            });
        });
    };
    FireApp.prototype.createAccount = function (email, pass) { };
    FireApp.prototype.signIn = function (email, pass) { };
    FireApp.prototype.destroyRef = function (key) {
        if (!this.refs[key])
            return;
        var ref = this.refs[key];
        var handler = this.handlers[key];
        ref.off('value', handler);
    };
    FireApp.prototype.destroy = function () {
        this.destroyRef('profile');
        this.destroyRef('quotes');
        this.offAuth();
    };
    return FireApp;
}());
exports.default = FireApp;
//# sourceMappingURL=fireapp.js.map