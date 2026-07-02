const app = getApp();
const { updateRankList, addBadge } = require('../../utils/mock-data');

function decorateProposals(list) {
  return (list || []).map((item) => ({
    ...item,
    statusLabel: item.status === 'accepted' ? '已接受' : item.status === 'rejected' ? '已婉拒' : '待回复',
  }));
}

Page({
  data: { post: {}, proposals: [] },

  onLoad(query) { this.loadPost(query.id); },
  onShow() { if (this.data.post.postId) this.loadPost(this.data.post.postId); },

  loadPost(id) {
    const state = app.restoreState();
    const post = state.posts.find((item) => item.postId === id) || state.posts[0];
    this.setData({ post, proposals: decorateProposals(state.proposalsByPost[post.postId] || []) });
  },

  acceptProposal(e) {
    const proposalId = e.currentTarget.dataset.id;
    const state = app.restoreState();
    const postId = this.data.post.postId;
    const proposals = state.proposalsByPost[postId] || [];
    const accepted = proposals.find((item) => item.proposalId === proposalId);
    if (!accepted) { wx.showToast({ title: '提案不存在', icon: 'none' }); return; }
    if (accepted.status === 'accepted') { wx.showToast({ title: '已接受过该提案', icon: 'none' }); return; }

    state.proposalsByPost[postId] = proposals.map((item) => ({ ...item, status: item.proposalId === proposalId ? 'accepted' : 'rejected' }));
    state.posts = state.posts.map((item) => item.postId === postId ? { ...item, status: 'done', proposalCount: state.proposalsByPost[postId].length } : item);
    state.currentUser.exchangeCount = (state.currentUser.exchangeCount || 0) + 1;
    state.currentUser.brainPower = (state.currentUser.brainPower || 0) + 50;
    state.currentUser.energy = (state.currentUser.energy || 0) + 30;
    addBadge(state.currentUser, '新手换物家');
    addBadge(state.currentUser, '绿色校园行动者');

    state.messages.unshift({ id: `m-${Date.now()}`, type: 'system', title: '交换达成', desc: `你已接受 ${accepted.proposerName} 的 ${accepted.offerItem} 提案，获得 +50 脑洞值和 +30 闲置能量`, time: '刚刚' });
    state.stories.unshift({ storyId: `s-${Date.now()}`, type: 'new', title: '刚刚发生了一次新交换', beforeItem: this.data.post.haveItem, afterItem: accepted.offerItem, likeCount: 0, liked: false });
    updateRankList(state);
    app.syncState(state);

    const nextPost = state.posts.find((item) => item.postId === postId);
    this.setData({ post: nextPost, proposals: decorateProposals(state.proposalsByPost[postId]) });
    wx.showModal({ title: '交换成功', content: '你获得了 +50 脑洞值和 +30 闲置能量，故事已加入交换故事广场。', showCancel: false });
  },

  goProposal() { wx.navigateTo({ url: `/pages/proposal/index?postId=${this.data.post.postId}` }); },
  goMap() { wx.navigateTo({ url: '/pages/map/index' }); },
  goChain() { wx.navigateTo({ url: '/pages/chain/index' }); },
});
