const app = getApp();

const { auth, db, storage } = require('../../utils/supabase');

Page({
  data: {
    postId: '',
    post: null,

    offerItem: '',
    description: '',
    images: [],

    funScore: 88,
    submitting: false,
    loading: false,
  },

  onLoad(options) {
    const postId = options.postId || options.id || '';

    this.setData({
      postId,
    });

    this.loadPost(postId);
  },

  async loadPost(postId) {
    if (!postId) {
      wx.showToast({
        title: '缺少帖子 ID',
        icon: 'none',
      });
      return;
    }

    this.setData({
      loading: true,
    });

    try {
      const rows = await db.select(
        'posts',
        `select=*,profiles(nick_name,avatar_url,school,credit_score,verified)&id=eq.${postId}`,
        false
      );

      const row = rows && rows[0];

      if (!row) {
        wx.showToast({
          title: '帖子不存在',
          icon: 'none',
        });
        return;
      }

      const profile = row.profiles || {};

      const post = {
        postId: row.id,
        userId: row.user_id,
        title: row.title,
        haveItem: row.have_item,
        wantItem: row.want_item,
        story: row.story,
        images: Array.isArray(row.image_urls) ? row.image_urls : [],
        proposalCount: row.proposal_count || 0,
        likeCount: row.like_count || 0,
        status: row.status,
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
        tags: row.tags || [],
        alternatives: row.alternatives || [],
        reason: row.reason || '',
        quest: row.quest || '',
      };

      this.setData({
        post,
        offerItem: '',
        description: `你好，我想用一个合适的物品和你交换「${post.haveItem}」。`,
      });
    } catch (err) {
      console.error('加载帖子失败：', err);

      wx.showToast({
        title: err.message || '加载失败',
        icon: 'none',
      });
    } finally {
      this.setData({
        loading: false,
      });
    }
  },

  onOfferInput(e) {
    this.setData({
      offerItem: e.detail.value,
    });
  },

  onDescriptionInput(e) {
    this.setData({
      description: e.detail.value,
    });
  },

  addImage() {
    const images = this.data.images || [];
    const remain = 3 - images.length;

    if (remain <= 0) {
      wx.showToast({
        title: '最多 3 张图片',
        icon: 'none',
      });
      return;
    }

    wx.chooseMedia({
      count: remain,
      mediaType: ['image'],
      sourceType: ['album', 'camera'],
      sizeType: ['compressed'],
      success: (res) => {
        const paths = (res.tempFiles || []).map((file) => file.tempFilePath);

        this.setData({
          images: images.concat(paths).slice(0, 3),
        });
      },
      fail: (err) => {
        console.log('选择图片失败：', err);
      },
    });
  },

  removeImage(e) {
    const { index } = e.currentTarget.dataset;
    const next = [...(this.data.images || [])];

    next.splice(index, 1);

    this.setData({
      images: next,
    });
  },

  previewImage(e) {
    const { src } = e.currentTarget.dataset;

    wx.previewImage({
      current: src,
      urls: this.data.images || [],
    });
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

  async uploadProposalImages(userId, images) {
    const imageUrls = [];

    if (!Array.isArray(images) || !images.length) {
      return imageUrls;
    }

    for (let i = 0; i < images.length; i += 1) {
      const localPath = images[i];

      if (!localPath) continue;

      if (String(localPath).startsWith('http')) {
        imageUrls.push(localPath);
        continue;
      }

      const ext = String(localPath).toLowerCase().includes('.png') ? 'png' : 'jpg';
      const objectPath = `${userId}/proposals/${Date.now()}-${i}.${ext}`;
      const url = await storage.uploadImage(localPath, objectPath);

      imageUrls.push(url);
    }

    return imageUrls;
  },

  async submitProposal() {
    if (this.data.submitting) return;

    const {
      postId,
      post,
      offerItem,
      description,
      images,
      funScore,
    } = this.data;

    if (!postId || !post) {
      wx.showToast({
        title: '帖子不存在',
        icon: 'none',
      });
      return;
    }

    if (!offerItem) {
      wx.showToast({
        title: '请输入你想拿什么交换',
        icon: 'none',
      });
      return;
    }

    let userId = '';

    try {
      userId = await this.getCurrentUserId();
    } catch (err) {
      console.error('获取用户失败：', err);
    }

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

    if (post.userId === userId) {
      wx.showToast({
        title: '不能给自己的帖子提案',
        icon: 'none',
      });
      return;
    }

    this.setData({
      submitting: true,
    });

    wx.showLoading({
      title: '提交中...',
    });

    try {
      const imageUrls = await this.uploadProposalImages(userId, images);

      await db.insert('proposals', {
        post_id: postId,
        from_user_id: userId,
        offer_item: offerItem,
        description: description || '我想和你交换这个物品。',
        image_urls: imageUrls,
        status: 'pending',
        fun_score: funScore || 88,
      });

      const state = app.restoreState();
      const posts = Array.isArray(state.posts) ? state.posts : [];

      state.posts = posts.map((item) => {
        if (item.postId !== postId) return item;

        return {
          ...item,
          proposalCount: Number(item.proposalCount || 0) + 1,
        };
      });

      state.currentUser = {
        ...(state.currentUser || {}),
        proposalCount: Number((state.currentUser || {}).proposalCount || 0) + 1,
        brainPower: Number((state.currentUser || {}).brainPower || 0) + 30,
      };

      state.messages = [
        {
          id: `m-${Date.now()}`,
          type: 'proposal',
          title: '提案已提交',
          desc: '你发送了新的交换提案，获得 +30 脑洞值',
          time: '刚刚',
        },
        ...(Array.isArray(state.messages) ? state.messages : []),
      ];

      app.syncState(state);

      wx.hideLoading();

      wx.showToast({
        title: '提案已提交',
        icon: 'success',
      });

      setTimeout(() => {
        wx.navigateBack();
      }, 700);
    } catch (err) {
      wx.hideLoading();

      console.error('提交提案失败：', err);

      wx.showToast({
        title: err.message || err.msg || '提交失败',
        icon: 'none',
      });
    } finally {
      this.setData({
        submitting: false,
      });
    }
  },
});
