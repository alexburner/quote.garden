"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var history_1 = require("history");
var React = require("react");
var ReactDOM = require("react-dom");
var react_redux_1 = require("react-redux");
var react_router_dom_1 = require("react-router-dom");
var redux_1 = require("redux");
var redux_loop_1 = require("redux-loop");
var App_1 = require("src/components/App");
var reducer_1 = require("src/redux/reducer");
var state_1 = require("src/redux/state");
var util_1 = require("src/util");
var history = history_1.createHashHistory();
var store = redux_1.createStore(reducer_1.default, state_1.getInit({ currPath: util_1.extractUserPath(history.location) }), redux_loop_1.install());
// TODO where to put this?
// Currently viewed user can be changed via URL hash
// And new quotes must be fetched from firebase if that happens
// But only react-router knows about that change
// So here we listen to its history emitter
// So we can pass updates to the redux store
history.listen(function (location) {
    return store.dispatch({
        type: 'path.curr',
        path: util_1.extractUserPath(location),
    });
});
ReactDOM.render(React.createElement(react_redux_1.Provider, { store: store },
    React.createElement(react_router_dom_1.Router, { history: history },
        React.createElement(App_1.default, null))), document.getElementById('app'));
//# sourceMappingURL=index.js.map