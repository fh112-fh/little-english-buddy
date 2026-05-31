import React, { useEffect, useMemo, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  Baby,
  BarChart3,
  BookOpen,
  CalendarDays,
  Check,
  ChevronLeft,
  ChevronRight,
  Heart,
  Home,
  Mic,
  Pause,
  Play,
  RotateCcw,
  Sparkles,
  Star,
  UserRound,
  Volume2,
} from "lucide-react";
import "./styles.css";

type Category = "animals" | "food" | "colors" | "body" | "toys" | "family";
type PracticeMode = "learn" | "listen" | "match" | "speak";
type AudienceMode = "kid" | "parent";

type WordCard = {
  id: string;
  word: string;
  cn: string;
  category: Category;
  visual: string;
  bg: string;
  phrase: string;
  encouragements: string[];
};

type LibraryWord = {
  word: string;
  cn: string;
  category: string;
  visual: string;
  bg: string;
};

type ProgressState = {
  date: string;
  stars: number;
  completedIds: string[];
  attempts: number;
  recordings: number;
  lastWords: string[];
};

type CheckInState = Record<string, true>;

type RecordingState = "idle" | "recording" | "ready" | "blocked" | "unsupported" | "insecure";

const cards: WordCard[] = [
  {
    id: "cat",
    word: "cat",
    cn: "小猫",
    category: "animals",
    visual: "🐱",
    bg: "sun",
    phrase: "A soft cat",
    encouragements: ["Great listening!", "Sweet cat voice!", "You found cat!"],
  },
  {
    id: "dog",
    word: "dog",
    cn: "小狗",
    category: "animals",
    visual: "🐶",
    bg: "sky",
    phrase: "A happy dog",
    encouragements: ["Nice dog sound!", "You tried so well!", "Happy speaking!"],
  },
  {
    id: "bird",
    word: "bird",
    cn: "小鸟",
    category: "animals",
    visual: "🐦",
    bg: "mint",
    phrase: "A blue bird",
    encouragements: ["Bright listening!", "Lovely bird!", "You are flying!"],
  },
  {
    id: "apple",
    word: "apple",
    cn: "苹果",
    category: "food",
    visual: "🍎",
    bg: "rose",
    phrase: "A red apple",
    encouragements: ["Crunchy good job!", "Apple star!", "You said apple!"],
  },
  {
    id: "banana",
    word: "banana",
    cn: "香蕉",
    category: "food",
    visual: "🍌",
    bg: "sun",
    phrase: "A yellow banana",
    encouragements: ["Banana smile!", "Great try!", "Sunny speaking!"],
  },
  {
    id: "milk",
    word: "milk",
    cn: "牛奶",
    category: "food",
    visual: "🥛",
    bg: "sky",
    phrase: "A cup of milk",
    encouragements: ["Gentle voice!", "Nice milk!", "You listened carefully!"],
  },
  {
    id: "red",
    word: "red",
    cn: "红色",
    category: "colors",
    visual: "🔴",
    bg: "rose",
    phrase: "Red circle",
    encouragements: ["Red star!", "You spotted it!", "Great color ears!"],
  },
  {
    id: "blue",
    word: "blue",
    cn: "蓝色",
    category: "colors",
    visual: "🔵",
    bg: "sky",
    phrase: "Blue circle",
    encouragements: ["Blue sparkle!", "Nice choice!", "Great listening!"],
  },
  {
    id: "green",
    word: "green",
    cn: "绿色",
    category: "colors",
    visual: "🟢",
    bg: "mint",
    phrase: "Green circle",
    encouragements: ["Green power!", "You got it!", "Lovely color!"],
  },
  {
    id: "eye",
    word: "eye",
    cn: "眼睛",
    category: "body",
    visual: "👁️",
    bg: "sky",
    phrase: "My eye",
    encouragements: ["Good looking!", "Eye star!", "You said it clearly!"],
  },
  {
    id: "hand",
    word: "hand",
    cn: "手",
    category: "body",
    visual: "✋",
    bg: "sun",
    phrase: "My hand",
    encouragements: ["High five!", "Nice hand!", "You tried bravely!"],
  },
  {
    id: "nose",
    word: "nose",
    cn: "鼻子",
    category: "body",
    visual: "👃",
    bg: "rose",
    phrase: "My nose",
    encouragements: ["Nose star!", "Soft speaking!", "Wonderful try!"],
  },
  {
    id: "ball",
    word: "ball",
    cn: "球",
    category: "toys",
    visual: "⚽",
    bg: "mint",
    phrase: "A round ball",
    encouragements: ["Bounce bounce!", "Great ball!", "You listened so well!"],
  },
  {
    id: "car",
    word: "car",
    cn: "小车",
    category: "toys",
    visual: "🚗",
    bg: "rose",
    phrase: "A little car",
    encouragements: ["Zoom! Nice job!", "Car star!", "You said car!"],
  },
  {
    id: "teddy",
    word: "teddy",
    cn: "玩具熊",
    category: "toys",
    visual: "🧸",
    bg: "sun",
    phrase: "A soft teddy",
    encouragements: ["Cozy voice!", "Teddy likes it!", "You tried kindly!"],
  },
  {
    id: "mom",
    word: "mom",
    cn: "妈妈",
    category: "family",
    visual: "👩",
    bg: "rose",
    phrase: "My mom",
    encouragements: ["Warm voice!", "Mom star!", "Lovely speaking!"],
  },
  {
    id: "dad",
    word: "dad",
    cn: "爸爸",
    category: "family",
    visual: "👨",
    bg: "sky",
    phrase: "My dad",
    encouragements: ["Dad heard you!", "Great try!", "Strong listening!"],
  },
  {
    id: "baby",
    word: "baby",
    cn: "宝宝",
    category: "family",
    visual: "👶",
    bg: "mint",
    phrase: "A little baby",
    encouragements: ["Baby smile!", "Gentle speaking!", "You did it!"],
  },
];

const categoryNames: Record<Category, string> = {
  animals: "动物",
  food: "食物",
  colors: "颜色",
  body: "身体",
  toys: "玩具",
  family: "家人",
};

const modes: { id: PracticeMode; label: string }[] = [
  { id: "learn", label: "看图" },
  { id: "listen", label: "听音" },
  { id: "match", label: "配对" },
  { id: "speak", label: "跟读" },
];

const globalPraise = [
  "You tried!",
  "Great listening!",
  "Nice voice!",
  "So brave!",
  "Little English star!",
  "One more sparkle!",
];

const todayKey = new Date().toISOString().slice(0, 10);
const learningThemes = [
  "听声音找图片",
  "看图片说英文",
  "亲子轮流点读",
  "颜色和动作小游戏",
  "睡前复习小挑战",
  "家里物品寻宝",
  "夸奖式跟读",
];

const dailyLifeWords: LibraryWord[] = [
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
  { word: "eat", cn: "吃", category: "日常", visual: "🍽️", bg: "rose" },
];

function getLocalDateKey(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function loadCheckIns(): CheckInState {
  try {
    const raw = localStorage.getItem("little-english-checkins");
    return raw ? (JSON.parse(raw) as CheckInState) : {};
  } catch {
    return {};
  }
}

function createCalendarDays(baseDate = new Date()) {
  const year = baseDate.getFullYear();
  const month = baseDate.getMonth();
  const first = new Date(year, month, 1);
  const totalDays = new Date(year, month + 1, 0).getDate();
  const leadingBlanks = first.getDay();

  return [
    ...Array.from({ length: leadingBlanks }, () => null),
    ...Array.from({ length: totalDays }, (_, index) => {
      const date = new Date(year, month, index + 1);
      return {
        day: index + 1,
        key: getLocalDateKey(date),
      };
    }),
  ];
}

function addMonths(date: Date, offset: number) {
  return new Date(date.getFullYear(), date.getMonth() + offset, 1);
}

function getCheckInStreak(checkIns: CheckInState, from = new Date()) {
  let streak = 0;
  const cursor = new Date(from.getFullYear(), from.getMonth(), from.getDate());

  while (checkIns[getLocalDateKey(cursor)]) {
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }

  return streak;
}

function formatMonthTitle(date = new Date()) {
  return `${date.getFullYear()} 年 ${date.getMonth() + 1} 月`;
}

function dateFromKey(key: string) {
  const [year, month, day] = key.split("-").map(Number);
  return new Date(year, month - 1, day);
}

function dayOfYear(date: Date) {
  const start = new Date(date.getFullYear(), 0, 0);
  return Math.floor((date.getTime() - start.getTime()) / 86400000);
}

function getDailyPlan(dateKey: string) {
  const date = dateFromKey(dateKey);
  const seed = dayOfYear(date);
  const monthShift = date.getMonth() * 5;
  const words = Array.from(
    { length: 4 },
    (_, index) => dailyLifeWords[(seed + monthShift + index * 7) % dailyLifeWords.length],
  );
  const categories = Array.from(new Set(words.map((card) => card.category)));

  return {
    dateKey,
    theme: learningThemes[seed % learningThemes.length],
    words,
    categories,
    parentTip: `先听 ${words[0].word} 和 ${words[1].word}，再让孩子在家里找一找相关物品。`,
  };
}

function getUpcomingPlans(days = 7) {
  const start = new Date();

  return Array.from({ length: days }, (_, index) => {
    const date = new Date(start.getFullYear(), start.getMonth(), start.getDate() + index);
    return getDailyPlan(getLocalDateKey(date));
  });
}

function createInitialProgress(): ProgressState {
  return {
    date: todayKey,
    stars: 0,
    completedIds: [],
    attempts: 0,
    recordings: 0,
    lastWords: [],
  };
}

function loadProgress(): ProgressState {
  try {
    const raw = localStorage.getItem("little-english-progress");
    if (!raw) return createInitialProgress();
    const parsed = JSON.parse(raw) as ProgressState;
    return parsed.date === todayKey ? parsed : createInitialProgress();
  } catch {
    return createInitialProgress();
  }
}

function speak(text: string) {
  if (!("speechSynthesis" in window)) return false;
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "en-US";
  utterance.rate = 0.78;
  utterance.pitch = 1.12;
  window.speechSynthesis.speak(utterance);
  return true;
}

function sampleOptions(active: WordCard, pool: WordCard[], count = 3) {
  const others = pool.filter((card) => card.id !== active.id);
  const shuffled = [...others].sort(() => Math.random() - 0.5).slice(0, count - 1);
  return [active, ...shuffled].sort(() => Math.random() - 0.5);
}

function App() {
  const [audienceMode, setAudienceMode] = useState<AudienceMode>("kid");
  const [practiceMode, setPracticeMode] = useState<PracticeMode>("learn");
  const [activeIndex, setActiveIndex] = useState(0);
  const [progress, setProgress] = useState<ProgressState>(loadProgress);
  const [checkIns, setCheckIns] = useState<CheckInState>(loadCheckIns);
  const [praise, setPraise] = useState("Tap the picture!");
  const [soundMissing, setSoundMissing] = useState(false);

  const activeCard = cards[activeIndex];
  const todaysCards = useMemo(() => cards.slice(0, 8), []);
  const visibleCards = audienceMode === "parent" ? todaysCards : cards;
  const options = useMemo(() => sampleOptions(activeCard, cards), [activeCard]);

  useEffect(() => {
    localStorage.setItem("little-english-progress", JSON.stringify(progress));
  }, [progress]);

  useEffect(() => {
    localStorage.setItem("little-english-checkins", JSON.stringify(checkIns));
  }, [checkIns]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      const ok = speak(activeCard.word);
      setSoundMissing(!ok);
    }, 250);
    return () => window.clearTimeout(timer);
  }, [activeCard.id]);

  function reward(card = activeCard, extraStars = 1) {
    const nextPraise =
      card.encouragements[Math.floor(Math.random() * card.encouragements.length)] ||
      globalPraise[Math.floor(Math.random() * globalPraise.length)];
    setPraise(nextPraise);
    setProgress((current) => ({
      ...current,
      stars: current.stars + extraStars,
      attempts: current.attempts + 1,
      completedIds: current.completedIds.includes(card.id)
        ? current.completedIds
        : [...current.completedIds, card.id],
      lastWords: [card.word, ...current.lastWords.filter((word) => word !== card.word)].slice(0, 6),
    }));
  }

  function goNext() {
    setActiveIndex((index) => (index + 1) % visibleCards.length);
    setPracticeMode((mode) => {
      const current = modes.findIndex((item) => item.id === mode);
      return modes[(current + 1) % modes.length].id;
    });
  }

  function goPrev() {
    setActiveIndex((index) => (index - 1 + visibleCards.length) % visibleCards.length);
  }

  function selectCard(card: WordCard) {
    const nextIndex = cards.findIndex((item) => item.id === card.id);
    setActiveIndex(nextIndex >= 0 ? nextIndex : 0);
    setPracticeMode("learn");
  }

  function resetToday() {
    setProgress(createInitialProgress());
    setPraise("Fresh start!");
  }

  function checkInToday() {
    const key = getLocalDateKey();
    setCheckIns((current) => ({ ...current, [key]: true }));
  }

  return (
    <main className="app-shell">
      <header className="topbar">
        <button
          className={`mode-pill ${audienceMode === "kid" ? "active" : ""}`}
          onClick={() => setAudienceMode("kid")}
          aria-label="儿童模式"
        >
          <Baby size={20} />
          <span>孩子</span>
        </button>
        <div className="brand">
          <Sparkles size={18} />
          <span>Little English</span>
        </div>
        <button
          className={`mode-pill ${audienceMode === "parent" ? "active" : ""}`}
          onClick={() => setAudienceMode("parent")}
          aria-label="家长模式"
        >
          <UserRound size={20} />
          <span>家长</span>
        </button>
      </header>

      {audienceMode === "kid" ? (
        <KidView
          activeCard={activeCard}
          practiceMode={practiceMode}
          setPracticeMode={setPracticeMode}
          progress={progress}
          praise={praise}
          soundMissing={soundMissing}
          options={options}
          onSpeak={() => setSoundMissing(!speak(activeCard.word))}
          onReward={reward}
          onNext={goNext}
          onPrev={goPrev}
          onRecordingComplete={() => {
            setProgress((current) => ({ ...current, recordings: current.recordings + 1 }));
            reward(activeCard, 2);
          }}
        />
      ) : (
        <ParentView
          cards={todaysCards}
          progress={progress}
          checkIns={checkIns}
          activeCard={activeCard}
          onSelectCard={selectCard}
          onSpeak={(word) => setSoundMissing(!speak(word))}
          onReset={resetToday}
          onCheckIn={checkInToday}
        />
      )}
    </main>
  );
}

function KidView({
  activeCard,
  practiceMode,
  setPracticeMode,
  progress,
  praise,
  soundMissing,
  options,
  onSpeak,
  onReward,
  onNext,
  onPrev,
  onRecordingComplete,
}: {
  activeCard: WordCard;
  practiceMode: PracticeMode;
  setPracticeMode: (mode: PracticeMode) => void;
  progress: ProgressState;
  praise: string;
  soundMissing: boolean;
  options: WordCard[];
  onSpeak: () => void;
  onReward: (card?: WordCard, extraStars?: number) => void;
  onNext: () => void;
  onPrev: () => void;
  onRecordingComplete: () => void;
}) {
  return (
    <section className="kid-view">
      <div className="star-row" aria-label={`今日获得 ${progress.stars} 颗星`}>
        {Array.from({ length: 5 }).map((_, index) => (
          <Star key={index} size={22} className={index < Math.min(progress.stars, 5) ? "filled" : ""} />
        ))}
        <span>{progress.stars}</span>
      </div>

      <div className="mode-tabs" role="tablist" aria-label="练习方式">
        {modes.map((mode) => (
          <button
            key={mode.id}
            className={practiceMode === mode.id ? "active" : ""}
            onClick={() => setPracticeMode(mode.id)}
            role="tab"
            aria-selected={practiceMode === mode.id}
          >
            {mode.label}
          </button>
        ))}
      </div>

      <WordStage card={activeCard} practiceMode={practiceMode} onSpeak={onSpeak} />

      {soundMissing && (
        <div className="soft-alert">
          当前浏览器没有打开英文发音，家长可以检查静音开关或浏览器权限。
        </div>
      )}

      {practiceMode === "learn" && (
        <div className="action-grid single">
          <button className="primary-action" onClick={onSpeak}>
            <Volume2 size={28} />
            <span>听一听</span>
          </button>
        </div>
      )}

      {practiceMode === "listen" && (
        <div className="choice-grid visual">
          {options.map((card) => (
            <button
              key={card.id}
              className={`choice-card ${card.bg}`}
              onClick={() => (card.id === activeCard.id ? onReward(card, 1) : onSpeak())}
              aria-label={card.cn}
            >
              <span className="mini-visual">{card.visual}</span>
            </button>
          ))}
        </div>
      )}

      {practiceMode === "match" && (
        <div className="choice-grid words">
          {options.map((card) => (
            <button
              key={card.id}
              className="word-choice"
              onClick={() => (card.id === activeCard.id ? onReward(card, 1) : onSpeak())}
            >
              {card.word}
            </button>
          ))}
        </div>
      )}

      {practiceMode === "speak" && (
        <Recorder card={activeCard} onComplete={onRecordingComplete} />
      )}

      <div className="praise-bubble">
        <Heart size={22} />
        <span>{praise}</span>
      </div>

      <nav className="bottom-controls" aria-label="切换词卡">
        <button onClick={onPrev} aria-label="上一个">
          <ChevronLeft size={30} />
        </button>
        <button className="home-button" onClick={() => setPracticeMode("learn")} aria-label="回到看图">
          <Home size={28} />
        </button>
        <button onClick={onNext} aria-label="下一个">
          <ChevronRight size={30} />
        </button>
      </nav>
    </section>
  );
}

function WordStage({
  card,
  practiceMode,
  onSpeak,
}: {
  card: WordCard;
  practiceMode: PracticeMode;
  onSpeak: () => void;
}) {
  return (
    <button className={`word-stage ${card.bg}`} onClick={onSpeak} aria-label={`播放 ${card.word}`}>
      <span className="category">{categoryNames[card.category]}</span>
      <span className="visual">{card.visual}</span>
      <span className="word">{card.word}</span>
      <span className="hint">{practiceMode === "learn" ? card.cn : card.phrase}</span>
      <span className="tap-cue">
        <Volume2 size={18} />
        tap
      </span>
    </button>
  );
}

function Recorder({
  card,
  onComplete,
}: {
  card: WordCard;
  onComplete: () => void;
}) {
  const [state, setState] = useState<RecordingState>("idle");
  const [recordingUrl, setRecordingUrl] = useState("");
  const [seconds, setSeconds] = useState(0);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<BlobPart[]>([]);
  const timerRef = useRef<number | null>(null);
  const stopTimerRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) window.clearInterval(timerRef.current);
      if (stopTimerRef.current) window.clearTimeout(stopTimerRef.current);
      if (recordingUrl) URL.revokeObjectURL(recordingUrl);
      recorderRef.current?.stream.getTracks().forEach((track) => track.stop());
    };
  }, [recordingUrl]);

  async function start() {
    if (!window.isSecureContext) {
      setState("insecure");
      return;
    }

    if (!("MediaRecorder" in window) || !navigator.mediaDevices?.getUserMedia) {
      setState("unsupported");
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      chunksRef.current = [];
      recorderRef.current = recorder;
      recorder.ondataavailable = (event) => chunksRef.current.push(event.data);
      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: recorder.mimeType || "audio/webm" });
        if (recordingUrl) URL.revokeObjectURL(recordingUrl);
        setRecordingUrl(URL.createObjectURL(blob));
        setState("ready");
        onComplete();
        stream.getTracks().forEach((track) => track.stop());
      };
      recorder.start();
      setSeconds(0);
      setState("recording");
      timerRef.current = window.setInterval(() => setSeconds((value) => value + 1), 1000);
      stopTimerRef.current = window.setTimeout(() => stop(), 4000);
    } catch {
      setState("blocked");
    }
  }

  function stop() {
    if (timerRef.current) window.clearInterval(timerRef.current);
    if (stopTimerRef.current) window.clearTimeout(stopTimerRef.current);
    if (recorderRef.current?.state === "recording") {
      recorderRef.current.stop();
    }
  }

  return (
    <div className="recorder">
      <div className="repeat-line">
        <span>Say:</span>
        <strong>{card.word}</strong>
      </div>
      {state === "recording" ? (
        <button className="record-button active" onClick={stop}>
          <Pause size={30} />
          <span>{Math.max(seconds, 1)}s 完成</span>
        </button>
      ) : (
        <button className="record-button" onClick={start}>
          <Mic size={30} />
          <span>说一说</span>
        </button>
      )}

      {recordingUrl && (
        <audio className="playback" controls src={recordingUrl}>
          <track kind="captions" />
        </audio>
      )}

      {state === "ready" && <p className="record-note">Nice voice! 只要开口就值得一颗大星星。</p>}
      {state === "blocked" && <p className="record-note">麦克风没有打开。家长可以允许浏览器使用麦克风。</p>}
      {state === "unsupported" && <p className="record-note">这个浏览器暂时不支持录音，可以先听和点选。</p>}
      {state === "insecure" && (
        <p className="record-note">
          当前不是 HTTPS 安全页面，微信可能不能直接录音。孩子说完后点下面，也会获得鼓励。
        </p>
      )}
      {(state === "blocked" || state === "unsupported" || state === "insecure") && (
        <button className="fallback-said" onClick={onComplete}>
          <Check size={22} />
          <span>我说完了</span>
        </button>
      )}
    </div>
  );
}

function ParentView({
  cards,
  progress,
  checkIns,
  activeCard,
  onSelectCard,
  onSpeak,
  onReset,
  onCheckIn,
}: {
  cards: WordCard[];
  progress: ProgressState;
  checkIns: CheckInState;
  activeCard: WordCard;
  onSelectCard: (card: WordCard) => void;
  onSpeak: (word: string) => void;
  onReset: () => void;
  onCheckIn: () => void;
}) {
  const completedCount = progress.completedIds.length;
  const minutesLeft = Math.max(1, 5 - Math.floor(progress.attempts / 2));
  const today = getLocalDateKey();
  const [selectedPlanKey, setSelectedPlanKey] = useState(today);
  const [calendarMonth, setCalendarMonth] = useState(
    () => new Date(new Date().getFullYear(), new Date().getMonth(), 1),
  );
  const checkedToday = Boolean(checkIns[today]);
  const streak = getCheckInStreak(checkIns);
  const selectedPlan = getDailyPlan(selectedPlanKey);
  const upcomingPlans = getUpcomingPlans();

  return (
    <section className="parent-view">
      <div className="parent-hero">
        <div>
          <p className="eyebrow">今日 5 分钟</p>
          <h1>先让孩子觉得“我敢说”。</h1>
          <p>今天建议玩 8 张词卡。每张卡先听两遍，再让孩子点图或跟读，家长只负责夸具体行为。</p>
        </div>
        <div className="parent-score" aria-label="今日进度">
          <Star className="filled" size={28} />
          <strong>{progress.stars}</strong>
          <span>stars</span>
        </div>
      </div>

      <div className="stats-grid">
        <Metric icon={<Check size={22} />} label="练过词卡" value={`${completedCount}/8`} />
        <Metric icon={<Mic size={22} />} label="开口次数" value={`${progress.recordings}`} />
        <Metric icon={<BarChart3 size={22} />} label="继续时长" value={`${minutesLeft} 分钟`} />
      </div>

      <section className="parent-panel calendar-panel">
        <div className="panel-head">
          <h2>打卡日历</h2>
          <button
            className={`checkin-button ${checkedToday ? "done" : ""}`}
            onClick={onCheckIn}
            disabled={checkedToday}
          >
            {checkedToday ? <Check size={18} /> : <CalendarDays size={18} />}
            {checkedToday ? "已打卡" : "今日打卡"}
          </button>
        </div>
        <div className="month-switcher">
          <button onClick={() => setCalendarMonth((current) => addMonths(current, -1))} aria-label="上个月">
            <ChevronLeft size={20} />
          </button>
          <strong>{formatMonthTitle(calendarMonth)}</strong>
          <button onClick={() => setCalendarMonth((current) => addMonths(current, 1))} aria-label="下个月">
            <ChevronRight size={20} />
          </button>
        </div>
        <div className="calendar-summary">
          <strong>{selectedPlan.dateKey.slice(5).replace("-", "/")} 学习计划</strong>
          <span>连续 {streak} 天</span>
        </div>
        <div className="calendar-grid" aria-label="本月打卡日历">
          {["日", "一", "二", "三", "四", "五", "六"].map((day) => (
            <span className="weekday" key={day}>
              {day}
            </span>
          ))}
          {createCalendarDays(calendarMonth).map((item, index) =>
            item ? (
              <button
                key={item.key}
                className={`calendar-day ${item.key === today ? "today" : ""} ${
                  checkIns[item.key] ? "checked" : ""
                } ${item.key === selectedPlanKey ? "selected" : ""}`}
                onClick={() => setSelectedPlanKey(item.key)}
                aria-label={`${item.day} 日学习计划`}
              >
                {item.day}
              </button>
            ) : (
              <span className="calendar-day blank" key={`blank-${index}`} />
            ),
          )}
        </div>
      </section>

      <section className="parent-panel library-panel">
        <div className="panel-head">
          <h2>学习内容库</h2>
          <span className="library-date">{selectedPlan.dateKey.slice(5).replace("-", "/")}</span>
        </div>
        <div className="plan-card">
          <div className="plan-title">
            <BookOpen size={20} />
            <div>
              <strong>{selectedPlan.theme}</strong>
              <small>{selectedPlan.categories.join(" / ")}</small>
            </div>
          </div>
          <div className="plan-words">
            {selectedPlan.words.map((card) => (
              <div
                key={card.word}
                className={`plan-word ${card.bg}`}
              >
                <span>{card.visual}</span>
                <strong>{card.word}</strong>
                <small>{card.cn}</small>
              </div>
            ))}
          </div>
          <p className="plan-tip">{selectedPlan.parentTip}</p>
        </div>
        <div className="upcoming-list" aria-label="未来学习内容">
          {upcomingPlans.map((plan) => (
            <button
              key={plan.dateKey}
              className={`upcoming-item ${plan.dateKey === selectedPlanKey ? "active" : ""}`}
              onClick={() => setSelectedPlanKey(plan.dateKey)}
            >
              <span>{plan.dateKey.slice(5).replace("-", "/")}</span>
              <strong>{plan.theme}</strong>
              <small>{plan.words.map((word) => word.word).join(" · ")}</small>
            </button>
          ))}
        </div>
      </section>

      <section className="parent-panel">
        <div className="panel-head">
          <h2>今日词卡</h2>
          <button className="text-button" onClick={onReset}>
            <RotateCcw size={18} />
            重来
          </button>
        </div>
        <div className="daily-list">
          {cards.map((card) => (
            <div
              key={card.id}
              className={`daily-card ${card.id === activeCard.id ? "active" : ""}`}
            >
              <button className="daily-pick" onClick={() => onSelectCard(card)}>
                <span className={`daily-visual ${card.bg}`}>{card.visual}</span>
                <span>
                  <strong>{card.word}</strong>
                  <small>{card.cn}</small>
                </span>
              </button>
              <button
                className="sound-dot"
                onClick={() => onSpeak(card.word)}
                aria-label={`播放 ${card.word}`}
              >
                <Play size={16} />
              </button>
            </div>
          ))}
        </div>
      </section>

      <section className="coach-panel">
        <h2>家长夸奖脚本</h2>
        <div className="coach-lines">
          <p>“你刚才很认真在听 cat。”</p>
          <p>“你愿意试着说出来，已经很棒了。”</p>
          <p>“我们再玩一张就休息。”</p>
        </div>
      </section>
    </section>
  );
}

function Metric({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="metric">
      <span>{icon}</span>
      <small>{label}</small>
      <strong>{value}</strong>
    </div>
  );
}

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
