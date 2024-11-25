"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const moment = require("moment");
const formatDate = (createdAt, formatDate = 'MMMM Do YYYY, h:mm a') => {
    return moment(createdAt).format(formatDate);
};
const ifeq = (a, b, options) => {
    if (a == b) {
        return options.fn(this);
    }
    return options.inverse(this);
};
module.exports = {
    formatDate,
    ifeq
};
//# sourceMappingURL=handlebar.helper.js.map