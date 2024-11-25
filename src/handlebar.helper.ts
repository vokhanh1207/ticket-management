import * as moment from 'moment' 
const formatDate = (createdAt: string, formatDate = 'MMMM Do YYYY, h:mm a') => {
    return moment(createdAt).format(formatDate); 
}

const ifeq = (a, b, options) => {
    if (a == b) { return options.fn(this); }
    return options.inverse(this);
}

module.exports = {
    formatDate,
    ifeq
}