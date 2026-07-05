const app = getApp();

const { auth, db } = require('../../utils/supabase');

function mapWish(row) {
  return {
    wishId: row.id,
    ownerId: row.owner_id || '',
    name: row.name || '',
    category: row.category || '其他',
    count: Number(row.count || 0),
    tag: row.tag || '',
    trend: row.trend || '',
    createdAt: row.created_at,
  };
}

Page({
  data: {
    wishes: [],
    loading: false,

    name: '',
    category: '数码',
    tag: '',

    categories: ['数码', '书籍', '生活', '课程', '运动', '美妆', '其他'],
    categoryIndex: 0,

    isLoggedIn: false,
  },

  async onShow() {
    await this.loadWishes();
  },

  async getCurrentUserId() {
    const session = auth.getSession();

    if (!session || !session.access_token) {
      return '';
    }

    if (session.user && session.user.id) {
      return session.user.id;
    }

    const user = await auth.getUser();
    return user && user.id ? user.id : '';
  },

  async loadWishes() {
    this.setData({
      loading: true,
    });

    try {
      const userId = await this.getCurrentUserId();

      const rows = await db.select(
        'wishes',
        'select=*&order=count.desc,created_at.desc',
        false
      );

      const wishes = Array.isArray(rows) ? rows.map(mapWish) : [];

      const state = app.restoreState();
      state.wishes = wishes;
      app.syncState(state);

      this.setData({
        wishes,
        isLoggedIn: Boolean(userId),
      });
    } catch (err) {
      console.error('心愿池加载失败：', err);

      wx.showToast({
        title: err.message || '加载失败',
        icon: 'none',
      });

      const state = app.restoreState();

      this.setData({
        wishes: Array.isArray(state.wishes) ? state.wishes : [],
      });
    } finally {
      this.setData({
        loading: false,
      });
    }
  },

  onNameInput(e) {
    this.setData({
      name: e.detail.value,
    });
  },

  onTagInput(e) {
    this.setData({
      tag: e.detail.value,
    });
  },

  onCategoryChange(e) {
    const index = Number(e.detail.value || 0);
    const category = this.data.categories[index] || '其他';

    this.setData({
      categoryIndex: index,
      category,
    });
  },

  async submitWish() {
    const name = String(this.data.name || '').trim();
    const category = this.data.category || '其他';
    const tag = String(this.data.tag || '').trim();

    if (!name) {
      wx.showToast({
        title: '请输入你的心愿',
        icon: 'none',
      });
      return;
    }

    const userId = await this.getCurrentUserId();

    if (!userId) {
      wx.showToast({
        title: '请先登录',
        icon: 'none',
      });

      wx.switchTab({
        url: '/pages/profile/index',
      });

      return;
    }

    try {
      wx.showLoading({
        title: '提交中...',
      });

      await db.rpc('add_wish', {
        p_name: name,
        p_category: category,
        p_tag: tag || null,
      });

      wx.hideLoading();

      wx.showToast({
        title: '已加入心愿池',
        icon: 'success',
      });

      this.setData({
        name: '',
        tag: '',
      });

      await this.loadWishes();
    } catch (err) {
      wx.hideLoading();

      console.error('提交心愿失败：', err);

      wx.showToast({
        title: err.message || err.msg || '提交失败',
        icon: 'none',
      });
    }
  },

  refreshWishes() {
    this.loadWishes();
  },

  goLogin() {
    wx.switchTab({
      url: '/pages/profile/index',
    });
  },
});
