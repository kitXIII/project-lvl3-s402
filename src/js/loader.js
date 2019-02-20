import axios from './axios';
import isRssMimiType from './utils';

export default url => axios.get(url, {
  validateStatus: status => status === 200,
  timeout: 10000,
})
  .then((resp) => {
    if (!isRssMimiType(resp)) {
      throw new Error('It is not rss address response');
    }
    return resp;
  });
