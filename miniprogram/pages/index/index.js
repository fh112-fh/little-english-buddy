const today = new Date();
const todayKey = getLocalDateKey(today);

const cards = [
  { id: "cat", word: "cat", cn: "小猫", category: "animals", visual: "🐱", bg: "sun", phrase: "A soft cat", encouragements: ["Great listening!", "Sweet cat voice!", "You found cat!"] },
  { id: "dog", word: "dog", cn: "小狗", category: "animals", visual: "🐶", bg: "sky", phrase: "A happy dog", encouragements: ["Nice dog sound!", "You tried so well!", "Happy speaking!"] },
  { id: "bird", word: "bird", cn: "小鸟", category: "animals", visual: "🐦", bg: "mint", phrase: "A blue bird", encouragements: ["Bright listening!", "Lovely bird!", "You are flying!"] },
  { id: "apple", word: "apple", cn: "苹果", category: "food", visual: "🍎", bg: "rose", phrase: "A red apple", encouragements: ["Crunchy good job!", "Apple star!", "You said apple!"] },
  { id: "banana", word: "banana", cn: "香蕉", category: "food", visual: "🍌", bg: "sun", phrase: "A yellow banana", encouragements: ["Banana smile!", "Great try!", "Sunny speaking!"] },
  { id: "milk", word: "milk", cn: "牛奶", category: "food", visual: "🥛", bg: "sky", phrase: "A cup of milk", encouragements: ["Gentle voice!", "Nice milk!", "You listened carefully!"] },
  { id: "red", word: "red", cn: "红色", category: "colors", visual: "🔴", bg: "rose", phrase: "Red circle", encouragements: ["Red star!", "You spotted it!", "Great color ears!"] },
  { id: "blue", word: "blue", cn: "蓝色", category: "colors", visual: "🔵", bg: "sky", phrase: "Blue circle", encouragements: ["Blue sparkle!", "Nice choice!", "Great listening!"] },
  { id: "green", word: "green", cn: "绿色", category: "colors", visual: "🟢", bg: "mint", phrase: "Green circle", encouragements: ["Green power!", "You got it!", "Lovely color!"] },
  { id: "eye", word: "eye", cn: "眼睛", category: "body", visual: "👁️", bg: "sky", phrase: "My eye", encouragements: ["Good looking!", "Eye star!", "You said it clearly!"] },
  { id: "hand", word: "hand", cn: "手", category: "body", visual: "✋", bg: "sun", phrase: "My hand", encouragements: ["High five!", "Nice hand!", "You tried bravely!"] },
  { id: "nose", word: "nose", cn: "鼻子", category: "body", visual: "👃", bg: "rose", phrase: "My nose", encouragements: ["Nose star!", "Soft speaking!", "Wonderful try!"] },
  { id: "ball", word: "ball", cn: "球", category: "toys", visual: "⚽", bg: "mint", phrase: "A round ball", encouragements: ["Bounce bounce!", "Great ball!", "You listened so well!"] },
  { id: "car", word: "car", cn: "小车", category: "toys", visual: "🚗", bg: "rose", phrase: "A little car", encouragements: ["Zoom! Nice job!", "Car star!", "You said car!"] },
  { id: "teddy", word: "teddy", cn: "玩具熊", category: "toys", visual: "🧸", bg: "sun", phrase: "A soft teddy", encouragements: ["Cozy voice!", "Teddy likes it!", "You tried kindly!"] },
  { id: "mom", word: "mom", cn: "妈妈", category: "family", visual: "👩", bg: "rose", phrase: "My mom", encouragements: ["Warm voice!", "Mom star!", "Lovely speaking!"] },
  { id: "dad", word: "dad", cn: "爸爸", category: "family", visual: "👨", bg: "sky", phrase: "My dad", encouragements: ["Dad heard you!", "Great try!", "Strong listening!"] },
  { id: "baby", word: "baby", cn: "宝宝", category: "family", visual: "👶", bg: "mint", phrase: "A little baby", encouragements: ["Baby smile!", "Gentle speaking!", "You did it!"] }
];

const categoryNames = {
  animals: "动物",
  food: "食物",
  colors: "颜色",
  body: "身体",
  toys: "玩具",
  family: "家人"
};

const modes = [
  { id: "learn", label: "看图" },
  { id: "listen", label: "听音" },
  { id: "match", label: "配对" },
  { id: "speak", label: "跟读" }
];

const globalPraise = ["You tried!", "Great listening!", "Nice voice!", "So brave!", "Little English star!", "One more sparkle!"];

const learningThemes = ["听声音找图片", "看图片说英文", "亲子轮流点读", "颜色和动作小游戏", "睡前复习小挑战", "家里物品寻宝", "夸奖式跟读"];

const dailyLifeWords = [
  { word: "cat", cn: "小猫", category: "动物", visual: "🐱", bg: "sun" },
  { word: "dog", cn: "小狗", category: "动物", visual: "🐶", bg: "sky" },
  { word: "bird", cn: "小鸟", category: "动物", visual: "🐦", bg: "mint" },
  { word: "fish", cn: "鱼", category: "动物", visual: "🐟", bg: "sky" },
  { word: "apple", cn: "苹果", category: "食物", visual: "🍎", bg: "rose" },
  { word: "banana", cn: "香蕉", category: "食物", visual: "🍌", bg: "sun" },
  { word: "milk", cn: "牛奶", category: "食物", visual: "🥛", bg: "sky" },
  { word: "egg", cn: "鸡蛋", category: "食物", visual: "🥚", bg: "sun" },
  { word: "rice", cn: "米饭", category: "食物", visual: "🍚", bg: "mint" },
  { word: "water", cn: "水", category: "食物", visual: "💧", bg: "sky" },
  { word: "red", cn: "红色", category: "颜色", visual: "🔴", bg: "rose" },
  { word: "blue", cn: "蓝色", category: "颜色", visual: "🔵", bg: "sky" },
  { word: "green", cn: "绿色", category: "颜色", visual: "🟢", bg: "mint" },
  { word: "yellow", cn: "黄色", category: "颜色", visual: "🟡", bg: "sun" },
  { word: "eye", cn: "眼睛", category: "身体", visual: "👁️", bg: "sky" },
  { word: "hand", cn: "手", category: "身体", visual: "✋", bg: "sun" },
  { word: "nose", cn: "鼻子", category: "身体", visual: "👃", bg: "rose" },
  { word: "mouth", cn: "嘴巴", category: "身体", visual: "👄", bg: "rose" },
  { word: "foot", cn: "脚", category: "身体", visual: "🦶", bg: "mint" },
  { word: "ball", cn: "球", category: "玩具", visual: "⚽", bg: "mint" },
  { word: "car", cn: "小车", category: "玩具", visual: "🚗", bg: "rose" },
  { word: "teddy", cn: "玩具熊", category: "玩具", visual: "🧸", bg: "sun" },
  { word: "book", cn: "书", category: "家里", visual: "📘", bg: "sky" },
  { word: "bed", cn: "床", category: "家里", visual: "🛏️", bg: "mint" },
  { word: "chair", cn: "椅子", category: "家里", visual: "🪑", bg: "sun" },
  { word: "cup", cn: "杯子", category: "家里", visual: "🥤", bg: "rose" },
  { word: "spoon", cn: "勺子", category: "家里", visual: "🥄", bg: "sky" },
  { word: "shoes", cn: "鞋子", category: "衣物", visual: "👟", bg: "mint" },
  { word: "hat", cn: "帽子", category: "衣物", visual: "🧢", bg: "sky" },
  { word: "shirt", cn: "衣服", category: "衣物", visual: "👕", bg: "rose" },
  { word: "mom", cn: "妈妈", category: "家人", visual: "👩", bg: "rose" },
  { word: "dad", cn: "爸爸", category: "家人", visual: "👨", bg: "sky" },
  { word: "baby", cn: "宝宝", category: "家人", visual: "👶", bg: "mint" },
  { word: "grandma", cn: "奶奶", category: "家人", visual: "👵", bg: "sun" },
  { word: "hello", cn: "你好", category: "问候", visual: "👋", bg: "sun" },
  { word: "bye", cn: "再见", category: "问候", visual: "🙋", bg: "sky" },
  { word: "please", cn: "请", category: "表达", visual: "🙏", bg: "mint" },
  { word: "thanks", cn: "谢谢", category: "表达", visual: "💛", bg: "sun" },
  { word: "happy", cn: "开心", category: "感受", visual: "😊", bg: "sun" },
  { word: "sleep", cn: "睡觉", category: "日常", visual: "🌙", bg: "sky" },
  { word: "wash", cn: "洗一洗", category: "日常", visual: "🫧", bg: "mint" },
  { word: "eat", cn: "吃", category: "日常", visual: "🍽️", bg: "rose" }
];

function getLocalDateKey(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function dateFromKey(key) {
  const [year, month, day] = key.split("-").map(Number);
  return new Date(year, month - 1, day);
}

function dayOfYear(date) {
  const start = new Date(date.getFullYear(), 0, 0);
  return Math.floor((date.getTime() - start.getTime()) / 86400000);
}

function getDailyPlan(dateKey) {
  const date = dateFromKey(dateKey);
  const seed = dayOfYear(date);
  const monthShift = date.getMonth() * 5;
  const words = Array.from({ length: 4 }, (_, index) => dailyLifeWords[(seed + monthShift + index * 7) % dailyLifeWords.length]);

  return {
    dateKey,
    theme: learningThemes[seed % learningThemes.length],
    words,
    parentTip: `先听 ${words[0].word} 和 ${words[1].word}，再让孩子在家里找一找相关物品。`
  };
}

function addMonths(date, offset) {
  return new Date(date.getFullYear(), date.getMonth() + offset, 1);
}

function createCalendarDays(baseDate = new Date(), checkIns = {}) {
  const year = baseDate.getFullYear();
  const month = baseDate.getMonth();
  const first = new Date(year, month, 1);
  const totalDays = new Date(year, month + 1, 0).getDate();
  const leadingBlanks = first.getDay();
  return [
    ...Array.from({ length: leadingBlanks }, () => null),
    ...Array.from({ length: totalDays }, (_, index) => {
      const date = new Date(year, month, index + 1);
      const key = getLocalDateKey(date);
      return { day: index + 1, key, checked: Boolean(checkIns[key]), isToday: key === todayKey };
    })
  ];
}

function formatMonthTitle(date = new Date()) {
  return `${date.getFullYear()} 年 ${date.getMonth() + 1} 月`;
}

function getUpcomingPlans(days = 7) {
  return Array.from({ length: days }, (_, index) => {
    const date = new Date(today.getFullYear(), today.getMonth(), today.getDate() + index);
    return getDailyPlan(getLocalDateKey(date));
  });
}

function getCheckInStreak(checkIns, from = new Date()) {
  let streak = 0;
  const cursor = new Date(from.getFullYear(), from.getMonth(), from.getDate());
  while (checkIns[getLocalDateKey(cursor)]) {
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }
  return streak;
}

function createInitialProgress() {
  return { date: todayKey, stars: 0, completedIds: [], attempts: 0, recordings: 0, lastWords: [] };
}

function loadProgress() {
  const stored = wx.getStorageSync("little-english-progress");
  return stored && stored.date === todayKey ? stored : createInitialProgress();
}

function loadCheckIns() {
  return wx.getStorageSync("little-english-checkins") || {};
}

function sampleOptions(active, pool, count = 3) {
  const others = pool.filter((card) => card.id !== active.id);
  const shuffled = others.sort(() => Math.random() - 0.5).slice(0, count - 1);
  return [active, ...shuffled].sort(() => Math.random() - 0.5);
}

Page({
  data: {
    audienceMode: "kid",
    practiceMode: "learn",
    activeIndex: 0,
    activeCard: cards[0],
    categoryNames,
    modes,
    cards,
    options: sampleOptions(cards[0], cards),
    progress: createInitialProgress(),
    checkIns: {},
    praise: "Tap the picture!",
    starSlots: [0, 1, 2, 3, 4],
    weekLabels: ["日", "一", "二", "三", "四", "五", "六"],
    todayKey,
    monthCursor: today,
    monthTitle: formatMonthTitle(today),
    calendarDays: createCalendarDays(today),
    dailyPlan: getDailyPlan(todayKey),
    upcomingPlans: getUpcomingPlans(7),
    dailyLifeWords,
    checkedToday: false,
    streak: 0,
    recordingState: "idle",
    recordingPath: "",
    recordHint: "轻轻说一遍，妈妈爸爸只听努力。"
  },

  onLoad() {
    const progress = loadProgress();
    const checkIns = loadCheckIns();
    this.recorder = wx.getRecorderManager();
    this.recorder.onStop((res) => {
      const nextProgress = {
        ...this.data.progress,
        recordings: this.data.progress.recordings + 1
      };
      this.setData({
        recordingState: "ready",
        recordingPath: res.tempFilePath,
        recordHint: "Nice voice!",
        progress: nextProgress
      });
      wx.setStorageSync("little-english-progress", nextProgress);
      this.reward(this.data.activeCard, 2);
    });
    this.recorder.onError(() => {
      this.setData({ recordingState: "idle", recordHint: "录音没有成功，家长可以检查麦克风权限。" });
    });
    this.setData({
      progress,
      checkIns,
      checkedToday: Boolean(checkIns[todayKey]),
      streak: getCheckInStreak(checkIns),
      calendarDays: createCalendarDays(this.data.monthCursor, checkIns)
    });
  },

  switchAudience(event) {
    this.setData({ audienceMode: event.currentTarget.dataset.mode });
  },

  switchPractice(event) {
    this.setData({ practiceMode: event.currentTarget.dataset.mode });
  },

  playWord() {
    const word = this.data.activeCard.word;
    wx.vibrateShort({ type: "light" });
    wx.showToast({ title: word, icon: "none" });
  },

  playLibraryWord(event) {
    wx.vibrateShort({ type: "light" });
    wx.showToast({ title: event.currentTarget.dataset.word, icon: "none" });
  },

  chooseOption(event) {
    const id = event.currentTarget.dataset.id;
    if (id === this.data.activeCard.id) {
      this.reward(this.data.activeCard, 1);
    } else {
      wx.showToast({ title: "Listen again", icon: "none" });
      this.playWord();
    }
  },

  reward(card, extraStars = 1) {
    const praiseList = card.encouragements.length ? card.encouragements : globalPraise;
    const nextPraise = praiseList[Math.floor(Math.random() * praiseList.length)];
    const current = this.data.progress;
    const progress = {
      ...current,
      stars: current.stars + extraStars,
      attempts: current.attempts + 1,
      completedIds: current.completedIds.includes(card.id) ? current.completedIds : [...current.completedIds, card.id],
      lastWords: [card.word, ...current.lastWords.filter((word) => word !== card.word)].slice(0, 6)
    };
    this.setData({ praise: nextPraise, progress });
    wx.setStorageSync("little-english-progress", progress);
  },

  goNext() {
    const nextIndex = (this.data.activeIndex + 1) % cards.length;
    const currentMode = modes.findIndex((item) => item.id === this.data.practiceMode);
    const practiceMode = modes[(currentMode + 1) % modes.length].id;
    this.setData({
      activeIndex: nextIndex,
      activeCard: cards[nextIndex],
      practiceMode,
      options: sampleOptions(cards[nextIndex], cards),
      recordingPath: "",
      recordingState: "idle"
    });
  },

  goPrev() {
    const nextIndex = (this.data.activeIndex - 1 + cards.length) % cards.length;
    this.setData({
      activeIndex: nextIndex,
      activeCard: cards[nextIndex],
      options: sampleOptions(cards[nextIndex], cards),
      recordingPath: "",
      recordingState: "idle"
    });
  },

  goHome() {
    this.setData({ practiceMode: "learn" });
  },

  toggleRecord() {
    if (this.data.recordingState === "recording") {
      this.recorder.stop();
      return;
    }
    this.setData({ recordingState: "recording", recordHint: "正在听你说..." });
    this.recorder.start({ duration: 6000, format: "mp3", numberOfChannels: 1, sampleRate: 16000 });
  },

  playRecording() {
    if (!this.data.recordingPath) return;
    const audio = wx.createInnerAudioContext();
    audio.src = this.data.recordingPath;
    audio.play();
  },

  checkInToday() {
    const checkIns = { ...this.data.checkIns, [todayKey]: true };
    wx.setStorageSync("little-english-checkins", checkIns);
    this.setData({
      checkIns,
      checkedToday: true,
      streak: getCheckInStreak(checkIns),
      calendarDays: createCalendarDays(this.data.monthCursor, checkIns)
    });
    wx.showToast({ title: "打卡成功", icon: "success" });
  },

  prevMonth() {
    const monthCursor = addMonths(this.data.monthCursor, -1);
    this.setData({
      monthCursor,
      monthTitle: formatMonthTitle(monthCursor),
      calendarDays: createCalendarDays(monthCursor, this.data.checkIns)
    });
  },

  nextMonth() {
    const monthCursor = addMonths(this.data.monthCursor, 1);
    this.setData({
      monthCursor,
      monthTitle: formatMonthTitle(monthCursor),
      calendarDays: createCalendarDays(monthCursor, this.data.checkIns)
    });
  }
});
