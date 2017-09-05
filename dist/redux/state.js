"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var RemoteData_1 = require("src/util/RemoteData");
exports.getInit = function (_a) {
    var currPath = _a.currPath;
    return ({
        auth: new RemoteData_1.default(),
        edits: {},
        path: {
            curr: currPath,
            self: new RemoteData_1.default(),
        },
        quotes: {
            curr: new RemoteData_1.default(),
            self: new RemoteData_1.default(),
        },
    });
};
//# sourceMappingURL=state.js.map