"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
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
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
exports.__esModule = true;
var helper_1 = require("./helper");
function FirebaseAdapter(db, options) {
    var _a;
    if (options === void 0) { options = {}; }
    var adapterCollectionName = (_a = options.adapterCollectionName) !== null && _a !== void 0 ? _a : '_next_auth_firebase_adapter_';
    var userCollectionRef = db.ref("".concat(adapterCollectionName, "/user"));
    var accountCollectionRef = db.ref("".concat(adapterCollectionName, "/account"));
    var sessionCollectionRef = db.ref("".concat(adapterCollectionName, "/session"));
    var verificationTokenCollectionRef = db.ref("".concat(adapterCollectionName, "/verificationToken"));
    var customTokenCollectionRef = db.ref("".concat(adapterCollectionName, "/customToken"));
    var findUserDoc = function (key) { return db.ref("".concat(adapterCollectionName, "/user/").concat(key)); };
    var findAccountDoc = function (key) { return db.ref("".concat(adapterCollectionName, "/account/").concat(key)); };
    var findSessionDoc = function (key) { return db.ref("".concat(adapterCollectionName, "/session/").concat(key)); };
    var findVerificationTokenDoc = function (key) { return db.ref("".concat(adapterCollectionName, "/verificationToken/").concat(key)); };
    var findCustomTokenDoc = function (sessionToken) { return db.ref("".concat(adapterCollectionName, "/customToken/").concat(sessionToken)); };
    return {
        createUser: function (data) {
            var _a, _b, _c, _d;
            return __awaiter(this, void 0, void 0, function () {
                var userData, userRef, user;
                return __generator(this, function (_e) {
                    switch (_e.label) {
                        case 0:
                            userData = {
                                name: (_a = data.name) !== null && _a !== void 0 ? _a : null,
                                email: (_b = data.email) !== null && _b !== void 0 ? _b : null,
                                image: (_c = data.image) !== null && _c !== void 0 ? _c : null,
                                emailVerified: (_d = data.emailVerified) !== null && _d !== void 0 ? _d : null
                            };
                            return [4 /*yield*/, userCollectionRef.push(userData)];
                        case 1:
                            userRef = _e.sent();
                            user = __assign({ id: userRef.key }, userData);
                            return [2 /*return*/, user];
                    }
                });
            });
        },
        getUser: function (id) {
            return __awaiter(this, void 0, void 0, function () {
                var userSnap, user;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, findUserDoc(id).get()];
                        case 1:
                            userSnap = _a.sent();
                            if (!userSnap.exists())
                                return [2 /*return*/, null];
                            user = userSnap.val();
                            return [2 /*return*/, user];
                    }
                });
            });
        },
        getUserByEmail: function (email) {
            return __awaiter(this, void 0, void 0, function () {
                var q, userSnap, _a, userKey, userData, user;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            q = userCollectionRef.limitToFirst(1).orderByChild('email').equalTo(email);
                            return [4 /*yield*/, q.once('value')];
                        case 1:
                            userSnap = _b.sent();
                            if (!userSnap.exists())
                                return [2 /*return*/, null];
                            _a = Object.entries(userSnap.val())[0], userKey = _a[0], userData = _a[1];
                            user = __assign({ id: userKey }, userData);
                            return [2 /*return*/, user];
                    }
                });
            });
        },
        getUserByAccount: function (_a) {
            var provider = _a.provider, providerAccountId = _a.providerAccountId;
            return __awaiter(this, void 0, void 0, function () {
                var q, accountSnaps, _b, accountKey, accountData, account, userSnap, userData, user;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0:
                            q = accountCollectionRef.orderByChild('providerAccountId').equalTo(providerAccountId);
                            return [4 /*yield*/, q.once('value')];
                        case 1:
                            accountSnaps = _c.sent();
                            if (!accountSnaps.exists())
                                return [2 /*return*/, null];
                            _b = Object.entries(accountSnaps.val()).find(function (_a) {
                                var key = _a[0], data = _a[1];
                                return data.provider === provider;
                            }), accountKey = _b[0], accountData = _b[1];
                            account = __assign({ id: accountKey }, accountData);
                            return [4 /*yield*/, findUserDoc(account.userId).get()];
                        case 2:
                            userSnap = _c.sent();
                            if (!userSnap.exists())
                                return [2 /*return*/, null];
                            userData = userSnap.val();
                            user = __assign({ id: userSnap.key }, userData);
                            return [2 /*return*/, user];
                    }
                });
            });
        },
        updateUser: function (data) {
            return __awaiter(this, void 0, void 0, function () {
                var id, userData, user;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            id = data.id, userData = __rest(data, ["id"]);
                            return [4 /*yield*/, findUserDoc(id).set(userData)];
                        case 1:
                            _a.sent();
                            user = data;
                            return [2 /*return*/, user];
                    }
                });
            });
        },
        deleteUser: function (id) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, findUserDoc(id).remove()];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            });
        },
        linkAccount: function (data) {
            return __awaiter(this, void 0, void 0, function () {
                var accountData, accountRef, account;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            accountData = data;
                            return [4 /*yield*/, accountCollectionRef.push(accountData)];
                        case 1:
                            accountRef = _a.sent();
                            account = __assign({ id: accountRef.key }, accountData);
                            return [2 /*return*/, account];
                    }
                });
            });
        },
        unlinkAccount: function (_a) {
            var provider = _a.provider, providerAccountId = _a.providerAccountId;
            return __awaiter(this, void 0, void 0, function () {
                var q, accountSnaps, _b, accountKey, accountData;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0:
                            q = accountCollectionRef.orderByChild('providerAccountId').equalTo(providerAccountId);
                            return [4 /*yield*/, q.once('value')];
                        case 1:
                            accountSnaps = _c.sent();
                            if (!accountSnaps.exists())
                                return [2 /*return*/];
                            _b = Object.entries(accountSnaps.val()).find(function (_a) {
                                var key = _a[0], data = _a[1];
                                return data.provider === provider;
                            }), accountKey = _b[0], accountData = _b[1];
                            return [4 /*yield*/, findAccountDoc(accountKey).remove()];
                        case 2:
                            _c.sent();
                            return [2 /*return*/];
                    }
                });
            });
        },
        getSessionAndUser: function (sessionToken) {
            return __awaiter(this, void 0, void 0, function () {
                var q, sessionSnap, _a, sessionKey, sessionData, userSnap, userData, user, session;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            q = sessionCollectionRef.limitToFirst(1).orderByChild('sessionToken').equalTo(sessionToken);
                            return [4 /*yield*/, q.once('value')];
                        case 1:
                            sessionSnap = _b.sent();
                            if (!sessionSnap.exists())
                                return [2 /*return*/, null];
                            _a = Object.entries(sessionSnap.val())[0], sessionKey = _a[0], sessionData = _a[1];
                            return [4 /*yield*/, findUserDoc(sessionData.userId).get()];
                        case 2:
                            userSnap = _b.sent();
                            if (!userSnap.exists())
                                return [2 /*return*/, null];
                            userData = userSnap.val();
                            user = __assign({ id: userSnap.key }, userData);
                            session = __assign({ id: sessionKey }, sessionData);
                            return [2 /*return*/, {
                                    user: user,
                                    session: (0, helper_1.from)(session)
                                }];
                    }
                });
            });
        },
        createSession: function (data) {
            var _a, _b, _c;
            return __awaiter(this, void 0, void 0, function () {
                var sessionData, sessionRef, session;
                return __generator(this, function (_d) {
                    switch (_d.label) {
                        case 0:
                            sessionData = {
                                sessionToken: (_a = data.sessionToken) !== null && _a !== void 0 ? _a : null,
                                userId: (_b = data.userId) !== null && _b !== void 0 ? _b : null,
                                expires: (_c = data.expires) !== null && _c !== void 0 ? _c : null
                            };
                            return [4 /*yield*/, sessionCollectionRef.push((0, helper_1.to)(sessionData))];
                        case 1:
                            sessionRef = _d.sent();
                            session = __assign({ id: sessionRef.key }, sessionData);
                            return [2 /*return*/, session];
                    }
                });
            });
        },
        updateSession: function (data) {
            return __awaiter(this, void 0, void 0, function () {
                var sessionToken, sessionData, q, sessionSnap, sessionKey;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            sessionToken = data.sessionToken, sessionData = __rest(data, ["sessionToken"]);
                            q = sessionCollectionRef.limitToFirst(1).orderByChild('sessionToken').equalTo(sessionToken);
                            return [4 /*yield*/, q.once('value')];
                        case 1:
                            sessionSnap = _a.sent();
                            if (!sessionSnap.exists())
                                return [2 /*return*/, null];
                            sessionKey = Object.entries(sessionSnap.val())[0][0];
                            return [4 /*yield*/, findSessionDoc(sessionKey).set((0, helper_1.to)(sessionData))];
                        case 2:
                            _a.sent();
                            return [2 /*return*/, data];
                    }
                });
            });
        },
        deleteSession: function (sessionToken) {
            return __awaiter(this, void 0, void 0, function () {
                var q, sessionSnap, sessionKey;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            q = sessionCollectionRef.limitToFirst(1).orderByChild('sessionToken').equalTo(sessionToken);
                            return [4 /*yield*/, q.once('value')];
                        case 1:
                            sessionSnap = _a.sent();
                            if (!sessionSnap.exists())
                                return [2 /*return*/, null];
                            sessionKey = Object.entries(sessionSnap.val())[0][0];
                            return [4 /*yield*/, Promise.allSettled([
                                    findSessionDoc(sessionKey).remove(),
                                    findCustomTokenDoc(sessionToken).remove(),
                                ])];
                        case 2:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            });
        },
        createVerificationToken: function (data) {
            return __awaiter(this, void 0, void 0, function () {
                var verificationTokenRef, verificationToken;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, verificationTokenCollectionRef.push(data)];
                        case 1:
                            verificationTokenRef = _a.sent();
                            verificationToken = __assign({ id: verificationTokenRef.key }, (0, helper_1.to)(data));
                            return [2 /*return*/, verificationToken];
                    }
                });
            });
        },
        useVerificationToken: function (_a) {
            var identifier = _a.identifier, token = _a.token;
            return __awaiter(this, void 0, void 0, function () {
                var q, verificationTokenSnap, _b, verificationTokenKey, verificationTokenData;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0:
                            q = verificationTokenCollectionRef.orderByChild('token').equalTo(token);
                            return [4 /*yield*/, q.once('value')];
                        case 1:
                            verificationTokenSnap = _c.sent();
                            if (!verificationTokenSnap.exists())
                                return [2 /*return*/, null];
                            _b = Object.entries(verificationTokenSnap.val()).find(function (_a) {
                                var key = _a[0], data = _a[1];
                                return data.identifier === identifier;
                            }), verificationTokenKey = _b[0], verificationTokenData = _b[1];
                            return [4 /*yield*/, findVerificationTokenDoc(verificationTokenKey).remove()];
                        case 2:
                            _c.sent();
                            return [2 /*return*/, (0, helper_1.from)(verificationTokenData)];
                    }
                });
            });
        }
    };
}
exports["default"] = FirebaseAdapter;
