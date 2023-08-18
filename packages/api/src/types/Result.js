"use strict";
exports.__esModule = true;
exports.isSuccess = exports.isError = void 0;
function isError(result) {
    return result instanceof Error;
}
exports.isError = isError;
function isSuccess(result) {
    return !isError(result);
}
exports.isSuccess = isSuccess;
