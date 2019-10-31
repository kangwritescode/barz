import axios from 'axios';

const instance = axios.create({
    baseURL: "https://barz-86ae0.firebaseio.com"
});

export default instance;