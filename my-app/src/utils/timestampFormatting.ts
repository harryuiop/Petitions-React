import moment from "moment";

export const formatTimestamp = (timestamp: string) => {
    return moment(timestamp).format("dddd, MMMM Do YYYY, h:mm:ss a");
};
