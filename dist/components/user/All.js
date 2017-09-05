"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var react_redux_1 = require("react-redux");
var react_router_dom_1 = require("react-router-dom");
var All = function (props) {
    console.log('All', props.match.params.qnum, props);
    return React.createElement("div", null, "All");
};
var mapStateToProps = function (_a) { return ({}); };
exports.default = react_router_dom_1.withRouter(react_redux_1.connect(mapStateToProps)(All));
//# sourceMappingURL=All.js.map