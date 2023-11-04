import axios from 'axios';

const client = axios.create({
  baseURL: 'http://192.168.88.105:8000',
});

export default client;
