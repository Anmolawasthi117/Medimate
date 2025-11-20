import axios from 'axios';

export default axios.create({
    baseURL: '/api/v1', // changed from full URL to relative path
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
    }
});