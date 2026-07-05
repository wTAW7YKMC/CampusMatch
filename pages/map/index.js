const app = getApp();

const { db } = require('../../utils/supabase');

const DEFAULT_CENTER = {
  latitude: 30.52662,
  longitude: 114.35412,
};

function mapSpot(row, index) {
  return {
    id: row.id,
    markerId: index + 1,
    name: row.name || '安全交易点',
    type: row.type || '校内交易点',
    latitude: Number(row.latitude),
    longitude: Number(row.longitude),
    description: row.description || '',
    createdAt: row.created_at || '',
  };
}

Page({
  data: {
    spots: [],
    markers: [],
    selectedSpot: null,

    latitude: DEFAULT_CENTER.latitude,
    longitude: DEFAULT_CENTER.longitude,

    loading: false,
    emptyText: '暂无安全交易点',
  },

  onShow() {
    this.loadSafeSpots();
  },

  async loadSafeSpots() {
    this.setData({
      loading: true,
    });

    try {
      const rows = await db.select(
        'safe_spots',
        'select=*&active=eq.true&order=created_at.desc',
        false
      );

      const spots = (Array.isArray(rows) ? rows : [])
        .map(mapSpot)
        .filter((item) => item.latitude && item.longitude);

      const markers = spots.map((spot) => ({
        id: spot.markerId,
        latitude: spot.latitude,
        longitude: spot.longitude,
        title: spot.name,
        width: 32,
        height: 32,
        callout: {
          content: spot.name,
          color: '#1a1025',
          fontSize: 13,
          borderRadius: 8,
          bgColor: '#ffffff',
          padding: 8,
          display: 'BYCLICK',
        },
      }));

      const firstSpot = spots[0];

      const state = app.restoreState();
      state.safeSpots = spots;
      app.syncState(state);

      this.setData({
        spots,
        markers,
        selectedSpot: firstSpot || null,
        latitude: firstSpot ? firstSpot.latitude : DEFAULT_CENTER.latitude,
        longitude: firstSpot ? firstSpot.longitude : DEFAULT_CENTER.longitude,
      });
    } catch (err) {
      console.error('安全交易点加载失败：', err);

      wx.showToast({
        title: err.message || '地图加载失败',
        icon: 'none',
      });

      const state = app.restoreState();
      const localSpots = Array.isArray(state.safeSpots) ? state.safeSpots : [];

      const markers = localSpots.map((spot, index) => ({
        id: index + 1,
        latitude: Number(spot.latitude),
        longitude: Number(spot.longitude),
        title: spot.name,
        width: 32,
        height: 32,
      }));

      this.setData({
        spots: localSpots,
        markers,
        selectedSpot: localSpots[0] || null,
        latitude: localSpots[0] ? Number(localSpots[0].latitude) : DEFAULT_CENTER.latitude,
        longitude: localSpots[0] ? Number(localSpots[0].longitude) : DEFAULT_CENTER.longitude,
      });
    } finally {
      this.setData({
        loading: false,
      });
    }
  },

  chooseSpot(e) {
    const id = e.currentTarget.dataset.id;
    const spot = this.data.spots.find((item) => item.id === id);

    if (!spot) return;

    this.setData({
      selectedSpot: spot,
      latitude: spot.latitude,
      longitude: spot.longitude,
    });
  },

  onMarkerTap(e) {
    const markerId = e.detail.markerId;
    const spot = this.data.spots.find((item) => item.markerId === markerId);

    if (!spot) return;

    this.setData({
      selectedSpot: spot,
      latitude: spot.latitude,
      longitude: spot.longitude,
    });
  },

  openLocation() {
    const spot = this.data.selectedSpot;

    if (!spot) {
      wx.showToast({
        title: '请选择交易点',
        icon: 'none',
      });
      return;
    }

    wx.openLocation({
      latitude: Number(spot.latitude),
      longitude: Number(spot.longitude),
      name: spot.name,
      address: spot.description || spot.type || '安全交易点',
      scale: 18,
    });
  },

  refreshSpots() {
    this.loadSafeSpots();
  },
});
