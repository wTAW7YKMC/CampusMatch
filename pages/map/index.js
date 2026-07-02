const app = getApp();
Page({
  data: { spots: [], markers: [], latitude: 30.52662, longitude: 114.35412 },
  onShow() {
    const state = app.restoreState();
    const markers = state.safeSpots.map((spot, index) => ({ id: index + 1, latitude: spot.latitude, longitude: spot.longitude, title: spot.name, width: 28, height: 28 }));
    this.setData({ spots: state.safeSpots, markers, latitude: state.safeSpots[0].latitude, longitude: state.safeSpots[0].longitude });
  },
  chooseSpot(e) {
    const id = e.currentTarget.dataset.id;
    const spot = this.data.spots.find((item) => item.id === id);
    if (!spot) return;
    this.setData({ latitude: spot.latitude, longitude: spot.longitude });
    wx.showToast({ title: `已选择${spot.name}`, icon: 'none' });
  },
});
