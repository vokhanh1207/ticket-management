import * as moment from 'moment';

export const formatDate = (createdAt: string, formatDate = 'MMMM Do YYYY, h:mm a') => {
    return moment(createdAt).format(formatDate); 
};

// Separate helpers for direct comparison and block usage
export const eq = function(a: any, b: any): boolean {
    return a === b;
};

export const ifeq = function(a: any, b: any, options: any): any {
    return a === b ? options.fn(this) : options.inverse(this);
};

export const ne = function(a: any, b: any): boolean {
    return a !== b;
};

export const or = function(a: any, b: any): boolean {
    return a || b;
};

export const and = function(a: any, b: any): boolean {
    return a && b;
};

export const slice = function(str: string, start: number, end: number): string {
    return str?.slice(start, end)?.toUpperCase() || '';
};

module.exports = {
    formatDate,
    eq,
    ifeq,
    ne,
    or,
    and,
    slice
}