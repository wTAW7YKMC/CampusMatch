const { generateSwapCard } = require('../../utils/mock-data');

Page({
  data: { haveItem: '保温杯', wantItem: '开放脑洞', card: null, ideas: [] },
  onInput(e) { this.setData({ haveItem: e.detail.value }); },
  onWantInput(e) { this.setData({ wantItem: e.detail.value }); },
  generateIdeas() {
    const item = this.data.haveItem || '物品';
    const want = this.data.wantItem || '开放脑洞';
    const card = generateSwapCard({ haveItem: item, wantItem: want, acceptBrain: true });
    const ideas = [
      `${item} 可以换 ${card.alternatives[0]}，适合走“实用交换”路线`,
      `${item} 可以换 ${card.alternatives[1]}，适合走“即时快乐”路线`,
      `${item} 可以换一次技能服务，比如修图、拍照、手绘头像`,
      `${item} 可以加入多边交换挑战局，提高被撮合概率`,
      `${item} 如果补充故事，会更容易进入故事广场`,
    ];
    this.setData({ card, ideas });
  },
  useToPublish() {
    wx.setStorageSync('publish_prefill', { wantItem: this.data.wantItem });
    wx.switchTab({ url: '/pages/publish/index' });
  },
});
