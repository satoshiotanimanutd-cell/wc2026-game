'use client';
import { useState, useEffect, useMemo } from 'react';

// ─── 全104試合データ（JST） ───────────────────────────────
const ALL_MATCHES = [
  // グループステージ
  {id:1,  home:'メキシコ',     away:'南アフリカ',   kickoff:'2026-06-12T04:00:00+09:00', stage:'グループA'},
  {id:2,  home:'韓国',         away:'チェコ',        kickoff:'2026-06-12T11:00:00+09:00', stage:'グループA'},
  {id:3,  home:'カナダ',       away:'ボスニア',      kickoff:'2026-06-13T04:00:00+09:00', stage:'グループB'},
  {id:4,  home:'アメリカ',     away:'パラグアイ',    kickoff:'2026-06-13T10:00:00+09:00', stage:'グループD'},
  {id:5,  home:'カタール',     away:'スイス',        kickoff:'2026-06-14T04:00:00+09:00', stage:'グループB'},
  {id:6,  home:'ブラジル',     away:'モロッコ',      kickoff:'2026-06-14T07:00:00+09:00', stage:'グループC'},
  {id:7,  home:'ハイチ',       away:'スコットランド',kickoff:'2026-06-14T10:00:00+09:00', stage:'グループC'},
  {id:8,  home:'オーストラリア',away:'トルコ',       kickoff:'2026-06-14T13:00:00+09:00', stage:'グループD'},
  {id:9,  home:'ドイツ',       away:'キュラソー',    kickoff:'2026-06-15T02:00:00+09:00', stage:'グループE'},
  {id:10, home:'オランダ',     away:'日本',          kickoff:'2026-06-15T05:00:00+09:00', stage:'グループF'},
  {id:11, home:'コートジボワール',away:'エクアドル', kickoff:'2026-06-15T08:00:00+09:00', stage:'グループE'},
  {id:12, home:'スウェーデン', away:'チュニジア',    kickoff:'2026-06-15T11:00:00+09:00', stage:'グループF'},
  {id:13, home:'スペイン',     away:'カーボベルデ',  kickoff:'2026-06-16T01:00:00+09:00', stage:'グループH'},
  {id:14, home:'ベルギー',     away:'エジプト',      kickoff:'2026-06-16T04:00:00+09:00', stage:'グループG'},
  {id:15, home:'サウジアラビア',away:'ウルグアイ',   kickoff:'2026-06-16T07:00:00+09:00', stage:'グループH'},
  {id:16, home:'イラン',       away:'ニュージーランド',kickoff:'2026-06-16T10:00:00+09:00',stage:'グループG'},
  {id:17, home:'フランス',     away:'セネガル',      kickoff:'2026-06-17T04:00:00+09:00', stage:'グループI'},
  {id:18, home:'イラク',       away:'ノルウェー',    kickoff:'2026-06-17T07:00:00+09:00', stage:'グループI'},
  {id:19, home:'アルゼンチン', away:'アルジェリア',  kickoff:'2026-06-17T10:00:00+09:00', stage:'グループJ'},
  {id:20, home:'オーストリア', away:'ヨルダン',      kickoff:'2026-06-17T13:00:00+09:00', stage:'グループJ'},
  {id:21, home:'ポルトガル',   away:'コンゴDR',      kickoff:'2026-06-18T02:00:00+09:00', stage:'グループK'},
  {id:22, home:'イングランド', away:'クロアチア',    kickoff:'2026-06-18T05:00:00+09:00', stage:'グループL'},
  {id:23, home:'ガーナ',       away:'パナマ',        kickoff:'2026-06-18T08:00:00+09:00', stage:'グループL'},
  {id:24, home:'ウズベキスタン',away:'コロンビア',   kickoff:'2026-06-18T11:00:00+09:00', stage:'グループK'},
  {id:25, home:'チェコ',       away:'南アフリカ',    kickoff:'2026-06-19T01:00:00+09:00', stage:'グループA'},
  {id:26, home:'スイス',       away:'ボスニア',      kickoff:'2026-06-19T04:00:00+09:00', stage:'グループB'},
  {id:27, home:'カナダ',       away:'カタール',      kickoff:'2026-06-19T07:00:00+09:00', stage:'グループB'},
  {id:28, home:'メキシコ',     away:'韓国',          kickoff:'2026-06-19T10:00:00+09:00', stage:'グループA'},
  {id:29, home:'アメリカ',     away:'オーストラリア',kickoff:'2026-06-20T04:00:00+09:00', stage:'グループD'},
  {id:30, home:'スコットランド',away:'モロッコ',     kickoff:'2026-06-20T07:00:00+09:00', stage:'グループC'},
  {id:31, home:'ブラジル',     away:'ハイチ',        kickoff:'2026-06-20T09:30:00+09:00', stage:'グループC'},
  {id:32, home:'トルコ',       away:'パラグアイ',    kickoff:'2026-06-20T12:00:00+09:00', stage:'グループD'},
  {id:33, home:'オランダ',     away:'スウェーデン',  kickoff:'2026-06-21T02:00:00+09:00', stage:'グループF'},
  {id:34, home:'ドイツ',       away:'コートジボワール',kickoff:'2026-06-21T05:00:00+09:00',stage:'グループE'},
  {id:35, home:'エクアドル',   away:'キュラソー',    kickoff:'2026-06-21T09:00:00+09:00', stage:'グループE'},
  {id:36, home:'チュニジア',   away:'日本',          kickoff:'2026-06-21T13:00:00+09:00', stage:'グループF'},
  {id:37, home:'スペイン',     away:'サウジアラビア',kickoff:'2026-06-22T01:00:00+09:00', stage:'グループH'},
  {id:38, home:'ベルギー',     away:'イラン',        kickoff:'2026-06-22T04:00:00+09:00', stage:'グループG'},
  {id:39, home:'ウルグアイ',   away:'カーボベルデ',  kickoff:'2026-06-22T07:00:00+09:00', stage:'グループH'},
  {id:40, home:'ニュージーランド',away:'エジプト',   kickoff:'2026-06-22T10:00:00+09:00', stage:'グループG'},
  {id:41, home:'アルゼンチン', away:'オーストリア',  kickoff:'2026-06-23T02:00:00+09:00', stage:'グループJ'},
  {id:42, home:'フランス',     away:'イラク',        kickoff:'2026-06-23T06:00:00+09:00', stage:'グループI'},
  {id:43, home:'ノルウェー',   away:'セネガル',      kickoff:'2026-06-23T09:00:00+09:00', stage:'グループI'},
  {id:44, home:'ヨルダン',     away:'アルジェリア',  kickoff:'2026-06-23T12:00:00+09:00', stage:'グループJ'},
  {id:45, home:'ポルトガル',   away:'ウズベキスタン',kickoff:'2026-06-24T02:00:00+09:00', stage:'グループK'},
  {id:46, home:'イングランド', away:'ガーナ',        kickoff:'2026-06-24T05:00:00+09:00', stage:'グループL'},
  {id:47, home:'パナマ',       away:'クロアチア',    kickoff:'2026-06-24T08:00:00+09:00', stage:'グループL'},
  {id:48, home:'コロンビア',   away:'コンゴDR',      kickoff:'2026-06-24T11:00:00+09:00', stage:'グループK'},
  {id:49, home:'スイス',       away:'カナダ',        kickoff:'2026-06-25T04:00:00+09:00', stage:'グループB'},
  {id:50, home:'ボスニア',     away:'カタール',      kickoff:'2026-06-25T04:00:00+09:00', stage:'グループB'},
  {id:51, home:'モロッコ',     away:'ハイチ',        kickoff:'2026-06-25T07:00:00+09:00', stage:'グループC'},
  {id:52, home:'スコットランド',away:'ブラジル',     kickoff:'2026-06-25T07:00:00+09:00', stage:'グループC'},
  {id:53, home:'南アフリカ',   away:'韓国',          kickoff:'2026-06-25T10:00:00+09:00', stage:'グループA'},
  {id:54, home:'チェコ',       away:'メキシコ',      kickoff:'2026-06-25T10:00:00+09:00', stage:'グループA'},
  {id:55, home:'キュラソー',   away:'コートジボワール',kickoff:'2026-06-26T05:00:00+09:00',stage:'グループE'},
  {id:56, home:'エクアドル',   away:'ドイツ',        kickoff:'2026-06-26T05:00:00+09:00', stage:'グループE'},
  {id:57, home:'チュニジア',   away:'オランダ',      kickoff:'2026-06-26T08:00:00+09:00', stage:'グループF'},
  {id:58, home:'日本',         away:'スウェーデン',  kickoff:'2026-06-26T08:00:00+09:00', stage:'グループF'},
  {id:59, home:'トルコ',       away:'アメリカ',      kickoff:'2026-06-26T11:00:00+09:00', stage:'グループD'},
  {id:60, home:'パラグアイ',   away:'オーストラリア',kickoff:'2026-06-26T11:00:00+09:00', stage:'グループD'},
  {id:61, home:'ノルウェー',   away:'フランス',      kickoff:'2026-06-27T04:00:00+09:00', stage:'グループI'},
  {id:62, home:'セネガル',     away:'イラク',        kickoff:'2026-06-27T04:00:00+09:00', stage:'グループI'},
  {id:63, home:'カーボベルデ', away:'サウジアラビア',kickoff:'2026-06-27T09:00:00+09:00', stage:'グループH'},
  {id:64, home:'ウルグアイ',   away:'スペイン',      kickoff:'2026-06-27T09:00:00+09:00', stage:'グループH'},
  {id:65, home:'ニュージーランド',away:'ベルギー',   kickoff:'2026-06-27T12:00:00+09:00', stage:'グループG'},
  {id:66, home:'エジプト',     away:'イラン',        kickoff:'2026-06-27T12:00:00+09:00', stage:'グループG'},
  {id:67, home:'パナマ',       away:'イングランド',  kickoff:'2026-06-28T06:00:00+09:00', stage:'グループL'},
  {id:68, home:'クロアチア',   away:'ガーナ',        kickoff:'2026-06-28T06:00:00+09:00', stage:'グループL'},
  {id:69, home:'コロンビア',   away:'ポルトガル',    kickoff:'2026-06-28T08:30:00+09:00', stage:'グループK'},
  {id:70, home:'コンゴDR',     away:'ウズベキスタン',kickoff:'2026-06-28T08:30:00+09:00', stage:'グループK'},
  {id:71, home:'アルジェリア', away:'オーストリア',  kickoff:'2026-06-28T11:00:00+09:00', stage:'グループJ'},
  {id:72, home:'ヨルダン',     away:'アルゼンチン',  kickoff:'2026-06-28T11:00:00+09:00', stage:'グループJ'},
  // ラウンド32
  {id:73, home:'TBD',away:'TBD', kickoff:'2026-06-29T04:00:00+09:00', stage:'ラウンド32'},
  {id:74, home:'TBD',away:'TBD', kickoff:'2026-06-30T05:30:00+09:00', stage:'ラウンド32'},
  {id:75, home:'TBD',away:'TBD', kickoff:'2026-06-30T10:00:00+09:00', stage:'ラウンド32'},
  {id:76, home:'TBD',away:'TBD', kickoff:'2026-06-30T02:00:00+09:00', stage:'ラウンド32'},
  {id:77, home:'TBD',away:'TBD', kickoff:'2026-07-01T06:00:00+09:00', stage:'ラウンド32'},
  {id:78, home:'TBD',away:'TBD', kickoff:'2026-07-01T02:00:00+09:00', stage:'ラウンド32'},
  {id:79, home:'TBD',away:'TBD', kickoff:'2026-07-01T10:00:00+09:00', stage:'ラウンド32'},
  {id:80, home:'TBD',away:'TBD', kickoff:'2026-07-02T01:00:00+09:00', stage:'ラウンド32'},
  {id:81, home:'TBD',away:'TBD', kickoff:'2026-07-02T09:00:00+09:00', stage:'ラウンド32'},
  {id:82, home:'TBD',away:'TBD', kickoff:'2026-07-02T05:00:00+09:00', stage:'ラウンド32'},
  {id:83, home:'TBD',away:'TBD', kickoff:'2026-07-03T08:00:00+09:00', stage:'ラウンド32'},
  {id:84, home:'TBD',away:'TBD', kickoff:'2026-07-03T04:00:00+09:00', stage:'ラウンド32'},
  {id:85, home:'TBD',away:'TBD', kickoff:'2026-07-03T12:00:00+09:00', stage:'ラウンド32'},
  {id:86, home:'TBD',away:'TBD', kickoff:'2026-07-04T07:00:00+09:00', stage:'ラウンド32'},
  {id:87, home:'TBD',away:'TBD', kickoff:'2026-07-04T10:30:00+09:00', stage:'ラウンド32'},
  {id:88, home:'TBD',away:'TBD', kickoff:'2026-07-04T03:00:00+09:00', stage:'ラウンド32'},
  // ラウンド16
  {id:89, home:'TBD',away:'TBD', kickoff:'2026-07-05T06:00:00+09:00', stage:'ラウンド16'},
  {id:90, home:'TBD',away:'TBD', kickoff:'2026-07-05T02:00:00+09:00', stage:'ラウンド16'},
  {id:91, home:'TBD',away:'TBD', kickoff:'2026-07-06T05:00:00+09:00', stage:'ラウンド16'},
  {id:92, home:'TBD',away:'TBD', kickoff:'2026-07-06T09:00:00+09:00', stage:'ラウンド16'},
  {id:93, home:'TBD',away:'TBD', kickoff:'2026-07-07T04:00:00+09:00', stage:'ラウンド16'},
  {id:94, home:'TBD',away:'TBD', kickoff:'2026-07-07T09:00:00+09:00', stage:'ラウンド16'},
  {id:95, home:'TBD',away:'TBD', kickoff:'2026-07-08T01:00:00+09:00', stage:'ラウンド16'},
  {id:96, home:'TBD',away:'TBD', kickoff:'2026-07-08T05:00:00+09:00', stage:'ラウンド16'},
  // 準々決勝
  {id:97, home:'TBD',away:'TBD', kickoff:'2026-07-10T05:00:00+09:00', stage:'準々決勝'},
  {id:98, home:'TBD',away:'TBD', kickoff:'2026-07-11T04:00:00+09:00', stage:'準々決勝'},
  {id:99, home:'TBD',away:'TBD', kickoff:'2026-07-12T06:00:00+09:00', stage:'準々決勝'},
  {id:100,home:'TBD',away:'TBD', kickoff:'2026-07-12T10:00:00+09:00', stage:'準々決勝'},
  // 準決勝
  {id:101,home:'TBD',away:'TBD', kickoff:'2026-07-15T04:00:00+09:00', stage:'準決勝'},
  {id:102,home:'TBD',away:'TBD', kickoff:'2026-07-16T04:00:00+09:00', stage:'準決勝'},
  // 3位決定戦・決勝
  {id:103,home:'TBD',away:'TBD', kickoff:'2026-07-19T06:00:00+09:00', stage:'3位決定戦'},
  {id:104,home:'TBD',away:'TBD', kickoff:'2026-07-20T04:00:00+09:00', stage:'決勝'},
];

const BET_RESULT = 1000;
const BET_SCORE  = 500;
const ADMIN_PW   = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || '4818';

// ─── 出場48カ国 ───────────────────────────────────────────
const TEAMS = [
  // グループA
  'メキシコ','南アフリカ','韓国','チェコ',
  // グループB
  'カナダ','ボスニア・ヘルツェゴビナ','カタール','スイス',
  // グループC
  'ブラジル','モロッコ','ハイチ','スコットランド',
  // グループD
  'アメリカ','パラグアイ','オーストラリア','トルコ',
  // グループE
  'ドイツ','キュラソー','コートジボワール','エクアドル',
  // グループF
  'オランダ','日本','スウェーデン','チュニジア',
  // グループG
  'ベルギー','エジプト','イラン','ニュージーランド',
  // グループH
  'スペイン','カーボベルデ','サウジアラビア','ウルグアイ',
  // グループI
  'フランス','セネガル','イラク','ノルウェー',
  // グループJ
  'アルゼンチン','アルジェリア','オーストリア','ヨルダン',
  // グループK
  'ポルトガル','コンゴDR','ウズベキスタン','コロンビア',
  // グループL
  'イングランド','クロアチア','ガーナ','パナマ',
].sort((a, b) => a.localeCompare(b, 'ja'));

// ─── 阿弥陀くじ・ドラフト ヘルパー ──────────────────────────
const AMIDA_LEVELS = 14;

function generateAmidaConnectors(n) {
  const cs = [];
  for (let lvl = 0; lvl < AMIDA_LEVELS; lvl++) {
    let i = 0;
    let added = 0;
    while (i < n - 1) {
      if (Math.random() > 0.25) { cs.push({ lvl, left: i }); added++; i += 2; }
      else i++;
    }
    // 各段に必ず1本以上の横棒を保証
    if (added === 0 && n > 1) {
      const pos = Math.floor(Math.random() * (n - 1));
      cs.push({ lvl, left: pos });
    }
  }
  return cs;
}

function traceAmida(startPos, connectors) {
  let pos = startPos;
  for (let lvl = 0; lvl < AMIDA_LEVELS; lvl++) {
    const c = connectors.find(c => c.lvl === lvl && (c.left === pos || c.left + 1 === pos));
    if (c) pos = c.left === pos ? c.left + 1 : c.left;
  }
  return pos;
}

function getDraftSequence(n) {
  const a = Array.from({ length: n }, (_, i) => i);
  return [...a, ...[...a].reverse()];
}

function fmtDate(iso) {
  const d = new Date(iso);
  return `${d.getMonth()+1}/${d.getDate()}`;
}
function fmtTime(iso) {
  const d = new Date(iso);
  return `${String(d.getHours()).padStart(2,'0')}:${String(d.getMinutes()).padStart(2,'0')}`;
}
function isLocked(kickoff) {
  return new Date() >= new Date(kickoff);
}
function getResult(hg, ag) {
  if (hg > ag) return 'home';
  if (hg < ag) return 'away';
  return 'draw';
}

// ─── ポイント計算 ─────────────────────────────────────────
function calcPoints(matches, players) {
  const pts = {};
  players.forEach(p => pts[p] = 0);
  let carryover = 0;

  matches.forEach(m => {
    if (m.result === null || m.result === undefined) return;
    const { homeGoals, awayGoals } = m.result;
    if (homeGoals === null || awayGoals === null) return;
    const correctResult = getResult(homeGoals, awayGoals);

    // ─ 勝敗ベット ─
    const resultWinners = players.filter(p => {
      const pred = m.predictions?.[p];
      return pred && pred.result === correctResult;
    });
    const resultPool = BET_RESULT * players.length;
    players.forEach(p => { pts[p] -= BET_RESULT; });
    if (resultWinners.length > 0) {
      const share = Math.floor(resultPool / resultWinners.length);
      resultWinners.forEach(p => { pts[p] += share; });
    }

    // ─ スコアベット ─
    const scorePool = BET_SCORE * players.length + carryover;
    const scoreWinners = players.filter(p => {
      const pred = m.predictions?.[p];
      return pred && Number(pred.homeGoals) === homeGoals && Number(pred.awayGoals) === awayGoals;
    });
    players.forEach(p => { pts[p] -= BET_SCORE; });
    if (scoreWinners.length > 0) {
      const share = Math.floor(scorePool / scoreWinners.length);
      scoreWinners.forEach(p => { pts[p] += share; });
      carryover = 0;
    } else {
      carryover += BET_SCORE * players.length;
    }
  });

  return { pts, carryover };
}

// ─── メインコンポーネント ─────────────────────────────────
export default function App() {
  const [gameState, setGameState] = useState(null);
  const [loading, setLoading]   = useState(true);
  const [me, setMe]             = useState(null); // logged-in player name
  const [isAdmin, setIsAdmin]   = useState(false);
  const [view, setView]         = useState('matches'); // matches | ranking | admin
  const [selDate, setSelDate]   = useState(null);
  const [saving, setSaving]     = useState(false);
  const [fetchingResults, setFetchingResults] = useState(false);
  const [msg, setMsg]           = useState('');

  // ─ 初期ロード ─
  useEffect(() => {
    loadState();
    // ブラウザに保存されたログイン状態を復元
    const saved = localStorage.getItem('wc2026_player');
    if (saved === '__admin__') { setIsAdmin(true); setView('admin'); }
    else if (saved) { setMe(saved); }
  }, []);

  // localStorageにプレイヤー情報をバックアップ
  function backupPlayers(players, passwords) {
    localStorage.setItem('wc2026_players', JSON.stringify(players || []));
    localStorage.setItem('wc2026_passwords', JSON.stringify(passwords || {}));
  }

  // localStorageからプレイヤー情報を復元
  function restorePlayers() {
    try {
      const players = JSON.parse(localStorage.getItem('wc2026_players') || '[]');
      const passwords = JSON.parse(localStorage.getItem('wc2026_passwords') || '{}');
      return { players, passwords };
    } catch { return { players: [], passwords: {} }; }
  }

  async function loadState() {
    setLoading(true);
    try {
      const res = await fetch('/api/game-state');
      const data = await res.json();
      if (data && data.players && data.players.length > 0) {
        setGameState(data);
        backupPlayers(data.players, data.playerPasswords); // localStorageにもバックアップ
        const firstDate = fmtDate(ALL_MATCHES[0].kickoff);
        setSelDate(data.selDate || firstDate);
        // ログイン中のプレイヤーがリストに存在しない場合は自動ログアウト
        const savedPlayer = localStorage.getItem('wc2026_player');
        if (savedPlayer && savedPlayer !== '__admin__' && !data.players.includes(savedPlayer)) {
          localStorage.removeItem('wc2026_player');
          setMe(null);
        }
      } else {
        // Vercel Blobが空 → localStorageのバックアップを確認
        const { players, passwords } = restorePlayers();
        setGameState({ players, matches: initMatches(), carryover: 0, playerPasswords: passwords });
        setSelDate(fmtDate(ALL_MATCHES[0].kickoff));
      }
    } catch {
      // 通信エラー時もlocalStorageから復元
      const { players, passwords } = restorePlayers();
      setGameState({ players, matches: initMatches(), carryover: 0, playerPasswords: passwords });
      setSelDate(fmtDate(ALL_MATCHES[0].kickoff));
    }
    setLoading(false);
  }

  function initMatches() {
    return ALL_MATCHES.map(m => ({ ...m, predictions: {}, result: null }));
  }

  async function saveState(newState) {
    setSaving(true);
    let success = false;
    try {
      const res = await fetch('/api/game-state', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newState),
      });
      if (res.ok) { success = true; }
      else { setMsg('⚠️ 保存に失敗しました（サーバーエラー）'); }
    } catch (e) { setMsg('⚠️ 保存に失敗しました: ' + e.message); }
    setSaving(false);
    return success;
  }

  // ─ プレイヤー未登録時：5秒ごとにサーバーを自動確認 ─
  useEffect(() => {
    if (!gameState || gameState.players.length > 0 || isAdmin) return;
    const timer = setInterval(async () => {
      try {
        const res = await fetch('/api/game-state');
        const data = await res.json();
        if (data && data.players && data.players.length > 0) {
          setGameState(data);
          backupPlayers(data.players, data.playerPasswords);
          setSelDate(data.selDate || fmtDate(ALL_MATCHES[0].kickoff));
        }
      } catch {}
    }, 5000);
    return () => clearInterval(timer);
  }, [gameState?.players?.length, isAdmin]);

  // ─ 日付リスト ─
  const dates = useMemo(() => {
    const set = new Set(ALL_MATCHES.map(m => fmtDate(m.kickoff)));
    return [...set];
  }, []);

  const todayMatches = useMemo(() => {
    if (!gameState || !selDate) return [];
    return gameState.matches.filter(m => fmtDate(m.kickoff) === selDate);
  }, [gameState, selDate]);

  // ─ ポイント計算 ─
  const { pts, carryover: co } = useMemo(() => {
    if (!gameState || !gameState.players.length) return { pts: {}, carryover: 0 };
    return calcPoints(gameState.matches, gameState.players);
  }, [gameState]);

  // ─ データ読み込み中（localStorage復元直後など） ─
  if (loading || !gameState) {
    return <div style={styles.center}>読み込み中...</div>;
  }

  // ─ ログイン画面 ─
  if (!me && !isAdmin) {
    return <LoginScreen
      gameState={gameState}
      onLogin={(name) => { setMe(name); localStorage.setItem('wc2026_player', name); }}
      onAdmin={() => {
        const pw = prompt('管理者パスワードを入力してください:');
        if (pw === ADMIN_PW) { setIsAdmin(true); setView('admin'); localStorage.setItem('wc2026_player', '__admin__'); }
        else alert('パスワードが違います');
      }}
      onSetup={(players) => {
        backupPlayers(players, {}); // localStorageにバックアップ
        const ns = { ...gameState, players, matches: initMatches(), carryover: 0 };
        setGameState(ns);
        saveState(ns);
      }}
      onSavePassword={(player, password) => {
        const newPasswords = { ...(gameState.playerPasswords||{}), [player]: password };
        backupPlayers(gameState.players, newPasswords); // localStorageにバックアップ
        const ns = { ...gameState, playerPasswords: newPasswords };
        setGameState(ns);
        saveState(ns);
      }}
      loading={loading}
    />;
  }

  // ─ プレイヤー予想入力 ─
  function setPrediction(matchId, field, value) {
    const nm = gameState.matches.map(m => {
      if (m.id !== matchId) return m;
      const pred = { ...(m.predictions || {})[me] };
      pred[field] = value;
      return { ...m, predictions: { ...m.predictions, [me]: pred } };
    });
    const ns = { ...gameState, matches: nm };
    setGameState(ns);
    saveState(ns);
  }

  // ─ 管理者：結果入力 ─
  function setMatchResult(matchId, homeGoals, awayGoals) {
    const nm = gameState.matches.map(m => {
      if (m.id !== matchId) return m;
      return { ...m, result: { homeGoals: Number(homeGoals), awayGoals: Number(awayGoals) } };
    });
    const ns = { ...gameState, matches: nm };
    setGameState(ns);
    saveState(ns);
  }

  // ─ 管理者：チーム名変更（ノックアウト） ─
  function setTeamName(matchId, field, value) {
    const nm = gameState.matches.map(m =>
      m.id === matchId ? { ...m, [field]: value } : m
    );
    const ns = { ...gameState, matches: nm };
    setGameState(ns);
    saveState(ns);
  }

  // ─ 自動結果取得 ─
  async function fetchResults() {
    setFetchingResults(true);
    setMsg('');
    try {
      const pending = gameState.matches.filter(m =>
        isLocked(m.kickoff) && (!m.result || m.result.homeGoals === null)
      ).slice(0, 10);
      if (!pending.length) { setMsg('取得対象の試合がありません'); setFetchingResults(false); return; }
      const res = await fetch('/api/fetch-results', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ matches: pending }),
      });
      const { results, error } = await res.json();
      if (error) { setMsg('エラー: ' + error); setFetchingResults(false); return; }
      let nm = [...gameState.matches];
      results.forEach(r => {
        if (r.homeGoals !== null && r.awayGoals !== null) {
          nm = nm.map(m => m.id === r.id ? { ...m, result: { homeGoals: r.homeGoals, awayGoals: r.awayGoals } } : m);
        }
      });
      const ns = { ...gameState, matches: nm };
      setGameState(ns);
      await saveState(ns);
      setMsg(`✅ ${results.filter(r => r.homeGoals !== null).length}試合の結果を取得しました`);
    } catch (e) { setMsg('エラー: ' + e.message); }
    setFetchingResults(false);
  }

  const S = styles;

  return (
    <div style={S.app}>
      {/* ヘッダー */}
      <div style={S.header}>
        <span style={S.logo}>🏆 WC2026 予想ゲーム</span>
        <div style={S.headerRight}>
          {saving && <span style={S.saving}>保存中...</span>}
          {co > 0 && <span style={S.carryBadge}>🔥キャリーオーバー {co.toLocaleString()}pt</span>}
          <span style={S.userName}>{isAdmin ? '👑管理者' : me}</span>
          <button style={S.logoutBtn} onClick={() => { setMe(null); setIsAdmin(false); setView('matches'); localStorage.removeItem('wc2026_player'); }}>ログアウト</button>
        </div>
      </div>

      {/* ナビ */}
      <div style={S.nav}>
        {['matches','champion','ranking'].map(v => (
          <button key={v} style={{...S.navBtn, ...(view===v?S.navActive:{})}}
            onClick={() => setView(v)}>
            {v==='matches'?'📅 試合':v==='champion'?'🏆 優勝予想':'🏅 ランキング'}
          </button>
        ))}
        {isAdmin && (
          <button style={{...S.navBtn, ...(view==='admin'?S.navActive:{})}} onClick={() => setView('admin')}>
            🔐 管理者
          </button>
        )}
      </div>

      {msg && <div style={S.msgBar}>{msg}</div>}

      {/* ─ 試合一覧 ─ */}
      {view === 'matches' && (
        <div>
          {/* 日付タブ */}
          <div style={S.dateTabs}>
            {dates.map(d => {
              const dayMatches = gameState.matches.filter(m => fmtDate(m.kickoff) === d);
              const allDone = dayMatches.every(m => m.result !== null);
              return (
                <button key={d} style={{...S.dateTab, ...(selDate===d?S.dateTabActive:{}), ...(allDone?S.dateTabDone:{})}}
                  onClick={() => setSelDate(d)}>
                  {d}
                </button>
              );
            })}
          </div>

          {/* 試合カード */}
          <div style={S.matchList}>
            {todayMatches.map(m => {
              const locked = isLocked(m.kickoff);
              const myPred = m.predictions?.[me] || {};
              const hasResult = m.result !== null && m.result?.homeGoals !== undefined;

              return (
                <div key={m.id} style={{...S.matchCard, ...(hasResult?S.matchCardDone:{})}}>
                  <div style={S.matchMeta}>
                    <span style={S.stageBadge}>{m.stage}</span>
                    <span style={S.kickoffTime}>{fmtTime(m.kickoff)} JST</span>
                    {locked && !hasResult && <span style={S.lockBadge}>🔒 締切</span>}
                    {hasResult && <span style={S.doneBadge}>✅ 結果済</span>}
                  </div>
                  <div style={S.teams}>
                    <span style={S.teamName}>{m.home}</span>
                    <span style={S.vs}>VS</span>
                    <span style={S.teamName}>{m.away}</span>
                  </div>

                  {/* 結果表示 */}
                  {hasResult && (
                    <div style={S.resultRow}>
                      <span style={S.resultScore}>
                        {m.result.homeGoals} - {m.result.awayGoals}
                      </span>
                    </div>
                  )}

                  {/* 予想入力（ロック前のみ） */}
                  {!locked && !isAdmin && (
                    <div style={S.predRow}>
                      <div style={S.resultBtns}>
                        {[{v:'home',l:`${m.home}勝ち`},{v:'draw',l:'引き分け'},{v:'away',l:`${m.away}勝ち`}].map(opt => (
                          <button key={opt.v}
                            style={{...S.resBtn, ...(myPred.result===opt.v?S.resBtnActive:{})}}
                            onClick={() => setPrediction(m.id, 'result', opt.v)}>
                            {opt.l}
                          </button>
                        ))}
                      </div>
                      <div style={S.scoreRow}>
                        <span style={S.scoreLabel}>スコア予想:</span>
                        <input type="number" min="0" max="20" value={myPred.homeGoals ?? ''}
                          style={S.scoreInput}
                          onChange={e => setPrediction(m.id, 'homeGoals', e.target.value)}
                          placeholder="0" />
                        <span style={S.scoreSep}>-</span>
                        <input type="number" min="0" max="20" value={myPred.awayGoals ?? ''}
                          style={S.scoreInput}
                          onChange={e => setPrediction(m.id, 'awayGoals', e.target.value)}
                          placeholder="0" />
                      </div>
                    </div>
                  )}

                  {/* ロック後：全員の予想表示 */}
                  {(locked || hasResult) && (
                    <div style={S.allPreds}>
                      {gameState.players.map(p => {
                        const pred = m.predictions?.[p];
                        const rCorrect = hasResult && pred?.result === getResult(m.result.homeGoals, m.result.awayGoals);
                        const sCorrect = hasResult && pred && Number(pred.homeGoals) === m.result.homeGoals && Number(pred.awayGoals) === m.result.awayGoals;
                        return (
                          <div key={p} style={S.playerPred}>
                            <span style={S.predName}>{p}</span>
                            {pred ? (
                              <>
                                <span style={{...S.predResult, ...(rCorrect?S.correct:hasResult?S.wrong:{})}}>
                                  {pred.result==='home'?`${m.home}勝ち`:pred.result==='away'?`${m.away}勝ち`:'引き分け'}
                                </span>
                                <span style={{...S.predScore, ...(sCorrect?S.correct:hasResult&&pred.homeGoals!==undefined?S.wrong:{})}}>
                                  {pred.homeGoals??'?'}-{pred.awayGoals??'?'}
                                </span>
                              </>
                            ) : <span style={S.noPred}>⚠️ 未予想</span>}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ─ 優勝予想 ─ */}
      {view === 'champion' && (
        <ChampionView
          gameState={gameState}
          me={me}
          isAdmin={isAdmin}
          onSetDraftOrder={(order) => {
            // orderがnullの場合はリセット
            const ns = { ...gameState, draftOrder: order, championPicks: {} };
            setGameState(ns);
            saveState(ns);
          }}
          onDraftPick={(country) => {
            const existing = gameState.championPicks?.[me] || [];
            const ns = { ...gameState, championPicks: { ...(gameState.championPicks||{}), [me]: [...existing, country] } };
            setGameState(ns);
            saveState(ns);
          }}
          onReloadState={async () => {
            try {
              const res = await fetch('/api/game-state');
              const data = await res.json();
              if (data?.players) setGameState(data);
            } catch {}
          }}
        />
      )}

      {/* ─ ランキング ─ */}
      {view === 'ranking' && (
        <div style={S.ranking}>
          <h2 style={S.rankTitle}>🏅 現在のランキング</h2>
          {co > 0 && <p style={S.carryNote}>🔥 スコアキャリーオーバー: {co.toLocaleString()}pt</p>}
          {gameState.players
            .sort((a,b) => (pts[b]||0) - (pts[a]||0))
            .map((p, i) => (
              <div key={p} style={{...S.rankRow, ...(i===0?S.rank1:i===1?S.rank2:i===2?S.rank3:{})}}>
                <span style={S.rankPos}>{i===0?'🥇':i===1?'🥈':i===2?'🥉':`${i+1}位`}</span>
                <span style={S.rankName}>{p}</span>
                <span style={S.rankPts}>{(pts[p]||0).toLocaleString()}pt</span>
              </div>
            ))}
        </div>
      )}

      {/* ─ 管理者 ─ */}
      {view === 'admin' && isAdmin && (
        <AdminView
          gameState={gameState}
          fetchingResults={fetchingResults}
          onFetchResults={fetchResults}
          onSetResult={setMatchResult}
          onSetTeam={setTeamName}
          pts={pts}
          co={co}
          onSetupPlayers={async (players) => {
            backupPlayers(players, {});
            const ns = { ...gameState, players, matches: initMatches(), carryover: 0, playerPasswords: {} };
            setGameState(ns);
            const ok = await saveState(ns);
            if (ok) setMsg('✅ 登録完了！参加者のアプリが自動的に更新されます（最大5秒）');
          }}
          onResetPlayers={() => {
            backupPlayers([], {});
            const ns = { ...gameState, players: [], playerPasswords: {}, matches: initMatches(), carryover: 0 };
            setGameState(ns);
            saveState(ns);
          }}
        />
      )}
    </div>
  );
}

// ─── 阿弥陀くじ SVG ─────────────────────────────────────────
function AmidaDisplay({ players, connectors, showResult }) {
  const n = players.length;
  const SP = Math.min(68, 260 / Math.max(n - 1, 1));
  const PX = 36, W = PX * 2 + (n - 1) * SP, H = 420;
  const TY = 48, BY = 370, LH = (BY - TY) / (AMIDA_LEVELS + 1);
  const lx = i => PX + i * SP;
  const ly = l => TY + (l + 1) * LH;
  const COLORS = ['#f87171','#4ade80','#60a5fa','#fbbf24','#c084fc'];

  function tracePath(si) {
    let p = si;
    const pts = [[lx(p), TY]];
    for (let l = 0; l < AMIDA_LEVELS; l++) {
      const c = connectors.find(c => c.lvl === l && (c.left === p || c.left + 1 === p));
      if (c) { pts.push([lx(p), ly(l)]); p = c.left === p ? c.left + 1 : c.left; pts.push([lx(p), ly(l)]); }
    }
    pts.push([lx(p), BY]);
    return pts;
  }

  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{width:'100%', maxWidth:W, display:'block', margin:'0 auto', background:'#0f172a', borderRadius:10, padding:4}}>
      {players.map((p, i) => (
        <text key={'n'+i} x={lx(i)} y={28} textAnchor="middle" fill={showResult ? COLORS[i%5] : '#93c5fd'} fontSize={10} fontWeight="700">
          {p.slice(0, 4)}
        </text>
      ))}
      {players.map((_, i) => <line key={'v'+i} x1={lx(i)} y1={TY} x2={lx(i)} y2={BY} stroke="#334155" strokeWidth={2}/>)}
      {connectors.map((c, k) => <line key={'h'+k} x1={lx(c.left)} y1={ly(c.lvl)} x2={lx(c.left+1)} y2={ly(c.lvl)} stroke="#475569" strokeWidth={2}/>)}
      {showResult && players.map((_, i) => {
        const pts = tracePath(i).map(([x,y]) => `${x},${y}`).join(' ');
        return <polyline key={'p'+i} points={pts} fill="none" stroke={COLORS[i%5]} strokeWidth={3} opacity={0.85} strokeLinejoin="round"/>;
      })}
      {players.map((_, i) => (
        <text key={'d'+i} x={lx(i)} y={H-8} textAnchor="middle" fill="#ffd700" fontSize={14} fontWeight="800">{i+1}</text>
      ))}
    </svg>
  );
}

// ─── 優勝予想コンポーネント ───────────────────────────────
function ChampionView({ gameState, me, isAdmin, onSetDraftOrder, onDraftPick, onReloadState }) {
  const [amidaConnectors, setAmidaConnectors] = useState(null);
  const [showAmidaResult, setShowAmidaResult]  = useState(false);
  const S = styles;

  const picks      = gameState.championPicks || {};
  const draftOrder = gameState.draftOrder || null;
  const n          = gameState.players.length;
  const locked     = isLocked(ALL_MATCHES[0].kickoff);
  const seq        = getDraftSequence(n);
  const totalPicks = gameState.players.reduce((s, p) => s + (picks[p]?.length || 0), 0);
  const draftDone  = draftOrder && totalPicks >= seq.length;
  const curIdx     = (draftOrder && !draftDone) ? seq[totalPicks] : -1;
  const curPicker  = curIdx >= 0 ? draftOrder[curIdx] : null;
  const allPicked  = Object.values(picks).flat();
  const available  = TEAMS.filter(t => !allPicked.includes(t));
  const isMyTurn   = curPicker === me && !locked && !isAdmin;

  // 阿弥陀結果（順位→プレイヤー名の配列）
  const amidaOrder = amidaConnectors ? (() => {
    const o = new Array(n);
    gameState.players.forEach((p, i) => { o[traceAmida(i, amidaConnectors)] = p; });
    return o;
  })() : null;

  function drawAmida() {
    setAmidaConnectors(generateAmidaConnectors(n));
    setShowAmidaResult(false);
  }

  return (
    <div style={S.champWrap}>
      <h2 style={S.champTitle}>🏆 優勝国予想</h2>
      {locked && <p style={S.lockNote}>🔒 大会開幕のため変更できません</p>}

      {/* ─ 阿弥陀くじセクション ─ */}
      {!locked && (
        <div style={S.amidaSection}>
          <h3 style={S.champAllTitle}>🎯 阿弥陀くじ（選択順決め）</h3>

          {draftOrder ? (
            /* 確定済み */
            <div>
              <p style={{color:'#4ade80', fontSize:13, marginBottom:8}}>✅ 選択順が確定しています</p>
              <div style={{display:'flex', flexWrap:'wrap', gap:6, marginBottom:10}}>
                {draftOrder.map((p, i) => (
                  <span key={i} style={{background:'#1e3a5f', color:'#93c5fd', padding:'4px 10px', borderRadius:10, fontSize:13}}>
                    {i+1}番目: <strong>{p}</strong>
                  </span>
                ))}
              </div>
              {isAdmin && (
                <button style={{...S.fetchBtn, background:'#7f1d1d', fontSize:12}}
                  onClick={() => { if (window.confirm('阿弥陀くじをリセットしますか？\n選択済みの国も全てリセットされます。')) onSetDraftOrder(null); }}>
                  🔄 阿弥陀くじをやり直す
                </button>
              )}
            </div>
          ) : !amidaConnectors ? (
            /* まだ引いていない */
            <div>
              {isAdmin ? (
                <button style={S.fetchBtn} onClick={drawAmida}>🎲 阿弥陀くじを引く</button>
              ) : (
                <p style={{color:'#fbbf24', fontSize:13}}>⏳ 管理者が阿弥陀くじを引くまでお待ちください</p>
              )}
            </div>
          ) : (
            /* 引いた後 */
            <div>
              <AmidaDisplay players={gameState.players} connectors={amidaConnectors} showResult={showAmidaResult} />
              <div style={{display:'flex', gap:8, marginTop:10, flexWrap:'wrap'}}>
                {!showAmidaResult ? (
                  <button style={{...S.fetchBtn, flex:1}} onClick={() => setShowAmidaResult(true)}>👀 結果を見る</button>
                ) : (
                  <>
                    <div style={{width:'100%', display:'flex', flexWrap:'wrap', gap:4, marginBottom:6}}>
                      {amidaOrder.map((p, i) => (
                        <span key={i} style={{background:'#1c1700', border:'1px solid #ffd700', color:'#ffd700', padding:'3px 10px', borderRadius:8, fontSize:12, fontWeight:700}}>
                          {i+1}番目: {p}
                        </span>
                      ))}
                    </div>
                    {isAdmin && (
                      <button style={{...S.fetchBtn, flex:1}} onClick={() => { onSetDraftOrder(amidaOrder); setAmidaConnectors(null); }}>
                        ✅ この順番で確定
                      </button>
                    )}
                    <button style={{...S.fetchBtn, background:'#374151', flex:1}} onClick={drawAmida}>🔄 引き直す</button>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ─ ドラフト進行中 ─ */}
      {draftOrder && !draftDone && !locked && (
        <div style={S.amidaSection}>
          <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:8}}>
            <h3 style={{...S.champAllTitle, margin:0}}>🎴 ドラフト中（{totalPicks}/{seq.length}）</h3>
            <button style={{...S.fetchBtn, background:'#374151', fontSize:11, padding:'4px 10px'}} onClick={onReloadState}>🔄 更新</button>
          </div>

          {/* 1→2→3→...→n→n→...→2→1 の順番表示 */}
          <div style={{display:'flex', flexWrap:'wrap', gap:4, marginBottom:12}}>
            {seq.map((posIdx, pickNum) => {
              const isPast = pickNum < totalPicks;
              const isCur  = pickNum === totalPicks;
              const player = draftOrder[posIdx];
              return (
                <div key={pickNum} style={{
                  textAlign:'center', padding:'5px 8px', borderRadius:8, fontSize:11, minWidth:52,
                  background: isCur?'#1d4ed8':isPast?'#064e3b':'#1e293b',
                  border: isCur?'1px solid #60a5fa':isPast?'1px solid #065f46':'1px solid #334155',
                  color: isCur?'#fff':isPast?'#4ade80':'#64748b',
                }}>
                  <div style={{fontWeight:700, fontSize:10}}>{pickNum+1}回目</div>
                  <div>{player}</div>
                </div>
              );
            })}
          </div>

          {isMyTurn && (
            <div>
              <p style={{color:'#4ade80', fontWeight:700, marginBottom:8}}>✋ あなたの番です！1カ国選んでください</p>
              <div style={S.teamGrid}>
                {available.map(t => (
                  <button key={t} style={S.teamChip} onClick={() => onDraftPick(t)}>{t}</button>
                ))}
              </div>
            </div>
          )}
          {!isMyTurn && !isAdmin && curPicker && (
            <p style={{color:'#94a3b8', fontSize:13, textAlign:'center', padding:12}}>
              ⏳ {curPicker}さんが選択中... 「更新」ボタンで最新状態を確認できます
            </p>
          )}
          {isAdmin && curPicker && (
            <p style={{color:'#fbbf24', fontSize:13}}>⏳ {curPicker}さんの番です</p>
          )}
        </div>
      )}

      {/* ─ 全員の予想一覧 ─ */}
      <div style={S.champAllWrap}>
        <h3 style={S.champAllTitle}>
          {draftDone ? '✅ 全員の優勝予想（確定）' : '📋 全員の優勝予想'}
        </h3>
        {gameState.players.map(p => (
          <div key={p} style={S.champRow}>
            <span style={S.champName}>{p}</span>
            <div style={S.champPicksRow}>
              {(picks[p]||[]).length
                ? (picks[p]||[]).map(t => <span key={t} style={S.champBadge}>{t}</span>)
                : <span style={S.noPred}>未選択</span>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── 使い方コンポーネント ─────────────────────────────────
function UsageSection({ S }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={S.rulesWrap}>
      <button style={S.rulesToggle} onClick={() => setOpen(o => !o)}>
        📖 使い方 {open ? '▲' : '▼'}
      </button>
      {open && (
        <div style={S.rulesBody}>
          <p style={S.rulesHeading}>🔑 ログイン</p>
          <ul style={S.rulesList}>
            <li>自分の名前をタップする</li>
            <li><strong>初回のみ</strong>：パスワードを自分で設定する（次回から必要）</li>
            <li>2回目以降：設定したパスワードを入力してログイン</li>
          </ul>
          <p style={S.rulesHeading}>📅 試合予想</p>
          <ul style={S.rulesList}>
            <li>上部の日付タブで日を切り替える</li>
            <li>各試合で <strong>勝敗（ホーム勝ち / 引き分け / アウェイ勝ち）</strong> を選ぶ</li>
            <li>さらに <strong>スコア（例：2-1）</strong> を入力する</li>
            <li>キックオフ時刻になると自動で締め切られる</li>
          </ul>
          <p style={S.rulesHeading}>🏆 優勝予想</p>
          <ul style={S.rulesList}>
            <li>上部ナビの「優勝予想」を開く</li>
            <li>優勝すると思う国を <strong>2カ国</strong> 選んで保存する</li>
            <li>大会開幕（6/12 キックオフ）以降は変更不可</li>
          </ul>
          <p style={S.rulesHeading}>🏅 ランキング</p>
          <ul style={S.rulesList}>
            <li>上部ナビの「ランキング」でリアルタイム順位を確認できる</li>
            <li>試合結果が入力されると自動でポイントが更新される</li>
          </ul>
        </div>
      )}
    </div>
  );
}

// ─── ルール表示コンポーネント ─────────────────────────────
function RulesSection({ S }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={S.rulesWrap}>
      <button style={S.rulesToggle} onClick={() => setOpen(o => !o)}>
        📋 ゲームルール {open ? '▲' : '▼'}
      </button>
      {open && (
        <div style={S.rulesBody}>
          <p style={S.rulesHeading}>⚽ 勝敗予想</p>
          <ul style={S.rulesList}>
            <li>各試合、全員が <strong>1,000pt</strong> を自動的に賭ける</li>
            <li>的中者が全員分のポイントを総取り（複数いれば山分け）</li>
            <li>誰も当たらなければ全員が -1,000pt</li>
          </ul>
          <p style={S.rulesHeading}>🎯 スコア予想</p>
          <ul style={S.rulesList}>
            <li>各試合、全員が <strong>500pt</strong> を自動的に賭ける</li>
            <li>○対○の完全一致が的中（点差ではなく正確なスコア）</li>
            <li>的中者がポイントを総取り（複数いれば山分け）</li>
            <li>誰も当たらなければ <strong>🔥キャリーオーバー</strong>！次の的中者が積み上げ分も総取り</li>
          </ul>
          <p style={S.rulesHeading}>📌 その他</p>
          <ul style={S.rulesList}>
            <li>開始時のポイントは <strong>0pt</strong>（マイナスになる場合あり）</li>
            <li>キックオフ時刻になると自動で予想が締め切られる</li>
            <li>締め切り後は他のプレイヤーの予想が見られる</li>
          </ul>
        </div>
      )}
    </div>
  );
}

// ─── ログイン画面 ──────────────────────────────────────────
function LoginScreen({ gameState, onLogin, onAdmin, onSetup, onSavePassword, loading }) {
  const [names, setNames]       = useState(['','','','','']);
  const [step, setStep]         = useState('select'); // select | setpw | enterpw
  const [selPlayer, setSelPlayer] = useState(null);
  const [pw, setPw]             = useState('');
  const [pw2, setPw2]           = useState('');
  const [err, setErr]           = useState('');
  const S = styles;

  if (loading) return <div style={S.center}>読み込み中...</div>;

  // ─ 未設定（管理者のみ設定可） ─
  if (!gameState?.players?.length) {
    return (
      <div style={S.loginBox}>
        <h1 style={S.loginTitle}>🏆 WC2026 予想ゲーム</h1>
        <UsageSection S={S} />
        <RulesSection S={S} />
        <div style={{background:'#0f172a', borderRadius:10, padding:16, textAlign:'center'}}>
          <p style={{color:'#fbbf24', fontWeight:700, marginBottom:6}}>⏳ 準備中</p>
          <p style={{color:'#94a3b8', fontSize:13, marginBottom:10}}>管理者がプレイヤーを登録するまでお待ちください</p>
          <p style={{color:'#64748b', fontSize:11}}>登録済みなのにこの画面が出る場合 ↓</p>
          <button style={{background:'transparent', border:'1px solid #334155', color:'#64748b', borderRadius:8, padding:'6px 14px', fontSize:12, cursor:'pointer', marginTop:4}}
            onClick={() => {
              localStorage.removeItem('wc2026_players');
              localStorage.removeItem('wc2026_passwords');
              localStorage.removeItem('wc2026_player');
              window.location.reload();
            }}>
            🔄 このブラウザのキャッシュをリセット
          </button>
        </div>
        <button style={S.adminBtn} onClick={onAdmin}>🔐 管理者ログイン</button>
      </div>
    );
  }

  const passwords = gameState.playerPasswords || {};

  // ─ パスワード設定画面（初回） ─
  if (step === 'setpw') {
    return (
      <div style={S.loginBox}>
        <h1 style={S.loginTitle}>🏆 WC2026 予想ゲーム</h1>
        <p style={S.loginSub}>「{selPlayer}」のパスワードを設定してください</p>
        <p style={{color:'#94a3b8', fontSize:12, textAlign:'center'}}>※ 次回ログイン時に必要になります</p>
        <input type="password" style={S.nameInput} placeholder="パスワードを入力"
          value={pw} onChange={e => { setPw(e.target.value); setErr(''); }} />
        <input type="password" style={S.nameInput} placeholder="もう一度入力"
          value={pw2} onChange={e => { setPw2(e.target.value); setErr(''); }} />
        {err && <p style={S.errMsg}>{err}</p>}
        <button style={S.startBtn} onClick={() => {
          if (!pw) return setErr('パスワードを入力してください');
          if (pw !== pw2) return setErr('パスワードが一致しません');
          onSavePassword(selPlayer, pw);
          onLogin(selPlayer);
        }}>
          設定してログイン 🚀
        </button>
        <button style={S.backBtn} onClick={() => { setStep('select'); setPw(''); setPw2(''); setErr(''); }}>
          ← 戻る
        </button>
      </div>
    );
  }

  // ─ パスワード入力画面（2回目以降） ─
  if (step === 'enterpw') {
    return (
      <div style={S.loginBox}>
        <h1 style={S.loginTitle}>🏆 WC2026 予想ゲーム</h1>
        <p style={S.loginSub}>「{selPlayer}」のパスワードを入力してください</p>
        <input type="password" style={S.nameInput} placeholder="パスワード"
          value={pw} onChange={e => { setPw(e.target.value); setErr(''); }}
          onKeyDown={e => { if (e.key === 'Enter') doLogin(); }} />
        {err && <p style={S.errMsg}>{err}</p>}
        <button style={S.startBtn} onClick={doLogin}>ログイン</button>
        <button style={S.backBtn} onClick={() => { setStep('select'); setPw(''); setErr(''); }}>
          ← 戻る
        </button>
      </div>
    );
  }

  function doLogin() {
    if (pw === passwords[selPlayer]) {
      onLogin(selPlayer);
    } else {
      setErr('パスワードが違います');
      setPw('');
    }
  }

  function handleSelect(p) {
    setSelPlayer(p);
    setPw(''); setPw2(''); setErr('');
    if (!passwords[p]) {
      setStep('setpw');   // 初回：パスワード設定
    } else {
      setStep('enterpw'); // 2回目以降：パスワード入力
    }
  }

  // ─ プレイヤー選択画面 ─
  return (
    <div style={S.loginBox}>
      <h1 style={S.loginTitle}>🏆 WC2026 予想ゲーム</h1>
      <UsageSection S={S} />
      <RulesSection S={S} />
      <p style={S.loginSub}>あなたは誰ですか？</p>
      {gameState.players.map(p => (
        <button key={p} style={S.playerBtn} onClick={() => handleSelect(p)}>
          {p}
          <span style={{fontSize:11, color: passwords[p] ? '#4ade80' : '#f59e0b', marginLeft:8}}>
            {passwords[p] ? '🔒' : '🔓 初回設定'}
          </span>
        </button>
      ))}
      <button style={S.adminBtn} onClick={onAdmin}>🔐 管理者としてログイン</button>
    </div>
  );
}

// ─── 管理者ビュー ──────────────────────────────────────────
function AdminView({ gameState, fetchingResults, onFetchResults, onSetResult, onSetTeam, pts, co, onSetupPlayers, onResetPlayers }) {
  const [adminDate, setAdminDate] = useState(fmtDate(ALL_MATCHES[0].kickoff));
  const [newNames, setNewNames]   = useState(['','','','','']);
  const [confirmReset, setConfirmReset] = useState(false);
  const S = styles;
  const dates = [...new Set(ALL_MATCHES.map(m => fmtDate(m.kickoff)))];
  const dayMatches = gameState.matches.filter(m => fmtDate(m.kickoff) === adminDate);

  return (
    <div style={S.adminWrap}>
      <h2 style={S.adminTitle}>🔐 管理者パネル</h2>

      {/* プレイヤー管理 */}
      <div style={S.adminSection}>
        <h3 style={S.sectionTitle}>👥 プレイヤー管理</h3>
        {gameState.players.length === 0 ? (
          // 未登録：登録フォーム
          <div>
            <p style={{color:'#94a3b8', fontSize:13, marginBottom:10}}>参加者の名前を入力してください（最大5人）</p>
            {newNames.map((n,i) => (
              <input key={i} style={{...S.nameInput, marginBottom:6}} placeholder={`プレイヤー${i+1}`}
                value={n} onChange={e => { const a=[...newNames]; a[i]=e.target.value; setNewNames(a); }} />
            ))}
            <button style={{...S.startBtn, marginTop:4}} onClick={() => {
              const players = newNames.filter(n => n.trim());
              if (!players.length) return alert('名前を1人以上入力してください');
              onSetupPlayers(players);
              setNewNames(['','','','','']);
            }}>
              ✅ 登録する
            </button>
          </div>
        ) : (
          // 登録済み：一覧 + リセット
          <div>
            <div style={{display:'flex', flexWrap:'wrap', gap:6, marginBottom:14}}>
              {gameState.players.map(p => (
                <span key={p} style={{background:'#1e3a5f', color:'#93c5fd', padding:'5px 12px', borderRadius:12, fontSize:13, fontWeight:600}}>
                  {p}
                </span>
              ))}
            </div>
            {!confirmReset ? (
              <button style={{...S.fetchBtn, background:'#7f1d1d', fontSize:13}}
                onClick={() => setConfirmReset(true)}>
                🔄 プレイヤーをリセット
              </button>
            ) : (
              <div style={{background:'#450a0a', borderRadius:8, padding:12}}>
                <p style={{color:'#fca5a5', fontSize:13, marginBottom:10}}>
                  ⚠️ リセットすると全員の予想データも削除されます。本当に実行しますか？
                </p>
                <div style={{display:'flex', gap:8}}>
                  <button style={{...S.fetchBtn, background:'#dc2626', flex:1}} onClick={() => { onResetPlayers(); setConfirmReset(false); }}>
                    はい、リセットする
                  </button>
                  <button style={{...S.fetchBtn, background:'#374151', flex:1}} onClick={() => setConfirmReset(false)}>
                    キャンセル
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* ランキング */}
      <div style={S.adminSection}>
        <h3 style={S.sectionTitle}>🏅 現在のランキング</h3>
        {co > 0 && <p style={S.carryNote}>🔥 キャリーオーバー: {co.toLocaleString()}pt</p>}
        {gameState.players.sort((a,b)=>(pts[b]||0)-(pts[a]||0)).map((p,i) => (
          <div key={p} style={S.adminRankRow}>
            <span>{i+1}位 {p}</span>
            <span style={{color: (pts[p]||0)>=0?'#4ade80':'#f87171'}}>{(pts[p]||0).toLocaleString()}pt</span>
          </div>
        ))}
      </div>

      {/* 自動取得 */}
      <div style={S.adminSection}>
        <h3 style={S.sectionTitle}>🤖 結果を自動取得</h3>
        <p style={{color:'#aaa', fontSize:13, marginBottom:8}}>キックオフ済みで未入力の試合（最大10試合）を自動取得します</p>
        <button style={S.fetchBtn} onClick={onFetchResults} disabled={fetchingResults}>
          {fetchingResults ? '取得中...' : '🤖 自動取得する'}
        </button>
      </div>

      {/* 手動入力 */}
      <div style={S.adminSection}>
        <h3 style={S.sectionTitle}>✏️ 結果を手動入力</h3>
        <div style={S.dateTabs}>
          {dates.map(d => (
            <button key={d} style={{...S.dateTab, ...(adminDate===d?S.dateTabActive:{})}}
              onClick={() => setAdminDate(d)}>{d}</button>
          ))}
        </div>
        {dayMatches.map(m => {
          const locked = isLocked(m.kickoff);
          return (
            <div key={m.id} style={S.adminMatchCard}>
              <div style={S.adminMatchHeader}>
                <span style={S.stageBadge}>{m.stage}</span>
                <span style={S.kickoffTime}>{fmtTime(m.kickoff)}</span>
              </div>

              {/* ノックアウト：チーム名変更 */}
              {m.home === 'TBD' || m.away === 'TBD' ? (
                <div style={S.tbdRow}>
                  <input style={S.tbdInput} value={m.home} placeholder="ホームチーム"
                    onChange={e => onSetTeam(m.id, 'home', e.target.value)} />
                  <span style={S.vs}>VS</span>
                  <input style={S.tbdInput} value={m.away} placeholder="アウェイチーム"
                    onChange={e => onSetTeam(m.id, 'away', e.target.value)} />
                </div>
              ) : (
                <div style={S.teams}>
                  <span style={S.teamName}>{m.home}</span>
                  <span style={S.vs}>VS</span>
                  <span style={S.teamName}>{m.away}</span>
                </div>
              )}

              {locked && (
                <div style={S.resultInputRow}>
                  <span style={S.scoreLabel}>結果:</span>
                  <input type="number" min="0" max="20"
                    defaultValue={m.result?.homeGoals ?? ''}
                    style={S.scoreInput}
                    onBlur={e => {
                      const ag = document.getElementById(`ag-${m.id}`);
                      if (e.target.value !== '' && ag?.value !== '') {
                        onSetResult(m.id, e.target.value, ag.value);
                      }
                    }} />
                  <span style={S.scoreSep}>-</span>
                  <input id={`ag-${m.id}`} type="number" min="0" max="20"
                    defaultValue={m.result?.awayGoals ?? ''}
                    style={S.scoreInput}
                    onBlur={e => {
                      const hg = e.target.previousSibling?.previousSibling;
                      if (e.target.value !== '' && hg?.value !== '') {
                        onSetResult(m.id, hg.value, e.target.value);
                      }
                    }} />
                  {m.result?.homeGoals !== undefined && (
                    <span style={S.savedBadge}>✅ {m.result.homeGoals}-{m.result.awayGoals}</span>
                  )}
                </div>
              )}
              {!locked && <span style={{color:'#666', fontSize:12}}>⏳ キックオフ前</span>}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── スタイル ──────────────────────────────────────────────
const styles = {
  app:        { maxWidth:600, margin:'0 auto', paddingBottom:40 },
  header:     { background:'#1a1a2e', padding:'12px 16px', display:'flex', justifyContent:'space-between', alignItems:'center', position:'sticky', top:0, zIndex:10 },
  logo:       { fontSize:18, fontWeight:700, color:'#ffd700' },
  headerRight:{ display:'flex', alignItems:'center', gap:8, flexWrap:'wrap' },
  saving:     { fontSize:12, color:'#aaa' },
  carryBadge: { background:'#7c2d12', color:'#fed7aa', padding:'2px 8px', borderRadius:12, fontSize:12 },
  userName:   { color:'#93c5fd', fontWeight:600 },
  logoutBtn:  { background:'transparent', border:'1px solid #444', color:'#aaa', padding:'4px 10px', borderRadius:6, cursor:'pointer', fontSize:12 },
  nav:        { display:'flex', background:'#111827', borderBottom:'1px solid #1f2937' },
  navBtn:     { flex:1, padding:'12px', background:'transparent', border:'none', color:'#9ca3af', cursor:'pointer', fontSize:14 },
  navActive:  { color:'#ffd700', borderBottom:'2px solid #ffd700' },
  msgBar:     { background:'#1e3a5f', color:'#93c5fd', padding:'8px 16px', fontSize:13, textAlign:'center' },
  dateTabs:   { display:'flex', overflowX:'auto', gap:4, padding:'8px 8px', background:'#0f172a' },
  dateTab:    { flexShrink:0, padding:'6px 12px', borderRadius:20, border:'1px solid #334155', background:'transparent', color:'#94a3b8', cursor:'pointer', fontSize:13 },
  dateTabActive:{ background:'#1d4ed8', color:'#fff', borderColor:'#1d4ed8' },
  dateTabDone:{ borderColor:'#059669', color:'#34d399' },
  matchList:  { padding:'8px 8px', display:'flex', flexDirection:'column', gap:8 },
  matchCard:  { background:'#1e293b', borderRadius:12, padding:14, border:'1px solid #334155' },
  matchCardDone:{ borderColor:'#065f46' },
  matchMeta:  { display:'flex', alignItems:'center', gap:8, marginBottom:8, flexWrap:'wrap' },
  stageBadge: { background:'#1e40af', color:'#bfdbfe', padding:'2px 8px', borderRadius:10, fontSize:11 },
  kickoffTime:{ color:'#94a3b8', fontSize:12 },
  lockBadge:  { color:'#fbbf24', fontSize:12 },
  doneBadge:  { color:'#34d399', fontSize:12 },
  teams:      { display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:10 },
  teamName:   { color:'#e2e8f0', fontWeight:600, fontSize:15, flex:1, textAlign:'center' },
  vs:         { color:'#64748b', fontSize:13, margin:'0 8px' },
  resultRow:  { textAlign:'center', marginBottom:8 },
  resultScore:{ fontSize:22, fontWeight:700, color:'#ffd700' },
  predRow:    { marginTop:8 },
  resultBtns: { display:'flex', gap:6, marginBottom:8, flexWrap:'wrap' },
  resBtn:     { flex:1, padding:'7px 4px', borderRadius:8, border:'1px solid #334155', background:'#0f172a', color:'#94a3b8', cursor:'pointer', fontSize:12, minWidth:80 },
  resBtnActive:{ background:'#1d4ed8', borderColor:'#1d4ed8', color:'#fff' },
  scoreRow:   { display:'flex', alignItems:'center', gap:8 },
  scoreLabel: { color:'#94a3b8', fontSize:12, whiteSpace:'nowrap' },
  scoreInput: { width:52, padding:'6px', borderRadius:6, border:'1px solid #334155', background:'#0f172a', color:'#fff', textAlign:'center', fontSize:16 },
  scoreSep:   { color:'#64748b', fontSize:18 },
  allPreds:   { marginTop:10, display:'flex', flexDirection:'column', gap:4 },
  playerPred: { display:'flex', alignItems:'center', gap:8, padding:'4px 0', borderTop:'1px solid #1e293b' },
  predName:   { color:'#94a3b8', fontSize:12, width:80, flexShrink:0 },
  predResult: { color:'#cbd5e1', fontSize:12, flex:1 },
  predScore:  { color:'#cbd5e1', fontSize:12, width:50, textAlign:'right' },
  correct:    { color:'#4ade80', fontWeight:700 },
  wrong:      { color:'#f87171' },
  noPred:     { color:'#f59e0b', fontSize:12 },
  ranking:    { padding:16 },
  rankTitle:  { fontSize:20, fontWeight:700, marginBottom:12, color:'#ffd700', textAlign:'center' },
  carryNote:  { color:'#fed7aa', fontSize:13, textAlign:'center', marginBottom:12 },
  rankRow:    { display:'flex', alignItems:'center', gap:12, padding:'12px 16px', background:'#1e293b', borderRadius:10, marginBottom:8 },
  rank1:      { background:'#78350f', border:'1px solid #fbbf24' },
  rank2:      { background:'#1c1917', border:'1px solid #9ca3af' },
  rank3:      { background:'#1c1917', border:'1px solid #b45309' },
  rankPos:    { fontSize:22, width:36 },
  rankName:   { flex:1, fontSize:16, fontWeight:600 },
  rankPts:    { fontSize:18, fontWeight:700, color:'#ffd700' },
  loginBox:   { maxWidth:400, margin:'60px auto', padding:24, background:'#1e293b', borderRadius:16, display:'flex', flexDirection:'column', gap:12 },
  loginTitle: { fontSize:24, fontWeight:700, color:'#ffd700', textAlign:'center' },
  loginSub:   { color:'#94a3b8', textAlign:'center', fontSize:14 },
  nameInput:  { padding:'10px 14px', borderRadius:8, border:'1px solid #334155', background:'#0f172a', color:'#fff', fontSize:15, outline:'none' },
  startBtn:   { padding:'12px', borderRadius:10, background:'#1d4ed8', color:'#fff', border:'none', cursor:'pointer', fontSize:16, fontWeight:700, marginTop:8 },
  playerBtn:  { padding:'14px', borderRadius:10, background:'#1e3a5f', color:'#93c5fd', border:'1px solid #1d4ed8', cursor:'pointer', fontSize:16, fontWeight:600 },
  adminBtn:   { padding:'10px', borderRadius:10, background:'#3b0764', color:'#c4b5fd', border:'1px solid #7c3aed', cursor:'pointer', fontSize:14, marginTop:8 },
  errMsg:     { color:'#f87171', fontSize:13, textAlign:'center', margin:0 },
  backBtn:    { padding:'8px', borderRadius:10, background:'transparent', color:'#94a3b8', border:'1px solid #334155', cursor:'pointer', fontSize:14 },
  center:     { display:'flex', justifyContent:'center', alignItems:'center', height:'100vh', color:'#aaa' },
  champWrap:       { padding:16 },
  champTitle:      { fontSize:20, fontWeight:700, color:'#ffd700', textAlign:'center', marginBottom:4 },
  champSub:        { color:'#94a3b8', fontSize:13, textAlign:'center', marginBottom:12 },
  lockNote:        { color:'#fbbf24', fontSize:12, textAlign:'center', marginBottom:8 },
  myPicksRow:      { display:'flex', gap:10, marginBottom:14, justifyContent:'center' },
  myPickBox:       { flex:1, maxWidth:160, padding:'12px 8px', borderRadius:10, border:'2px dashed #334155', color:'#64748b', textAlign:'center', fontSize:14 },
  myPickBoxFilled: { border:'2px solid #ffd700', color:'#ffd700', fontWeight:700, background:'#1c1700' },
  teamGrid:        { display:'flex', flexWrap:'wrap', gap:6, marginBottom:8 },
  teamChip:        { padding:'6px 12px', borderRadius:20, border:'1px solid #334155', background:'#1e293b', color:'#cbd5e1', cursor:'pointer', fontSize:13 },
  teamChipSel:     { background:'#1d4ed8', borderColor:'#3b82f6', color:'#fff', fontWeight:700 },
  teamChipDisabled:{ opacity:0.35, cursor:'default' },
  amidaSection:    { background:'#1e293b', borderRadius:12, padding:14, marginBottom:12 },
  champAllWrap:    { marginTop:12, background:'#1e293b', borderRadius:12, padding:14 },
  champAllTitle:   { fontSize:15, fontWeight:600, color:'#e2e8f0', marginBottom:12 },
  champRow:        { display:'flex', alignItems:'center', gap:10, padding:'8px 0', borderBottom:'1px solid #0f172a' },
  champName:       { color:'#94a3b8', fontSize:13, width:80, flexShrink:0 },
  champPicksRow:   { display:'flex', gap:6, flexWrap:'wrap' },
  champBadge:      { background:'#1c3a1c', border:'1px solid #166534', color:'#4ade80', padding:'3px 10px', borderRadius:12, fontSize:12, fontWeight:600 },
  rulesWrap:  { background:'#0f172a', borderRadius:10, overflow:'hidden', border:'1px solid #1e3a5f' },
  rulesToggle:{ width:'100%', padding:'10px 14px', background:'transparent', border:'none', color:'#93c5fd', cursor:'pointer', fontSize:14, fontWeight:600, textAlign:'left' },
  rulesBody:  { padding:'0 14px 14px' },
  rulesHeading:{ color:'#fbbf24', fontWeight:700, fontSize:13, margin:'10px 0 4px' },
  rulesList:  { color:'#cbd5e1', fontSize:12, lineHeight:1.7, paddingLeft:16, margin:0 },
  adminWrap:  { padding:16 },
  adminTitle: { fontSize:20, fontWeight:700, color:'#c4b5fd', marginBottom:16, textAlign:'center' },
  adminSection:{ background:'#1e293b', borderRadius:12, padding:16, marginBottom:12 },
  sectionTitle:{ fontSize:15, fontWeight:600, color:'#e2e8f0', marginBottom:12 },
  adminRankRow:{ display:'flex', justifyContent:'space-between', padding:'6px 0', borderBottom:'1px solid #0f172a', fontSize:14 },
  fetchBtn:   { padding:'10px 20px', background:'#059669', color:'#fff', border:'none', borderRadius:8, cursor:'pointer', fontSize:14, fontWeight:600 },
  adminMatchCard:{ background:'#0f172a', borderRadius:10, padding:12, marginBottom:8 },
  adminMatchHeader:{ display:'flex', gap:8, alignItems:'center', marginBottom:6 },
  tbdRow:     { display:'flex', alignItems:'center', gap:8, marginBottom:8 },
  tbdInput:   { flex:1, padding:'6px', borderRadius:6, border:'1px solid #334155', background:'#1e293b', color:'#fff', fontSize:13 },
  resultInputRow:{ display:'flex', alignItems:'center', gap:8, marginTop:8 },
  savedBadge: { color:'#4ade80', fontSize:12 },
};
