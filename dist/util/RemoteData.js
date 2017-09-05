"use strict";
/*
  Mimicking Elm's RemoteData with TypeScript
  > http://package.elm-lang.org/packages/ohanhi/remotedata-http/latest

  type RemoteData e a
      = NotAsked
      | Loading
      | Failure e
      | Success a

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
var RemoteData = (function () {
    function RemoteData() {
        this.notAsked = true;
        this.loading = false;
    }
    return RemoteData;
}());
exports.default = RemoteData;
function ask(fetcher, args, rd) {
    return __awaiter(this, void 0, void 0, function () {
        var _a, thrown_1;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    rd.notAsked = false;
                    rd.loading = true;
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 3, , 4]);
                    _a = rd;
                    return [4 /*yield*/, fetcher.apply(void 0, args)];
                case 2:
                    _a.success = _b.sent();
                    rd.loading = false;
                    return [2 /*return*/, rd.success];
                case 3:
                    thrown_1 = _b.sent();
                    rd.failure = thrown_1; // <-- Warning! we assume fetcher throws F
                    rd.loading = false;
                    throw rd.failure;
                case 4: return [2 /*return*/];
            }
        });
    });
}
exports.ask = ask;
/*
  Example use:

  // 1. import RemoteData constructor & ask function
  import RemoteData, { ask } from 'src/stateless/RemoteData'

  // 2.a. add type for remote data response
  type User = { data: any }
  // 2.b. add params for remote data request
  const userParams = [{ url: 'foo/bar' }, 5, 6]
  // 2.c. add function for fetching remote data
  async function fetchUsers(params): Promise<User[]> {
    return await Promise.resolve([{ data: params }])
  }

  // 3. create the RemoteData object
  const rUsers = new RemoteData<User[]>()

  // elm-> NotAsked
  rUsers.notAsked // true
  rUsers.loading // false
  rUsers.success // void
  rUsers.failure // void

  // 4. ask for data using RemoteData object
  const usersPromise = ask<User[]>(fetchUsers, userParams, rUsers)

  // elm-> Loading
  rUsers.notAsked // false
  rUsers.loading // true
  rUsers.success // void
  rUsers.failure // void

  // 5. handle promise returned by async ask
  usersPromise
    .then((users: User[]) => {
      // elm-> Success
      rUsers.notAsked // false
      rUsers.loading // false
      rUsers.success // User[]
      rUsers.failure // void
    })
    .catch((error: Error) => {
      // elm-> Failure
      rUsers.notAsked // false
      rUsers.loading // false
      rUsers.success // void
      rUsers.failure // Error
    })

 */
//# sourceMappingURL=RemoteData.js.map