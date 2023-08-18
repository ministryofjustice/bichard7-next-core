"use strict";
exports.__esModule = true;
var typeorm_1 = require("typeorm");
var resolveFindOperator = function (transformerInput, transformedValue) {
    if (transformerInput instanceof typeorm_1.FindOperator) {
        return new typeorm_1.FindOperator(transformerInput.type, transformedValue(transformerInput.value), transformerInput.useParameter, transformerInput.multipleParameters, transformerInput.getSql, transformerInput.objectLiteralParameters);
    }
    return transformedValue(transformerInput);
};
exports["default"] = resolveFindOperator;
