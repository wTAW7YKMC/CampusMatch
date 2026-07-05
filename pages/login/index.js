const { auth } = require('../../utils/supabase');

Page({
  data: {
    mode: 'login',
    email: '',
    password: '',
    nickName: '',
    school: '武汉理工大学',
    grade: '2023级',
    loading: false,
  },

  switchMode() {
    this.setData({
      mode: this.data.mode === 'login' ? 'register' : 'login',
    });
  },

  onEmailInput(e) {
    this.setData({ email: e.detail.value.trim() });
  },

  onPasswordInput(e) {
    this.setData({ password: e.detail.value });
  },

  onNickInput(e) {
    this.setData({ nickName: e.detail.value });
  },

  onSchoolInput(e) {
    this.setData({ school: e.detail.value });
  },

  onGradeInput(e) {
    this.setData({ grade: e.detail.value });
  },

  async submit() {
    const {
      mode,
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

    this.setData({ loading: true });

    try {
      if (mode === 'register') {
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

      setTimeout(() => {
        wx.switchTab({
          url: '/pages/home/index',
        });
      }, 500);
    } catch (err) {
      console.error('登录/注册失败：', err);

      wx.showToast({
        title: err.msg || err.message || err.error_description || '操作失败',
        icon: 'none',
      });
    } finally {
      this.setData({ loading: false });
    }
  },
});
