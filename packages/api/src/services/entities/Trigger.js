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
// eslint-disable-next-line import/no-cycle
var CourtCase_1 = require("./CourtCase");
var dateTransformer_1 = require("./transformers/dateTransformer");
var resolutionStatusTransformer_1 = require("./transformers/resolutionStatusTransformer");
var Trigger = /** @class */ (function (_super) {
    __extends(Trigger, _super);
    function Trigger() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    __decorate([
        (0, typeorm_1.PrimaryColumn)("int4", { name: "trigger_id" }),
        __metadata("design:type", Number)
    ], Trigger.prototype, "triggerId");
    __decorate([
        (0, typeorm_1.Column)("varchar", { name: "trigger_code" }),
        __metadata("design:type", String)
    ], Trigger.prototype, "triggerCode");
    __decorate([
        (0, typeorm_1.Column)("int4", { name: "error_id" }),
        __metadata("design:type", Number)
    ], Trigger.prototype, "errorId");
    __decorate([
        (0, typeorm_1.Column)({ type: "int4", transformer: resolutionStatusTransformer_1["default"] }),
        __metadata("design:type", String)
    ], Trigger.prototype, "status");
    __decorate([
        (0, typeorm_1.Column)({ name: "create_ts", type: "timestamp", transformer: dateTransformer_1["default"] }),
        __metadata("design:type", Date)
    ], Trigger.prototype, "createdAt");
    __decorate([
        (0, typeorm_1.Column)({ name: "resolved_by", type: "varchar" }),
        __metadata("design:type", String)
    ], Trigger.prototype, "resolvedBy");
    __decorate([
        (0, typeorm_1.Column)({ name: "resolved_ts", type: "timestamp", transformer: dateTransformer_1["default"] }),
        __metadata("design:type", Date)
    ], Trigger.prototype, "resolvedAt");
    __decorate([
        (0, typeorm_1.Column)("varchar", { name: "trigger_item_identity" }),
        __metadata("design:type", Number)
    ], Trigger.prototype, "triggerItemIdentity");
    __decorate([
        (0, typeorm_1.ManyToOne)(function () { return CourtCase_1["default"]; }),
        (0, typeorm_1.JoinColumn)({ name: "error_id" }),
        __metadata("design:type", Object)
    ], Trigger.prototype, "courtCase");
    Trigger = __decorate([
        (0, typeorm_1.Entity)({ name: "error_list_triggers" })
    ], Trigger);
    return Trigger;
}(BaseEntity_1["default"]));
exports["default"] = Trigger;
