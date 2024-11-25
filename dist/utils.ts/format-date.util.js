"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatDate = void 0;
const moment = require("moment");
const formatDate = (createdAt, formatDate = 'MMMM Do YYYY, h:mm a') => {
    return moment(createdAt).format('MMMM Do YYYY, h:mm a');
};
exports.formatDate = formatDate;
//# sourceMappingURL=format-date.util.js.map