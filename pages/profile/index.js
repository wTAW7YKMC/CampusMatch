const app = getApp();
const { refreshTasks } = require('../../utils/mock-data');

Page({
  data: { user: {}, tasks: [] },

  onShow() {
    const state = app.restoreState();
    refreshTasks(state);
    this.setData({ user: state.currentUser, tasks: state.tasks.slice(0, 3) });
  },

  goVerify() { wx.navigateTo({ url: '/pages/verify/index' }); },
  goRank() { wx.navigateTo({ url: '/pages/rank/index' }); },
  goTasks() { wx.navigateTo({ url: '/pages/tasks/index' }); },
  goWish() { wx.navigateTo({ url: '/pages/wish/index' }); },
  goChain() { wx.navigateTo({ url: '/pages/chain/index' }); },
  goMap() { wx.navigateTo({ url: '/pages/map/index' }); },
  resetDemo() {
    wx.showModal({
      title: '重置体验数据',
      content: '会恢复为完整升级版示例数据，适合答辩前演示。',
      success: (res) => {
        if (res.confirm) {
          const state = app.resetState();
          this.setData({ user: state.currentUser, tasks: state.tasks.slice(0, 3) });
          wx.showToast({ title: '已重置', icon: 'success' });
        }
      },
    });
  },
});
