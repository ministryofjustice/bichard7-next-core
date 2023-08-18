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
var Note_1 = require("./Note");
var Trigger_1 = require("./Trigger");
var booleanIntTransformer_1 = require("./transformers/booleanIntTransformer");
var dateTransformer_1 = require("./transformers/dateTransformer");
var resolutionStatusTransformer_1 = require("./transformers/resolutionStatusTransformer");
var CourtCase = /** @class */ (function (_super) {
    __extends(CourtCase, _super);
    function CourtCase() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    CourtCase.prototype.isLockedByAnotherUser = function (username) {
        return ((!!this.errorLockedByUsername && this.errorLockedByUsername !== username) ||
            (!!this.triggerLockedByUsername && this.triggerLockedByUsername !== username));
    };
    __decorate([
        (0, typeorm_1.PrimaryColumn)("int4", { name: "error_id" }),
        __metadata("design:type", Number)
    ], CourtCase.prototype, "errorId");
    __decorate([
        (0, typeorm_1.Column)("varchar", { name: "message_id" }),
        __metadata("design:type", String)
    ], CourtCase.prototype, "messageId");
    __decorate([
        (0, typeorm_1.Column)("int4", { name: "phase" }),
        __metadata("design:type", Number)
    ], CourtCase.prototype, "phase");
    __decorate([
        (0, typeorm_1.Column)({ name: "error_status", type: "int4", transformer: resolutionStatusTransformer_1["default"] }),
        __metadata("design:type", String)
    ], CourtCase.prototype, "errorStatus");
    __decorate([
        (0, typeorm_1.Column)({ name: "trigger_status", type: "int4", transformer: resolutionStatusTransformer_1["default"] }),
        __metadata("design:type", String)
    ], CourtCase.prototype, "triggerStatus");
    __decorate([
        (0, typeorm_1.Column)({ name: "error_quality_checked", type: "int4", nullable: true }),
        __metadata("design:type", Number)
    ], CourtCase.prototype, "errorQualityChecked");
    __decorate([
        (0, typeorm_1.Column)({ name: "trigger_quality_checked", type: "int4", nullable: true }),
        __metadata("design:type", Number)
    ], CourtCase.prototype, "triggerQualityChecked");
    __decorate([
        (0, typeorm_1.Column)("int4", { name: "trigger_count" }),
        __metadata("design:type", Number)
    ], CourtCase.prototype, "triggerCount");
    __decorate([
        (0, typeorm_1.Column)({ name: "is_urgent", type: "int2", transformer: booleanIntTransformer_1["default"] }),
        __metadata("design:type", Boolean)
    ], CourtCase.prototype, "isUrgent");
    __decorate([
        (0, typeorm_1.Column)({ name: "asn", type: "varchar", nullable: true }),
        __metadata("design:type", String)
    ], CourtCase.prototype, "asn");
    __decorate([
        (0, typeorm_1.Column)({ name: "court_code", type: "varchar", nullable: true }),
        __metadata("design:type", String)
    ], CourtCase.prototype, "courtCode");
    __decorate([
        (0, typeorm_1.Column)({ name: "annotated_msg", type: "varchar" }),
        __metadata("design:type", String)
    ], CourtCase.prototype, "hearingOutcome");
    __decorate([
        (0, typeorm_1.Column)({ name: "updated_msg", type: "varchar", nullable: true }),
        __metadata("design:type", String)
    ], CourtCase.prototype, "updatedHearingOutcome");
    __decorate([
        (0, typeorm_1.Column)("varchar", { name: "error_report" }),
        __metadata("design:type", String)
    ], CourtCase.prototype, "errorReport");
    __decorate([
        (0, typeorm_1.Column)({ name: "create_ts", type: "timestamptz" }),
        __metadata("design:type", Date)
    ], CourtCase.prototype, "createdTimestamp");
    __decorate([
        (0, typeorm_1.Column)({ name: "error_reason", type: "varchar", nullable: true }),
        __metadata("design:type", String)
    ], CourtCase.prototype, "errorReason");
    __decorate([
        (0, typeorm_1.Column)({ name: "trigger_reason", type: "varchar", nullable: true }),
        __metadata("design:type", String)
    ], CourtCase.prototype, "triggerReason");
    __decorate([
        (0, typeorm_1.Column)("int4", { name: "error_count" }),
        __metadata("design:type", Number)
    ], CourtCase.prototype, "errorCount");
    __decorate([
        (0, typeorm_1.Column)({ name: "user_updated_flag", type: "int2", nullable: true }),
        __metadata("design:type", Number)
    ], CourtCase.prototype, "userUpdatedFlag");
    __decorate([
        (0, typeorm_1.Column)({ name: "court_date", type: "date", nullable: true, transformer: dateTransformer_1["default"] }),
        __metadata("design:type", Date)
    ], CourtCase.prototype, "courtDate");
    __decorate([
        (0, typeorm_1.Column)("varchar", { name: "ptiurn" }),
        __metadata("design:type", String)
    ], CourtCase.prototype, "ptiurn");
    __decorate([
        (0, typeorm_1.Column)("varchar", { name: "court_name" }),
        __metadata("design:type", String)
    ], CourtCase.prototype, "courtName");
    __decorate([
        (0, typeorm_1.Column)({ name: "resolution_ts", type: "timestamptz", nullable: true }),
        __metadata("design:type", Date)
    ], CourtCase.prototype, "resolutionTimestamp");
    __decorate([
        (0, typeorm_1.Column)({ name: "msg_received_ts", type: "timestamptz" }),
        __metadata("design:type", Date)
    ], CourtCase.prototype, "messageReceivedTimestamp");
    __decorate([
        (0, typeorm_1.Column)({ name: "error_resolved_by", type: "varchar", nullable: true }),
        __metadata("design:type", String)
    ], CourtCase.prototype, "errorResolvedBy");
    __decorate([
        (0, typeorm_1.Column)({ name: "trigger_resolved_by", type: "varchar", nullable: true }),
        __metadata("design:type", String)
    ], CourtCase.prototype, "triggerResolvedBy");
    __decorate([
        (0, typeorm_1.Column)({ name: "error_resolved_ts", type: "timestamptz", nullable: true }),
        __metadata("design:type", Date)
    ], CourtCase.prototype, "errorResolvedTimestamp");
    __decorate([
        (0, typeorm_1.Column)({ name: "trigger_resolved_ts", type: "timestamptz", nullable: true }),
        __metadata("design:type", Date)
    ], CourtCase.prototype, "triggerResolvedTimestamp");
    __decorate([
        (0, typeorm_1.Column)({ name: "defendant_name", type: "varchar", nullable: true }),
        __metadata("design:type", String)
    ], CourtCase.prototype, "defendantName");
    __decorate([
        (0, typeorm_1.Column)({ name: "org_for_police_filter", type: "varchar", nullable: true }),
        __metadata("design:type", String)
    ], CourtCase.prototype, "orgForPoliceFilter");
    __decorate([
        (0, typeorm_1.Column)({ name: "court_room", type: "varchar", nullable: true }),
        __metadata("design:type", String)
    ], CourtCase.prototype, "courtRoom");
    __decorate([
        (0, typeorm_1.Column)("varchar", { name: "court_reference" }),
        __metadata("design:type", String)
    ], CourtCase.prototype, "courtReference");
    __decorate([
        (0, typeorm_1.Column)({ name: "error_insert_ts", type: "timestamptz", nullable: true }),
        __metadata("design:type", Date)
    ], CourtCase.prototype, "errorInsertedTimestamp");
    __decorate([
        (0, typeorm_1.Column)({ name: "trigger_insert_ts", type: "timestamptz", nullable: true }),
        __metadata("design:type", Date)
    ], CourtCase.prototype, "triggerInsertedTimestamp");
    __decorate([
        (0, typeorm_1.Column)({ name: "pnc_update_enabled", type: "varchar", nullable: true }),
        __metadata("design:type", String)
    ], CourtCase.prototype, "pncUpdateEnabled");
    __decorate([
        (0, typeorm_1.OneToMany)(function () { return Trigger_1["default"]; }, function (trigger) { return trigger.courtCase; }, { eager: true, cascade: ["insert", "update"] }),
        __metadata("design:type", Array)
    ], CourtCase.prototype, "triggers");
    __decorate([
        (0, typeorm_1.Column)({ name: "error_locked_by_id", type: "varchar", nullable: true }),
        __metadata("design:type", String)
    ], CourtCase.prototype, "errorLockedByUsername");
    __decorate([
        (0, typeorm_1.Column)({ name: "trigger_locked_by_id", type: "varchar", nullable: true }),
        __metadata("design:type", String)
    ], CourtCase.prototype, "triggerLockedByUsername");
    __decorate([
        (0, typeorm_1.OneToMany)(function () { return Note_1["default"]; }, function (note) { return note.courtCase; }, { eager: true, cascade: ["insert", "update"] }),
        __metadata("design:type", Array)
    ], CourtCase.prototype, "notes");
    CourtCase = __decorate([
        (0, typeorm_1.Entity)({ name: "error_list" })
    ], CourtCase);
    return CourtCase;
}(BaseEntity_1["default"]));
exports["default"] = CourtCase;
