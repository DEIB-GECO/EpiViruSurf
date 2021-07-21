export const FULL_TEXT = 'FULL NUCLEOTIDE SEQUENCE'
export const LOADING_TEXT = 'Loading...'
import axios from "axios";

export const poll = (id, callback) => {
    let myInterval;
    myInterval = setInterval(() => {
        let url = `poll/${id}`
        axios.get(url)
            .then((res) => {
                return res.data;
            })
            .then((res) => {
                if (res.ready) {
                    clearInterval(myInterval);
                    callback(res.result);
                }
            }).catch(
            function (error) {
                clearInterval(myInterval);
            }
        );
    }, 5000);
    return [myInterval, id];
}


export const stopPoll = (array_interval) => {
    clearInterval(array_interval[0])
}