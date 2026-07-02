const app = getApp();
const {
  createPostId,
  generateSwapCard,
  updateRankList,
  addBadge,
  refreshTasks,
} = require('../../utils/mock-data');

Page({
  data: {
    haveItem: '',
    wantItem: '',
    story: '',
    images: ['../../assets/mock-posts/post-calculator.png'],
    aiCard: null,
  },

  onHaveInput(e) { this.setData({ haveItem: e.detail.value }); },
  onWantInput(e) { this.setData({ wantItem: e.detail.value }); },
  onStoryInput(e) { this.setData({ story: e.detail.value }); },

  generateCard() {
    const { haveItem, wantItem, story } = this.data;
    if (!haveItem || !wantItem) {
      wx.showToast({ title: '先填上“有什么”和“想换什么”', icon: 'none' });
      return;
    }
    const aiCard = generateSwapCard({ haveItem, wantItem, story });
    this.setData({ aiCard });
  },

  addPreviewImage() {
    const previews = [
      '../../assets/mock-posts/post-calculator.png',
      '../../assets/mock-posts/post-cup.png',
      '../../assets/mock-posts/post-suitcase.png',
      '../../assets/mock-posts/post-books.png',
      '../../assets/mock-posts/post-art.png',
    ];
    const { images } = this.data;
    if (images.length >= 3) {
      wx.showToast({ title: '最多 3 张预览图', icon: 'none' });
      return;
    }
    const next = [...images, previews[Math.floor(Math.random() * previews.length)]];
    this.setData({ images: next });
  },

  removeImage(e) {
    const { index } = e.currentTarget.dataset;
    const next = [...this.data.images];
    next.splice(index, 1);
    this.setData({ images: next.length ? next : ['../../assets/mock-posts/post-calculator.png'] });
  },

  submitPost() {
    const { haveItem, wantItem, story, images, aiCard } = this.data;
    if (!haveItem || !wantItem) {
      wx.showToast({ title: '请填写完整信息', icon: 'none' });
      return;
    }
    const state = app.restoreState();
    const card = aiCard || generateSwapCard({ haveItem, wantItem, story });
    const newPost = {
      postId: createPostId(state),
      userId: state.currentUser.userId,
      title: card.title,
      haveItem,
      wantItem,
      story: story || '快来和我交换吧！',
      images: images.length ? images : ['../../assets/mock-posts/post-calculator.png'],
      proposalCount: 0,
      likeCount: 0,
      status: 'open',
      createdAt: '刚刚',
      school: state.currentUser.school,
      creditScore: state.currentUser.creditScore,
      verified: Boolean(state.currentUser.verified),
      avatar: state.currentUser.avatar,
      nickName: state.currentUser.nickName,
      estimatedValue: card.estimatedValue,
      rarity: card.rarity,
      brainScore: card.brainScore,
      matchScore: card.matchScore,
      tags: card.tags,
      alternatives: card.alternatives,
      reason: card.reason,
      quest: card.quest,
    };
    state.posts.unshift(newPost);
    state.currentUser.publishCount = (state.currentUser.publishCount || 0) + 1;
    state.currentUser.brainPower = (state.currentUser.brainPower || 0) + 20;
    addBadge(state.currentUser, 'AI交换卡收藏家');
    updateRankList(state);
    refreshTasks(state);
    state.messages.unshift({
      id: `m-${Date.now()}`,
      type: 'system',
      title: '交换卡发布成功',
      desc: `你发布的「${haveItem}」已上线，快去广场看看吧`,
      time: '刚刚',
    });
    app.syncState(state);
    wx.showToast({ title: '发布成功', icon: 'success' });
    setTimeout(() => wx.switchTab({ url: '/pages/home/index' }), 600);
  },
});
