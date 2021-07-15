import axios from 'axios';

export default axios.create({
    baseURL: "http://localhost:16004/api/",
    responseType: "json"
});