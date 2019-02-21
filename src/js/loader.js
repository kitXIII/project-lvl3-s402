import axios from 'axios';
import parse from './parser';

const corsProxyUrl = 'https://cors-anywhere.herokuapp.com/';

const hasRssHeader = (res) => {
  if (!res.headers['content-type']) {
    throw new Error('Cant validate mime type');
  }
  return res.headers['content-type'].split(';').map(elem => elem.trim()).includes('application/rss+xml');
};

export default url => axios.get(`${corsProxyUrl}${url}`, {
  validateStatus: status => status === 200,
  timeout: 10000,
})
  .then((resp) => {
    if (!hasRssHeader(resp)) {
      throw new Error('It is not rss address');
    }
    if (!resp.data) {
      throw new Error('Response data is empty');
    }
    return parse(resp.data);
  });
