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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
exports.__esModule = true;
exports.findMany = exports.findOne = exports.getUserCollection = exports.getUserDoc = exports.validCustomToken = exports.deleteDoc = exports.updateDoc = exports.setDoc = exports.getDocs = exports.getDoc = exports.addDoc = exports.trySignInWithCustomToken = exports.signInFirebase = void 0;
var app_1 = require("firebase/app");
var auth_1 = require("firebase/auth");
var firestore_1 = require("firebase/firestore");
var helper_1 = require("../helper");
function signInFirebase(app) {
    if (app === void 0) { app = (0, app_1.getApp)(); }
    return __awaiter(this, void 0, void 0, function () {
        var token;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, fetch('/api/auth/firebase-custom-token').then(function (res) { return res.text(); })];
                case 1:
                    token = _a.sent();
                    return [4 /*yield*/, (0, auth_1.signInWithCustomToken)((0, auth_1.getAuth)(app), token)];
                case 2:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
exports.signInFirebase = signInFirebase;
function trySignInWithCustomToken(f, app) {
    if (app === void 0) { app = (0, app_1.getApp)(); }
    return __awaiter(this, void 0, void 0, function () {
        var failCount, err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    failCount = 3;
                    _a.label = 1;
                case 1:
                    if (!failCount--) return [3 /*break*/, 8];
                    _a.label = 2;
                case 2:
                    _a.trys.push([2, 4, , 7]);
                    return [4 /*yield*/, (typeof f === 'function' ? f() : f)];
                case 3: return [2 /*return*/, _a.sent()];
                case 4:
                    err_1 = _a.sent();
                    console.error(err_1);
                    return [4 /*yield*/, signInFirebase(app)];
                case 5:
                    _a.sent();
                    return [4 /*yield*/, (0, helper_1.sleep)(100)];
                case 6:
                    _a.sent();
                    return [3 /*break*/, 7];
                case 7: return [3 /*break*/, 1];
                case 8: throw new Error('Fail sign in with custom token.');
            }
        });
    });
}
exports.trySignInWithCustomToken = trySignInWithCustomToken;
exports.addDoc = (function (reference, data) {
    return trySignInWithCustomToken(function () { return (0, firestore_1.addDoc)(reference, data); });
});
exports.getDoc = (function (reference) {
    return trySignInWithCustomToken(function () { return (0, firestore_1.getDoc)(reference); });
});
exports.getDocs = (function (reference) {
    return trySignInWithCustomToken(function () { return (0, firestore_1.getDocs)(reference); });
});
exports.setDoc = (function (reference, data, options) {
    return trySignInWithCustomToken(function () { return (0, firestore_1.setDoc)(reference, data, options); });
});
exports.updateDoc = (function (reference, field, value) {
    var moreFieldsAndValues = [];
    for (var _i = 3; _i < arguments.length; _i++) {
        moreFieldsAndValues[_i - 3] = arguments[_i];
    }
    return trySignInWithCustomToken(function () { return firestore_1.updateDoc.apply(void 0, __spreadArray([reference, field, value], moreFieldsAndValues, false)); });
});
exports.deleteDoc = (function (reference) {
    return trySignInWithCustomToken(function () { return (0, firestore_1.deleteDoc)(reference); });
});
function validCustomToken(db, id) {
    var docRef = (0, firestore_1.doc)(db, 'store', id);
    return (0, firestore_1.getDoc)(docRef);
}
exports.validCustomToken = validCustomToken;
function getUserDoc(db, email) {
    var paths = [];
    for (var _i = 2; _i < arguments.length; _i++) {
        paths[_i - 2] = arguments[_i];
    }
    return firestore_1.doc.apply(void 0, __spreadArray([db, 'store', email], paths, false));
}
exports.getUserDoc = getUserDoc;
function getUserCollection(db, email) {
    var paths = [];
    for (var _i = 2; _i < arguments.length; _i++) {
        paths[_i - 2] = arguments[_i];
    }
    return firestore_1.collection.apply(void 0, __spreadArray([db, 'store', email], paths, false));
}
exports.getUserCollection = getUserCollection;
function findOne(q) {
    var _a;
    return __awaiter(this, void 0, void 0, function () {
        var querySnap;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, (0, exports.getDocs)(q)];
                case 1:
                    querySnap = _b.sent();
                    return [2 /*return*/, (_a = querySnap.docs[0]) !== null && _a !== void 0 ? _a : null];
            }
        });
    });
}
exports.findOne = findOne;
function findMany(q) {
    return __awaiter(this, void 0, void 0, function () {
        var querySnap, result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, exports.getDocs)(q)];
                case 1:
                    querySnap = _a.sent();
                    result = [];
                    querySnap.forEach(function (doc) { return result.push(doc); });
                    return [2 /*return*/, result];
            }
        });
    });
}
exports.findMany = findMany;
