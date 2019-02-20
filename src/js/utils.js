const isRssMimeType = ({ headers }) => {
  if (!headers['content-type']) {
    throw new Error('Cant validate mime type');
  }
  return headers['content-type'].split(';').map(elem => elem.trim()).includes('application/rss+xml');
};


export default isRssMimeType;
