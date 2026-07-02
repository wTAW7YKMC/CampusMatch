const app = getApp();
function iconOf(type) { return type === 'proposal' ? '💬' : type === 'story' ? '📖' : type === 'task' ? '🎮' : '🔔'; }
Page({
  data: { messages: [] },
  onShow() {
    const state = app.restoreState();
    this.setData({ messages: state.messages.map((m) => ({ ...m, icon: iconOf(m.type) })) });
    this.syncTabBar();
  },

  syncTabBar() {
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({ selected: 2 });
    }
  },
});
