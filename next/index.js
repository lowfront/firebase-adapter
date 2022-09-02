"use strict";
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
exports.createRemoveExpiredSessions = exports.createFirebaseCustomTokenHandler = exports.getSessionToken = exports.updateCustomToken = exports.getCustomToken = void 0;
var firebase_admin_1 = __importDefault(require("firebase-admin"));
var firestore_1 = require("firebase-admin/firestore");
var react_1 = require("next-auth/react");
var helper_1 = require("../firestore/helper");
var helper_2 = require("../helper");
function getCustomToken(db, sessionToken, adapterCollectionName) {
    if (adapterCollectionName === void 0) { adapterCollectionName = '_next_auth_firebase_adapter_'; }
    return __awaiter(this, void 0, void 0, function () {
        var token, expires, tokenDocRef, tokenDoc, tokenSnap;
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    if (!(db instanceof firestore_1.Firestore)) return [3 /*break*/, 2];
                    tokenDocRef = db.collection(adapterCollectionName).doc('store').collection('customToken').doc(sessionToken);
                    return [4 /*yield*/, tokenDocRef.get()];
                case 1:
                    tokenDoc = _c.sent();
                    if (!tokenDoc.exists)
                        return [2 /*return*/];
                    (_a = tokenDoc.data(), token = _a.token, expires = _a.expires);
                    return [3 /*break*/, 4];
                case 2: return [4 /*yield*/, db.ref("".concat(adapterCollectionName, "/customToken/").concat(sessionToken)).get()];
                case 3:
                    tokenSnap = _c.sent();
                    if (!tokenSnap.exists())
                        return [2 /*return*/];
                    (_b = tokenSnap.val(), token = _b.token, expires = _b.expires);
                    _c.label = 4;
                case 4:
                    if (Date.now() > new Date(expires).getTime())
                        return [2 /*return*/];
                    return [2 /*return*/, token];
            }
        });
    });
}
exports.getCustomToken = getCustomToken;
function updateCustomToken(db, sessionToken, token, adapterCollectionName) {
    if (adapterCollectionName === void 0) { adapterCollectionName = '_next_auth_firebase_adapter_'; }
    return __awaiter(this, void 0, void 0, function () {
        var tokenData, tokenDocRef;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    tokenData = {
                        token: token,
                        expires: Date.now() + 60 * 60 * 1000
                    };
                    if (!(db instanceof firestore_1.Firestore)) return [3 /*break*/, 2];
                    tokenDocRef = db.collection(adapterCollectionName).doc('store').collection('customToken').doc(sessionToken);
                    return [4 /*yield*/, tokenDocRef.set(tokenData)];
                case 1:
                    _a.sent();
                    return [3 /*break*/, 4];
                case 2: return [4 /*yield*/, db.ref("".concat(adapterCollectionName, "/customToken/").concat(sessionToken)).update(tokenData)];
                case 3:
                    _a.sent();
                    _a.label = 4;
                case 4: return [2 /*return*/, token];
            }
        });
    });
}
exports.updateCustomToken = updateCustomToken;
function getSessionToken(req) {
    var _a, _b;
    return (_b = (_a = req.cookies['__Secure-next-auth.session-token']) !== null && _a !== void 0 ? _a : req.cookies['next-auth.session-token']) !== null && _b !== void 0 ? _b : '';
}
exports.getSessionToken = getSessionToken;
function createFirebaseCustomTokenHandler(_a) {
    var db = _a.db, _b = _a.adapterCollectionName, adapterCollectionName = _b === void 0 ? '_next_auth_firebase_adapter_' : _b, _c = _a.method, method = _c === void 0 ? 'GET' : _c, additionalClaims = _a.additionalClaims;
    return function firebaseCustomTokenHandler(req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var session, sessionToken, user, email, token;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (req.method !== method)
                            return [2 /*return*/, res.status(403).json(false)];
                        return [4 /*yield*/, (0, react_1.getSession)({ req: req })];
                    case 1:
                        session = _a.sent();
                        if (!session)
                            return [2 /*return*/, res.status(403).json(false)];
                        sessionToken = getSessionToken(req);
                        if (!sessionToken)
                            console.warn('No sessionToken');
                        user = session.user;
                        email = user.email;
                        return [4 /*yield*/, getCustomToken(db, sessionToken, adapterCollectionName)];
                    case 2:
                        token = _a.sent();
                        if (token)
                            return [2 /*return*/, res.json(token)];
                        return [4 /*yield*/, firebase_admin_1["default"]
                                .auth()
                                .createCustomToken(email, Object.assign({}, additionalClaims === null || additionalClaims === void 0 ? void 0 : additionalClaims(session), { sessionToken: sessionToken, uid: btoa(email) }))];
                    case 3:
                        token = _a.sent();
                        return [4 /*yield*/, updateCustomToken(db, sessionToken, token, adapterCollectionName)];
                    case 4:
                        _a.sent();
                        return [2 /*return*/, res.json(token)];
                }
            });
        });
    };
}
exports.createFirebaseCustomTokenHandler = createFirebaseCustomTokenHandler;
function createRemoveExpiredSessions(_a) {
    var db = _a.db, _b = _a.adapterCollectionName, adapterCollectionName = _b === void 0 ? '_next_auth_firebase_adapter_' : _b;
    return function removeExpiredSessions(adapter, limit, asyncMax) {
        if (limit === void 0) { limit = 100; }
        if (asyncMax === void 0) { asyncMax = 30; }
        return __awaiter(this, void 0, void 0, function () {
            var q, expiredSessionDocs;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        q = db.collection(adapterCollectionName).doc('store').collection('session').where('expires', '<', new Date()).limit(limit);
                        return [4 /*yield*/, (0, helper_1.findMany)(q)];
                    case 1:
                        expiredSessionDocs = _a.sent();
                        return [4 /*yield*/, (0, helper_2.asyncMap)(expiredSessionDocs.map(function (doc) { return function () { return adapter.deleteSession(doc.data().sessionToken); }; }), asyncMax)];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
}
exports.createRemoveExpiredSessions = createRemoveExpiredSessions;
