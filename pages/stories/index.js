const app = getApp();
const { updateRankList, addBadge } = require('../../utils/mock-data');

Page({
  data: { stories: [] },
  onShow() { const state = app.restoreState(); this.setData({ stories: state.stories }); },
  likeStory(e) {
    const id = e.currentTarget.dataset.id;
    const state = app.restoreState();
    let liked = false;
    state.stories = state.stories.map((story) => {
      if (story.storyId !== id || story.liked) return story;
      liked = true;
      return { ...story, likeCount: (story.likeCount || 0) + 1, liked: true };
    });
    if (liked) {
      state.currentUser.storyLikes = (state.currentUser.storyLikes || 0) + 1;
      state.currentUser.brainPower = (state.currentUser.brainPower || 0) + 5;
      addBadge(state.currentUser, '故事发现官');
      updateRankList(state);
      app.syncState(state);
      this.setData({ stories: state.stories });
      wx.showToast({ title: '+5 脑洞值', icon: 'success' });
    } else {
      wx.showToast({ title: '已经点过赞啦', icon: 'none' });
    }
  },
});
