import { flatten, sortBy } from 'lodash';

export const renderFeedTitles = feeds => sortBy(feeds, feed => Date.parse(feed.pubDate))
  .reverse()
  .map(feed => `
    <div class="pl-2">
      <h5>${feed.title}</h5>
      <p class="font-weight-light pl-1">${feed.description}</p>
    </div><hr/>`)
  .join('');

export const renderFeedItems = (feeds, itemsModalElementId) => {
  const itemsWithRenders = flatten(feeds
    .map((feed, feedIndex) => feed.items.map((item, itemIndex) => ({
      ...item,
      render: `
        <div class="d-flex justify-content-between align-items-center py-1">
          <a href="${item.link}">${item.title}</a>
          <button type="button" class="btn btn-sm btn-secondary ml-2" data-toggle="modal" data-target="#${itemsModalElementId}" data-channel="${feedIndex}" data-index="${itemIndex}">
            view
          </button>
        </div>`,
    }))));
  return sortBy(itemsWithRenders, item => Date.parse(item.pubDate))
    .reverse()
    .map(item => item.render)
    .join('');
};
