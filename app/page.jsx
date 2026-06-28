'use client';
import { useState, useEffect, useMemo, useRef } from 'react';

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
  {id:73, home:'南アフリカ',   away:'カナダ',         kickoff:'2026-06-29T04:00:00+09:00', stage:'ラウンド32'},
  {id:74, home:'ドイツ',       away:'パラグアイ',     kickoff:'2026-06-30T05:30:00+09:00', stage:'ラウンド32'},
  {id:75, home:'オランダ',     away:'モロッコ',       kickoff:'2026-06-30T10:00:00+09:00', stage:'ラウンド32'},
  {id:76, home:'ブラジル',     away:'日本',           kickoff:'2026-06-30T02:00:00+09:00', stage:'ラウンド32'},
  {id:77, home:'フランス',     away:'スウェーデン',   kickoff:'2026-07-01T06:00:00+09:00', stage:'ラウンド32'},
  {id:78, home:'コートジボワール',away:'ノルウェー',  kickoff:'2026-07-01T02:00:00+09:00', stage:'ラウンド32'},
  {id:79, home:'メキシコ',     away:'エクアドル',     kickoff:'2026-07-01T10:00:00+09:00', stage:'ラウンド32'},
  {id:80, home:'イングランド', away:'コンゴDR',       kickoff:'2026-07-02T01:00:00+09:00', stage:'ラウンド32'},
  {id:81, home:'アメリカ',     away:'ボスニア',       kickoff:'2026-07-02T09:00:00+09:00', stage:'ラウンド32'},
  {id:82, home:'ベルギー',     away:'セネガル',       kickoff:'2026-07-02T05:00:00+09:00', stage:'ラウンド32'},
  {id:83, home:'ポルトガル',   away:'クロアチア',     kickoff:'2026-07-03T08:00:00+09:00', stage:'ラウンド32'},
  {id:84, home:'スペイン',     away:'オーストリア',   kickoff:'2026-07-03T04:00:00+09:00', stage:'ラウンド32'},
  {id:85, home:'スイス',       away:'アルジェリア',   kickoff:'2026-07-03T12:00:00+09:00', stage:'ラウンド32'},
  {id:86, home:'アルゼンチン', away:'カーボベルデ',   kickoff:'2026-07-04T07:00:00+09:00', stage:'ラウンド32'},
  {id:87, home:'コロンビア',   away:'ガーナ',         kickoff:'2026-07-04T10:30:00+09:00', stage:'ラウンド32'},
  {id:88, home:'オーストラリア',away:'エジプト',      kickoff:'2026-07-04T03:00:00+09:00', stage:'ラウンド32'},
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

// ─── 放送チャンネル（地上波がある試合も BSP4K/DAZN を併記） ─────────────
const CHANNELS = {
  // グループステージ（6/12〜6/16 は画像スケジュールより）
  1:  'NHK総合・BSP4K/DAZN',    // メキシコ×南アフリカ
  5:  'NHK総合・BSP4K/DAZN',    // カタール×スイス
  6:  'フジテレビ・BSP4K/DAZN', // ブラジル×モロッコ
  8:  '日テレ・BSP4K/DAZN',     // オーストラリア×トルコ
  10: 'NHK総合・BSP4K/DAZN',    // オランダ×日本
  13: 'NHK総合・BSP4K/DAZN',    // スペイン×カーボベルデ
  // 6/17〜 は goal.com 情報より
  17: 'フジテレビ・BSP4K/DAZN', // フランス×セネガル
  19: 'NHK総合・BSP4K/DAZN',    // アルゼンチン×アルジェリア
  21: 'フジテレビ・BSP4K/DAZN', // ポルトガル×DRコンゴ
  25: '日テレ・BSP4K/DAZN',     // チェコ×南アフリカ
  28: 'NHK総合・BSP4K/DAZN',    // メキシコ×韓国
  29: 'NHK総合・BSP4K/DAZN',    // アメリカ×オーストラリア
  30: 'フジテレビ・BSP4K/DAZN', // スコットランド×モロッコ
  31: 'NHK総合・BSP4K/DAZN',    // ブラジル×ハイチ
  33: 'NHK総合・BSP4K/DAZN',    // オランダ×スウェーデン
  34: '日テレ・BSP4K/DAZN',     // ドイツ×コートジボワール
  36: '日テレ・BSP4K/DAZN',     // チュニジア×日本（NHK BS生+日テレ）
  37: 'NHK総合・BSP4K/DAZN',    // スペイン×サウジアラビア
  43: 'NHK総合・BSP4K/DAZN',    // ノルウェー×セネガル
  45: 'NHK総合・BSP4K/DAZN',    // ポルトガル×ウズベキスタン
  47: 'フジテレビ・BSP4K/DAZN', // パナマ×クロアチア
  48: '日テレ・BSP4K/DAZN',     // コロンビア×DRコンゴ
  49: 'NHK総合・BSP4K/DAZN',    // スイス×カナダ
  54: 'NHK総合・BSP4K/DAZN',    // チェコ×メキシコ
  58: 'NHK総合・BSP4K/DAZN',    // 日本×スウェーデン
  59: '日テレ・BSP4K/DAZN',     // トルコ×アメリカ
  61: 'NHK総合・BSP4K/DAZN',    // ノルウェー×フランス
  64: '日テレ・BSP4K/DAZN',     // ウルグアイ×スペイン
  65: 'フジテレビ・BSP4K/DAZN', // ニュージーランド×ベルギー
  69: 'フジテレビ・BSP4K/DAZN', // コロンビア×ポルトガル
  72: 'NHK総合・BSP4K/DAZN',    // ヨルダン×アルゼンチン
  // ラウンド32
  78: '日テレ・BSP4K/DAZN',     // 7/1 2:00
  83: '日テレ・BSP4K/DAZN',     // 7/3 8:00
  86: '日テレ・BSP4K/DAZN',     // 7/4 7:00
  // ラウンド16
  89: '日テレ・BSP4K/DAZN',     // 7/5 6:00
  93: '日テレ・BSP4K/DAZN',     // 7/7 4:00
  // 3位決定戦・決勝
  103: 'NHK総合・BSP4K/DAZN',
  104: 'NHK総合・BSP4K/DAZN',
};
function getChannel(matchId) {
  return CHANNELS[matchId] || 'BSP4K/DAZN';
}

// ─── ノックアウトブラケット（勝者自動伝播） ──────────────────
// key: 試合ID, home/away: その試合のホーム/アウェイを決める前ラウンドの試合ID
// loser: true のときは敗者（3位決定戦）
const BRACKET = {
  // ラウンド16
  90:  { home: 73,  away: 75  },
  89:  { home: 74,  away: 77  },
  91:  { home: 76,  away: 78  },
  92:  { home: 79,  away: 80  },
  93:  { home: 83,  away: 84  },
  94:  { home: 81,  away: 82  },
  95:  { home: 86,  away: 88  },
  96:  { home: 85,  away: 87  },
  // 準々決勝
  97:  { home: 89,  away: 90  },
  98:  { home: 93,  away: 94  },
  99:  { home: 91,  away: 92  },
  100: { home: 95,  away: 96  },
  // 準決勝
  101: { home: 97,  away: 98  },
  102: { home: 99,  away: 100 },
  // 3位決定戦（準決勝の敗者）
  103: { home: 101, away: 102, loser: true },
  // 決勝（準決勝の勝者）
  104: { home: 101, away: 102 },
};

function propagateWinners(matches) {
  const map = Object.fromEntries(matches.map(m => [m.id, { ...m }]));
  for (const [destId, src] of Object.entries(BRACKET)) {
    const dest = map[Number(destId)];
    if (!dest) continue;
    const pick = (srcMatch, wantLoser) => {
      if (!srcMatch?.result || srcMatch.result.homeGoals === null) return null;
      const { homeGoals, awayGoals } = srcMatch.result;
      if (homeGoals === awayGoals) return null;
      const winner = homeGoals > awayGoals ? srcMatch.home : srcMatch.away;
      const loser  = homeGoals > awayGoals ? srcMatch.away : srcMatch.home;
      return wantLoser ? loser : winner;
    };
    const newHome = pick(map[src.home], src.loser);
    const newAway = pick(map[src.away], src.loser);
    if (newHome) dest.home = newHome;
    if (newAway) dest.away = newAway;
  }
  return matches.map(m => map[m.id]);
}

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

// まだ結果が出ていない最初の試合の日付を返す
function getFirstUnresultedDate(matches) {
  const unresulted = matches?.find(m => !m.result || m.result.homeGoals === null || m.result.homeGoals === undefined);
  if (unresulted) return fmtDate(unresulted.kickoff);
  // 全試合終了後は最終日
  const allDates = [...new Set(ALL_MATCHES.map(m => fmtDate(m.kickoff)))];
  return allDates[allDates.length - 1];
}
function getResult(hg, ag) {
  if (hg > ag) return 'home';
  if (hg < ag) return 'away';
  return 'draw';
}

// ─── 同率タイ時の決定論的ランダム抽選 ────────────────────────
// シードが同じなら何度計算しても同じプレイヤーが選ばれる
function seededPick(arr, seed) {
  if (arr.length === 1) return arr[0];
  let h = (seed * 1664525 + 1013904223) & 0xffffffff;
  h = Math.imul(h ^ (h >>> 16), 0x45d9f3b);
  h = Math.imul(h ^ (h >>> 16), 0x45d9f3b);
  h = h ^ (h >>> 16);
  return arr[Math.abs(h) % arr.length];
}

// ─── ポイント計算 ─────────────────────────────────────────
// 結果が確定した試合をキックオフ時刻でグループ化（同時キックオフ対応）
function groupByKickoff(matches) {
  const groups = [];
  const seen = {};
  matches.forEach(m => {
    if (!m.result || m.result.homeGoals === null || m.result.homeGoals === undefined) return;
    const key = m.kickoff;
    if (!seen[key]) { seen[key] = []; groups.push(seen[key]); }
    seen[key].push(m);
  });
  return groups;
}

function calcPoints(matches, players) {
  const pts = {};
  players.forEach(p => pts[p] = 0);
  let carryover = 0;

  groupByKickoff(matches).forEach(group => {
    // ─ 勝敗ベット（各試合独立） ─
    group.forEach(m => {
      const { homeGoals, awayGoals } = m.result;
      const correctResult = getResult(homeGoals, awayGoals);
      const resultWinners = players.filter(p => m.predictions?.[p]?.result === correctResult);
      if (resultWinners.length > 0) {
        const pool = BET_RESULT * players.length;
        players.forEach(p => { pts[p] -= BET_RESULT; });
        const share = Math.floor(pool / resultWinners.length);
        const rem = pool % resultWinners.length;
        resultWinners.forEach(p => { pts[p] += share; });
        if (rem > 0) {
          const tied = resultWinners.filter(p => pts[p] === Math.min(...resultWinners.map(w => pts[w])));
          pts[seededPick(tied, m.id * 10000 + pool)] += rem;
        }
      }
    });

    // ─ スコアベット（同時キックオフは的中者全員で1プールを山分け） ─
    const winnersList = group.map(m => {
      const { homeGoals, awayGoals } = m.result;
      return players.filter(p => {
        const pred = m.predictions?.[p];
        return pred && Number(pred.homeGoals) === homeGoals && Number(pred.awayGoals) === awayGoals;
      });
    });
    const nW = winnersList.filter(w => w.length > 0).length;
    const nL = group.length - nW;
    group.forEach(() => players.forEach(p => { pts[p] -= BET_SCORE; }));

    if (nW > 0) {
      // 的中者がいる試合のベット分 + キャリーオーバーを1プールに集約し全員で山分け
      const totalPool = BET_SCORE * players.length * nW + carryover;
      const allWinners = winnersList.filter(w => w.length > 0).flat();
      const share = Math.floor(totalPool / allWinners.length);
      const rem = totalPool % allWinners.length;
      allWinners.forEach(p => { pts[p] += share; });
      if (rem > 0) {
        const tied = allWinners.filter(p => pts[p] === Math.min(...allWinners.map(w => pts[w])));
        pts[seededPick(tied, group[0].id * 10000 + 1 + totalPool)] += rem;
      }
      carryover = BET_SCORE * players.length * nL; // 的中者なし試合分のみ次のキャリーオーバーへ
    } else {
      carryover += BET_SCORE * players.length * group.length;
    }
  });

  return { pts, carryover };
}

// ─── プレイヤー別ポイント変遷計算 ────────────────────────────
function calcPlayerHistory(targetPlayer, matches, players) {
  const history = [];
  let carryover = 0;
  let cumulative = 0;
  const allPts = {};
  players.forEach(p => allPts[p] = 0);

  groupByKickoff(matches).forEach(group => {
    const n = players.length;

    // ─ 勝敗ベット（各試合独立） ─
    group.forEach(m => {
      const { homeGoals, awayGoals } = m.result;
      const correctResult = getResult(homeGoals, awayGoals);
      const pred = m.predictions?.[targetPlayer];
      const resultWinners = players.filter(p => m.predictions?.[p]?.result === correctResult);
      const myResultCorrect = pred?.result === correctResult;
      const noResultWinner = resultWinners.length === 0;
      let resultDelta = 0;
      let resultRemInfo = null;
      if (!noResultWinner) {
        const resultPool = BET_RESULT * n;
        players.forEach(p => { allPts[p] -= BET_RESULT; });
        const share = Math.floor(resultPool / resultWinners.length);
        const rem = resultPool % resultWinners.length;
        resultWinners.forEach(p => { allPts[p] += share; });
        let remRecipient = null;
        if (rem > 0) {
          const tied = resultWinners.filter(p => allPts[p] === Math.min(...resultWinners.map(w => allPts[w])));
          remRecipient = seededPick(tied, m.id * 10000 + resultPool);
          allPts[remRecipient] += rem;
          resultRemInfo = { amount: rem, recipient: remRecipient, wasLottery: tied.length > 1 };
        }
        resultDelta = myResultCorrect
          ? share - BET_RESULT + (remRecipient === targetPlayer ? rem : 0)
          : -BET_RESULT;
      }
      // 勝敗デルタを一時記録（スコアベット処理後にまとめてpush）
      m._resultDelta = resultDelta;
      m._resultRemInfo = resultRemInfo;
      m._myResultCorrect = myResultCorrect;
      m._noResultWinner = noResultWinner;
    });

    // ─ スコアベット（同時キックオフは的中者全員で1プールを山分け） ─
    const winnersList = group.map(m => {
      const { homeGoals, awayGoals } = m.result;
      return players.filter(p => {
        const pred = m.predictions?.[p];
        return pred && Number(pred.homeGoals) === homeGoals && Number(pred.awayGoals) === awayGoals;
      });
    });
    const nW = winnersList.filter(w => w.length > 0).length;
    const nL = group.length - nW;
    group.forEach(() => players.forEach(p => { allPts[p] -= BET_SCORE; }));

    let scoreShare = 0, scoreRem = 0, remRecipientScore = null, usedCarryoverTotal = 0;
    if (nW > 0) {
      const totalPool = BET_SCORE * n * nW + carryover;
      const allWinners = winnersList.filter(w => w.length > 0).flat();
      scoreShare = Math.floor(totalPool / allWinners.length);
      scoreRem = totalPool % allWinners.length;
      allWinners.forEach(p => { allPts[p] += scoreShare; });
      if (scoreRem > 0) {
        const tied = allWinners.filter(p => allPts[p] === Math.min(...allWinners.map(w => allPts[w])));
        remRecipientScore = seededPick(tied, group[0].id * 10000 + 1 + totalPool);
        allPts[remRecipientScore] += scoreRem;
      }
      usedCarryoverTotal = carryover;
      carryover = BET_SCORE * n * nL;
    } else {
      carryover += BET_SCORE * n * group.length;
    }

    // 余り・キャリーオーバー表示は最初の的中試合に付与
    const firstWinIdx = winnersList.findIndex(w => w.length > 0);

    group.forEach((m, i) => {
      const { homeGoals, awayGoals } = m.result;
      const pred = m.predictions?.[targetPlayer];
      const myScoreCorrect = pred
        ? (Number(pred.homeGoals) === homeGoals && Number(pred.awayGoals) === awayGoals)
        : false;
      const noScoreWinner = winnersList[i].length === 0;
      let scoreDelta = -BET_SCORE;
      let scoreRemInfo = null;
      const usedCarryover = (i === firstWinIdx) ? usedCarryoverTotal : 0;

      if (myScoreCorrect) {
        scoreDelta = scoreShare - BET_SCORE + (remRecipientScore === targetPlayer ? scoreRem : 0);
      }
      if (i === firstWinIdx && scoreRem > 0) {
        scoreRemInfo = { amount: scoreRem, recipient: remRecipientScore, wasLottery: true };
      }

      const delta = m._resultDelta + scoreDelta;
      cumulative += delta;
      history.push({
        home: m.home, away: m.away, homeGoals, awayGoals,
        resultDelta: m._resultDelta, scoreDelta, delta, cumulative,
        myResultCorrect: m._myResultCorrect, myScoreCorrect,
        noResultWinner: m._noResultWinner, noScoreWinner,
        usedCarryover,
        resultRemInfo: m._resultRemInfo, scoreRemInfo,
      });
    });
  });

  return history;
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
  // ─ 予想入力：ローカル状態（未確定の入力） ─
  const [localPreds, setLocalPreds] = useState({});  // { matchId: { result, homeGoals, awayGoals } }
  const [predsReady, setPredsReady] = useState(false); // localPredsの初期化完了フラグ
  const [savingMatch, setSavingMatch] = useState({});  // { matchId: bool }

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
      const res = await fetch('/api/game-state?' + Date.now(), {
        cache: 'no-store',
        headers: { 'Cache-Control': 'no-cache', 'Pragma': 'no-cache' },
      });
      const data = await res.json();
      if (data && data.players && data.players.length > 0) {
        // ALL_MATCHESのチーム名でTBDを補完（R32チーム名反映 / 勝者自動伝播）
        const allMatchMap = Object.fromEntries(ALL_MATCHES.map(m => [m.id, m]));
        let needsSync = false;
        const syncedMatches = propagateWinners(data.matches.map(m => {
          const base = allMatchMap[m.id];
          if (!base) return m;
          let u = m;
          // ラウンド32は常にALL_MATCHESで上書き（壊れたデータも修正）、他はTBDのみ補完
          const forceUpdate = m.stage === 'ラウンド32';
          if ((forceUpdate || m.home === 'TBD') && base.home !== 'TBD') { u = { ...u, home: base.home }; needsSync = true; }
          if ((forceUpdate || m.away === 'TBD') && base.away !== 'TBD') { u = { ...u, away: base.away }; needsSync = true; }
          return u;
        }));
        const finalData = needsSync ? { ...data, matches: syncedMatches } : data;
        if (needsSync) saveState(finalData); // Redisにも即反映
        setGameState(finalData);
        backupPlayers(finalData.players, finalData.playerPasswords); // localStorageにもバックアップ
        setSelDate(getFirstUnresultedDate(finalData.matches));
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
        setSelDate(getFirstUnresultedDate(null));
      }
    } catch {
      // 通信エラー時もlocalStorageから復元
      const { players, passwords } = restorePlayers();
      setGameState({ players, matches: initMatches(), carryover: 0, playerPasswords: passwords });
      setSelDate(getFirstUnresultedDate(null));
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
      else {
        let errDetail = '';
        try { const errBody = await res.json(); errDetail = errBody.error || ''; } catch {}
        setMsg(`⚠️ 保存に失敗しました（${res.status}${errDetail ? ': ' + errDetail : ''}）`);
      }
    } catch (e) { setMsg('⚠️ 保存に失敗しました: ' + e.message); }
    setSaving(false);
    return success;
  }

  // ─ 日付タブのスクロール用ref ─
  const dateTabsContainerRef = useRef(null);
  const selectedDateTabRef   = useRef(null);

  // 選択中の日付タブが見えるようにタブバーをスクロール
  useEffect(() => {
    if (!dateTabsContainerRef.current || !selectedDateTabRef.current) return;
    const container = dateTabsContainerRef.current;
    const tab = selectedDateTabRef.current;
    container.scrollLeft = tab.offsetLeft - 8;
  }, [selDate]);

  // ─ 次の試合へのスクロール用ref ─
  const nextMatchRef = useRef(null);

  // 日付タブが切り替わったら次の試合へスクロール
  useEffect(() => {
    if (!nextMatchRef.current) return;
    const timer = setTimeout(() => {
      nextMatchRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
    return () => clearTimeout(timer);
  }, [selDate]);

  // ─ プレイヤー未登録時：5秒ごとにサーバーを自動確認 ─
  const [pollStatus, setPollStatus] = useState('');

  // ─ ランキング：クリックで変遷表示するプレイヤー ─
  const [selectedRankPlayer, setSelectedRankPlayer] = useState(null);

  // ─ localPredsの初期化：meとgameStateが揃ったタイミングで1度だけ実行 ─
  // （me変更時はリセット → meとgameStateが両方揃ったら既存予想を読み込む）
  useEffect(() => {
    if (!me) { setLocalPreds({}); setPredsReady(false); return; }
  }, [me]);

  useEffect(() => {
    if (!me || !gameState?.matches || predsReady) return;
    const init = {};
    gameState.matches.forEach(m => {
      if (m.predictions?.[me]) init[m.id] = { ...m.predictions[me] };
    });
    setLocalPreds(init);
    setPredsReady(true);
  }, [me, gameState, predsReady]); // eslint-disable-line react-hooks/exhaustive-deps

  async function checkServerPlayers() {
    setPollStatus('確認中...');
    try {
      const res = await fetch('/api/game-state?' + Date.now()); // キャッシュバイパス
      const data = await res.json();
      if (data && data.players && data.players.length > 0) {
        setGameState(data);
        backupPlayers(data.players, data.playerPasswords);
        setSelDate(getFirstUnresultedDate(data.matches));
        setPollStatus('');
      } else {
        const now = new Date();
        setPollStatus(`最終確認: ${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}:${String(now.getSeconds()).padStart(2,'0')} — 未登録`);
      }
    } catch (e) {
      setPollStatus('確認エラー: ' + e.message);
    }
  }

  useEffect(() => {
    if (!gameState || gameState.players.length > 0 || isAdmin) return;
    checkServerPlayers(); // 即座に1回確認
    const timer = setInterval(checkServerPlayers, 5000);
    return () => clearInterval(timer);
  }, [gameState?.players?.length, isAdmin]);

  // ─ 日付リスト ─
  const dates = useMemo(() => {
    const set = new Set(ALL_MATCHES.map(m => fmtDate(m.kickoff)));
    return [...set]; // 古い日付が左・新しい日付が右
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

  // ─ 試合ごとの自分のポイント計算（結果表示用） ─
  const matchPointsMap = useMemo(() => {
    if (!gameState || !me) return {};
    const map = {};
    let carryover = 0;
    const allPts = {};
    gameState.players.forEach(p => allPts[p] = 0);

    gameState.matches.forEach(m => {
      if (!m.result || m.result.homeGoals === null) { return; }
      const { homeGoals, awayGoals } = m.result;
      const correctResult = getResult(homeGoals, awayGoals);
      const n = gameState.players.length;
      const pred = m.predictions?.[me];

      // 勝敗予想（誰も当たらなければ変動なし）
      const resultWinners = gameState.players.filter(p => m.predictions?.[p]?.result === correctResult);
      const myResultCorrect = pred?.result === correctResult;
      const noResultWinner = resultWinners.length === 0;
      let resultDelta = 0;
      if (!noResultWinner) {
        const resultPool = BET_RESULT * n;
        gameState.players.forEach(p => { allPts[p] -= BET_RESULT; });
        const share = Math.floor(resultPool / resultWinners.length);
        const rem = resultPool % resultWinners.length;
        resultWinners.forEach(p => { allPts[p] += share; });
        let remRecipient = null;
        if (rem > 0) {
          const tied = resultWinners.filter(p => allPts[p] === Math.min(...resultWinners.map(w => allPts[w])));
          remRecipient = seededPick(tied, m.id * 10000 + resultPool);
          allPts[remRecipient] += rem;
        }
        resultDelta = myResultCorrect
          ? share - BET_RESULT + (remRecipient === me ? rem : 0)
          : -BET_RESULT;
      }

      // スコア予想
      const scorePool = BET_SCORE * n + carryover;
      const scoreWinners = gameState.players.filter(p => {
        const pp = m.predictions?.[p];
        return pp && Number(pp.homeGoals) === homeGoals && Number(pp.awayGoals) === awayGoals;
      });
      const myScoreCorrect = pred
        ? (Number(pred.homeGoals) === homeGoals && Number(pred.awayGoals) === awayGoals)
        : false;
      const noScoreWinner = scoreWinners.length === 0;
      gameState.players.forEach(p => { allPts[p] -= BET_SCORE; });
      let scoreDelta = -BET_SCORE;
      if (!noScoreWinner) {
        const share = Math.floor(scorePool / scoreWinners.length);
        const rem = scorePool % scoreWinners.length;
        scoreWinners.forEach(p => { allPts[p] += share; });
        let remRecipient = null;
        if (rem > 0) {
          const tied = scoreWinners.filter(p => allPts[p] === Math.min(...scoreWinners.map(w => allPts[w])));
          remRecipient = seededPick(tied, m.id * 10000 + 1 + scorePool);
          allPts[remRecipient] += rem;
        }
        if (myScoreCorrect) {
          scoreDelta = share - BET_SCORE + (remRecipient === me ? rem : 0);
        }
        carryover = 0;
      } else {
        carryover += BET_SCORE * n;
      }

      map[m.id] = { resultDelta, scoreDelta, total: resultDelta + scoreDelta, myResultCorrect, myScoreCorrect, noScoreWinner };
    });
    return map;
  }, [gameState, me]);

  // ─ データ読み込み中（localStorage復元直後など） ─
  if (loading || !gameState) {
    return <div style={styles.center}>読み込み中...</div>;
  }

  // ─ ログイン画面 ─
  if (!me && !isAdmin) {
    return <LoginScreen
      gameState={gameState}
      pollStatus={pollStatus}
      onManualCheck={checkServerPlayers}
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

  // ─ プレイヤー予想入力（ローカル状態のみ更新。確定ボタンで保存） ─
  function setLocalPred(matchId, field, value) {
    setLocalPreds(prev => ({
      ...prev,
      [matchId]: { ...(prev[matchId] || {}), [field]: value },
    }));
  }

  // ─ 予想の確定保存（1試合分だけサーバーに保存）─
  async function confirmPrediction(matchId) {
    setSavingMatch(prev => ({ ...prev, [matchId]: true }));
    try {
      // サーバーの最新データを取得（他プレイヤーの予想を保護するため）
      const res = await fetch('/api/game-state?' + Date.now(), {
        cache: 'no-store',
        headers: { 'Cache-Control': 'no-cache', 'Pragma': 'no-cache' },
      });
      const serverState = await res.json();
      if (!serverState?.players?.length) {
        setSavingMatch(prev => ({ ...prev, [matchId]: false }));
        return;
      }

      // この試合だけ自分の予想を更新（他の試合は一切触らない）
      const myPred = localPreds[matchId] || {};
      // スコアは両方入力されていて空でない場合のみ保存
      const hg = (myPred.homeGoals !== '' && myPred.homeGoals !== undefined && myPred.homeGoals !== null)
        ? myPred.homeGoals : null;
      const ag = (myPred.awayGoals !== '' && myPred.awayGoals !== undefined && myPred.awayGoals !== null)
        ? myPred.awayGoals : null;
      const hasScore = hg !== null && ag !== null;
      const savePred = {};
      if (myPred.result) savePred.result = myPred.result;
      if (hasScore) { savePred.homeGoals = hg; savePred.awayGoals = ag; }

      const mergedMatches = serverState.matches.map(sm => {
        if (sm.id !== matchId) return sm; // 他の試合は絶対に変更しない
        const newPreds = { ...sm.predictions };
        if (Object.keys(savePred).length > 0) newPreds[me] = savePred;
        else delete newPreds[me];
        return { ...sm, predictions: newPreds };
      });
      const merged = { ...serverState, matches: mergedMatches };
      setGameState(merged);

      const saveRes = await fetch('/api/game-state', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(merged),
      });
      if (!saveRes.ok) {
        let errDetail = '';
        try { const eb = await saveRes.json(); errDetail = eb.error || ''; } catch {}
        setMsg(`⚠️ 保存に失敗しました（${saveRes.status}${errDetail ? ': ' + errDetail : ''}）`);
      } else {
        setMsg('✅ 予想を保存しました');
        setTimeout(() => setMsg(m => m === '✅ 予想を保存しました' ? '' : m), 2000);
      }
    } catch (e) { setMsg('⚠️ 保存に失敗しました: ' + e.message); }
    setSavingMatch(prev => ({ ...prev, [matchId]: false }));
  }

  // ─ サーバーの最新状態を取得するヘルパー ─
  async function fetchLatestState() {
    const res = await fetch('/api/game-state?' + Date.now(), {
      cache: 'no-store',
      headers: { 'Cache-Control': 'no-cache', 'Pragma': 'no-cache' },
    });
    const data = await res.json();
    return (data && data.players) ? data : gameState;
  }

  // ─ 管理者：結果入力（プレイヤーの予想を消さないよう最新状態を取得してから保存） ─
  async function setMatchResult(matchId, homeGoals, awayGoals) {
    try {
      const latest = await fetchLatestState();
      const updated = latest.matches.map(m => {
        if (m.id !== matchId) return m;
        return { ...m, result: { homeGoals: Number(homeGoals), awayGoals: Number(awayGoals) } };
      });
      // ノックアウト勝者を次ラウンドの試合に自動反映
      const nm = propagateWinners(updated);
      const ns = { ...latest, matches: nm };
      setGameState(ns);
      saveState(ns);
    } catch (e) {
      setMsg('⚠️ 結果保存に失敗しました: ' + e.message);
    }
  }

  // ─ 管理者：チーム名変更（ノックアウト）─
  async function setTeamName(matchId, field, value) {
    try {
      const latest = await fetchLatestState();
      const nm = latest.matches.map(m =>
        m.id === matchId ? { ...m, [field]: value } : m
      );
      const ns = { ...latest, matches: nm };
      setGameState(ns);
      saveState(ns);
    } catch (e) {
      setMsg('⚠️ チーム名保存に失敗しました: ' + e.message);
    }
  }

  // ─ 自動結果取得 ─
  async function fetchResults() {
    setFetchingResults(true);
    setMsg('');
    try {
      const latest = await fetchLatestState();
      const pending = latest.matches.filter(m =>
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
      let nm = [...latest.matches];
      results.forEach(r => {
        if (r.homeGoals !== null && r.awayGoals !== null) {
          nm = nm.map(m => m.id === r.id ? { ...m, result: { homeGoals: r.homeGoals, awayGoals: r.awayGoals } } : m);
        }
      });
      const ns = { ...latest, matches: nm };
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
          {/* 日付タブ（逆順：今日/未来が左、過去が右） */}
          <div ref={dateTabsContainerRef} style={S.dateTabs}>
            {dates.map(d => {
              const dayMatches = gameState.matches.filter(m => fmtDate(m.kickoff) === d);
              const allDone = dayMatches.every(m => m.result !== null);
              const isSelected = selDate === d;
              return (
                <button key={d}
                  ref={isSelected ? selectedDateTabRef : null}
                  style={{...S.dateTab, ...(isSelected?S.dateTabActive:{}), ...(allDone?S.dateTabDone:{})}}
                  onClick={() => setSelDate(d)}>
                  {d}
                </button>
              );
            })}
          </div>

          {/* 試合カード */}
          <div style={S.matchList}>
            {todayMatches.map((m, idx) => {
              const locked = isLocked(m.kickoff);
              const myPred = m.predictions?.[me] || {};
              const hasResult = m.result !== null && m.result?.homeGoals !== undefined;
              // 結果未入力の最初の試合をスクロール対象にする
              const firstUnresultedIdx = todayMatches.findIndex(tm =>
                !tm.result || tm.result.homeGoals === null || tm.result.homeGoals === undefined
              );
              const isNextTarget = idx === firstUnresultedIdx;

              return (
                <div key={m.id}
                  ref={isNextTarget ? nextMatchRef : null}
                  style={{...S.matchCard, ...(hasResult?S.matchCardDone:{})}}>
                  <div style={S.matchMeta}>
                    <span style={S.stageBadge}>{m.stage}</span>
                    <span style={S.kickoffTime}>{fmtTime(m.kickoff)} JST</span>
                    <span style={S.channelBadge}>{getChannel(m.id)}</span>
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

                  {/* 予想入力（キックオフ前・プレイヤーのみ） */}
                  {!locked && !isAdmin && !hasResult && (() => {
                    const lp = localPreds[m.id] || {};
                    const serverPred = m.predictions?.[me];
                    // サーバー保存済みの予想とローカルが一致しているか確認
                    const isSaved = serverPred?.result === lp.result
                      && String(serverPred?.homeGoals ?? '') === String(lp.homeGoals ?? '')
                      && String(serverPred?.awayGoals ?? '') === String(lp.awayGoals ?? '');
                    const hasLocalResult = !!lp.result;
                    return (
                      <div style={S.predRow}>
                        <div style={S.resultBtns}>
                          {[{v:'home',l:`${m.home}勝ち`},{v:'draw',l:'引き分け'},{v:'away',l:`${m.away}勝ち`}].map(opt => (
                            <button key={opt.v}
                              style={{...S.resBtn, ...(lp.result===opt.v?S.resBtnActive:{})}}
                              onClick={() => setLocalPred(m.id, 'result', opt.v)}>
                              {opt.l}
                            </button>
                          ))}
                        </div>
                        <div style={S.scoreRow}>
                          <span style={S.scoreLabel}>スコア予想:</span>
                          <input type="number" min="0" max="20"
                            value={lp.homeGoals ?? ''}
                            style={S.scoreInput}
                            onChange={e => setLocalPred(m.id, 'homeGoals', e.target.value)}
                            placeholder="–" />
                          <span style={S.scoreSep}>-</span>
                          <input type="number" min="0" max="20"
                            value={lp.awayGoals ?? ''}
                            style={S.scoreInput}
                            onChange={e => setLocalPred(m.id, 'awayGoals', e.target.value)}
                            placeholder="–" />
                        </div>
                        {isSaved && hasLocalResult ? (
                          <div style={S.savedNote}>
                            ✅ 保存済み
                            <span style={{fontSize:11, color:'#64748b', fontWeight:400, marginLeft:8}}>
                              （変更する場合は選び直してください）
                            </span>
                          </div>
                        ) : (
                          <button
                            style={{...S.confirmBtn, ...(savingMatch[m.id]||!hasLocalResult?{opacity:0.5,cursor:'default'}:{})}}
                            onClick={() => { if (!savingMatch[m.id] && hasLocalResult) confirmPrediction(m.id); }}
                            disabled={savingMatch[m.id] || !hasLocalResult}>
                            {savingMatch[m.id] ? '⏳ 保存中...' : '✅ 確定する'}
                          </button>
                        )}
                        {!hasLocalResult && (
                          <p style={{color:'#64748b', fontSize:11, textAlign:'center', margin:'4px 0 0'}}>
                            ※ 勝敗を選んでから確定してください
                          </p>
                        )}
                      </div>
                    );
                  })()}

                  {/* ロック済み・結果前：全員の予想を表示 */}
                  {locked && !hasResult && !isAdmin && (
                    <div style={{borderTop:'1px solid #1e293b', marginTop:8, paddingTop:10}}>
                      <p style={{color:'#64748b', fontSize:11, marginBottom:6}}>🔒 締切済み・結果待ち — 全員の予想</p>
                      <div style={S.allPreds}>
                        {gameState.players.map(p => {
                          const pred = m.predictions?.[p];
                          const isMe = p === me;
                          return (
                            <div key={p} style={S.playerPred}>
                              <span style={{...S.predName, ...(isMe?{color:'#93c5fd', fontWeight:700}:{})}}>
                                {p}{isMe ? ' 👤' : ''}
                              </span>
                              {pred?.result ? (
                                <>
                                  <span style={S.predResult}>
                                    {pred.result==='home'?`${m.home}勝ち`:pred.result==='away'?`${m.away}勝ち`:'引き分け'}
                                  </span>
                                  <span style={S.predScore}>
                                    {pred.homeGoals??'?'}-{pred.awayGoals??'?'}
                                  </span>
                                </>
                              ) : <span style={S.noPred}>⚠️ 未予想</span>}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* 結果後：自分の予想＋正誤＋ポイント（プレイヤー） */}
                  {hasResult && !isAdmin && (() => {
                    const mp = matchPointsMap[m.id];
                    return (
                      <div style={{borderTop:'1px solid #1e293b', marginTop:8, paddingTop:10}}>
                        {/* 自分の予想（読み取り専用） */}
                        <p style={{color:'#64748b', fontSize:11, marginBottom:6}}>あなたの予想</p>
                        {myPred.result ? (
                          <div style={{display:'flex', flexDirection:'column', gap:6, marginBottom:10}}>
                            <div style={{display:'flex', alignItems:'center', gap:8}}>
                              <span style={{...S.resBtn, ...S.resBtnActive, cursor:'default', opacity:0.85}}>
                                {myPred.result==='home'?`${m.home}勝ち`:myPred.result==='away'?`${m.away}勝ち`:'引き分け'}
                              </span>
                              <span style={{fontSize:16}}>{mp?.myResultCorrect ? '✅' : '❌'}</span>
                            </div>
                            <div style={{display:'flex', alignItems:'center', gap:8}}>
                              <span style={{color:'#94a3b8', fontSize:13}}>
                                スコア: {myPred.homeGoals??'?'} - {myPred.awayGoals??'?'}
                              </span>
                              <span style={{fontSize:16}}>{mp?.myScoreCorrect ? '✅' : (mp?.noScoreWinner ? '➡️' : '❌')}</span>
                            </div>
                          </div>
                        ) : <p style={{...S.noPred, marginBottom:10}}>⚠️ 未予想（この試合はポイントなし）</p>}

                        {/* ポイント内訳 */}
                        {mp && (
                          <div style={{background:'#0f172a', borderRadius:8, padding:'8px 12px', marginBottom:10}}>
                            <p style={{color:'#64748b', fontSize:11, marginBottom:6}}>📊 この試合のポイント</p>
                            <div style={{display:'flex', justifyContent:'space-between', fontSize:12, marginBottom:3}}>
                              <span style={{color:'#94a3b8'}}>結果予想</span>
                              <span style={{color: mp.resultDelta >= 0 ? '#4ade80' : '#f87171', fontWeight:700}}>
                                {mp.resultDelta >= 0 ? '+' : ''}{mp.resultDelta.toLocaleString()} pt
                              </span>
                            </div>
                            <div style={{display:'flex', justifyContent:'space-between', fontSize:12, marginBottom:6}}>
                              <span style={{color:'#94a3b8'}}>
                                スコア予想{mp.noScoreWinner ? '（次へ繰越）' : ''}
                              </span>
                              <span style={{color: mp.scoreDelta >= 0 ? '#4ade80' : '#f87171', fontWeight:700}}>
                                {mp.scoreDelta >= 0 ? '+' : ''}{mp.scoreDelta.toLocaleString()} pt
                              </span>
                            </div>
                            <div style={{display:'flex', justifyContent:'space-between', fontSize:13, borderTop:'1px solid #1e293b', paddingTop:6}}>
                              <span style={{color:'#e2e8f0', fontWeight:700}}>合計</span>
                              <span style={{color: mp.total >= 0 ? '#4ade80' : '#f87171', fontWeight:800, fontSize:15}}>
                                {mp.total >= 0 ? '+' : ''}{mp.total.toLocaleString()} pt
                              </span>
                            </div>
                          </div>
                        )}

                        {/* 全員の予想 */}
                        <p style={{color:'#64748b', fontSize:11, marginBottom:6}}>全員の予想</p>
                        <div style={S.allPreds}>
                          {gameState.players.map(p => {
                            const pred = m.predictions?.[p];
                            const rCorrect = pred?.result === getResult(m.result.homeGoals, m.result.awayGoals);
                            const sCorrect = pred && Number(pred.homeGoals) === m.result.homeGoals && Number(pred.awayGoals) === m.result.awayGoals;
                            return (
                              <div key={p} style={S.playerPred}>
                                <span style={S.predName}>{p}</span>
                                {pred ? (
                                  <>
                                    <span style={{...S.predResult, ...(rCorrect?S.correct:S.wrong)}}>
                                      {pred.result==='home'?`${m.home}勝ち`:pred.result==='away'?`${m.away}勝ち`:'引き分け'}
                                    </span>
                                    <span style={{...S.predScore, ...(sCorrect?S.correct:pred.homeGoals!==undefined?S.wrong:{})}}>
                                      {pred.homeGoals??'?'}-{pred.awayGoals??'?'}
                                    </span>
                                  </>
                                ) : <span style={S.noPred}>⚠️ 未予想</span>}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })()}

                  {/* 管理者：全員の予想表示 */}
                  {(locked || hasResult) && isAdmin && (
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
          <p style={S.rankHint}>名前をタップするとポイント変遷を表示</p>
          {[...gameState.players]
            .sort((a,b) => (pts[b]||0) - (pts[a]||0))
            .map((p, i) => {
              const isOpen = selectedRankPlayer === p;
              const history = isOpen ? calcPlayerHistory(p, gameState.matches, gameState.players) : [];
              return (
                <div key={p}>
                  <div
                    style={{...S.rankRow, ...(i===0?S.rank1:i===1?S.rank2:i===2?S.rank3:{}), cursor:'pointer', userSelect:'none'}}
                    onClick={() => setSelectedRankPlayer(isOpen ? null : p)}
                  >
                    <span style={S.rankPos}>{i===0?'🥇':i===1?'🥈':i===2?'🥉':`${i+1}位`}</span>
                    <span style={S.rankName}>{p}</span>
                    <span style={S.rankPts}>{(pts[p]||0).toLocaleString()}pt</span>
                    <span style={S.rankChevron}>{isOpen ? '▲' : '▼'}</span>
                  </div>
                  {isOpen && (
                    <div style={S.historyPanel}>
                      <p style={S.historyTitle}>📈 {p} のポイント変遷</p>
                      {history.length === 0 && <p style={{color:'#94a3b8', fontSize:13}}>まだ結果が出ていません</p>}
                      {history.map((h, idx) => (
                        <div key={idx} style={S.historyItem}>
                          <div style={S.historyMatchName}>
                            ⚽ {h.home} {h.homeGoals}-{h.awayGoals} {h.away}
                          </div>
                          <div style={S.historyRows}>
                            <div style={S.historyLine}>
                              <span style={S.historyLabel}>勝敗予想</span>
                              {h.noResultWinner
                                ? <span style={S.historyNeutral}>変動なし（誰も不正解）</span>
                                : h.myResultCorrect
                                  ? <span style={S.historyWin}>✅ 正解</span>
                                  : <span style={S.historyLose}>❌ 不正解</span>
                              }
                              <span style={{...S.historyDelta, color: h.resultDelta > 0 ? '#4ade80' : h.resultDelta < 0 ? '#f87171' : '#94a3b8'}}>
                                {h.resultDelta === 0 ? '±0' : (h.resultDelta > 0 ? '+' : '') + h.resultDelta.toLocaleString()}pt
                              </span>
                            </div>
                            {h.resultRemInfo && (
                              <div style={S.historyLotteryLine}>
                                🎲 端数{h.resultRemInfo.amount}pt
                                {h.resultRemInfo.wasLottery ? '（同率のため抽選）' : '（最下位）'}
                                → {h.resultRemInfo.recipient}
                                {h.resultRemInfo.recipient === p ? ' ← あなた' : ''}
                              </div>
                            )}
                            <div style={S.historyLine}>
                              <span style={S.historyLabel}>スコア予想</span>
                              {h.noScoreWinner
                                ? <span style={S.historyCarry}>🔥 CO</span>
                                : h.myScoreCorrect
                                  ? <span style={S.historyWin}>✅ 正解{h.usedCarryover > 0 ? `（CO+${h.usedCarryover.toLocaleString()}）` : ''}</span>
                                  : <span style={S.historyLose}>❌ 不正解</span>
                              }
                              <span style={{...S.historyDelta, color: h.scoreDelta > 0 ? '#4ade80' : '#f87171'}}>
                                {(h.scoreDelta > 0 ? '+' : '') + h.scoreDelta.toLocaleString()}pt
                              </span>
                            </div>
                            {h.scoreRemInfo && (
                              <div style={S.historyLotteryLine}>
                                🎲 端数{h.scoreRemInfo.amount}pt
                                {h.scoreRemInfo.wasLottery ? '（同率のため抽選）' : '（最下位）'}
                                → {h.scoreRemInfo.recipient}
                                {h.scoreRemInfo.recipient === p ? ' ← あなた' : ''}
                              </div>
                            )}
                          </div>
                          <div style={S.historyCumRow}>
                            <span style={S.historyCumLabel}>この試合</span>
                            <span style={{...S.historyCumDelta, color: h.delta > 0 ? '#4ade80' : h.delta < 0 ? '#f87171' : '#94a3b8'}}>
                              {(h.delta > 0 ? '+' : '') + h.delta.toLocaleString()}pt
                            </span>
                            <span style={S.historyCumLabel}>累計</span>
                            <span style={{...S.historyCumTotal, color: h.cumulative >= 0 ? '#4ade80' : '#f87171'}}>
                              {(h.cumulative > 0 ? '+' : '') + h.cumulative.toLocaleString()}pt
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
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
          onFixPrediction={async (matchId, player, pred) => {
            try {
              const latest = await fetchLatestState();
              const nm = latest.matches.map(m => {
                if (m.id !== matchId) return m;
                const newPreds = { ...m.predictions, [player]: pred };
                return { ...m, predictions: newPreds };
              });
              const ns = { ...latest, matches: nm };
              setGameState(ns);
              return await saveState(ns);
            } catch { return false; }
          }}
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
          onUpdateState={async (patch) => {
            const ns = { ...gameState, ...patch };
            setGameState(ns);
            const ok = await saveState(ns);
            if (ok) setMsg('✅ 保存しました');
          }}
          onReload={async () => {
            try {
              const res = await fetch('/api/game-state');
              const data = await res.json();
              if (data && data.players) {
                setGameState(data);
                backupPlayers(data.players, data.playerPasswords);
                setMsg('✅ サーバーから再読み込みしました');
              } else {
                setMsg('⚠️ サーバーにデータがありません（プレイヤー未登録の状態）');
              }
            } catch (e) { setMsg('⚠️ 読み込みエラー: ' + e.message); }
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
            <li>誰も当たらなければ全員ポイント変動なし（キャリーオーバーなし）</li>
            <li>割り切れない端数は最下位の的中者が受け取る。同率の場合は🎲抽選で決定</li>
          </ul>
          <p style={S.rulesHeading}>🎯 スコア予想</p>
          <ul style={S.rulesList}>
            <li>各試合、全員が <strong>500pt</strong> を自動的に賭ける</li>
            <li>○対○の完全一致が的中（点差ではなく正確なスコア）</li>
            <li>的中者がポイントを総取り（複数いれば山分け）</li>
            <li>誰も当たらなければ <strong>🔥キャリーオーバー</strong>！次の的中者が積み上げ分も総取り</li>
            <li>割り切れない端数は最下位の的中者が受け取る。同率の場合は🎲抽選で決定</li>
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
function LoginScreen({ gameState, onLogin, onAdmin, onSetup, onSavePassword, loading, pollStatus, onManualCheck }) {
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
          <p style={{color:'#475569', fontSize:11, marginBottom:6}}>5秒ごとに自動確認しています</p>
          {pollStatus && (
            <p style={{color: pollStatus.includes('エラー') ? '#f87171' : '#64748b', fontSize:11, marginBottom:6}}>
              {pollStatus}
            </p>
          )}
          <button style={{background:'#1d4ed8', color:'#fff', border:'none', borderRadius:8, padding:'7px 16px', fontSize:13, cursor:'pointer', marginBottom:10}}
            onClick={onManualCheck}>
            🔍 今すぐ確認する
          </button>
          <div style={{borderTop:'1px solid #1e293b', paddingTop:10, marginTop:4}}>
            <p style={{color:'#475569', fontSize:11, marginBottom:4}}>↓ それでも変わらない場合</p>
            <button style={{background:'transparent', border:'1px solid #334155', color:'#64748b', borderRadius:8, padding:'5px 12px', fontSize:11, cursor:'pointer'}}
              onClick={() => {
                localStorage.removeItem('wc2026_players');
                localStorage.removeItem('wc2026_passwords');
                localStorage.removeItem('wc2026_player');
                window.location.reload();
              }}>
              🗑️ ブラウザのキャッシュをリセット
            </button>
          </div>
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
function AdminView({ gameState, fetchingResults, onFetchResults, onSetResult, onSetTeam, pts, co, onSetupPlayers, onResetPlayers, onUpdateState, onReload, onFixPrediction }) {
  const [adminDate, setAdminDate] = useState(getFirstUnresultedDate(gameState.matches));
  const adminDateTabsRef = useRef(null);
  const adminSelectedTabRef = useRef(null);
  const [fixPlayer, setFixPlayer] = useState('');
  const [fixMatchId, setFixMatchId] = useState('');
  const [fixResult, setFixResult] = useState('');
  const [fixHome, setFixHome] = useState('');
  const [fixAway, setFixAway] = useState('');
  const [fixMsg, setFixMsg] = useState('');

  useEffect(() => {
    if (!adminDateTabsRef.current || !adminSelectedTabRef.current) return;
    adminDateTabsRef.current.scrollLeft = adminSelectedTabRef.current.offsetLeft - 8;
  }, [adminDate]);
  const [newNames, setNewNames]   = useState(['','','','','']);
  const [confirmReset, setConfirmReset] = useState(false);
  const [showRaw, setShowRaw]     = useState(false);
  const [blobInfo, setBlobInfo]   = useState(null);   // { count, totalSizeMB }
  const [blobDeleting, setBlobDeleting] = useState(false);
  const S = styles;

  // Blob容量確認
  async function checkBlob() {
    try {
      const res = await fetch('/api/cleanup-blobs');
      const data = await res.json();
      setBlobInfo(data);
    } catch { setBlobInfo({ error: '確認失敗' }); }
  }

  // Blob全削除
  async function deleteAllBlobs() {
    if (!window.confirm(`Vercel Blobに残っている古いファイル ${blobInfo?.count || ''}件を全て削除しますか？\n（現在のゲームデータ＝Redisには影響しません）`)) return;
    setBlobDeleting(true);
    try {
      const res = await fetch('/api/cleanup-blobs', { method: 'POST' });
      const data = await res.json();
      if (data.ok) {
        alert(`✅ ${data.deleted}件のファイルを削除しました。Vercel Blobの容量が解放されます。`);
        setBlobInfo(null);
      } else {
        alert('⚠️ 削除に失敗しました: ' + data.error);
      }
    } catch (e) { alert('⚠️ エラー: ' + e.message); }
    setBlobDeleting(false);
  }
  const dates = [...new Set(ALL_MATCHES.map(m => fmtDate(m.kickoff)))];
  const dayMatches = gameState.matches.filter(m => fmtDate(m.kickoff) === adminDate);
  const passwords = gameState.playerPasswords || {};
  const champPicks = gameState.championPicks || {};

  return (
    <div style={S.adminWrap}>
      <h2 style={S.adminTitle}>🔐 管理者パネル</h2>

      {/* 予想の修正（管理者専用） */}
      <div style={S.adminSection}>
        <h3 style={S.sectionTitle}>🛠️ プレイヤーの予想を修正</h3>
        <div style={{display:'flex', flexDirection:'column', gap:8}}>
          <div style={{display:'flex', gap:8, flexWrap:'wrap'}}>
            <select value={fixPlayer} onChange={e=>setFixPlayer(e.target.value)}
              style={{flex:1, minWidth:100, padding:'6px 8px', background:'#1e293b', color:'#e2e8f0', border:'1px solid #475569', borderRadius:6, fontSize:13}}>
              <option value=''>プレイヤー選択</option>
              {gameState.players.map(p=><option key={p} value={p}>{p}</option>)}
            </select>
            <select value={fixMatchId} onChange={e=>setFixMatchId(e.target.value)}
              style={{flex:2, minWidth:180, padding:'6px 8px', background:'#1e293b', color:'#e2e8f0', border:'1px solid #475569', borderRadius:6, fontSize:12}}>
              <option value=''>試合選択</option>
              {gameState.matches.map(m=>(
                <option key={m.id} value={m.id}>{fmtDate(m.kickoff)} {fmtTime(m.kickoff)} {m.home} vs {m.away}</option>
              ))}
            </select>
          </div>
          <div style={{display:'flex', gap:8, flexWrap:'wrap'}}>
            <select value={fixResult} onChange={e=>setFixResult(e.target.value)}
              style={{flex:1, padding:'6px 8px', background:'#1e293b', color:'#e2e8f0', border:'1px solid #475569', borderRadius:6, fontSize:13}}>
              <option value=''>勝敗選択</option>
              {fixMatchId && (() => {
                const fm = gameState.matches.find(m=>m.id===Number(fixMatchId));
                if (!fm) return null;
                return [
                  <option key='home' value='home'>{fm.home}勝ち</option>,
                  <option key='draw' value='draw'>引き分け</option>,
                  <option key='away' value='away'>{fm.away}勝ち</option>,
                ];
              })()}
            </select>
            <input type='number' min='0' max='20' placeholder='ホームGoals' value={fixHome}
              onChange={e=>setFixHome(e.target.value)}
              style={{width:90, padding:'6px 8px', background:'#1e293b', color:'#e2e8f0', border:'1px solid #475569', borderRadius:6, fontSize:13}} />
            <span style={{color:'#94a3b8', alignSelf:'center'}}>-</span>
            <input type='number' min='0' max='20' placeholder='アウェイGoals' value={fixAway}
              onChange={e=>setFixAway(e.target.value)}
              style={{width:90, padding:'6px 8px', background:'#1e293b', color:'#e2e8f0', border:'1px solid #475569', borderRadius:6, fontSize:13}} />
          </div>
          <button
            disabled={!fixPlayer || !fixMatchId || !fixResult}
            style={{padding:'8px 16px', background: fixPlayer&&fixMatchId&&fixResult ? '#0891b2':'#374151', color:'#fff', border:'none', borderRadius:6, fontSize:13, cursor: fixPlayer&&fixMatchId&&fixResult?'pointer':'default'}}
            onClick={async () => {
              setFixMsg('⏳ 修正中...');
              const pred = { result: fixResult };
              if (fixHome !== '' && fixAway !== '') { pred.homeGoals = Number(fixHome); pred.awayGoals = Number(fixAway); }
              const ok = await onFixPrediction(Number(fixMatchId), fixPlayer, pred);
              setFixMsg(ok ? '✅ 修正しました' : '⚠️ 修正に失敗しました');
              setTimeout(() => setFixMsg(''), 3000);
            }}>
            修正を確定する
          </button>
          {fixMsg && <p style={{color: fixMsg.startsWith('✅')?'#34d399':'#f87171', fontSize:12, margin:0}}>{fixMsg}</p>}
        </div>
      </div>

      {/* 手動入力（最優先で一番上） */}
      <div style={S.adminSection}>
        <h3 style={S.sectionTitle}>✏️ 結果を手動入力</h3>
        <div ref={adminDateTabsRef} style={S.dateTabs}>
          {dates.map(d => (
            <button key={d}
              ref={adminDate===d ? adminSelectedTabRef : null}
              style={{...S.dateTab, ...(adminDate===d?S.dateTabActive:{})}}
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
                <span style={S.channelBadge}>{getChannel(m.id)}</span>
              </div>
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

      {/* ─ 予想状況 ─ */}
      <div style={S.adminSection}>
        <h3 style={S.sectionTitle}>📋 予想状況</h3>
        {gameState.matches.map(m => {
          const predicted = gameState.players.filter(p => m.predictions?.[p]?.result);
          const notYet = gameState.players.filter(p => !m.predictions?.[p]?.result);
          return (
            <div key={m.id} style={{marginBottom:10, background:'#0f172a', borderRadius:8, padding:'10px 12px'}}>
              <p style={{color:'#94a3b8', fontSize:12, marginBottom:6}}>
                試合{m.id}：{m.home} vs {m.away}
                <span style={{marginLeft:8, color: notYet.length===0 ? '#4ade80' : '#fbbf24', fontWeight:700}}>
                  {predicted.length}/{gameState.players.length}人完了
                </span>
              </p>
              <div style={{display:'flex', gap:6, flexWrap:'wrap'}}>
                {gameState.players.map(p => (
                  <span key={p} style={{
                    fontSize:11, padding:'2px 8px', borderRadius:12,
                    background: m.predictions?.[p]?.result ? '#14532d' : '#1e293b',
                    color: m.predictions?.[p]?.result ? '#4ade80' : '#64748b',
                  }}>
                    {m.predictions?.[p]?.result ? '✅' : '⏳'} {p}
                  </span>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* ─ データ管理 ─ */}
      <div style={S.adminSection}>
        <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:12}}>
          <h3 style={{...S.sectionTitle, margin:0}}>🗄️ データ管理</h3>
          <button style={{...S.fetchBtn, fontSize:12, padding:'5px 12px'}} onClick={onReload}>
            🔄 サーバーから再読み込み
          </button>
        </div>

        {/* Blob容量クリーンアップ */}
        <div style={{background:'#0f172a', borderRadius:8, padding:'12px 14px', marginBottom:16}}>
          <p style={{color:'#fbbf24', fontSize:12, fontWeight:700, marginBottom:6}}>🗑️ Vercel Blob 容量クリーンアップ</p>
          <p style={{color:'#94a3b8', fontSize:12, marginBottom:8}}>
            以前のデータ保存方式（Vercel Blob）の残留ファイルを削除します。<br/>
            現在のゲームデータ（Redis）には影響しません。
          </p>
          {!blobInfo ? (
            <button style={{...S.fetchBtn, fontSize:12, padding:'6px 14px', background:'#1d4ed8'}}
              onClick={checkBlob}>
              🔍 残留ファイルを確認する
            </button>
          ) : blobInfo.error ? (
            <p style={{color:'#f87171', fontSize:12}}>{blobInfo.error}</p>
          ) : blobInfo.count === 0 ? (
            <p style={{color:'#4ade80', fontSize:12}}>✅ 残留ファイルはありません</p>
          ) : (
            <div>
              <p style={{color:'#f87171', fontSize:13, fontWeight:700, marginBottom:8}}>
                ⚠️ {blobInfo.count}件 / {blobInfo.totalSizeMB}MB の古いファイルが残っています
              </p>
              <button style={{...S.fetchBtn, background:'#dc2626', fontSize:13}}
                onClick={deleteAllBlobs} disabled={blobDeleting}>
                {blobDeleting ? '削除中...' : '🗑️ 全て削除して容量を解放する'}
              </button>
            </div>
          )}
        </div>

        {/* パスワード管理 */}
        <p style={{color:'#fbbf24', fontSize:12, fontWeight:700, marginBottom:6}}>🔐 パスワード</p>
        <div style={{marginBottom:12}}>
          {gameState.players.length === 0 ? (
            <p style={{color:'#64748b', fontSize:12}}>プレイヤー未登録</p>
          ) : gameState.players.map(p => (
            <div key={p} style={{display:'flex', justifyContent:'space-between', alignItems:'center', padding:'5px 0', borderBottom:'1px solid #1e293b'}}>
              <span style={{color:'#e2e8f0', fontSize:13}}>{p}
                <span style={{marginLeft:8, fontSize:11, color: passwords[p] ? '#4ade80' : '#64748b'}}>
                  {passwords[p] ? '🔒 設定済み' : '未設定'}
                </span>
              </span>
              {passwords[p] && (
                <button style={{background:'#7f1d1d', color:'#fca5a5', border:'none', borderRadius:6, padding:'3px 8px', fontSize:11, cursor:'pointer'}}
                  onClick={() => {
                    const pw = { ...passwords };
                    delete pw[p];
                    onUpdateState({ playerPasswords: pw });
                  }}>
                  リセット
                </button>
              )}
            </div>
          ))}
          {gameState.players.some(p => passwords[p]) && (
            <button style={{...S.fetchBtn, background:'#7f1d1d', fontSize:11, marginTop:8}}
              onClick={() => onUpdateState({ playerPasswords: {} })}>
              全員のパスワードをリセット
            </button>
          )}
        </div>

        {/* 優勝予想管理 */}
        <p style={{color:'#fbbf24', fontSize:12, fontWeight:700, marginBottom:6}}>🏆 優勝予想</p>
        <div style={{marginBottom:12}}>
          {gameState.players.length === 0 ? (
            <p style={{color:'#64748b', fontSize:12}}>プレイヤー未登録</p>
          ) : gameState.players.map(p => {
            const picks = champPicks[p] || [];
            return (
              <div key={p} style={{display:'flex', justifyContent:'space-between', alignItems:'center', padding:'5px 0', borderBottom:'1px solid #1e293b'}}>
                <span style={{color:'#e2e8f0', fontSize:13}}>{p}
                  <span style={{marginLeft:8, fontSize:11, color: picks.length ? '#4ade80' : '#64748b'}}>
                    {picks.length ? picks.join('・') : '未選択'}
                  </span>
                </span>
                {picks.length > 0 && (
                  <button style={{background:'#7f1d1d', color:'#fca5a5', border:'none', borderRadius:6, padding:'3px 8px', fontSize:11, cursor:'pointer'}}
                    onClick={() => onUpdateState({ championPicks: { ...champPicks, [p]: [] } })}>
                    リセット
                  </button>
                )}
              </div>
            );
          })}
          {Object.values(champPicks).some(v => v?.length > 0) && (
            <button style={{...S.fetchBtn, background:'#7f1d1d', fontSize:11, marginTop:8}}
              onClick={() => onUpdateState({ championPicks: {} })}>
              全員の優勝予想をリセット
            </button>
          )}
        </div>

        {/* 生データ確認 */}
        <button style={{background:'transparent', border:'1px solid #334155', color:'#64748b', borderRadius:8, padding:'5px 12px', fontSize:11, cursor:'pointer', width:'100%'}}
          onClick={() => setShowRaw(o => !o)}>
          {showRaw ? '▲ 生データを隠す' : '▼ 生データを確認する（デバッグ用）'}
        </button>
        {showRaw && (
          <pre style={{background:'#020617', color:'#94a3b8', fontSize:10, padding:10, borderRadius:8, marginTop:8, overflowX:'auto', maxHeight:200, overflowY:'auto'}}>
            {JSON.stringify({
              players: gameState.players,
              playerPasswords: Object.fromEntries(Object.entries(passwords).map(([k,v]) => [k, v ? '(設定済み)' : null])),
              championPicks: champPicks,
              draftOrder: gameState.draftOrder,
              carryover: gameState.carryover,
              matchCount: gameState.matches?.length,
            }, null, 2)}
          </pre>
        )}
      </div>

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
  channelBadge:{ background:'#1e3a5f', color:'#93c5fd', padding:'2px 7px', borderRadius:10, fontSize:11 },
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
  scoreRow:   { display:'flex', alignItems:'center', gap:8, marginBottom:8 },
  scoreLabel: { color:'#94a3b8', fontSize:12, whiteSpace:'nowrap' },
  scoreInput: { width:52, padding:'6px', borderRadius:6, border:'1px solid #334155', background:'#0f172a', color:'#fff', textAlign:'center', fontSize:16 },
  scoreSep:   { color:'#64748b', fontSize:18 },
  confirmBtn: { width:'100%', padding:'10px', borderRadius:8, background:'#059669', color:'#fff', border:'none', cursor:'pointer', fontSize:15, fontWeight:700 },
  savedNote:  { color:'#4ade80', fontSize:12, textAlign:'center', padding:'8px 0', fontWeight:600 },
  allPreds:   { marginTop:10, display:'flex', flexDirection:'column', gap:4 },
  playerPred: { display:'flex', alignItems:'center', gap:8, padding:'4px 0', borderTop:'1px solid #1e293b' },
  predName:   { color:'#94a3b8', fontSize:12, width:80, flexShrink:0 },
  predResult: { color:'#cbd5e1', fontSize:12, flex:1 },
  predScore:  { color:'#cbd5e1', fontSize:12, width:50, textAlign:'right' },
  correct:    { color:'#4ade80', fontWeight:700 },
  wrong:      { color:'#f87171' },
  noPred:     { color:'#f59e0b', fontSize:12 },
  ranking:    { padding:16 },
  rankTitle:  { fontSize:20, fontWeight:700, marginBottom:4, color:'#ffd700', textAlign:'center' },
  rankHint:   { color:'#64748b', fontSize:12, textAlign:'center', marginBottom:12 },
  carryNote:  { color:'#fed7aa', fontSize:13, textAlign:'center', marginBottom:12 },
  rankRow:    { display:'flex', alignItems:'center', gap:12, padding:'12px 16px', background:'#1e293b', borderRadius:10, marginBottom:4 },
  rank1:      { background:'#78350f', border:'1px solid #fbbf24' },
  rank2:      { background:'#1c1917', border:'1px solid #9ca3af' },
  rank3:      { background:'#1c1917', border:'1px solid #b45309' },
  rankPos:    { fontSize:22, width:36 },
  rankName:   { flex:1, fontSize:16, fontWeight:600 },
  rankPts:    { fontSize:18, fontWeight:700, color:'#ffd700' },
  rankChevron:{ fontSize:12, color:'#475569' },
  historyPanel:{ background:'#0f172a', borderRadius:'0 0 10px 10px', marginBottom:8, padding:'12px 14px', border:'1px solid #1e3a5f', borderTop:'none' },
  historyTitle:{ color:'#93c5fd', fontWeight:700, fontSize:14, marginBottom:10, margin:'0 0 10px 0' },
  historyItem: { background:'#1e293b', borderRadius:8, padding:'10px 12px', marginBottom:8 },
  historyMatchName:{ color:'#e2e8f0', fontSize:13, fontWeight:600, marginBottom:8 },
  historyRows: { display:'flex', flexDirection:'column', gap:4, marginBottom:8 },
  historyLine: { display:'flex', alignItems:'center', gap:8, fontSize:12 },
  historyLabel:{ color:'#64748b', width:64, flexShrink:0 },
  historyWin:  { color:'#4ade80', flex:1 },
  historyLose: { color:'#f87171', flex:1 },
  historyNeutral:{ color:'#94a3b8', flex:1 },
  historyCarry:      { color:'#fb923c', flex:1 },
  historyDelta:      { fontWeight:700, fontSize:13, marginLeft:'auto' },
  historyLotteryLine:{ color:'#a78bfa', fontSize:11, paddingLeft:64, marginTop:2 },
  historyCumRow:{ display:'flex', alignItems:'center', gap:8, paddingTop:6, borderTop:'1px solid #334155' },
  historyCumLabel:{ color:'#64748b', fontSize:11 },
  historyCumDelta:{ fontWeight:700, fontSize:13 },
  historyCumTotal:{ fontWeight:800, fontSize:15, marginLeft:'auto' },
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
