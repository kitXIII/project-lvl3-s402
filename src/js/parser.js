const tags = {
  channel: ['title', 'description'],
  item: ['title', 'description', 'link'],
};

const getElementContent = elem => tags[elem.tagName].reduce((acc, tag) => {
  const child = elem.querySelector(tag);
  return child ? { ...acc, [tag]: child.textContent } : acc;
}, {});

export default (rawData) => {
  const domParser = new DOMParser();
  const xml = domParser.parseFromString(rawData, 'text/xml');
  const items = [...xml.querySelectorAll('item')].map(getElementContent);
  const channel = getElementContent(xml.querySelector('channel'));
  return { ...channel, items };
};
