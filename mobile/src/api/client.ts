import {Keys, getFromAsyncStorage} from '@utils/asyncStorage';
import axios, {CreateAxiosDefaults} from 'axios';

// const baseURL = 'http://192.168.88.106:8000';
// const baseURL = 'http://172.22.200.229:8000';
const baseURL = 'http://localhost:8000';

const client = axios.create({
  baseURL,
});

type headers = CreateAxiosDefaults<any>['headers'];

export const getClient = async (headers?: headers) => {
  const token = await getFromAsyncStorage(Keys.AUTH_TOKEN);
  if (!token) return axios.create({baseURL});
  const defaultHeaders = {
    Authorization: 'Bearer ' + token,
    ...headers,
  };
  return axios.create({baseURL, headers: defaultHeaders});
};

export default client;
