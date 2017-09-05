"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var react_router_dom_1 = require("react-router-dom");
var Auth_1 = require("src/components/Auth");
var User_1 = require("src/components/User");
exports.default = function () {
    return (React.createElement("div", null,
        "Hello App",
        React.createElement(react_router_dom_1.Route, { path: "/auth", component: Auth_1.default }),
        React.createElement(react_router_dom_1.Route, { path: "/:userKey", component: User_1.default })));
};
//# sourceMappingURL=App.js.map