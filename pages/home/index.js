const app = getApp();
const { refreshTasks } = require('../../utils/mock-data');

Page({
  data: {
    user: {},
    posts: [],
    wishes: [],
    tasks: [],
    chains: [],
    activities: [],
    currentTime: '19:12',
    matchCount: 1337,
    unreadCount: 3,
    selectedTab: 0,
    topicTags: [
      '#奶茶换万物',
      '#毕业季清仓',
      '#离谱交换大赏',
      '#以技换物',
      '#本周热榜',
    ],
    searchKeyword: '',
    isSearching: false,
    allPosts: [],
    filteredPosts: [],
  },


  onShow() {
    const state = app.resetState();
    refreshTasks(state);
    this.updateTime();

    // 把图片路径转换成首页同目录下的相对路径，避免开发者工具根路径解析问题
    state.currentUser.avatar = './images/avatar-1.png';
    const localPosts = state.posts.map((post, idx) => ({
      ...post,
      avatar: `./images/avatar-${(idx % 6) + 2}.png`,
      images: [`./images/post-${['calculator','cup','suitcase','books','art'][idx % 5]}.png`],
    }));

    this.setData({
      user: state.currentUser,
      posts: localPosts,
      allPosts: localPosts,
      filteredPosts: localPosts,
      wishes: state.wishes.slice(0, 4),
      tasks: state.tasks.slice(0, 2),
      chains: state.chains.slice(0, 1),
      activities: state.activityCards || [],
    });
    console.log('DEBUG posts[0].images', this.data.posts[0] && this.data.posts[0].images);
    console.log('DEBUG state.version', state.version);
    this.syncTabBar();
  },

  syncTabBar() {
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({
        selected: 0,
        unreadCount: this.data.unreadCount,
      });
    }
  },

  updateTime() {
    const now = new Date();
    const h = String(now.getHours()).padStart(2, '0');
    const m = String(now.getMinutes()).padStart(2, '0');
    this.setData({ currentTime: `${h}:${m}` });
  },

  goPublish() { wx.switchTab({ url: '/pages/publish/index' }); },
  goLab() { wx.navigateTo({ url: '/pages/lab/index' }); },
  goRank() { wx.navigateTo({ url: '/pages/rank/index' }); },
  goStories() { wx.navigateTo({ url: '/pages/stories/index' }); },
  goTasks() { wx.navigateTo({ url: '/pages/tasks/index' }); },
  goWish() { wx.navigateTo({ url: '/pages/wish/index' }); },
  goChain() { wx.navigateTo({ url: '/pages/chain/index' }); },
  goMap() { wx.navigateTo({ url: '/pages/map/index' }); },

  goDetail(e) {
    const { id } = e.currentTarget.dataset;
    wx.navigateTo({ url: `/pages/detail/index?id=${id}` });
  },

  randomStory() { wx.navigateTo({ url: '/pages/stories/index?focus=random' }); },

  onSearchTap() {
    this.setData({ isSearching: true });
  },

  onSearchInput(e) {
    const keyword = e.detail.value || '';
    this.setData({ searchKeyword: keyword });
    this.filterPosts(keyword);
  },

  onSearchConfirm(e) {
    const keyword = e.detail.value || '';
    this.setData({ searchKeyword: keyword });
    this.filterPosts(keyword);
  },

  clearSearch() {
    this.setData({ searchKeyword: '' });
    this.filterPosts('');
  },

  cancelSearch() {
    this.setData({ isSearching: false, searchKeyword: '' });
    this.filterPosts('');
  },

  filterPosts(keyword) {
    const kw = (keyword || '').toLowerCase().trim();
    if (!kw) {
      this.setData({ filteredPosts: this.data.allPosts });
      return;
    }
    // 支持空格分隔的多关键词，任一关键词命中即可
    const kws = kw.split(/\s+/).filter((s) => s.length > 0);
    const filtered = this.data.allPosts.filter((post) => {
      const haystack = [
        post.title || '',
        post.haveItem || '',
        post.wantItem || '',
        post.nickName || '',
        post.school || '',
        post.story || '',
        (post.tags || []).join(' '),
      ].join(' ').toLowerCase();
      return kws.some((w) => haystack.includes(w));
    });
    this.setData({ filteredPosts: filtered });
  },



  onTagTap(e) {
    const { tag } = e.currentTarget.dataset;
    wx.showToast({ title: `进入 ${tag}`, icon: 'none' });
  },

  onChatTap(e) {
    const { id } = e.currentTarget.dataset;
    wx.navigateTo({ url: `/pages/proposal/index?postId=${id}` });
  },

  onSwapTap(e) {
    const { id } = e.currentTarget.dataset;
    wx.navigateTo({ url: `/pages/detail/index?id=${id}` });
  },
});
