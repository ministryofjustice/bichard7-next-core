"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
exports.__esModule = true;
var typeorm_1 = require("typeorm");
var BaseEntity_1 = require("./BaseEntity");
var delimitedPrefixedString_1 = require("./transformers/delimitedPrefixedString");
var featureFlagTransformer_1 = require("./transformers/featureFlagTransformer");
var User = /** @class */ (function (_super) {
    __extends(User, _super);
    function User() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.groups = [];
        return _this;
    }
    Object.defineProperty(User.prototype, "canLockTriggers", {
        get: function () {
            return this.groups.some(function (group) {
                return group === "TriggerHandler" || group === "GeneralHandler" || group === "Allocator" || group === "Supervisor";
            });
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(User.prototype, "canLockExceptions", {
        get: function () {
            return this.groups.some(function (group) {
                return group === "ExceptionHandler" || group === "GeneralHandler" || group === "Allocator" || group === "Supervisor";
            });
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(User.prototype, "isSupervisor", {
        get: function () {
            return this.groups.some(function (group) { return group === "Supervisor"; });
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(User.prototype, "visibleCases", {
        get: function () {
            return this.visibleForces.concat(this.visibleCourts);
        },
        enumerable: false,
        configurable: true
    });
    __decorate([
        (0, typeorm_1.PrimaryColumn)("varchar"),
        __metadata("design:type", String)
    ], User.prototype, "username");
    __decorate([
        (0, typeorm_1.Column)("varchar"),
        __metadata("design:type", String)
    ], User.prototype, "password");
    __decorate([
        (0, typeorm_1.Column)("varchar"),
        __metadata("design:type", String)
    ], User.prototype, "email");
    __decorate([
        (0, typeorm_1.Column)("varchar"),
        __metadata("design:type", String)
    ], User.prototype, "forenames");
    __decorate([
        (0, typeorm_1.Column)("varchar"),
        __metadata("design:type", String)
    ], User.prototype, "surname");
    __decorate([
        (0, typeorm_1.Column)({ name: "visible_forces", transformer: (0, delimitedPrefixedString_1["default"])(",", "0"), type: "varchar" }),
        __metadata("design:type", Array)
    ], User.prototype, "visibleForces");
    __decorate([
        (0, typeorm_1.Column)({ name: "visible_courts", transformer: (0, delimitedPrefixedString_1["default"])(",", "0"), type: "varchar" }),
        __metadata("design:type", Array)
    ], User.prototype, "visibleCourts");
    __decorate([
        (0, typeorm_1.Column)({ name: "feature_flags", transformer: featureFlagTransformer_1["default"], type: "jsonb" }),
        __metadata("design:type", Object)
    ], User.prototype, "featureFlags");
    User = __decorate([
        (0, typeorm_1.Entity)({ name: "users" })
    ], User);
    return User;
}(BaseEntity_1["default"]));
exports["default"] = User;
