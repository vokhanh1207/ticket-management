import * as moment from 'moment' 
const formatDate = (createdAt: string, formatDate = 'MMMM Do YYYY, h:mm a') => {
    return moment(createdAt).format(formatDate); 
}
module.exports = {
    formatDate
}