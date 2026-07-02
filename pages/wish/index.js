const app = getApp();
const { createWishId, updateRankList, addBadge } = require('../../utils/mock-data');
Page({
  data: { wishes: [], wishName: '', category: '学习用品' },
  onShow() { const state = app.restoreState(); this.setData({ wishes: state.wishes }); },
  onNameInput(e) { this.setData({ wishName: e.detail.value }); },
  onCategoryInput(e) { this.setData({ category: e.detail.value }); },
  addWish() {
    const name = this.data.wishName || '神秘心愿';
    const state = app.restoreState();
    const existing = state.wishes.find((w) => w.name === name);
    if (existing) existing.count = (existing.count || 0) + 1;
    else state.wishes.unshift({ wishId: createWishId(state), name, category: this.data.category || '其他', count: 1, tag: '新心愿', trend: 'new', ownerId: state.currentUser.userId });
    state.currentUser.wishCount = (state.currentUser.wishCount || 0) + 1;
    state.currentUser.brainPower = (state.currentUser.brainPower || 0) + 10;
    addBadge(state.currentUser, '心愿收集员');
    updateRankList(state);
    state.messages.unshift({ id: `m-${Date.now()}`, type: 'system', title: '心愿已投递', desc: `你把「${name}」投入校园心愿池，获得 +10 脑洞值`, time: '刚刚' });
    app.syncState(state);
    this.setData({ wishes: state.wishes, wishName: '' });
    wx.showToast({ title: '心愿已点亮', icon: 'success' });
  },
  publishForWish(e) { wx.setStorageSync('publish_prefill', { wantItem: e.currentTarget.dataset.name }); wx.switchTab({ url: '/pages/publish/index' }); },
});
