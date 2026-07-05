const { db } = require('../../utils/supabase');

const rankConfig = {
  brain: {
    title: '脑洞值排行榜',
    view: 'rank_brain',
    unit: '脑洞值',
    emptyText: '暂无脑洞值排行',
  },
  exchange: {
    title: '交换次数排行榜',
    view: 'rank_exchange',
    unit: '次交换',
    emptyText: '暂无交换排行',
  },
  credit: {
    title: '信用分排行榜',
    view: 'rank_credit',
    unit: '信用分',
    emptyText: '暂无信用排行',
  },
  energy: {
    title: '闲置能量排行榜',
    view: 'rank_energy',
    unit: '能量',
    emptyText: '暂无能量排行',
  },
};

Page({
  data: {
    tabs: [
      { key: 'brain', label: '脑洞' },
      { key: 'exchange', label: '交换' },
      { key: 'credit', label: '信用' },
      { key: 'energy', label: '能量' },
    ],

    activeType: 'brain',
    currentTitle: '脑洞值排行榜',
    currentUnit: '脑洞值',
    emptyText: '暂无脑洞值排行',

    rankRows: [],
    loading: false,
  },

  onLoad(options) {
    const type = options.type || 'brain';
    const activeType = rankConfig[type] ? type : 'brain';

    this.setData({
      activeType,
    });

    this.loadRank(activeType);
  },

  async loadRank(type) {
    const config = rankConfig[type] || rankConfig.brain;

    this.setData({
      loading: true,
      currentTitle: config.title,
      currentUnit: config.unit,
      emptyText: config.emptyText,
    });

    try {
      const rows = await db.select(
        config.view,
        'select=*',
        false
      );

      const rankRows = (Array.isArray(rows) ? rows : []).map((item, index) => ({
        rank: index + 1,
        nickName: item.nick_name || '校换用户',
        school: item.school || '未知学校',
        value: Number(item.value || 0),
        unit: config.unit,
        medal: this.getMedal(index + 1),
      }));

      this.setData({
        rankRows,
      });
    } catch (err) {
      console.error('排行榜加载失败：', err);

      wx.showToast({
        title: err.message || '排行榜加载失败',
        icon: 'none',
      });

      this.setData({
        rankRows: [],
      });
    } finally {
      this.setData({
        loading: false,
      });
    }
  },

  getMedal(rank) {
    if (rank === 1) return '🥇';
    if (rank === 2) return '🥈';
    if (rank === 3) return '🥉';
    return `#${rank}`;
  },

  switchRank(e) {
    const type = e.currentTarget.dataset.type;

    if (!type || type === this.data.activeType) return;

    this.setData({
      activeType: type,
    });

    this.loadRank(type);
  },

  refreshRank() {
    this.loadRank(this.data.activeType);
  },
});
