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

function getIcon(type) {
  if (type === 'proposal') return '💡';
  if (type === 'system') return '🔔';
  if (type === 'swap') return '🎉';
  if (type === 'verify') return '✅';
  return '📩';
}

function mapMessage(row) {
  return {
    id: row.id,
    type: row.type || 'system',
    icon: getIcon(row.type),
    title: row.title || '系统消息',
    desc: row.description || '',
    time: row.time_label || formatTime(row.created_at),
    read: Boolean(row.read_at),
    readAt: row.read_at || '',
    createdAt: row.created_at,
  };
}

Page({
  data: {
    messages: [],
    unreadCount: 0,
    loading: false,
    isLoggedIn: false,
  },

  async onShow() {
    await this.loadMessages();
    this.syncTabBar();
  },

  syncTabBar() {
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({
        selected: 2,
        unreadCount: this.data.unreadCount,
      });
    }
  },

  async loadMessages() {
    const session = auth.getSession();

    if (!session || !session.access_token) {
      this.setData({
        messages: [],
        unreadCount: 0,
        isLoggedIn: false,
      });

      return;
    }

    this.setData({
      loading: true,
      isLoggedIn: true,
    });

    try {
      const rows = await db.select(
        'messages',
        'select=*&order=created_at.desc',
        true
      );

      const messages = Array.isArray(rows) ? rows.map(mapMessage) : [];
      const unreadCount = messages.filter((item) => !item.read).length;

      const state = app.restoreState();

      state.messages = messages.map((item) => ({
        id: item.id,
        type: item.type,
        title: item.title,
        desc: item.desc,
        time: item.time,
        read: item.read,
      }));

      app.syncState(state);

      this.setData({
        messages,
        unreadCount,
      });
    } catch (err) {
      console.error('消息加载失败：', err);

      wx.showToast({
        title: err.message || '消息加载失败',
        icon: 'none',
      });
    } finally {
      this.setData({
        loading: false,
      });
    }
  },

  async markOneRead(e) {
    const id = e.currentTarget.dataset.id;

    if (!id) return;

    const target = this.data.messages.find((item) => item.id === id);

    if (!target || target.read) return;

    try {
      await db.update(
        'messages',
        `id=eq.${id}`,
        {
          read_at: new Date().toISOString(),
        }
      );

      const messages = this.data.messages.map((item) => {
        if (item.id !== id) return item;

        return {
          ...item,
          read: true,
          readAt: new Date().toISOString(),
        };
      });

      const unreadCount = messages.filter((item) => !item.read).length;

      this.setData({
        messages,
        unreadCount,
      });

      this.syncTabBar();
    } catch (err) {
      console.error('标记消息已读失败：', err);

      wx.showToast({
        title: err.message || '操作失败',
        icon: 'none',
      });
    }
  },

  async markAllRead() {
    const unreadMessages = this.data.messages.filter((item) => !item.read);

    if (!unreadMessages.length) {
      wx.showToast({
        title: '没有未读消息',
        icon: 'none',
      });
      return;
    }

    try {
      wx.showLoading({
        title: '处理中...',
      });

      await db.update(
        'messages',
        'read_at=is.null',
        {
          read_at: new Date().toISOString(),
        }
      );

      const messages = this.data.messages.map((item) => ({
        ...item,
        read: true,
        readAt: item.readAt || new Date().toISOString(),
      }));

      this.setData({
        messages,
        unreadCount: 0,
      });

      this.syncTabBar();

      wx.hideLoading();

      wx.showToast({
        title: '已全部已读',
        icon: 'success',
      });
    } catch (err) {
      wx.hideLoading();

      console.error('全部已读失败：', err);

      wx.showToast({
        title: err.message || '操作失败',
        icon: 'none',
      });
    }
  },

  goLogin() {
    wx.switchTab({
      url: '/pages/profile/index',
    });
  },

  refreshMessages() {
    this.loadMessages();
  },
});
