import axios from 'axios';

const corsProxyUrl = 'https://cors-anywhere.herokuapp.com/';
// const corsProxyUrl = 'http://cors.io/?';

axios.interceptors.request.use((config) => {
  if (process.env.NODE_ENV !== 'test') {
    // eslint-disable-next-line no-param-reassign
    config.url = `${corsProxyUrl}${config.url}`;
  }
  return config;
});

export default axios;
