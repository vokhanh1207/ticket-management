"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.slice = exports.and = exports.or = exports.ne = exports.ifeq = exports.eq = exports.formatDate = void 0;
const moment = require("moment");
const formatDate = (createdAt, formatDate = 'MMMM Do YYYY, h:mm a') => {
    return moment(createdAt).format(formatDate);
};
exports.formatDate = formatDate;
const eq = function (a, b) {
    return a === b;
};
exports.eq = eq;
const ifeq = function (a, b, options) {
    return a === b ? options.fn(this) : options.inverse(this);
};
exports.ifeq = ifeq;
const ne = function (a, b) {
    return a !== b;
};
exports.ne = ne;
const or = function (a, b) {
    return a || b;
};
exports.or = or;
const and = function (a, b) {
    return a && b;
};
exports.and = and;
const slice = function (str, start, end) {
    return str?.slice(start, end)?.toUpperCase() || '';
};
exports.slice = slice;
module.exports = {
    formatDate: exports.formatDate,
    eq: exports.eq,
    ifeq: exports.ifeq,
    ne: exports.ne,
    or: exports.or,
    and: exports.and,
    slice: exports.slice
};
//# sourceMappingURL=handlebar.helper.js.map