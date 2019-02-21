import axios from './axios';
import isRssMimeType from './utils';
import parse from './parser';

export default url => axios.get(url, {
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
    const domParser = new DOMParser();
    const xml = domParser.parseFromString(resp.data, 'text/xml');
    console.dir(xml);
    const channel = xml.querySelector('channel');
    return parse(channel.children);
  });
