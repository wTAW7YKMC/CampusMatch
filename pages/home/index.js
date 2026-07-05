const app = getApp();

const { auth, db } = require('../../utils/supabase');
const { refreshTasks } = require('../../utils/mock-data');

function defaultUser() {
  return {
    userId: '',
    nickName: '未登录',
    avatar: '../../assets/avatars/avatar-1.png',
    school: '',
    grade: '',
    creditScore: 60,
    exchangeCount: 0,
    publishCount: 0,
    proposalCount: 0,
    wishCount: 0,
    chainCount: 0,
    storyLikes: 0,
    level: 'Lv1',
    verified: false,
    brainPower: 0,
    energy: 0,
    badges: [],
    title: '校园换物家',
  };
}

function mapProfile(row) {
  if (!row) return defaultUser();

  return {
    userId: row.id,
    nickName: row.nick_name || '校换用户',
    avatar: row.avatar_url || '../../assets/avatars/avatar-1.png',
    school: row.school || '',
    grade: row.grade || '',
    creditScore: row.credit_score || 60,
    exchangeCount: row.exchange_count || 0,
    publishCount: row.publish_count || 0,
    proposalCount: row.proposal_count || 0,
    wishCount: row.wish_count || 0,
    chainCount: row.chain_count || 0,
    storyLikes: row.story_likes || 0,
    level: row.level || 'Lv1',
    verified: Boolean(row.verified),
    brainPower: row.brain_power || 0,
    energy: row.energy || 0,
    badges: row.badges || [],
    title: row.title || '校园换物家',
  };
}

function formatDateLabel(value) {
  if (!value) return '刚刚';

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return String(value);

  const now = Date.now();
  const diff = now - date.getTime();

  const minute = 60 * 1000;
  const hour = 60 * minute;
  const day = 24 * hour;

  if (diff < minute) return '刚刚';
  if (diff < hour) return `${Math.floor(diff / minute)}分钟前`;
  if (diff < day) return `${Math.floor(diff / hour)}小时前`;
  if (diff < 7 * day) return `${Math.floor(diff / day)}天前`;

  const month = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${month}.${d}`;
}

function mapPost(row) {
  const profile = row.profiles || {};

  return {
    postId: row.id,
    userId: row.user_id,
    title: row.title || `${row.have_item || ''} 换 ${row.want_item || ''}`,
    haveItem: row.have_item || '',
    wantItem: row.want_item || '',
    story: row.story || '',
    images: Array.isArray(row.image_urls) ? row.image_urls : [],
    proposalCount: row.proposal_count || 0,
    likeCount: row.like_count || 0,
    status: row.status || 'open',
    createdAt: row.created_at,
    createdAtLabel: formatDateLabel(row.created_at),
    school: row.school || profile.school || '',
    creditScore: profile.credit_score || 60,
    verified: Boolean(profile.verified),
    avatar: profile.avatar_url || '../../assets/avatars/avatar-1.png',
    nickName: profile.nick_name || '校换用户',
    estimatedValue: row.estimated_value || 0,
    rarity: row.rarity || '普通',
    brainScore: row.brain_score || 80,
    matchScore: row.match_score || 80,
    tags: Array.isArray(row.tags) ? row.tags : [],
    alternatives: Array.isArray(row.alternatives) ? row.alternatives : [],
    reason: row.reason || '',
    quest: row.quest || '',
    distance: row.distance || 200,
  };
}

Page({
  data: {
    user: defaultUser(),
    posts: [],
    wishes: [],
    tasks: [],
    chains: [],
    activities: [],

    matchCount: 0,
    unreadCount: 0,

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

    loading: false,
  },

  async onShow() {
    await this.loadHomeData();
    this.syncTabBar();
  },

  async loadHomeData() {
    this.setData({ loading: true });

    try {
      const state = app.restoreState();
      const session = auth.getSession();

      let currentUser = state.currentUser || defaultUser();

      if (session && session.access_token) {
        try {
          const authUser = await auth.getUser();
          const userId = authUser && authUser.id;

          if (userId) {
            const profileRows = await db.select(
              'profiles',
              `select=*&id=eq.${userId}`,
              true
            );

            if (profileRows && profileRows[0]) {
              currentUser = mapProfile(profileRows[0]);
              state.currentUser = currentUser;
            }
          }
        } catch (err) {
          console.warn('首页加载用户信息失败：', err);
        }
      }

      const postRows = await db.select(
        'posts',
        'select=*,profiles(nick_name,avatar_url,school,credit_score,verified)&status=eq.open&order=created_at.desc',
        false
      );

      const posts = Array.isArray(postRows) ? postRows.map(mapPost) : [];
      const sortedPosts = this.sortPosts(posts, this.data.sortBy);

      let unreadCount = 0;

      if (session && session.access_token) {
        try {
          const unreadRows = await db.select(
            'messages',
            'select=id&read_at=is.null',
            true
          );

          unreadCount = Array.isArray(unreadRows) ? unreadRows.length : 0;
        } catch (err) {
          console.warn('首页加载未读消息失败：', err);
        }
      }

      state.posts = posts;
      refreshTasks(state);
      app.syncState(state);

      this.setData({
        user: currentUser,
        posts,
        allPosts: posts,
        filteredPosts: sortedPosts,
        wishes: Array.isArray(state.wishes) ? state.wishes.slice(0, 4) : [],
        tasks: Array.isArray(state.tasks) ? state.tasks.slice(0, 2) : [],
        chains: Array.isArray(state.chains) ? state.chains.slice(0, 1) : [],
        activities: Array.isArray(state.activityCards) ? state.activityCards : [],
        matchCount: this.calcMatchCount(posts),
        unreadCount,
      });
    } catch (err) {
      console.error('首页加载失败：', err);

      wx.showToast({
        title: err.message || '首页加载失败',
        icon: 'none',
      });

      const state = app.restoreState();
      const posts = Array.isArray(state.posts) ? state.posts : [];

      this.setData({
        user: state.currentUser || defaultUser(),
        posts,
        allPosts: posts,
        filteredPosts: this.sortPosts(posts, this.data.sortBy),
        matchCount: this.calcMatchCount(posts),
        unreadCount: Array.isArray(state.messages) ? state.messages.length : 0,
      });
    } finally {
      this.setData({ loading: false });
    }
  },

  calcMatchCount(posts) {
    return (posts || []).reduce((sum, post) => {
      return sum + Number(post.proposalCount || 0);
    }, 0);
  },

  syncTabBar() {
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({
        selected: 0,
        unreadCount: this.data.unreadCount,
      });
    }
  },

  goPublish() {
    wx.switchTab({ url: '/pages/publish/index' });
  },

  goLab() {
    wx.navigateTo({ url: '/pages/lab/index' });
  },

  goRank() {
    wx.navigateTo({ url: '/pages/rank/index' });
  },

  goStories() {
    wx.navigateTo({ url: '/pages/stories/index' });
  },

  goTasks() {
    wx.navigateTo({ url: '/pages/tasks/index' });
  },

  goWish() {
    wx.navigateTo({ url: '/pages/wish/index' });
  },

  goChain() {
    wx.navigateTo({ url: '/pages/chain/index' });
  },

  goMap() {
    wx.navigateTo({ url: '/pages/map/index' });
  },

  goDetail(e) {
    const { id } = e.currentTarget.dataset;
    wx.navigateTo({ url: `/pages/detail/index?id=${id}` });
  },

  randomStory() {
    wx.navigateTo({ url: '/pages/stories/index?focus=random' });
  },

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
    this.setData({
      isSearching: false,
      searchKeyword: '',
    });

    this.filterPosts('');
  },

  filterPosts(keyword) {
    const kw = String(keyword || '').toLowerCase().trim();
    let base = this.data.allPosts || [];

    if (kw) {
      const keywords = kw.split(/\s+/).filter(Boolean);

      base = base.filter((post) => {
        const haystack = [
          post.title || '',
          post.haveItem || '',
          post.wantItem || '',
          post.nickName || '',
          post.school || '',
          post.story || '',
          (post.tags || []).join(' '),
        ].join(' ').toLowerCase();

        return keywords.some((word) => haystack.includes(word));
      });
    }

    this.setData({
      filteredPosts: this.sortPosts(base, this.data.sortBy),
    });
  },

  sortPosts(list, sortBy) {
    const posts = (list || []).slice();

    if (sortBy === 'hot') {
      posts.sort((a, b) => {
        const hotA = Number(a.likeCount || 0) + Number(a.proposalCount || 0) * 2;
        const hotB = Number(b.likeCount || 0) + Number(b.proposalCount || 0) * 2;
        return hotB - hotA;
      });

      return posts;
    }

    posts.sort((a, b) => {
      const timeA = new Date(a.createdAt || 0).getTime();
      const timeB = new Date(b.createdAt || 0).getTime();
      return timeB - timeA;
    });

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

    this.setData({
      isSearching: true,
      searchKeyword: String(tag || '').replace('#', ''),
    });

    this.filterPosts(String(tag || '').replace('#', ''));
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
