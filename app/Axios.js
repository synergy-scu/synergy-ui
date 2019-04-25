import Axios from 'axios';

const instance = Axios.create({
    baseURL: '/api/',
    timeout: 30000,
    method: 'post',
    transformResponse: [data => Object.values(JSON.parse(data))[0]],
});

export default instance;
