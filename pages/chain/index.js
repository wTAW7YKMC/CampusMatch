const app = getApp();
const { updateRankList, addBadge } = require('../../utils/mock-data');
Page({
  data: { chains: [] },
  onShow() { const state = app.restoreState(); this.setData({ chains: state.chains }); },
  joinChain(e) {
    const chainId = e.currentTarget.dataset.id;
    const state = app.restoreState();
    const chain = state.chains.find((c) => c.chainId === chainId);
    if (!chain) return;
    if (chain.status === 'joined') { wx.showToast({ title: '已参与该挑战', icon: 'none' }); return; }
    chain.status = 'joined';
    state.currentUser.chainCount = (state.currentUser.chainCount || 0) + 1;
    state.currentUser.brainPower = (state.currentUser.brainPower || 0) + (chain.rewardBrain || 60);
    state.currentUser.energy = (state.currentUser.energy || 0) + (chain.rewardEnergy || 60);
    addBadge(state.currentUser, '交换链大师');
    state.messages.unshift({ id: `m-${Date.now()}`, type: 'task', title: '交换挑战局已开启', desc: `${chain.title} 已加入，获得 +${chain.rewardBrain} 脑洞值和 +${chain.rewardEnergy} 闲置能量`, time: '刚刚' });
    state.stories.unshift({ storyId: `s-${Date.now()}`, type: 'chain', title: '新多边交换挑战开启', beforeItem: chain.nodes[0].have, afterItem: chain.nodes[chain.nodes.length - 1].have, likeCount: 0, liked: false });
    updateRankList(state);
    app.syncState(state);
    this.setData({ chains: state.chains });
    wx.showModal({ title: '挑战局开启', content: '你已参与多边交换闭环，奖励已发放，故事也进入广场。', showCancel: false });
  },
});
