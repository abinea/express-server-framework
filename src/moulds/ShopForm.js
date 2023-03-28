"use strict";
exports.__esModule = true;
exports.createShopFormSchema = void 0;
var Yup = require("yup");
var createShopFormSchema = function () {
    return Yup.object({
        name: Yup.string()
            .required("店铺名不能为空")
            .min(3, "店铺名至少 3 个字符")
            .max(20, "店铺名不可超过 20 字")
    });
};
exports.createShopFormSchema = createShopFormSchema;
