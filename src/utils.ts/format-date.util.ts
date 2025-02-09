import * as moment from 'moment';

export const formatDate = (createdAt: string | Date, formatDate = 'MMMM Do YYYY, h:mm a') => {
    return moment(createdAt).format('MMMM Do YYYY, h:mm a'); 
}