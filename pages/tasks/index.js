const app = getApp();
const { refreshTasks, claimTaskReward } = require('../../utils/mock-data');
Page({
  data: { tasks: [], user: {} },
  onShow() { this.load(); },
  load() { const state = app.restoreState(); refreshTasks(state); app.syncState(state); this.setData({ tasks: state.tasks, user: state.currentUser }); },
  claim(e) {
    const taskId = e.currentTarget.dataset.id;
    const state = app.restoreState();
    const result = claimTaskReward(state, taskId);
    app.syncState(state);
    this.setData({ tasks: state.tasks, user: state.currentUser });
    wx.showToast({ title: result.ok ? '奖励已领取' : result.message, icon: result.ok ? 'success' : 'none' });
  },
  goPublish() { wx.switchTab({ url: '/pages/publish/index' }); },
  goWish() { wx.navigateTo({ url: '/pages/wish/index' }); },
  goChain() { wx.navigateTo({ url: '/pages/chain/index' }); },
  goStories() { wx.navigateTo({ url: '/pages/stories/index' }); },
});
