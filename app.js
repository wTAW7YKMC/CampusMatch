const { seedState, cloneDeep, ensureStateDefaults } = require('./utils/mock-data');

App({
  globalData: {
    state: ensureStateDefaults(cloneDeep(seedState)),
  },

  onLaunch() {
    this.loadCustomFonts();
  },

  onShow() {
    this.loadCustomFonts();
  },

  loadCustomFonts() {
    wx.loadFontFace({
      family: 'ZCOOL KuaiLe',
      source: 'url("https://fonts.cdnfonts.com/s/15322/ZCOOLKuaiLe-Regular.woff")',
      success: () => console.log('ZCOOL KuaiLe 加载成功'),
      fail: (err) => console.log('ZCOOL KuaiLe 加载失败，使用回退字体', err),
    });

    wx.loadFontFace({
      family: 'DSEG14 Classic',
      source: 'url("https://cdn.jsdelivr.net/gh/keshikan/DSEG@master/fonts/DSEG14-Classic/DSEG14Classic-Regular.woff2")',
      success: () => console.log('DSEG14 Classic 加载成功'),
      fail: (err) => console.log('DSEG14 Classic 加载失败，使用回退字体', err),
    });
  },

  syncState(nextState) {
    this.globalData.state = ensureStateDefaults(cloneDeep(nextState));
    wx.setStorageSync('swapanything_state', this.globalData.state);
  },

  restoreState() {
    const saved = wx.getStorageSync('swapanything_state');
    if (saved && saved.version === seedState.version) {
      this.globalData.state = ensureStateDefaults(cloneDeep(saved));
      wx.setStorageSync('swapanything_state', this.globalData.state);
      return this.globalData.state;
    }
    this.globalData.state = ensureStateDefaults(cloneDeep(seedState));
    wx.setStorageSync('swapanything_state', this.globalData.state);
    return this.globalData.state;
  },

  resetState() {
    this.globalData.state = ensureStateDefaults(cloneDeep(seedState));
    wx.setStorageSync('swapanything_state', this.globalData.state);
    return this.globalData.state;
  },
});
