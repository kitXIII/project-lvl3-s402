export default class AppState {
  constructor(feedUrls = []) {
    this.addedFeedList = new Set(feedUrls);
    this.feedsOnLoading = new Set();
    this.feeds = [];
    this.inputValue = '';
    this.state = 'init';
    this.errorType = '';
    this.rssItemsModalContent = {};
  }

  addFeed(feed) {
    const { feeds } = this;
    this.feeds = [feed, ...feeds];
  }

  setFeeds(feeds) {
    this.feeds = feeds;
  }

  setInputValue(value) {
    this.inputValue = value;
  }

  setOnValid() {
    this.state = 'onValid';
  }

  setOnInvalid() {
    this.state = 'onInvalid';
  }

  setOnError(errorType) {
    this.state = 'onError';
    this.errorType = errorType;
  }

  setOnPending() {
    this.state = 'onPending';
  }

  setOnSuccess() {
    if (this.inputValue) {
      this.addedFeedList.add(this.inputValue);
    }
    this.inputValue = '';
    this.state = 'onSuccess';
  }
}
