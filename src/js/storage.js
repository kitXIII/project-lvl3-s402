const STORE_ITEM_NAME = 'rss-kit-store-item-name';

export const loadFeedUrls = () => {
  const rawUrls = localStorage.getItem(STORE_ITEM_NAME);
  return rawUrls ? JSON.parse(rawUrls) : [];
};

export const saveFeedUrls = urls => localStorage.setItem(STORE_ITEM_NAME, JSON.stringify(urls));

export const removeFeedUrls = () => localStorage.removeItem(STORE_ITEM_NAME);
