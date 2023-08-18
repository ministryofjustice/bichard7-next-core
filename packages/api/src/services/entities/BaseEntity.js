"use strict";
exports.__esModule = true;
var BaseEntity = /** @class */ (function () {
    function BaseEntity() {
    }
    BaseEntity.prototype.serialize = function () {
        return JSON.parse(JSON.stringify(this));
    };
    return BaseEntity;
}());
exports["default"] = BaseEntity;
