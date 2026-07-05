const app = getApp();

const { auth, db, storage } = require('../../utils/supabase');

const {
  generateSwapCard,
  addBadge,
  refreshTasks,
} = require('../../utils/mock-data');

const MAX_IMAGES = 3;

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
    submitting: false,
  },

  onLoad() {
    this.setData({
      'form.acceptBrain': true,
    });
  },

  onShow() {
    this.syncTabBar();
  },

  syncTabBar() {
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({
        selected: 1,
      });
    }
  },

  updateFormField(key, value) {
    this.setData({
      [`form.${key}`]: value,
    });
  },

  onHaveInput(e) {
    this.updateFormField('haveItem', e.detail.value);
  },

  onWantInput(e) {
    this.updateFormField('wantItem', e.detail.value);
  },

  onStoryInput(e) {
    this.updateFormField('story', e.detail.value);
  },

  onBrainChange(e) {
    this.updateFormField('acceptBrain', e.detail.value);
  },

  addImage() {
    const images = this.data.form.images || [];
    const remain = MAX_IMAGES - images.length;

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
        const newPaths = (res.tempFiles || []).map((file) => file.tempFilePath);

        this.setData({
          'form.images': images.concat(newPaths).slice(0, MAX_IMAGES),
        });
      },
      fail: (err) => {
        console.log('选择图片失败', err);
      },
    });
  },

  removeImage(e) {
    const { index } = e.currentTarget.dataset;
    const next = [...(this.data.form.images || [])];

    next.splice(index, 1);

    this.setData({
      'form.images': next,
    });
  },

  previewImage(e) {
    const { src } = e.currentTarget.dataset;

    wx.previewImage({
      current: src,
      urls: this.data.form.images || [],
    });
  },

  generateAiCard() {
    const { haveItem, wantItem } = this.data.form;

    if (!haveItem || !wantItem) {
      wx.showToast({
        title: '先填上“有什么”和“想换什么”',
        icon: 'none',
      });
      return;
    }

    const aiCard = generateSwapCard(this.data.form);

    this.setData({
      aiCard,
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

  async uploadPostImages(userId, images) {
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
      const objectPath = `${userId}/posts/${Date.now()}-${i}.${ext}`;
      const url = await storage.uploadImage(localPath, objectPath);

      imageUrls.push(url);
    }

    return imageUrls;
  },

  async submitPost() {
    if (this.data.submitting) return;

    const { form, aiCard } = this.data;
    const { haveItem, wantItem, story, images } = form;

    if (!haveItem || !wantItem) {
      wx.showToast({
        title: '请填写想换出和想换入',
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

    this.setData({
      submitting: true,
    });

    wx.showLoading({
      title: '发布中...',
    });

    try {
      const state = app.restoreState();
      const currentUser = state.currentUser || {};

      const card = aiCard || generateSwapCard(form);

      const imageUrls = await this.uploadPostImages(userId, images);

      const rows = await db.insert('posts', {
        user_id: userId,
        title: card.title || `${haveItem} 换 ${wantItem}`,
        have_item: haveItem,
        want_item: wantItem,
        story: story || '快来和我交换吧！',
        image_urls: imageUrls,
        status: 'open',
        school: currentUser.school || '',
        estimated_value: card.estimatedValue || 0,
        rarity: card.rarity || '普通',
        brain_score: card.brainScore || 80,
        match_score: card.matchScore || 80,
        tags: card.tags || [],
        alternatives: card.alternatives || [],
        reason: card.reason || '',
        quest: card.quest || '',
      });

      const newPost = rows && rows[0];

      const nextUser = {
        ...currentUser,
        userId,
        publishCount: Number(currentUser.publishCount || 0) + 1,
        brainPower: Number(currentUser.brainPower || 0) + 20,
      };

      addBadge(nextUser, 'AI交换卡收藏家');

      await db.update(
        'profiles',
        `id=eq.${userId}`,
        {
          publish_count: nextUser.publishCount,
          brain_power: nextUser.brainPower,
          badges: nextUser.badges || [],
        }
      );

      await db.insert('messages', {
        user_id: userId,
        type: 'system',
        title: '交换卡发布成功',
        description: `你发布的「${haveItem}」已上线，快去广场看看吧`,
        time_label: '刚刚',
      });

      if (newPost) {
        const localPost = {
          postId: newPost.id,
          userId,
          title: newPost.title,
          haveItem: newPost.have_item,
          wantItem: newPost.want_item,
          story: newPost.story,
          images: newPost.image_urls || [],
          proposalCount: 0,
          likeCount: 0,
          status: newPost.status,
          createdAt: newPost.created_at || '刚刚',
          school: currentUser.school || '',
          creditScore: currentUser.creditScore || 60,
          verified: Boolean(currentUser.verified),
          avatar: currentUser.avatar || '../../assets/avatars/avatar-1.png',
          nickName: currentUser.nickName || '校换用户',
          estimatedValue: newPost.estimated_value,
          rarity: newPost.rarity,
          brainScore: newPost.brain_score,
          matchScore: newPost.match_score,
          tags: newPost.tags || [],
          alternatives: newPost.alternatives || [],
          reason: newPost.reason || '',
          quest: newPost.quest || '',
        };

        state.posts = [
          localPost,
          ...(Array.isArray(state.posts) ? state.posts : []),
        ];
      }

      state.currentUser = nextUser;

      state.messages = [
        {
          id: `m-${Date.now()}`,
          type: 'system',
          title: '交换卡发布成功',
          desc: `你发布的「${haveItem}」已上线，快去广场看看吧`,
          time: '刚刚',
        },
        ...(Array.isArray(state.messages) ? state.messages : []),
      ];

      refreshTasks(state);
      app.syncState(state);

      this.setData({
        form: {
          haveItem: '',
          wantItem: '',
          story: '',
          images: [],
          acceptBrain: true,
        },
        aiCard: null,
      });

      wx.hideLoading();

      wx.showToast({
        title: '发布成功',
        icon: 'success',
      });

      setTimeout(() => {
        wx.switchTab({
          url: '/pages/home/index',
        });
      }, 600);
    } catch (err) {
      wx.hideLoading();

      console.error('发布失败：', err);

      wx.showToast({
        title: err.message || err.msg || '发布失败',
        icon: 'none',
      });
    } finally {
      this.setData({
        submitting: false,
      });
    }
  },
});
