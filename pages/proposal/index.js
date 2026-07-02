const app = getApp();
const { createProposalId, updateRankList, addBadge } = require('../../utils/mock-data');

Page({
  data: { postId: '', offerItem: '', description: '', aiText: '', targetPost: {} },

  onLoad(query) {
    const state = app.restoreState();
    const postId = query.postId || (state.posts[0] && state.posts[0].postId) || '';
    this.setData({ postId, targetPost: state.posts.find((p) => p.postId === postId) || {} });
  },
  onOfferInput(e) { this.setData({ offerItem: e.detail.value }); },
  onDescInput(e) { this.setData({ description: e.detail.value }); },

  generateProposal() {
    const post = this.data.targetPost || {};
    const offer = this.data.offerItem || '奶茶券';
    const aiText = `AI 提案：用「${offer}」交换「${post.haveItem || '对方物品'}」很有故事感。建议补充：可线下图书馆门口面交，也可增加一份小零食提高接受率。`;
    this.setData({ aiText, description: this.data.description || aiText });
  },

  submitProposal() {
    const state = app.restoreState();
    const proposalId = createProposalId(state);
    const proposal = {
      proposalId,
      postId: this.data.postId || state.posts[0].postId,
      fromUserId: state.currentUser.userId,
      proposerName: state.currentUser.nickName,
      school: state.currentUser.school,
      offerItem: this.data.offerItem || '脑洞提案',
      description: this.data.description || this.data.aiText || '我愿意拿一个有趣的交换方案来参与。',
      images: ['../../assets/mock-posts/proposal-milktea.png'],
      status: 'pending',
      creditScore: state.currentUser.creditScore,
      funScore: Math.floor(80 + Math.random() * 18),
    };
    const list = state.proposalsByPost[proposal.postId] || [];
    list.unshift(proposal);
    state.proposalsByPost[proposal.postId] = list;
    state.posts = state.posts.map((item) => item.postId === proposal.postId ? { ...item, proposalCount: list.length } : item);
    state.currentUser.proposalCount = (state.currentUser.proposalCount || 0) + 1;
    state.currentUser.brainPower = (state.currentUser.brainPower || 0) + 30;
    addBadge(state.currentUser, '脑洞提案大师');
    updateRankList(state);
    state.messages.unshift({ id: `m-${Date.now()}`, type: 'proposal', title: '提案已提交', desc: `你向 ${proposal.postId} 发送了新的交换提案，获得 +30 脑洞值`, time: '刚刚' });
    app.syncState(state);
    wx.showToast({ title: '已提交', icon: 'success' });
    wx.navigateBack();
  },
});