const app = getApp();

const { auth, db } = require('../../utils/supabase');

function mapChain(row, joinedMap) {
  return {
    chainId: row.id,
    title: row.title || '交换挑战局',
    status: row.status || 'waiting',
    score: Number(row.score || 0),
    rewardBrain: Number(row.reward_brain || 0),
    rewardEnergy: Number(row.reward_energy || 0),
    nodes: Array.isArray(row.nodes) ? row.nodes : [],
    reason: row.reason || '',
    joined: Boolean(joinedMap[row.id]),
    createdAt: row.created_at || '',
  };
}

Page({
  data: {
    chains: [],
    loading: false,
    isLoggedIn: false,
  },

  async onShow() {
    await this.loadChains();
  },

  async getCurrentUserId() {
    const session = auth.getSession();

    if (!session || !session.access_token) {
      return '';
    }

    if (session.user && session.user.id) {
      return session.user.id;
    }

    const user = await auth.getUser();
    return user && user.id ? user.id : '';
  },

  async loadChains() {
    this.setData({ loading: true });

    try {
      const userId = await this.getCurrentUserId();
      const joinedMap = {};

      if (userId) {
        const joinedRows = await db.select(
          'chain_participants',
          `select=chain_id&user_id=eq.${userId}`,
          true
        );

        (Array.isArray(joinedRows) ? joinedRows : []).forEach((item) => {
          joinedMap[item.chain_id] = true;
        });
      }

      const rows = await db.select(
        'chains',
        'select=*&active=eq.true&order=created_at.desc',
        false
      );

      const chains = (Array.isArray(rows) ? rows : []).map((row) => mapChain(row, joinedMap));

      const state = app.restoreState();
      state.chains = chains;
      app.syncState(state);

      this.setData({
        chains,
        isLoggedIn: Boolean(userId),
      });
    } catch (err) {
      console.error('交换挑战局加载失败：', err);

      wx.showToast({
        title: err.message || '加载失败',
        icon: 'none',
      });

      const state = app.restoreState();

      this.setData({
        chains: Array.isArray(state.chains) ? state.chains : [],
      });
    } finally {
      this.setData({ loading: false });
    }
  },

  async joinChain(e) {
    const chainId = e.currentTarget.dataset.id;

    if (!chainId) return;

    const userId = await this.getCurrentUserId();

    if (!userId) {
      wx.showToast({
        title: '请先登录',
        icon: 'none',
      });

      wx.switchTab({
        url: '/pages/profile/index',
      });

      return;
    }

    const chain = this.data.chains.find((item) => item.chainId === chainId);

    if (!chain) return;

    if (chain.joined) {
      wx.showToast({
        title: '你已加入该挑战局',
        icon: 'none',
      });
      return;
    }

    try {
      wx.showLoading({
        title: '加入中...',
      });

      await db.rpc('join_chain', {
        p_chain_id: chainId,
      });

      wx.hideLoading();

      wx.showToast({
        title: '加入成功',
        icon: 'success',
      });

      await this.loadChains();
    } catch (err) {
      wx.hideLoading();

      console.error('加入挑战局失败：', err);

      wx.showToast({
        title: err.message || err.msg || '加入失败',
        icon: 'none',
      });
    }
  },

  refreshChains() {
    this.loadChains();
  },
});
