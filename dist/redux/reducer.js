"use strict";
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
var redux_loop_1 = require("redux-loop");
var fireapp_1 = require("src/fireapp");
exports.default = function (state, action) {
    console.log('action!', action, state);
    switch (action.type) {
        case '@@redux/INIT': {
            // Redux startup
            return state;
        }
        // TODO actual actions:
        // -- authstart / authcomplete
        // wait wait wait
        // firebase style?
        // resources to listen to:
        // -> auth
        // -> profile (currently just urlId)
        // -> quotes
        // and then also:
        // -> current urlId
        // +> associated quotes
        case 'path.curr': {
            if (action.path === state.path.curr)
                return state;
            // Current user path has changed
            return redux_loop_1.loop(__assign({}, state, { path: __assign({}, state.path, { curr: action.path }) }), redux_loop_1.Cmd.run(fireapp_1.getQuotes, {
                args: [{ path: action.path }],
                successActionCreator: function (quotes) { return ({
                    type: 'quotes.response',
                    quotes: quotes,
                }); },
                failActionCreator: function (error) { return ({ type: 'error', error: error }); },
            }));
        }
        case 'quotes.request': {
            // TODO
            return state;
        }
        case 'quotes.response': {
            // TODO
            return state;
        }
        default: {
            // Unhandled action
            console.error('Unhandled action:', action);
            return state;
        }
    }
};
//# sourceMappingURL=reducer.js.map