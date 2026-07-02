Component({
  data: {
    selected: 0,
    unreadCount: 0,
    list: [
      { pagePath: '/pages/home/index', text: '广场', icon: '🏠' },
      { pagePath: '/pages/publish/index', text: '发布', icon: '➕' },
      { pagePath: '/pages/messages/index', text: '消息', icon: '💬' },
      { pagePath: '/pages/profile/index', text: '我的', icon: '👤' },
    ],
  },

  methods: {
    switchTab(e) {
      const { index, path } = e.currentTarget.dataset;
      const current = this.data.selected;
      if (current === index) return;
      // 切换交给页面 onShow 同步高亮，避免状态不一致导致点击无响应
      wx.switchTab({ url: path });
    },
  },
});