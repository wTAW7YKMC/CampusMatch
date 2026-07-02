const app = getApp();
const {
  createPostId,
  generateSwapCard,
  updateRankList,
  addBadge,
  refreshTasks,
} = require('../../utils/mock-data');

const MAX_IMAGES = 3;
const DEFAULT_IMAGE = '../../assets/mock-posts/post-calculator.png';

Page({
  data: {
    form: {
      haveItem: '',
      wantItem: '',
      story: '',
      images: [],
      acceptBrain: true,
    },
    aiCard: null,
  },

  onLoad() {
    this.setData({ 'form.acceptBrain': true });
  },

  updateFormField(key, value) {
    this.setData({ [`form.${key}`]: value });
  },

  onHaveInput(e) { this.updateFormField('haveItem', e.detail.value); },
  onWantInput(e) { this.updateFormField('wantItem', e.detail.value); },
  onStoryInput(e) { this.updateFormField('story', e.detail.value); },
  onBrainChange(e) { this.updateFormField('acceptBrain', e.detail.value); },

  addImage() {
    const { images } = this.data.form;
    const remain = MAX_IMAGES - images.length;
    if (remain <= 0) {
      wx.showToast({ title: '最多 3 张图片', icon: 'none' });
      return;
    }
    wx.chooseMedia({
      count: remain,
      mediaType: ['image'],
      sourceType: ['album', 'camera'],
      sizeType: ['compressed'],
      success: (res) => {
        const newPaths = res.tempFiles.map((file) => file.tempFilePath);
        this.setData({ 'form.images': images.concat(newPaths).slice(0, MAX_IMAGES) });
      },
      fail: (err) => {
        console.log('选择图片失败', err);
      },
    });
  },

  removeImage(e) {
    const { index } = e.currentTarget.dataset;
    const next = [...this.data.form.images];
    next.splice(index, 1);
    this.setData({ 'form.images': next });
  },

  previewImage(e) {
    const { src } = e.currentTarget.dataset;
    wx.previewImage({
      current: src,
      urls: this.data.form.images,
    });
  },

  generateAiCard() {
    const { haveItem, wantItem } = this.data.form;
    if (!haveItem || !wantItem) {
      wx.showToast({ title: '先填上“有什么”和“想换什么”', icon: 'none' });
      return;
    }
    const aiCard = generateSwapCard(this.data.form);
    this.setData({ aiCard });
  },

  submitPost() {
    const { form, aiCard } = this.data;
    const { haveItem, wantItem, story, images } = form;
    if (!haveItem || !wantItem) {
      wx.showToast({ title: '请填写完整信息', icon: 'none' });
      return;
    }
    const state = app.restoreState();
    const card = aiCard || generateSwapCard(form);
    const finalImages = images.length ? images : [DEFAULT_IMAGE];
    const newPost = {
      postId: createPostId(state),
      userId: state.currentUser.userId,
      title: card.title,
      haveItem,
      wantItem,
      story: story || '快来和我交换吧！',
      images: finalImages,
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
