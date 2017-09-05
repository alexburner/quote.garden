"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var react_redux_1 = require("react-redux");
var react_router_dom_1 = require("react-router-dom");
var Account = function (props) {
    console.log('Account', props.match.params.qnum, props);
    return React.createElement("div", null, "Account");
};
var mapStateToProps = function (_a) { return ({}); };
exports.default = react_router_dom_1.withRouter(react_redux_1.connect(mapStateToProps)(Account));
//# sourceMappingURL=Account.js.map