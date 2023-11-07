import axios from 'axios';

const client = axios.create({
  // baseURL: 'http://192.168.88.106:8000',
  baseURL: 'http://172.22.200.229:8000',
});

export default client;
