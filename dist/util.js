"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var constants_1 = require("src/constants");
exports.extractUserPath = function (location) {
    // '/:user/foo/bar' >>> ['', :user, 'foo', 'bar']
    var userPath = location.pathname.split('/')[1];
    if (!userPath || !userPath.length)
        return null;
    if (constants_1.RESERVED_WORDS[userPath])
        return null;
    return userPath;
};
//# sourceMappingURL=util.js.map