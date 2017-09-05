"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var react_redux_1 = require("react-redux");
var react_router_dom_1 = require("react-router-dom");
var Account_1 = require("src/components/user/Account");
var All_1 = require("src/components/user/All");
var Edit_1 = require("src/components/user/Edit");
var Shuffle_1 = require("src/components/user/Shuffle");
/*
  TODO: redirects!

  for NONE
  - >>> /shuffle

  for EDIT and ACCOUNT
  - if !self >>> auth
  - if curr !== self >>> self/edit|account
*/
var User = function (_a) {
    var path = _a.path, url = _a.match.url;
    return (React.createElement("div", null,
        path.curr && React.createElement("span", null,
            "This is User ",
            path.curr),
        path.self.success && React.createElement("span", null,
            "You are User ",
            path.self.success),
        React.createElement(react_router_dom_1.Route, { path: url + "/shuffle/:qnum", component: Shuffle_1.default }),
        React.createElement(react_router_dom_1.Route, { path: url + "/all/:qnum", component: All_1.default }),
        React.createElement(react_router_dom_1.Route, { path: url + "/edit/:qnum", component: Edit_1.default }),
        React.createElement(react_router_dom_1.Route, { path: url + "/account", component: Account_1.default })));
};
var mapStateToProps = function (_a) {
    var path = _a.path;
    return ({ path: path });
};
exports.default = react_router_dom_1.withRouter(react_redux_1.connect(mapStateToProps)(User));
//# sourceMappingURL=User.js.map