const app = getApp();
const { updateRankList } = require('../../utils/mock-data');

Page({
  data: {
    active: 'brain',
    list: [],
  },

  onShow() {
    const state = app.restoreState();
    updateRankList(state);
    app.syncState(state);
    this.setData({
      list: state.rankList.brain,
    });
  },

  switchTab(e) {
    const type = e.currentTarget.dataset.type;
    const state = app.restoreState();
    updateRankList(state);
    this.setData({
      active: type,
      list: state.rankList[type] || [],
    });
  },
});
