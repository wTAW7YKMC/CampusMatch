const app = getApp();

const { auth, db } = require('../../utils/supabase');

const defaultUser = {
  userId: '',
  nickName: '未登录',
  avatar: '../../assets/avatars/avatar-1.png',
  school: '',
  grade: '',
  creditScore: 60,
  exchangeCount: 0,
  publishCount: 0,
  proposalCount: 0,
  wishCount: 0,
  chainCount: 0,
  storyLikes: 0,
  level: 'Lv1',
  verified: false,
  brainPower: 0,
  energy: 0,
  badges: [],
  title: '校园换物家',

  schoolLine: '未填写学校 · 未填写年级 · 校园换物家',
  verifiedLabel: '未认证',
};

function buildDisplayUser(user) {
  const school = user.school || '未填写学校';
  const grade = user.grade || '未填写年级';
  const title = user.title || '校园换物家';

  return {
    ...user,
    avatar: user.avatar || '../../assets/avatars/avatar-1.png',
    schoolLine: `${school} · ${grade} · ${title}`,
    verifiedLabel: user.verified ? '已认证大学生' : '未认证',
    badgeCount: Array.isArray(user.badges) ? user.badges.length : 0,
  };
}

function mapProfile(row) {
  if (!row) return buildDisplayUser(defaultUser);

  return buildDisplayUser({
    userId: row.id,
    nickName: row.nick_name || '校换用户',
    avatar: row.avatar_url || '../../assets/avatars/avatar-1.png',
    school: row.school || '',
    grade: row.grade || '',
    creditScore: row.credit_score || 60,
    exchangeCount: row.exchange_count || 0,
    publishCount: row.publish_count || 0,
    proposalCount: row.proposal_count || 0,
    wishCount: row.wish_count || 0,
    chainCount: row.chain_count || 0,
    storyLikes: row.story_likes || 0,
    level: row.level || 'Lv1',
    verified: Boolean(row.verified),
    brainPower: row.brain_power || 0,
    energy: row.energy || 0,
    badges: row.badges || [],
    title: row.title || '校园换物家',
    realName: row.real_name || '',
    studentId: row.student_id || '',
    major: row.major || '',
    verifiedAt: row.verified_at || '',
  });
}

Page({
  data: {
    user: buildDisplayUser(defaultUser),
    isLoggedIn: false,
    loading: false,

    authMode: 'login',
    email: '',
    password: '',
    nickName: '',
    school: '武汉理工大学',
    grade: '2023级',

    myPosts: [],
    myProposals: [],
    recentMessages: [],
  },

  async onShow() {
    await this.loadProfile();
    this.syncTabBar();
  },

  syncTabBar() {
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({
        selected: 3,
      });
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

  async loadProfile() {
    const session = auth.getSession();

    if (!session || !session.access_token) {
      this.setData({
        user: buildDisplayUser(defaultUser),
        isLoggedIn: false,
        myPosts: [],
        myProposals: [],
        recentMessages: [],
      });

      return;
    }

    this.setData({
      loading: true,
    });

    try {
      const userId = await this.getCurrentUserId();

      if (!userId) {
        throw new Error('登录状态已失效');
      }

      const profileRows = await db.select(
        'profiles',
        `select=*&id=eq.${userId}`,
        true
      );

      const user = mapProfile(profileRows && profileRows[0]);

      let myPosts = [];
      let myProposals = [];
      let recentMessages = [];

      try {
        const postRows = await db.select(
          'posts',
          `select=id,title,have_item,want_item,status,proposal_count,created_at&user_id=eq.${userId}&order=created_at.desc`,
          true
        );

        myPosts = Array.isArray(postRows) ? postRows : [];
      } catch (err) {
        console.warn('加载我的发布失败：', err);
      }

      try {
        const proposalRows = await db.select(
          'proposals',
          `select=id,post_id,offer_item,status,created_at&from_user_id=eq.${userId}&order=created_at.desc`,
          true
        );

        myProposals = Array.isArray(proposalRows) ? proposalRows : [];
      } catch (err) {
        console.warn('加载我的提案失败：', err);
      }

      try {
        const messageRows = await db.select(
          'messages',
          'select=id,type,title,description,read_at,created_at&order=created_at.desc&limit=3',
          true
        );

        recentMessages = Array.isArray(messageRows) ? messageRows : [];
      } catch (err) {
        console.warn('加载近期消息失败：', err);
      }

      const state = app.restoreState();

      state.currentUser = user;

      app.syncState(state);

      this.setData({
        user,
        isLoggedIn: true,
        myPosts,
        myProposals,
        recentMessages,
      });
    } catch (err) {
      console.error('加载个人页失败：', err);

      wx.showToast({
        title: err.message || '加载失败',
        icon: 'none',
      });

      this.setData({
        user: buildDisplayUser(defaultUser),
        isLoggedIn: false,
      });
    } finally {
      this.setData({
        loading: false,
      });
    }
  },

  switchAuthMode() {
    this.setData({
      authMode: this.data.authMode === 'login' ? 'register' : 'login',
    });
  },

  onEmailInput(e) {
    this.setData({
      email: e.detail.value.trim(),
    });
  },

  onPasswordInput(e) {
    this.setData({
      password: e.detail.value,
    });
  },

  onNickInput(e) {
    this.setData({
      nickName: e.detail.value,
    });
  },

  onSchoolInput(e) {
    this.setData({
      school: e.detail.value,
    });
  },

  onGradeInput(e) {
    this.setData({
      grade: e.detail.value,
    });
  },

  async submitAuth() {
    const {
      authMode,
      email,
      password,
      nickName,
      school,
      grade,
    } = this.data;

    if (!email || !password) {
      wx.showToast({
        title: '请输入邮箱和密码',
        icon: 'none',
      });
      return;
    }

    if (password.length < 6) {
      wx.showToast({
        title: '密码至少 6 位',
        icon: 'none',
      });
      return;
    }

    this.setData({
      loading: true,
    });

    try {
      if (authMode === 'register') {
        await auth.signUp({
          email,
          password,
          nickName,
          school,
          grade,
        });

        wx.showToast({
          title: '注册成功',
          icon: 'success',
        });
      } else {
        await auth.signIn({
          email,
          password,
        });

        wx.showToast({
          title: '登录成功',
          icon: 'success',
        });
      }

      await this.loadProfile();
    } catch (err) {
      console.error('登录注册失败：', err);

      wx.showToast({
        title: err.msg || err.message || err.error_description || '操作失败',
        icon: 'none',
      });
    } finally {
      this.setData({
        loading: false,
      });
    }
  },

  async logout() {
    wx.showModal({
      title: '退出登录',
      content: '确定退出当前账号吗？',
      success: async (res) => {
        if (!res.confirm) return;

        try {
          await auth.signOut();

          const state = app.restoreState();

          state.currentUser = buildDisplayUser(defaultUser);
          state.posts = [];
          state.messages = [];

          app.syncState(state);

          this.setData({
            user: buildDisplayUser(defaultUser),
            isLoggedIn: false,
            email: '',
            password: '',
            myPosts: [],
            myProposals: [],
            recentMessages: [],
          });

          wx.showToast({
            title: '已退出',
            icon: 'success',
          });
        } catch (err) {
          console.error('退出失败：', err);

          wx.showToast({
            title: '退出失败',
            icon: 'none',
          });
        }
      },
    });
  },

  goVerify() {
    if (!this.data.isLoggedIn) {
      wx.showToast({
        title: '请先登录',
        icon: 'none',
      });
      return;
    }

    wx.navigateTo({
      url: '/pages/verify/index',
    });
  },

  goRank() {
    wx.navigateTo({
      url: '/pages/rank/index',
    });
  },

  goTasks() {
    wx.navigateTo({
      url: '/pages/tasks/index',
    });
  },

  goWish() {
    wx.navigateTo({
      url: '/pages/wish/index',
    });
  },

  goChain() {
    wx.navigateTo({
      url: '/pages/chain/index',
    });
  },

  goMap() {
    wx.navigateTo({
      url: '/pages/map/index',
    });
  },

  goMessages() {
    wx.switchTab({
      url: '/pages/messages/index',
    });
  },

  goPostDetail(e) {
    const id = e.currentTarget.dataset.id;

    if (!id) return;

    wx.navigateTo({
      url: `/pages/detail/index?id=${id}`,
    });
  },
});
