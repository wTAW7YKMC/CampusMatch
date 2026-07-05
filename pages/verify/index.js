const app = getApp();
const { auth, db } = require('../../utils/supabase');

Page({
  data: {
    realName: '',
    school: '武汉理工大学',
    grade: '2023级',
    major: '',
    studentId: '',
    loading: false,
    verified: false,
  },

  onShow() {
    const state = app.restoreState();
    const user = state.currentUser || {};

    this.setData({
      school: user.school || '武汉理工大学',
      grade: user.grade || '2023级',
      verified: Boolean(user.verified),
    });
  },

  onRealNameInput(e) {
    this.setData({ realName: e.detail.value.trim() });
  },

  onSchoolInput(e) {
    this.setData({ school: e.detail.value.trim() });
  },

  onGradeInput(e) {
    this.setData({ grade: e.detail.value.trim() });
  },

  onMajorInput(e) {
    this.setData({ major: e.detail.value.trim() });
  },

  onStudentIdInput(e) {
    this.setData({ studentId: e.detail.value.trim() });
  },

  async submitVerify() {
    const session = auth.getSession();

    if (!session || !session.access_token || !session.user) {
      wx.showToast({
        title: '请先登录',
        icon: 'none',
      });
      return;
    }

    const {
      realName,
      school,
      grade,
      major,
      studentId,
    } = this.data;

    if (!realName || !school || !grade || !major || !studentId) {
      wx.showToast({
        title: '请填写完整认证信息',
        icon: 'none',
      });
      return;
    }

    if (studentId.length < 6) {
      wx.showToast({
        title: '学号格式不正确',
        icon: 'none',
      });
      return;
    }

    this.setData({ loading: true });

    try {
      const userId = session.user.id;

      const rows = await db.update(
        'profiles',
        `id=eq.${userId}`,
        {
          real_name: realName,
          school,
          grade,
          major,
          student_id: studentId,
          verified: true,
          verified_at: new Date().toISOString(),
          credit_score: 80,
          title: '已认证大学生',
        }
      );

      const updated = rows && rows[0];

      const state = app.restoreState();

      state.currentUser = {
        ...state.currentUser,
        userId,
        realName,
        school,
        grade,
        major,
        studentId,
        verified: true,
        creditScore: updated && updated.credit_score ? updated.credit_score : 80,
        title: '已认证大学生',
      };

      app.syncState(state);

      this.setData({
        verified: true,
      });

      wx.showToast({
        title: '认证成功',
        icon: 'success',
      });

      setTimeout(() => {
        wx.navigateBack();
      }, 700);
    } catch (err) {
      console.error('学生认证失败：', err);

      wx.showToast({
        title: err.message || '认证失败',
        icon: 'none',
      });
    } finally {
      this.setData({ loading: false });
    }
  },
});

