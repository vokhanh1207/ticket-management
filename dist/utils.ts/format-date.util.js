"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatDate = void 0;
const moment_1 = require("moment");
const formatDate = (createdAt, formatDate = 'MMMM Do YYYY, h:mm a') => {
    return (0, moment_1.default)(createdAt).format(formatDate);
};
exports.formatDate = formatDate;
//# sourceMappingURL=format-date.util.js.map