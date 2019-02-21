import { keys } from 'lodash';

const parse = (nodes) => {
  const items = [];
  const transform = {
    item: (node, acc) => {
      items.push(parse(node.children));
      return acc;
    },
    title: (node, acc) => ({ ...acc, title: node.textContent }),
    description: (node, acc) => ({ ...acc, description: node.textContent }),
    link: (node, acc) => ({ ...acc, link: node.textContent }),
  };

  const result = [...nodes].filter(node => keys(transform).includes(node.tagName))
    .reduce((acc, node) => transform[node.tagName](node, acc), {});

  if (items.length) {
    return { ...result, items };
  }
  return result;
};

export default (rawData) => {
  const domParser = new DOMParser();
  const xml = domParser.parseFromString(rawData, 'text/xml');
  const channel = xml.querySelector('channel');
  return parse(channel.children);
};
