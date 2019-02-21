import axios from 'axios';
import isRssMimeType from './utils';
import parse from './parser';

const corsProxyUrl = 'https://cors-anywhere.herokuapp.com/';

export default url => axios.get(`${corsProxyUrl}${url}`, {
  validateStatus: status => status === 200,
  timeout: 10000,
})
  .then((resp) => {
    if (!isRssMimeType(resp)) {
      throw new Error('It is not rss address');
    }
    if (!resp.data) {
      throw new Error('Response data is empty');
    }
    return parse(resp.data);
  });
