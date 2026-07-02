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
    sortBy: 'latest',
  },



  onShow() {
    const state = app.restoreState();
    refreshTasks(state);
    this.updateTime();

    // 把图片路径转换成首页同目录下的相对路径，避免开发者工具根路径解析问题
    state.currentUser.avatar = './images/avatar-1.png';
    const localPosts = state.posts.map((post, idx) => ({
      ...post,
      avatar: `./images/avatar-${(idx % 6) + 2}.png`,
      images: post.images && post.images.length
        ? [`./images/post-${['calculator','cup','suitcase','books','art'][idx % 5]}.png`]
        : [],
    }));

    const sortedPosts = this.sortPosts(localPosts, this.data.sortBy);

    this.setData({
      user: state.currentUser,
      posts: localPosts,
      allPosts: localPosts,
      filteredPosts: sortedPosts,
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
    let base = this.data.allPosts;
    if (kw) {
      // 支持空格分隔的多关键词，任一关键词命中即可
      const kws = kw.split(/\s+/).filter((s) => s.length > 0);
      base = this.data.allPosts.filter((post) => {
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
    }
    this.setData({ filteredPosts: this.sortPosts(base, this.data.sortBy) });
  },

  sortPosts(list, sortBy) {
    const posts = (list || []).slice();
    if (sortBy === 'hot') {
      posts.sort((a, b) => {
        const hotA = (a.likeCount || 0) + (a.proposalCount || 0) * 2;
        const hotB = (b.likeCount || 0) + (b.proposalCount || 0) * 2;
        return hotB - hotA;
      });
    } else {
      // 最新：新发布（createdAt 为 '刚刚'）置顶，其余按 createdAt 字符串降序
      posts.sort((a, b) => {
        if (a.createdAt === '刚刚' && b.createdAt !== '刚刚') return -1;
        if (b.createdAt === '刚刚' && a.createdAt !== '刚刚') return 1;
        return String(b.createdAt || '').localeCompare(String(a.createdAt || ''));
      });
    }
    return posts;
  },

  onSortTap(e) {
    const { type } = e.currentTarget.dataset;
    if (type === this.data.sortBy) return;
    this.setData({ sortBy: type });
    this.filterPosts(this.data.searchKeyword);
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
