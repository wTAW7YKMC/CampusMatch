const app = getApp();

const { auth, db } = require('../../utils/supabase');

function formatTime(value) {
  if (!value) return '刚刚';

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '刚刚';

  const diff = Date.now() - date.getTime();
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

function mapStory(row, likedMap) {
  return {
    storyId: row.id,
    ownerId: row.owner_id || '',
    type: row.type || 'new',
    title: row.title || '一次新的校园交换',
    beforeItem: row.before_item || '',
    afterItem: row.after_item || '',
    likeCount: Number(row.like_count || 0),
    createdAt: row.created_at,
    timeLabel: formatTime(row.created_at),
    liked: Boolean(likedMap[row.id]),
  };
}

Page({
  data: {
    stories: [],
    loading: false,
    isLoggedIn: false,
    emptyText: '暂无交换故事',
  },

  async onShow() {
    await this.loadStories();
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

  async loadStories() {
    this.setData({
      loading: true,
    });

    try {
      const userId = await this.getCurrentUserId();
      const likedMap = {};

      if (userId) {
        try {
          const likedRows = await db.select(
            'story_likes',
            `select=story_id&user_id=eq.${userId}`,
            true
          );

          (Array.isArray(likedRows) ? likedRows : []).forEach((item) => {
            likedMap[item.story_id] = true;
          });
        } catch (err) {
          console.warn('加载点赞状态失败：', err);
        }
      }

      const rows = await db.select(
        'stories',
        'select=*&order=created_at.desc',
        false
      );

      const stories = (Array.isArray(rows) ? rows : []).map((row) => mapStory(row, likedMap));

      const state = app.restoreState();

      state.stories = stories.map((item) => ({
        storyId: item.storyId,
        type: item.type,
        title: item.title,
        beforeItem: item.beforeItem,
        afterItem: item.afterItem,
        likeCount: item.likeCount,
        liked: item.liked,
      }));

      app.syncState(state);

      this.setData({
        stories,
        isLoggedIn: Boolean(userId),
      });
    } catch (err) {
      console.error('故事广场加载失败：', err);

      wx.showToast({
        title: err.message || '故事加载失败',
        icon: 'none',
      });

      this.setData({
        stories: [],
      });
    } finally {
      this.setData({
        loading: false,
      });
    }
  },

  async likeStory(e) {
    const storyId = e.currentTarget.dataset.id;

    if (!storyId) return;

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

    const target = this.data.stories.find((item) => item.storyId === storyId);

    if (!target) return;

    if (target.liked) {
      wx.showToast({
        title: '已经点过赞啦',
        icon: 'none',
      });
      return;
    }

    try {
      await db.insert(
        'story_likes',
        {
          story_id: storyId,
          user_id: userId,
        },
        'select=*'
      );

      const stories = this.data.stories.map((item) => {
        if (item.storyId !== storyId) return item;

        return {
          ...item,
          liked: true,
          likeCount: Number(item.likeCount || 0) + 1,
        };
      });

      this.setData({
        stories,
      });

      wx.showToast({
        title: '已点赞',
        icon: 'success',
      });
    } catch (err) {
      console.error('点赞失败：', err);

      wx.showToast({
        title: err.message || err.msg || '点赞失败',
        icon: 'none',
      });
    }
  },

  refreshStories() {
    this.loadStories();
  },

  goHome() {
    wx.switchTab({
      url: '/pages/home/index',
    });
  },
});
