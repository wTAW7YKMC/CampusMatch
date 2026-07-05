const seedState = {
    version: 3,
  
    currentUser: {
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
    },
  
    posts: [],
    wishes: [],
    chains: [],
    safeSpots: [],
    activityCards: [],
    tasks: [],
    stories: [],
    proposalsByPost: {},
  
    rankList: {
      brain: [],
      exchange: [],
      credit: [],
      energy: [],
    },
  
    messages: [],
  };
  
const taskBlueprints = [
  { taskId: 't-publish', title: '发布第一张 AI 交换卡', desc: '发起 1 次交换，体验 AI 生成标题、估值和标签。', target: 1, metric: 'publishCount', rewardBrain: 20, rewardEnergy: 10, badge: 'AI交换卡收藏家' },
  { taskId: 't-proposal', title: '脑洞提案大师', desc: '向 3 个交换发起脑洞提案。', target: 3, metric: 'proposalCount', rewardBrain: 80, rewardEnergy: 20, badge: '脑洞提案大师' },
  { taskId: 't-exchange', title: '完成第一次交换', desc: '接受或达成 1 次交换，让闲置真正流动起来。', target: 1, metric: 'exchangeCount', rewardBrain: 60, rewardEnergy: 60, badge: '新手换物家' },
  { taskId: 't-wish', title: '点亮校园心愿池', desc: '投递 2 个心愿，让系统发现校园真实需求。', target: 2, metric: 'wishCount', rewardBrain: 40, rewardEnergy: 10, badge: '心愿收集员' },
  { taskId: 't-chain', title: '开启多边交换挑战', desc: '参与 1 次交换挑战局，完成多人交换闭环。', target: 1, metric: 'chainCount', rewardBrain: 90, rewardEnergy: 80, badge: '交换链大师' },
  { taskId: 't-story', title: '故事广场点赞官', desc: '给 3 个交换故事点赞，发现校园里的神奇交换。', target: 3, metric: 'storyLikes', rewardBrain: 30, rewardEnergy: 10, badge: '故事发现官' },
];

function cloneDeep(value) {
  return JSON.parse(JSON.stringify(value));
}

function createPostId(state) {
  const count = state.posts.length + 1;
  return `p-${String(count).padStart(3, '0')}`;
}

function createProposalId(state) {
  let max = 0;
  Object.values(state.proposalsByPost || {}).forEach((items) => {
    items.forEach((item) => {
      const n = Number(String(item.proposalId).split('-')[1]) || 0;
      if (n > max) max = n;
    });
  });
  return `pr-${String(max + 1).padStart(3, '0')}`;
}

function createWishId(state) {
  const count = (state.wishes || []).length + 1;
  return `w-${String(count).padStart(3, '0')}`;
}

function createMessageId() {
  return `m-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
}

function defaultTags(post) {
  const have = post.haveItem || '';
  const want = post.wantItem || '';
  const tags = [];
  if (/计算器|资料|教材|笔记|六级|考研|台灯/.test(have + want)) tags.push('学习刚需');
  if (/奶茶|电影|早餐|券|咖啡/.test(have + want)) tags.push('即时快乐');
  if (/行李箱|收纳|床上桌|宿舍|风扇/.test(have + want)) tags.push('宿舍好物');
  if (/手绘|服务|技能|头像|摄影|修图/.test(have + want)) tags.push('技能换物');
  if (/伞|杯|雨衣|鞋套/.test(have + want)) tags.push('生活小物');
  tags.push('AI推荐');
  return Array.from(new Set(tags)).slice(0, 4);
}

function generateSwapCard(form) {
  const haveItem = form.haveItem || '神秘闲置';
  const wantItem = form.wantItem || '开放脑洞';
  const text = `${haveItem}${wantItem}${form.story || ''}`;
  const tags = defaultTags({ haveItem, wantItem });
  const baseValue = 18 + Math.min(haveItem.length * 5 + wantItem.length * 3, 72);
  const novelty = /服务|手绘|技能|故事|随机|开放|脑洞/.test(text) ? 12 : 0;
  const urgency = /计算器|雨伞|资料|行李箱|考试|毕业/.test(text) ? 10 : 0;
  const brainScore = Math.min(99, 68 + tags.length * 4 + novelty + urgency + (form.acceptBrain ? 6 : 0));
  const rarity = brainScore >= 94 ? 'SS级神奇交换' : brainScore >= 88 ? 'S级校园刚需' : brainScore >= 80 ? 'A级好换' : 'B级可探索';
  const alternatives = [];
  if (/计算器|资料|教材|笔记/.test(wantItem + haveItem)) alternatives.push('考研资料', '台灯', '打印券');
  if (/奶茶|电影|早餐|券/.test(wantItem + haveItem)) alternatives.push('咖啡券', '早餐券', '电影票');
  if (/宿舍|行李箱|收纳|床上桌/.test(wantItem + haveItem)) alternatives.push('收纳箱', '小风扇', '插排');
  if (!alternatives.length) alternatives.push('奶茶券', '学习资料', '宿舍小物');
  return {
    title: `${haveItem}，想换${wantItem}`,
    estimatedValue: baseValue,
    rarity,
    brainScore,
    matchScore: Math.min(98, brainScore - 2 + Math.floor(Math.random() * 5)),
    tags,
    alternatives: Array.from(new Set(alternatives)).slice(0, 3),
    reason: `校换小管家判断：${haveItem}适合交换${wantItem}，也可以接受价值接近、使用场景相近或更有故事感的脑洞提案。`,
    quest: brainScore >= 88 ? '建议加入本周挑战局，获得更高曝光。' : '建议补充故事和图片，提高提案率。',
  };
}

function addBadge(user, badge) {
  if (!badge) return;
  if (!Array.isArray(user.badges)) user.badges = [];
  if (!user.badges.includes(badge)) user.badges.push(badge);
}

function upsertRank(list, user, value) {
  const next = Array.isArray(list) ? cloneDeep(list) : [];
  const index = next.findIndex((item) => item.nickName === user.nickName && item.school === user.school);
  const row = { nickName: user.nickName, school: user.school, value };
  if (index >= 0) next[index] = row;
  else next.push(row);
  return next.sort((a, b) => Number(b.value || 0) - Number(a.value || 0)).slice(0, 10);
}

function updateRankList(state) {
  if (!state || !state.currentUser) return state;
  const user = state.currentUser;
  state.rankList = state.rankList || {};
  state.rankList.brain = upsertRank(state.rankList.brain, user, user.brainPower || 0);
  state.rankList.exchange = upsertRank(state.rankList.exchange, user, user.exchangeCount || 0);
  state.rankList.credit = upsertRank(state.rankList.credit, user, user.creditScore || 0);
  state.rankList.energy = upsertRank(state.rankList.energy, user, user.energy || 0);
  return state;
}

function metricValue(state, metric) {
  const user = state.currentUser || {};
  if (metric === 'publishCount') return user.publishCount || state.posts.filter((p) => p.userId === user.userId).length || 0;
  if (metric === 'proposalCount') return user.proposalCount || 0;
  if (metric === 'exchangeCount') return user.exchangeCount || 0;
  if (metric === 'wishCount') return user.wishCount || (state.wishes || []).filter((w) => w.ownerId === user.userId).length || 0;
  if (metric === 'chainCount') return user.chainCount || 0;
  if (metric === 'storyLikes') return user.storyLikes || 0;
  return 0;
}

function refreshTasks(state) {
  const existing = {};
  (state.tasks || []).forEach((task) => { existing[task.taskId] = task; });
  state.tasks = taskBlueprints.map((bp) => {
    const old = existing[bp.taskId] || {};
    const progress = Math.min(metricValue(state, bp.metric), bp.target);
    return {
      ...bp,
      progress,
      percent: Math.min(100, Math.floor((progress / bp.target) * 100)),
      claimed: Boolean(old.claimed),
      done: progress >= bp.target,
    };
  });
  return state.tasks;
}

function claimTaskReward(state, taskId) {
  refreshTasks(state);
  const task = state.tasks.find((item) => item.taskId === taskId);
  if (!task || !task.done || task.claimed) return { ok: false, message: '任务尚未完成或已领取' };
  task.claimed = true;
  const user = state.currentUser;
  user.brainPower = (user.brainPower || 0) + (task.rewardBrain || 0);
  user.energy = (user.energy || 0) + (task.rewardEnergy || 0);
  addBadge(user, task.badge);
  state.messages.unshift({
    id: createMessageId(),
    type: 'task',
    title: '任务奖励已领取',
    desc: `${task.title} 完成，获得 +${task.rewardBrain} 脑洞值、+${task.rewardEnergy} 闲置能量和「${task.badge}」徽章`,
    time: '刚刚',
  });
  updateRankList(state);
  return { ok: true, task };
}

function ensureStateDefaults(rawState) {
  const state = rawState || cloneDeep(seedState);
  const defaults = cloneDeep(seedState);
  state.currentUser = { ...defaults.currentUser, ...(state.currentUser || {}) };
  const user = state.currentUser;
  if (typeof user.energy !== 'number') user.energy = 0;
  if (!Array.isArray(user.badges)) user.badges = [];
  if (typeof user.brainPower !== 'number') user.brainPower = 0;
  if (typeof user.exchangeCount !== 'number') user.exchangeCount = 0;
  if (typeof user.publishCount !== 'number') user.publishCount = 0;
  if (typeof user.proposalCount !== 'number') user.proposalCount = 0;
  if (typeof user.wishCount !== 'number') user.wishCount = 0;
  if (typeof user.chainCount !== 'number') user.chainCount = 0;
  if (typeof user.storyLikes !== 'number') user.storyLikes = 0;
  if (!user.level) user.level = 'Lv1';
  if (!user.title) user.title = '校园换物家';

  state.posts = Array.isArray(state.posts) ? state.posts : cloneDeep(defaults.posts);
  state.posts = state.posts.map((post, index) => ({
    proposalCount: 0,
    likeCount: 0,
    status: 'open',
    createdAt: '刚刚',
    school: user.school,
    creditScore: user.creditScore,
    verified: Boolean(user.verified),
    avatar: user.avatar,
    nickName: user.nickName,
    estimatedValue: 25 + index * 5,
    rarity: index % 2 === 0 ? 'A级好换' : 'S级刚需',
    brainScore: 80 + (index % 15),
    matchScore: 80 + (index % 14),
    tags: defaultTags(post),
    ...post,
  }));

  ['wishes', 'chains', 'safeSpots', 'activityCards', 'stories', 'messages'].forEach((key) => {
    state[key] = Array.isArray(state[key]) ? state[key] : cloneDeep(defaults[key]);
  });
  state.chains = state.chains.map((chain) => ({
    ...chain,
    routeText: (chain.nodes || []).map((node) => `${node.user}的${node.have}`).join(' → '),
  }));
  state.proposalsByPost = state.proposalsByPost || cloneDeep(defaults.proposalsByPost);
  Object.keys(state.proposalsByPost).forEach((postId) => {
    state.proposalsByPost[postId] = (state.proposalsByPost[postId] || []).map((proposal) => ({
      status: 'pending',
      funScore: 80,
      ...proposal,
    }));
  });

  state.rankList = state.rankList || cloneDeep(defaults.rankList);
  state.rankList.brain = Array.isArray(state.rankList.brain) ? state.rankList.brain : [];
  state.rankList.exchange = Array.isArray(state.rankList.exchange) ? state.rankList.exchange : [];
  state.rankList.credit = Array.isArray(state.rankList.credit) ? state.rankList.credit : [];
  state.rankList.energy = Array.isArray(state.rankList.energy) ? state.rankList.energy : [];
  refreshTasks(state);
  updateRankList(state);
  return state;
}

module.exports = {
  seedState,
  cloneDeep,
  createPostId,
  createProposalId,
  createWishId,
  createMessageId,
  ensureStateDefaults,
  updateRankList,
  refreshTasks,
  claimTaskReward,
  generateSwapCard,
  addBadge,
};
