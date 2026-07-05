const {
    SUPABASE_URL,
    SUPABASE_ANON_KEY,
    STORAGE_BUCKET,
  } = require('./supabase-config');
  
  const SESSION_KEY = 'campus_swap_supabase_session';
  
  function getSession() {
    return wx.getStorageSync(SESSION_KEY) || null;
  }
  
  function setSession(session) {
    wx.setStorageSync(SESSION_KEY, session);
  }
  
  function clearSession() {
    wx.removeStorageSync(SESSION_KEY);
  }
  
  function request({ url, method = 'GET', data, auth = false, headers = {} }) {
    const session = getSession();
  
    const header = {
      apikey: SUPABASE_ANON_KEY,
      'Content-Type': 'application/json',
      ...headers,
    };
  
    if (auth && session && session.access_token) {
      header.Authorization = `Bearer ${session.access_token}`;
    }
  
    return new Promise((resolve, reject) => {
      wx.request({
        url,
        method,
        data,
        header,
        success(res) {
          if (res.statusCode >= 200 && res.statusCode < 300) {
            resolve(res.data);
          } else {
            console.error('Supabase request error:', res);
            reject(res.data || { message: `HTTP ${res.statusCode}` });
          }
        },
        fail(err) {
          console.error('wx.request fail:', err);
          reject(err);
        },
      });
    });
  }
  
  function authUrl(path) {
    return `${SUPABASE_URL}/auth/v1${path}`;
  }
  
  function restUrl(table, query = 'select=*') {
    return `${SUPABASE_URL}/rest/v1/${table}?${query}`;
  }
  
  const auth = {
    getSession,
  
    async signUp({ email, password, nickName, school, grade }) {
      const data = await request({
        url: authUrl('/signup'),
        method: 'POST',
        data: {
          email,
          password,
          data: {
            nick_name: nickName || '新用户',
            school: school || '',
            grade: grade || '',
          },
        },
      });
  
      if (data.session) {
        setSession(data.session);
      }
  
      return data;
    },
  
    async signIn({ email, password }) {
      const data = await request({
        url: authUrl('/token?grant_type=password'),
        method: 'POST',
        data: {
          email,
          password,
        },
      });
  
      setSession(data);
      return data;
    },
  
    async getUser() {
      return request({
        url: authUrl('/user'),
        method: 'GET',
        auth: true,
      });
    },
  
    async signOut() {
      try {
        await request({
          url: authUrl('/logout'),
          method: 'POST',
          auth: true,
        });
      } finally {
        clearSession();
      }
    },
  };
  
  const db = {
    select(table, query = 'select=*', authRequired = false) {
      return request({
        url: restUrl(table, query),
        method: 'GET',
        auth: authRequired,
      });
    },
  
    insert(table, row, query = 'select=*') {
      return request({
        url: restUrl(table, query),
        method: 'POST',
        auth: true,
        data: row,
        headers: {
          Prefer: 'return=representation',
        },
      });
    },
  
    update(table, query, values) {
      return request({
        url: restUrl(table, query),
        method: 'PATCH',
        auth: true,
        data: values,
        headers: {
          Prefer: 'return=representation',
        },
      });
    },
  
    remove(table, query) {
      return request({
        url: restUrl(table, query),
        method: 'DELETE',
        auth: true,
        headers: {
          Prefer: 'return=representation',
        },
      });
    },
  
    rpc(functionName, params = {}) {
      return request({
        url: `${SUPABASE_URL}/rest/v1/rpc/${functionName}`,
        method: 'POST',
        auth: true,
        data: params,
      });
    },
  };
  
  function guessContentType(path) {
    const lower = String(path || '').toLowerCase();
  
    if (lower.endsWith('.png')) return 'image/png';
    if (lower.endsWith('.webp')) return 'image/webp';
  
    return 'image/jpeg';
  }
  
  function readFileArrayBuffer(filePath) {
    return new Promise((resolve, reject) => {
      wx.getFileSystemManager().readFile({
        filePath,
        success: (res) => resolve(res.data),
        fail: reject,
      });
    });
  }
  
  const storage = {
    async uploadImage(localPath, objectPath) {
      const session = getSession();
  
      if (!session || !session.access_token) {
        throw new Error('请先登录');
      }
  
      const body = await readFileArrayBuffer(localPath);
      const contentType = guessContentType(localPath);
      const uploadUrl = `${SUPABASE_URL}/storage/v1/object/${STORAGE_BUCKET}/${objectPath}`;
  
      await request({
        url: uploadUrl,
        method: 'POST',
        auth: true,
        data: body,
        headers: {
          'Content-Type': contentType,
          'x-upsert': 'true',
        },
      });
  
      return `${SUPABASE_URL}/storage/v1/object/public/${STORAGE_BUCKET}/${objectPath}`;
    },
  };
  
  module.exports = {
    auth,
    db,
    storage,
  };
  