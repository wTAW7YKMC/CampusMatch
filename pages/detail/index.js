const app = getApp();

const { auth, db } = require('../../utils/supabase');
const { addBadge } = require('../../utils/mock-data');

function defaultPost() {
  return {
    postId: '',
    userId: '',
    title: '',
    haveItem: '',
    wantItem: '',
    story: '',
    images: [],
    proposalCount: 0,
    likeCount: 0,
    status: 'open',
    school: '',
    creditScore: 60,
    verified: false,
    avatar: '../../assets/avatars/avatar-1.png',
    nickName: '校换用户',
    estimatedValue: 0,
    rarity: '普通',
    brainScore: 80,
    matchScore: 80,
    tags: [],
    alternatives: [],
    reason: '',
    quest: '',
  };
}

function decorateStatus(status) {
  if (status === 'accepted') return '已接受';
  if (status === 'rejected') return '已婉拒';
  if (status === 'cancelled') return '已取消';
  return '待回复';
}

function mapPost(row) {
  if (!row) return defaultPost();

  const profile = row.profiles || {};

  return {
    postId: row.id,
    userId: row.user_id,
    title: row.title || `${row.have_item || ''} 换 ${row.want_item || ''}`,
    haveItem: row.have_item || '',
    wantItem: row.want_item || '',
    story: row.story || '',
    images: Array.isArray(row.image_urls) ? row.image_urls : [],
    proposalCount: row.proposal_count || 0,
    likeCount: row.like_count || 0,
    status: row.status || 'open',
    createdAt: row.created_at,
    school: row.school || profile.school || '',
    creditScore: profile.credit_score || 60,
    verified: Boolean(profile.verified),
    avatar: profile.avatar_url || '../../assets/avatars/avatar-1.png',
    nickName: profile.nick_name || '校换用户',
    estimatedValue: row.estimated_value || 0,
    rarity: row.rarity || '普通',
    brainScore: row.brain_score || 80,
    matchScore: row.match_score || 80,
    tags: Array.isArray(row.tags) ? row.tags : [],
    alternatives: Array.isArray(row.alternatives) ? row.alternatives : [],
    reason: row.reason || '',
    quest: row.quest || '',
  };
}

function mapProposal(row) {
  const profile = row.profiles || {};

  return {
    proposalId: row.id,
    postId: row.post_id,
    fromUserId: row.from_user_id,
    proposerName: profile.nick_name || '校换用户',
    avatar: profile.avatar_url || '../../assets/avatars/avatar-1.png',
    school: profile.school || '',
    creditScore: profile.credit_score || 60,
    verified: Boolean(profile.verified),
    offerItem: row.offer_item || '',
    description: row.description || '',
    images: Array.isArray(row.image_urls) ? row.image_urls : [],
    status: row.status || 'pending',
    statusLabel: decorateStatus(row.status),
    funScore: row.fun_score || 80,
    createdAt: row.created_at,
  };
}

Page({
  data: {
    post: defaultPost(),
    proposals: [],
    isOwner: false,
    loading: false,
    currentUserId: '',
  },

  onLoad(query) {
    const id = query.id || query.postId || '';

    if (!id) {
      wx.showToast({
        title: '缺少帖子 ID',
        icon: 'none',
      });
      return;
    }

    this.loadDetail(id);
  },

  onShow() {
    if (this.data.post.postId) {
      this.loadDetail(this.data.post.postId);
    }
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

  async loadDetail(id) {
    this.setData({
      loading: true,
    });

    try {
      const currentUserId = await this.getCurrentUserId();

      const postRows = await db.select(
        'posts',
        `select=*,profiles(nick_name,avatar_url,school,credit_score,verified)&id=eq.${id}`,
        false
      );

      const postRow = postRows && postRows[0];

      if (!postRow) {
        wx.showToast({
          title: '帖子不存在',
          icon: 'none',
        });
        return;
      }

      const post = mapPost(postRow);

      let proposals = [];

      if (currentUserId) {
        try {
          const proposalRows = await db.select(
            'proposals',
            `select=*,profiles(nick_name,avatar_url,school,credit_score,verified)&post_id=eq.${id}&order=created_at.desc`,
            true
          );

          proposals = Array.isArray(proposalRows)
            ? proposalRows.map(mapProposal)
            : [];
        } catch (err) {
          console.warn('提案列表加载失败：', err);
        }
      }

      this.setData({
        post,
        proposals,
        currentUserId,
        isOwner: Boolean(currentUserId && post.userId === currentUserId),
      });
    } catch (err) {
      console.error('详情加载失败：', err);

      wx.showToast({
        title: err.message || '详情加载失败',
        icon: 'none',
      });
    } finally {
      this.setData({
        loading: false,
      });
    }
  },

  async acceptProposal(e) {
    const proposalId = e.currentTarget.dataset.id;

    if (!proposalId) return;

    if (!this.data.isOwner) {
      wx.showToast({
        title: '只有发布者可以接受提案',
        icon: 'none',
      });
      return;
    }

    wx.showModal({
      title: '接受提案',
      content: '接受后该交换将标记为已达成，其他提案会自动关闭。',
      success: async (res) => {
        if (!res.confirm) return;

        wx.showLoading({
          title: '处理中...',
        });

        try {
          await db.rpc('accept_proposal', {
            p_proposal_id: proposalId,
          });

          const state = app.restoreState();
          const postId = this.data.post.postId;

          state.posts = (Array.isArray(state.posts) ? state.posts : []).map((item) => {
            if (item.postId !== postId) return item;

            return {
              ...item,
              status: 'done',
            };
          });

          if (state.currentUser) {
            state.currentUser.exchangeCount = Number(state.currentUser.exchangeCount || 0) + 1;
            state.currentUser.brainPower = Number(state.currentUser.brainPower || 0) + 50;
            state.currentUser.energy = Number(state.currentUser.energy || 0) + 30;
            addBadge(state.currentUser, '新手换物家');
          }

          app.syncState(state);

          wx.hideLoading();

          wx.showModal({
            title: '交换成功',
            content: '你获得了 +50 脑洞值和 +30 闲置能量，交换故事已加入故事广场。',
            showCancel: false,
          });

          await this.loadDetail(postId);
        } catch (err) {
          wx.hideLoading();

          console.error('接受提案失败：', err);

          wx.showToast({
            title: err.message || err.msg || '操作失败',
            icon: 'none',
          });
        }
      },
    });
  },

  async rejectProposal(e) {
    const proposalId = e.currentTarget.dataset.id;

    if (!proposalId) return;

    if (!this.data.isOwner) {
      wx.showToast({
        title: '只有发布者可以婉拒提案',
        icon: 'none',
      });
      return;
    }

    try {
      wx.showLoading({
        title: '处理中...',
      });

      await db.update(
        'proposals',
        `id=eq.${proposalId}`,
        {
          status: 'rejected',
        }
      );

      wx.hideLoading();

      wx.showToast({
        title: '已婉拒',
        icon: 'success',
      });

      await this.loadDetail(this.data.post.postId);
    } catch (err) {
      wx.hideLoading();

      console.error('婉拒提案失败：', err);

      wx.showToast({
        title: err.message || err.msg || '操作失败',
        icon: 'none',
      });
    }
  },

  goProposal() {
    if (!this.data.post.postId) return;

    wx.navigateTo({
      url: `/pages/proposal/index?postId=${this.data.post.postId}`,
    });
  },

  goMap() {
    wx.navigateTo({
      url: '/pages/map/index',
    });
  },

  goChain() {
    wx.navigateTo({
      url: '/pages/chain/index',
    });
  },
});

