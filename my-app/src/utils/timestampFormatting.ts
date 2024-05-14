import moment from 'moment';

export const formatTimestamp = (timestamp: string) => {
    return moment().format("dddd, MMMM Do YYYY");
}
