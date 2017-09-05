"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var react_redux_1 = require("react-redux");
var react_router_dom_1 = require("react-router-dom");
var Shuffle = function (props) {
    console.log('Shuffle', props.match.params.qnum, props);
    return React.createElement("div", null, "Shuffle");
};
var mapStateToProps = function (_a) { return ({}); };
exports.default = react_router_dom_1.withRouter(react_redux_1.connect(mapStateToProps)(Shuffle));
//# sourceMappingURL=Shuffle.js.map