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
function FirestoreAdapter(db, options) {
    var _a;
    if (options === void 0) { options = {}; }
    var adapterCollectionName = (_a = options.adapterCollectionName) !== null && _a !== void 0 ? _a : '_next_auth_firebase_adapter_';
    var userCollectionRef = db.collection(adapterCollectionName).doc('store').collection('user');
    var accountCollectionRef = db.collection(adapterCollectionName).doc('store').collection('account');
    var sessionCollectionRef = db.collection(adapterCollectionName).doc('store').collection('session');
    var verificationTokenCollectionRef = db.collection(adapterCollectionName).doc('store').collection('verificationToken');
    var customTokenCollectionRef = db.collection(adapterCollectionName).doc('store').collection('customToken');
    var findUserDoc = function (id) { return userCollectionRef.doc(id); };
    var findAccountDoc = function (id) { return accountCollectionRef.doc(id); };
    var findSessionDoc = function (id) { return sessionCollectionRef.doc(id); };
    var findVerificationTokenDoc = function (id) { return verificationTokenCollectionRef.doc(id); };
    var findCustomTokenDoc = function (sessionToken) { return customTokenCollectionRef.doc(sessionToken); };
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
                            return [4 /*yield*/, userCollectionRef.add(userData)];
                        case 1:
                            userRef = _e.sent();
                            user = __assign({ id: userRef.id }, userData);
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
                            if (!userSnap.exists)
                                return [2 /*return*/, null];
                            user = userSnap.data();
                            return [2 /*return*/, user];
                    }
                });
            });
        },
        getUserByEmail: function (email) {
            return __awaiter(this, void 0, void 0, function () {
                var q, userRef, user;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            q = userCollectionRef.where('email', '==', email).limit(1);
                            return [4 /*yield*/, (0, helper_1.findOne)(q)];
                        case 1:
                            userRef = _a.sent();
                            if (!userRef)
                                return [2 /*return*/, null];
                            user = __assign({ id: userRef.id }, userRef.data());
                            return [2 /*return*/, user];
                    }
                });
            });
        },
        getUserByAccount: function (_a) {
            var provider = _a.provider, providerAccountId = _a.providerAccountId;
            return __awaiter(this, void 0, void 0, function () {
                var q, accountRef, account, userRef, userData, user;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            q = accountCollectionRef.where('provider', '==', provider).where('providerAccountId', '==', providerAccountId).limit(1);
                            return [4 /*yield*/, (0, helper_1.findOne)(q)];
                        case 1:
                            accountRef = _b.sent();
                            if (!accountRef)
                                return [2 /*return*/, null];
                            account = __assign({ id: accountRef.id }, accountRef.data());
                            return [4 /*yield*/, findUserDoc(account.userId).get()];
                        case 2:
                            userRef = _b.sent();
                            if (!userRef.exists)
                                return [2 /*return*/, null];
                            userData = userRef.data();
                            user = __assign({ id: userRef.id }, userData);
                            return [2 /*return*/, user];
                    }
                });
            });
        },
        updateUser: function (data) {
            return __awaiter(this, void 0, void 0, function () {
                var id, userData, userSnap, user;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            id = data.id, userData = __rest(data, ["id"]);
                            return [4 /*yield*/, findUserDoc(id).set(userData, { merge: true })];
                        case 1:
                            _a.sent();
                            return [4 /*yield*/, findUserDoc(id).get()];
                        case 2:
                            userSnap = _a.sent();
                            user = userSnap.data();
                            return [2 /*return*/, user];
                    }
                });
            });
        },
        deleteUser: function (id) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, findUserDoc(id)["delete"]()];
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
                            return [4 /*yield*/, accountCollectionRef.add(accountData)];
                        case 1:
                            accountRef = _a.sent();
                            account = __assign({ id: accountRef.id }, accountData);
                            return [2 /*return*/, account];
                    }
                });
            });
        },
        unlinkAccount: function (_a) {
            var provider = _a.provider, providerAccountId = _a.providerAccountId;
            return __awaiter(this, void 0, void 0, function () {
                var q, accountRef;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            q = accountCollectionRef.where('provider', '==', provider).where('providerAccountId', '==', providerAccountId).limit(1);
                            return [4 /*yield*/, (0, helper_1.findOne)(q)];
                        case 1:
                            accountRef = _b.sent();
                            if (!accountRef)
                                return [2 /*return*/];
                            return [4 /*yield*/, findAccountDoc(accountRef.id)["delete"]()];
                        case 2:
                            _b.sent();
                            return [2 /*return*/];
                    }
                });
            });
        },
        getSessionAndUser: function (sessionToken) {
            return __awaiter(this, void 0, void 0, function () {
                var q, sessionRef, sessionData, userRef, userData, user, session;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            q = sessionCollectionRef.where('sessionToken', '==', sessionToken).limit(1);
                            return [4 /*yield*/, (0, helper_1.findOne)(q)];
                        case 1:
                            sessionRef = _a.sent();
                            if (!sessionRef)
                                return [2 /*return*/, null];
                            sessionData = sessionRef.data();
                            return [4 /*yield*/, findUserDoc(sessionData.userId).get()];
                        case 2:
                            userRef = _a.sent();
                            if (!userRef.exists)
                                return [2 /*return*/, null];
                            userData = userRef.data();
                            user = __assign({ id: userRef.id }, userData);
                            session = __assign({ id: sessionRef.id }, sessionData);
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
                            return [4 /*yield*/, sessionCollectionRef.add(sessionData)];
                        case 1:
                            sessionRef = _d.sent();
                            session = __assign({ id: sessionRef.id }, sessionData);
                            return [2 /*return*/, session];
                    }
                });
            });
        },
        updateSession: function (data) {
            return __awaiter(this, void 0, void 0, function () {
                var sessionToken, sessionData, q, sessionRef;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            sessionToken = data.sessionToken, sessionData = __rest(data, ["sessionToken"]);
                            q = sessionCollectionRef.where('sessionToken', '==', sessionToken).limit(1);
                            return [4 /*yield*/, (0, helper_1.findOne)(q)];
                        case 1:
                            sessionRef = _a.sent();
                            if (!sessionRef)
                                return [2 /*return*/];
                            return [4 /*yield*/, findSessionDoc(sessionRef.id).set(sessionData)];
                        case 2:
                            _a.sent();
                            return [2 /*return*/, data];
                    }
                });
            });
        },
        deleteSession: function (sessionToken) {
            return __awaiter(this, void 0, void 0, function () {
                var q, sessionRef;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            q = sessionCollectionRef.where('sessionToken', '==', sessionToken).limit(1);
                            return [4 /*yield*/, (0, helper_1.findOne)(q)];
                        case 1:
                            sessionRef = _a.sent();
                            if (!sessionRef)
                                return [2 /*return*/];
                            return [4 /*yield*/, Promise.allSettled([
                                    findSessionDoc(sessionRef.id)["delete"](),
                                    findCustomTokenDoc(sessionToken)["delete"](),
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
                        case 0: return [4 /*yield*/, verificationTokenCollectionRef.add(data)];
                        case 1:
                            verificationTokenRef = _a.sent();
                            verificationToken = __assign({ id: verificationTokenRef.id }, data);
                            return [2 /*return*/, verificationToken];
                    }
                });
            });
        },
        useVerificationToken: function (_a) {
            var identifier = _a.identifier, token = _a.token;
            return __awaiter(this, void 0, void 0, function () {
                var q, verificationTokenRef, verificationToken;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            q = verificationTokenCollectionRef.where('identifier', '==', identifier).where('token', '==', token).limit(1);
                            return [4 /*yield*/, (0, helper_1.findOne)(q)];
                        case 1:
                            verificationTokenRef = _b.sent();
                            if (!verificationTokenRef)
                                return [2 /*return*/, null];
                            verificationToken = verificationTokenRef.data();
                            return [4 /*yield*/, findVerificationTokenDoc(verificationTokenRef.id)["delete"]()];
                        case 2:
                            _b.sent();
                            return [2 /*return*/, (0, helper_1.from)(verificationToken)];
                    }
                });
            });
        }
    };
}
exports["default"] = FirestoreAdapter;
