/* KIRIN-GUITAR-THEORY:BEGIN */
(function () {
'use strict';
const version='1.11.0';
const presets=[
{id:"standard",name:"レギュラー",description:"E A D G B E",notes:["E2","A2","D3","G3","B3","E4"],preferFlats:false},
{id:"half-step-down",name:"半音下げ",description:"Eb Ab Db Gb Bb Eb",notes:["Eb2","Ab2","Db3","Gb3","Bb3","Eb4"],preferFlats:true},
{id:"whole-step-down",name:"全音下げ",description:"D G C F A D",notes:["D2","G2","C3","F3","A3","D4"],preferFlats:false},
{id:"drop-d",name:"Drop D",description:"D A D G B E",notes:["D2","A2","D3","G3","B3","E4"],preferFlats:false},
{id:"drop-c",name:"Drop C",description:"C G C F A D",notes:["C2","G2","C3","F3","A3","D4"],preferFlats:false},
{id:"dadgad",name:"DADGAD",description:"D A D G A D",notes:["D2","A2","D3","G3","A3","D4"],preferFlats:false},
{id:"open-g",name:"Open G",description:"D G D G B D",notes:["D2","G2","D3","G3","B3","D4"],preferFlats:false},
{id:"open-d",name:"Open D",description:"D A D F# A D",notes:["D2","A2","D3","F#3","A3","D4"],preferFlats:false},
{id:"open-e",name:"Open E",description:"E B E G# B E",notes:["E2","B2","E3","G#3","B3","E4"],preferFlats:false}
];
presets.push(
{id:'drop-c-sharp',name:'ドロップC♯',notes:['C#2','G#2','C#3','F#3','A#3','D#4'],preferFlats:false},
{id:'drop-b',name:'ドロップB',notes:['B1','F#2','B2','E3','G#3','C#4'],preferFlats:false},
{id:'drop-a',name:'ドロップA',notes:['A1','E2','A2','D3','F#3','B3'],preferFlats:false},
{id:'open-c',name:'オープンC',notes:['C2','G2','C3','G3','C4','E4'],preferFlats:false},
{id:'double-drop-d',name:'ダブルドロップD',notes:['D2','A2','D3','G3','B3','D4'],preferFlats:false},
{id:'open-d-minor',name:'オープンDマイナー',notes:['D2','A2','D3','F3','A3','D4'],preferFlats:false});
presets.forEach(p=>{p.description=p.notes.join(' ');p.name=p.name.replace('Drop ','ドロップ').replace('Open ','オープン');});
const types=[
{symbol:"",intervals:[0,4,7],priority:100},
{symbol:"m",intervals:[0,3,7],priority:99},
{symbol:"5",intervals:[0,7],priority:86},
{symbol:"sus2",intervals:[0,2,7],priority:84},
{symbol:"sus4",intervals:[0,5,7],priority:84},
{symbol:"6",intervals:[0,4,7,9],priority:82},
{symbol:"m6",intervals:[0,3,7,9],priority:82},
{symbol:"7",intervals:[0,4,7,10],priority:90},
{symbol:"maj7",intervals:[0,4,7,11],priority:90},
{symbol:"m7",intervals:[0,3,7,10],priority:90},
{symbol:"mMaj7",intervals:[0,3,7,11],priority:72},
{symbol:"dim",intervals:[0,3,6],priority:72},
{symbol:"aug",intervals:[0,4,8],priority:72},
{symbol:"m7b5",intervals:[0,3,6,10],priority:75},
{symbol:"dim7",intervals:[0,3,6,9],priority:70},
{symbol:"add9",intervals:[0,2,4,7],priority:80},
{symbol:"madd9",intervals:[0,2,3,7],priority:78},
{symbol:"9",intervals:[0,2,4,7,10],priority:76},
{symbol:"m9",intervals:[0,2,3,7,10],priority:76},
{symbol:"maj9",intervals:[0,2,4,7,11],priority:74},
{symbol:"11",intervals:[0,2,4,5,7,10],priority:62},
{symbol:"13",intervals:[0,2,4,7,9,10],priority:60}
];
const mod=n=>((n%12)+12)%12;
function toMidi(value){const m=String(value).trim().replace(/♯/g,'#').replace(/♭/g,'b').match(/^([A-Ga-g])([#b]?)(-?\d+)$/);if(!m)throw new Error('音名はE2、C#3、Bb3の形式で入力してください');return (Number(m[3])+1)*12+({C:0,D:2,E:4,F:5,G:7,A:9,B:11}[m[1].toUpperCase()])+(m[2]==='#'?1:m[2]==='b'?-1:0);}
function note(m,flats=false){return (flats?['C','Db','D','Eb','E','F','Gb','G','Ab','A','Bb','B']:['C','C#','D','D#','E','F','F#','G','G#','A','A#','B'])[mod(m)]+(Math.floor(m/12)-1);}
function matchPreset(notes){const m=notes.map(toMidi);return presets.find(p=>p.notes.every((n,i)=>toMidi(n)===m[i]))||null;}
function detect(notes,flats=false,slash=true){
 if(!notes.length)return [];const names=flats?['C','Db','D','Eb','E','F','Gb','G','Ab','A','Bb','B']:['C','C#','D','D#','E','F','F#','G','G#','A','A#','B'];
 const pcs=[...new Set(notes.map(n=>mod(n.midi)))];const bass=mod(Math.min(...notes.map(n=>n.midi)));const out=[];
 for(let root=0;root<12;root++){const played=pcs.map(p=>mod(p-root));if(!played.includes(0))continue;
 for(const ct of types){const missing=ct.intervals.filter(n=>!played.includes(n));const extra=played.filter(n=>!ct.intervals.includes(n));const exact=!missing.length&&!extra.length;
 if(!exact&&(played.length<2||missing.length>1||extra.length>1))continue;
 const name=names[root]+ct.symbol+(slash&&root!==bass?'/'+names[bass]:'');
 out.push({name,type:exact?'exact':'near',score:(exact?3000:100)+ct.priority+(root===bass?8:0)-missing.length*30-extra.length*30,detail:exact?'全構成音が完全一致'+(root!==bass?'／最低音 '+names[bass]:''):'近似：不足音程 '+missing.join(',')+'／追加音程 '+extra.join(',')});}}
 if(slash){const low=notes.reduce((a,b)=>a.midi<=b.midi?a:b);const body=notes.filter(n=>n!==low);const bp=[...new Set(body.map(n=>mod(n.midi)))];for(let root=0;root<12;root++)for(const ct of types){if(root===bass||ct.intervals.includes(mod(bass-root)))continue;const ints=bp.map(p=>mod(p-root));if(ints.length===ct.intervals.length&&ct.intervals.every(n=>ints.includes(n)))out.push({name:names[root]+ct.symbol+'/'+names[bass],type:'on',score:2000+ct.priority,detail:'和音に含まれない最低音を分離した完全一致'});}}
 out.sort((a,b)=>b.score-a.score);return out.filter((v,i)=>out.findIndex(x=>x.name===v.name)===i).slice(0,8);
}
function forms(tuning,root,symbol){
 const type=types.find(t=>t.symbol===symbol);if(!type)return [];const open=tuning.map(toMidi),want=type.intervals.map(n=>mod(n+root));const found=new Map();
 for(let start=0;start<=16;start++){const opts=open.map(n=>{const o=[null];for(let f=Math.max(0,start);f<=Math.min(16,start+3);f++)if(want.includes(mod(n+f)))o.push(f);if(start>0&&want.includes(mod(n)))o.push(0);return o;});
 function visit(i,shape){if(i<6){for(const f of opts[i])visit(i+1,shape.concat(f));return;}const played=shape.map((f,j)=>f===null?null:open[j]+f).filter(n=>n!==null);if(played.length<Math.max(3,want.length))return;const pcs=[...new Set(played.map(mod))];if(pcs.length!==want.length||!want.every(n=>pcs.includes(n)))return;const pos=shape.filter(n=>n>0);const low=pos.length?Math.min(...pos):0,hi=pos.length?Math.max(...pos):0;if(hi-low>3)return;const count=shape.filter(n=>n!==null).length;const bass=mod(Math.min(...played));const score=(bass===root?40:0)+count*8-shape.filter(n=>n>0).length*2-(hi-low)*3;const key=shape.join(',');found.set(key,{frets:shape,low,hi,score});}
 visit(0,[]);}
 const all=[...found.values()].sort((a,b)=>a.low-b.low||b.score-a.score||a.hi-b.hi);const groups=new Map();for(const x of all){const n=groups.get(x.low)||[];if(n.length<2){n.push(x);groups.set(x.low,n);}}
 return [...groups.values()].flat().slice(0,32);
}
window.KIRIN_GUITAR_THEORY=Object.freeze({version,presets,types,toMidi,note,matchPreset,detect,forms});
})();
/* KIRIN-GUITAR-THEORY:END */
/* KIRIN-FILE: appId=music-theory; version=1.11.0; updated=2026-11-03; changeId=C-039 */ (function () {
  const keyOrder = [
    { id: 'C', name: 'C', relativeMinor: 'Am', notes: ['C', 'D', 'E', 'F', 'G', 'A', 'B'], position: 0 },
    { id: 'G', name: 'G', relativeMinor: 'Em', notes: ['G', 'A', 'B', 'C', 'D', 'E', 'F#'], position: 1 },
    { id: 'D', name: 'D', relativeMinor: 'Bm', notes: ['D', 'E', 'F#', 'G', 'A', 'B', 'C#'], position: 2 },
    { id: 'A', name: 'A', relativeMinor: 'F#m', notes: ['A', 'B', 'C#', 'D', 'E', 'F#', 'G#'], position: 3 },
    { id: 'E', name: 'E', relativeMinor: 'C#m', notes: ['E', 'F#', 'G#', 'A', 'B', 'C#', 'D#'], position: 4 },
    { id: 'B', name: 'B', relativeMinor: 'G#m', notes: ['B', 'C#', 'D#', 'E', 'F#', 'G#', 'A#'], position: 5 },
    { id: 'F#', name: 'F#', relativeMinor: 'D#m', notes: ['F#', 'G#', 'A#', 'B', 'C#', 'D#', 'E#'], position: 6 },
    { id: 'C#', name: 'C#', relativeMinor: 'A#m', notes: ['C#', 'D#', 'E#', 'F#', 'G#', 'A#', 'B#'], position: 7 },
    { id: 'G#', name: 'G#', relativeMinor: 'E#m', notes: ['G#', 'A#', 'B#', 'C#', 'D#', 'E#', 'F##'], position: 8 },
    { id: 'D#', name: 'D#', relativeMinor: 'B#m', notes: ['D#', 'E#', 'F##', 'G#', 'A#', 'B#', 'C##'], position: 9 },
    { id: 'A#', name: 'A#', relativeMinor: 'Fm', notes: ['A#', 'B#', 'C##', 'D#', 'E#', 'F##', 'G##'], position: 10 },
    { id: 'F', name: 'F', relativeMinor: 'Dm', notes: ['F', 'G', 'A', 'A#', 'C', 'D', 'E'], position: 11 }
  ];

  const circleOfFifths = keyOrder.map((item) => item.id);

  const commonChords = [
    { id: 'C', symbol: 'C', label: 'ド', quality: 'major' },
    { id: 'G', symbol: 'G', label: 'ソ', quality: 'major' },
    { id: 'D', symbol: 'D', label: 'レ', quality: 'major' },
    { id: 'Am', symbol: 'Am', label: 'ラm', quality: 'minor' },
    { id: 'Em', symbol: 'Em', label: 'ミm', quality: 'minor' },
    { id: 'F', symbol: 'F', label: 'ファ', quality: 'major' },
    { id: 'Bm', symbol: 'Bm', label: 'シm', quality: 'minor' },
    { id: 'Dm', symbol: 'Dm', label: 'レm', quality: 'minor' }
  ];

  const tunings = window.KIRIN_GUITAR_THEORY.presets.map(p=>({id:p.id,name:p.name,notes:p.notes.map(n=>n.replace(/-?\d+$/,'')),midiNotes:p.notes.slice()}));

  const voiceRanges = [
    { id: 'soprano', name: 'Soprano', low: 'C4', high: 'A5' },
    { id: 'alto', name: 'Alto', low: 'A3', high: 'F5' },
    { id: 'tenor', name: 'Tenor', low: 'B2', high: 'G5' },
    { id: 'bass', name: 'Bass', low: 'E2', high: 'C4' }
  ];

  const commonProgressions = {
    C: ['C', 'F', 'G', 'Am'],
    G: ['G', 'C', 'D', 'Em'],
    D: ['D', 'G', 'A', 'Bm'],
    A: ['A', 'D', 'E', 'F#m'],
    E: ['E', 'A', 'B', 'C#m']
  };

  // ---- v1.1.0 追加：有名なコード進行。度数で持ち、キーに合わせて解決する ----
  // 書式 '[b|#]度数:品質'。例 '2:m7' = Ⅱm7、'b7:' = ♭Ⅶ
  const romanNumerals = ['Ⅰ', 'Ⅱ', 'Ⅲ', 'Ⅳ', 'Ⅴ', 'Ⅵ', 'Ⅶ'];
  const majorSteps = [0, 2, 4, 5, 7, 9, 11]; // 長音階の半音数。C D E F G A B の高さとしても使う
  const letters = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];
  const enharmonicSimple = { 'C♭': 'B', 'F♭': 'E', 'E♯': 'F', 'B♯': 'C' }; // 実用上よく使う綴りへ寄せる
  const tonicNames = {
    major: ['C', 'D♭', 'D', 'E♭', 'E', 'F', 'F♯', 'G', 'A♭', 'A', 'B♭', 'B'],
    minor: ['C', 'C♯', 'D', 'E♭', 'E', 'F', 'F♯', 'G', 'G♯', 'A', 'B♭', 'B']
  };

  // cat: 一覧の分類 / aliases: 検索用の別名（通称・数字表記など）
  const progressionCategories = ['基本', 'J-POP定番', '洋楽・ロック', 'ジャズ', '短調の定番', 'クリシェ'];

  const progressions = [
    { id: 'three-chord', cat: '基本', name: 'スリーコード（Ⅰ-Ⅳ-Ⅴ）', mode: 'major', chords: ['1', '4', '5', '1'],
      aliases: ['1451', '主要三和音', 'フォーク'],
      summary: '主要三和音だけでできる基本形。ロックやフォークの出発点。' },
    { id: 'rock-1454', cat: '基本', name: 'ロックのスリーコード（Ⅰ-Ⅳ-Ⅴ-Ⅳ）', mode: 'major', chords: ['1', '4', '5', '4'],
      aliases: ['1454', 'ロックンロール'],
      summary: 'Ⅴのあとにいったんまた Ⅳ へ戻して、ぐるぐる回す形。ロックンロールやパンクで多い。' },
    { id: 'one-four-six-five', cat: '基本', name: 'Ⅰ-Ⅳ-Ⅵm-Ⅴ', mode: 'major', chords: ['1', '4', '6:m', '5'],
      aliases: ['1465'],
      summary: '明るい主和音から始まり、Ⅵm でほんの少し切なくなってⅤで次へ向かう。' },
    { id: 'one-three-four-five', cat: '基本', name: 'Ⅰ-Ⅲm-Ⅳ-Ⅴ', mode: 'major', chords: ['1', '3:m', '4', '5'],
      aliases: ['1345'],
      summary: '根音が1音ずつ上がっていく形。Ⅲm が入るので、スリーコードより少しやわらかい。' },

    { id: 'oudou', cat: 'J-POP定番', name: '王道進行', mode: 'major', chords: ['4:maj7', '5:7', '3:m7', '6:m'],
      aliases: ['4536', 'おうどう', 'Ⅳ-Ⅴ-Ⅲm-Ⅵm', '王道'],
      summary: 'J-POPのサビで多い。切なさと高揚感が同居する。Ⅲm のところで一瞬ほろりとして、Ⅵm に着地する。' },
    { id: 'oudou-triad', cat: 'J-POP定番', name: '王道進行（三和音）', mode: 'major', chords: ['4', '5', '3:m', '6:m'],
      aliases: ['4536', '王道', 'おうどう'],
      summary: '王道進行を三和音だけで弾く形。ギターのコードブックでも押さえやすい。' },
    { id: 'two-five-three-six', cat: 'J-POP定番', name: 'Ⅱm-Ⅴ-Ⅲm-Ⅵm（より切ない王道）', mode: 'major', chords: ['2:m', '5', '3:m', '6:m'],
      aliases: ['2536', '王道の亜種'],
      summary: '王道の最初の Ⅳ を Ⅱm に替えた形。サブドミナントの代わりに使い、いっそう切なくなる。' },
    { id: 'komuro', cat: 'J-POP定番', name: '小室進行', mode: 'major', chords: ['6:m', '4', '5', '1'],
      aliases: ['6451', 'ろくよんごーいち', 'こむろ'],
      summary: '短調のⅥmから始まり、長調のⅠへ抜ける。哀愁と疾走感がある。' },
    { id: 'four-five-six-one', cat: 'J-POP定番', name: 'Ⅳ-Ⅴ-Ⅵm-Ⅰ', mode: 'major', chords: ['4', '5', '6:m', '1'],
      aliases: ['4561'],
      summary: 'Ⅵm から Ⅰ へ明るく解決する。王道進行の Ⅲm を省いた形で、さわやかに終わる。' },
    { id: 'four-five-six', cat: 'J-POP定番', name: 'Ⅳ-Ⅴ-Ⅵm', mode: 'major', chords: ['4', '5', '6:m'],
      aliases: ['456', '3コード上昇'],
      summary: '根音が3つ続けて上がる。Ⅵm で止まるので、少し余韻が残る。' },
    { id: 'four-five-six-five', cat: 'J-POP定番', name: 'Ⅳ-Ⅴ-Ⅵm-Ⅴ', mode: 'major', chords: ['4', '5', '6:m', '5'],
      aliases: ['4565'],
      summary: 'Ⅵm のあとに Ⅴ へ戻る。もう一度盛り上がりたいときに使われる。' },
    { id: 'four-five-six-three', cat: 'J-POP定番', name: 'Ⅳ-Ⅴ-Ⅵm-Ⅲm', mode: 'major', chords: ['4', '5', '6:m', '3:m'],
      aliases: ['4563'],
      summary: 'Ⅵm から Ⅲm へ下がる形。Ⅲm の哀愁が最後に残る。' },
    { id: 'junkan', cat: 'J-POP定番', name: '循環コード（Ⅰ-Ⅵm-Ⅱm-Ⅴ）', mode: 'major', chords: ['1', '6:m', '2:m', '5:7'],
      aliases: ['1625', 'イチロクニーゴー', 'じゅんかん'],
      summary: '5度ずつ下がる流れで、ぐるぐる繰り返しやすい。昔から多くの曲で使われる。' },
    { id: 'gyaku-junkan', cat: 'J-POP定番', name: '逆循環（Ⅵm-Ⅱm-Ⅴ-Ⅰ）', mode: 'major', chords: ['6:m', '2:m7', '5:7', '1'],
      aliases: ['6251', 'ろくにーごーいち'],
      summary: '循環コードを Ⅵm から始めた形。Ⅱm-Ⅴ-Ⅰ の解決感を、Ⅵm の切なさから導く。' },
    { id: 'marusa', cat: 'J-POP定番', name: '丸サ進行', mode: 'major', chords: ['4:maj7', '3:7', '6:m7', '1:7'],
      aliases: ['4361', 'まるさ', '丸の内サディスティック'],
      summary: 'Ⅲ7が入っておしゃれに聴こえる。丸の内サディスティック進行とも呼ばれる。' },
    { id: 'marusa-five', cat: 'J-POP定番', name: '丸サ進行（5コード版）', mode: 'major', chords: ['4:maj7', '3:7', '6:m7', '5:m7', '1:7'],
      aliases: ['43651', '丸サ', 'まるさ'],
      summary: '丸サ進行に Ⅴm7 を挟み、Ⅰ7 へ向かう形。ジャズ寄りの深い響きになる。' },

    { id: 'canon', cat: '洋楽・ロック', name: 'カノン進行', mode: 'major', chords: ['1', '5', '6:m', '3:m', '4', '1', '4', '5'],
      aliases: ['15634145', 'パッヘルベル', 'かのん'],
      summary: 'パッヘルベルのカノンで知られる8コード。低音が下りていくので、穏やかで明るい。' },
    { id: 'fifties', cat: '洋楽・ロック', name: '50年代進行（Ⅰ-Ⅵm-Ⅳ-Ⅴ）', mode: 'major', chords: ['1', '6:m', '4', '5'],
      aliases: ['1645', 'いつメン', 'ドゥーワップ', 'ゴールデンパターン'],
      summary: '1950年代のドゥーワップで定番だった形。素朴で懐かしい。' },
    { id: 'four-chord', cat: '洋楽・ロック', name: '4コード（Ⅰ-Ⅴ-Ⅵm-Ⅳ）', mode: 'major', chords: ['1', '5', '6:m', '4'],
      aliases: ['1564', 'ポップパンク進行', 'Let It Be進行', 'ポップパンク', 'レットイットビー'],
      summary: '洋楽ポップで多い4コード。明るく開放的で、ループしやすい。ポップパンク進行、Let It Be進行とも呼ばれる。' },
    { id: 'four-chord-minor', cat: '洋楽・ロック', name: '逆4コード（Ⅵm-Ⅳ-Ⅰ-Ⅴ）', mode: 'major', chords: ['6:m', '4', '1', '5'],
      aliases: ['6415'],
      summary: '4コードをⅥmから始めた形。同じ和音でも切ない印象になる。' },
    { id: 'mixolydian', cat: '洋楽・ロック', name: 'ロック定番（Ⅰ-♭Ⅶ-Ⅳ）', mode: 'major', chords: ['1', 'b7', '4', '1'],
      aliases: ['1b74', 'ミクソリディアン'],
      summary: '♭Ⅶが入ると力強く少しワイルドになる。ロックでよく使われる。' },
    { id: 'blues-12', cat: '洋楽・ロック', name: '12小節ブルース', mode: 'major', chords: ['1:7', '1:7', '1:7', '1:7', '4:7', '4:7', '1:7', '1:7', '5:7', '4:7', '1:7', '5:7'],
      aliases: ['12バーブルース', 'ブルース', '12小節'],
      summary: '1コード1小節で12小節。ブルースやロックンロールの土台になる形。' },

    { id: 'two-five', cat: 'ジャズ', name: 'ツーファイブ（Ⅱ-Ⅴ）', mode: 'major', chords: ['2:m7', '5:7'],
      aliases: ['25', 'ii-v', 'ツーファイブ', '2-5'],
      summary: 'ジャズの基本単位。Ⅱm7からⅤ7へ進むと、Ⅰに戻りたくなる流れが生まれる。' },
    { id: 'two-five-one', cat: 'ジャズ', name: 'Ⅱ-Ⅴ-Ⅰ', mode: 'major', chords: ['2:m7', '5:7', '1:maj7'],
      aliases: ['251', 'ii-v-i', 'ツーファイブワン'],
      summary: 'ツーファイブがⅠへ解決する形。曲の終わりやキーの切り替えに使われる。' },
    { id: 'two-five-one-four', cat: 'ジャズ', name: 'Ⅱ-Ⅴ-Ⅰ-Ⅳ', mode: 'major', chords: ['2:m7', '5:7', '1:maj7', '4:maj7'],
      aliases: ['2514', 'サイクルオブフィフス'],
      summary: 'Ⅱ-Ⅴ-Ⅰ のあとに Ⅳ へ進み、次の Ⅱ-Ⅴ へつなげる。5度ずつ下がる流れが続く。' },
    { id: 'sanroku', cat: 'ジャズ', name: '三六二五（Ⅲm7-Ⅵ7-Ⅱm7-Ⅴ7）', mode: 'major', chords: ['3:m7', '6:7', '2:m7', '5:7'],
      aliases: ['3625', 'さんろくにご'],
      summary: '5度ずつ下がり、Ⅵ7がⅡm7へ強く引っ張る。ジャズ寄りの響き。' },
    { id: 'minor-two-five', cat: 'ジャズ', name: '短調のツーファイブ（Ⅱm7♭5-Ⅴ7-Ⅰm7）', mode: 'minor', chords: ['2:m7♭5', '5:7', '1:m7'],
      aliases: ['ii-v-i', 'マイナーツーファイブ', '251'],
      summary: 'ジャズの短調版。Ⅱm7♭5が暗く、Ⅴ7で緊張してⅠm7に落ち着く。' },

    { id: 'andalusian', cat: '短調の定番', name: 'アンダルシア進行', mode: 'minor', chords: ['1:m', 'b7', 'b6', '5'],
      aliases: ['1m b7 b6 5', 'フラメンコ', 'Ⅰm-♭Ⅶ-♭Ⅵ-Ⅴ'],
      summary: '短調で順番に下がる流れ。フラメンコ風の情熱的な響きになる。' },
    { id: 'minor-four', cat: '短調の定番', name: '短調の4コード（Ⅰm-♭Ⅵ-♭Ⅲ-♭Ⅶ）', mode: 'minor', chords: ['1:m', 'b6', 'b3', 'b7'],
      aliases: ['1m b6 b3 b7'],
      summary: '短調の定番ループ。重く広がりのある響き。' },
    { id: 'minor-cadence', cat: '短調の定番', name: '短調の終止（Ⅳm-Ⅴ7-Ⅰm）', mode: 'minor', chords: ['4:m', '5:7', '1:m'],
      aliases: ['4m 5 1m', 'マイナー終止'],
      summary: 'Ⅴ7がⅠmへ強く解決する、短調のしめくくりの形。' },
    { id: 'minor-1-4-5', cat: '短調の定番', name: 'Ⅰm-Ⅳm-Ⅴ7', mode: 'minor', chords: ['1:m', '4:m', '5:7'],
      aliases: ['1m4m5', 'マイナースリーコード'],
      summary: '短調の主要三和音。Ⅴ7 が Ⅰm へ戻りたくさせる、シンプルな形。' },
    { id: 'minor-1-4-b7-5', cat: '短調の定番', name: 'Ⅰm-Ⅳm-♭Ⅶ-Ⅴ7', mode: 'minor', chords: ['1:m', '4:m', 'b7', '5:7'],
      aliases: ['1m4mb75'],
      summary: 'Ⅳm から ♭Ⅶ を経て Ⅴ7 へ。♭Ⅶ が入って、短調に少し広がりが出る。' },
    { id: 'minor-1-b6-b7', cat: '短調の定番', name: 'Ⅰm-♭Ⅵ-♭Ⅶ', mode: 'minor', chords: ['1:m', 'b6', 'b7'],
      aliases: ['1mb6b7', 'エオリアン'],
      summary: '♭Ⅵ から ♭Ⅶ へ上がって、力強く盛り上がる。ロックやアニメ曲で多い。' },
    { id: 'minor-1-b6-b3-5', cat: '短調の定番', name: 'Ⅰm-♭Ⅵ-♭Ⅲ-Ⅴ7', mode: 'minor', chords: ['1:m', 'b6', 'b3', '5:7'],
      aliases: ['1mb6b35'],
      summary: '♭Ⅵ と ♭Ⅲ の明るさを経て、Ⅴ7 で Ⅰm に戻りたくなる。' },
    { id: 'minor-1-b7-b6-5', cat: '短調の定番', name: 'Ⅰm-♭Ⅶ-♭Ⅵ-Ⅴ7', mode: 'minor', chords: ['1:m', 'b7', 'b6', '5:7'],
      aliases: ['1mb7b65', 'アンダルシアの変形'],
      summary: 'アンダルシア進行の最後を Ⅴ7 にした形。下降する流れが、Ⅴ7 でⅠmへ向かう。' },
    { id: 'minor-1-b3-4-5', cat: '短調の定番', name: 'Ⅰm-♭Ⅲ-Ⅳm-Ⅴ7', mode: 'minor', chords: ['1:m', 'b3', '4:m', '5:7'],
      aliases: ['1mb34m5'],
      summary: '♭Ⅲ から Ⅳm へ上がっていく形。短調のサビで広がりを出したいときに使われる。' },
    { id: 'minor-b6-b7-1', cat: '短調の定番', name: '♭Ⅵ-♭Ⅶ-Ⅰm', mode: 'minor', chords: ['b6', 'b7', '1:m'],
      aliases: ['b6b71m'],
      summary: '♭Ⅵ-♭Ⅶ から Ⅰm へ着地する。三つの流れが短く、ロックで多い。' },
    { id: 'minor-b6-5-1', cat: '短調の定番', name: '♭Ⅵ-Ⅴ7-Ⅰm', mode: 'minor', chords: ['b6', '5:7', '1:m'],
      aliases: ['b651m'],
      summary: '♭Ⅵ から Ⅴ7 へ下り、Ⅰm へ解決する。切なさのある終止形。' },
    { id: 'minor-4-1-5-1', cat: '短調の定番', name: 'Ⅳm-Ⅰm-Ⅴ7-Ⅰm', mode: 'minor', chords: ['4:m', '1:m', '5:7', '1:m'],
      aliases: ['4m1m51m'],
      summary: 'Ⅳm から始まり、Ⅴ7 で Ⅰm へ戻る。短調で落ち着いた雰囲気を作る。' },

    { id: 'cliche-major', cat: 'クリシェ', name: '下降クリシェ（長調）', mode: 'major', chords: ['1', '1:maj7', '1:7', '4'],
      aliases: ['クリシェ', 'ラインクリシェ', 'ライン'],
      summary: '同じ和音のまま、1音だけが半音ずつ下がっていく。Ⅰ から Ⅳ へつながるときに使われる。' },
    { id: 'cliche-minor', cat: 'クリシェ', name: '下降クリシェ（短調）', mode: 'minor', chords: ['1:m', '1:mM7', '1:m7', '1:m6'],
      aliases: ['クリシェ', 'ラインクリシェ', 'ライン'],
      summary: '短調の和音のまま、1音だけが半音ずつ下がる。映画音楽のような雰囲気になる。' }
  ];

  function parseChord(token) {
    const m = /^([b#]?)([1-7]):(.*)$/.exec(token + (token.indexOf(':') < 0 ? ':' : ''));
    return { acc: m[1] === 'b' ? -1 : (m[1] === '#' ? 1 : 0), degree: Number(m[2]), quality: m[3] };
  }

  function accidentalText(n) {
    return ['♭♭', '♭', '', '♯', '♯♯'][n + 2] || '';
  }

  // 主音の綴りと度数から、文字を1つずつ進めて根音を綴る（F♯メジャーのⅦ＝E♯、のように正しく綴る）
  function spellRoot(tonic, degree, acc) {
    const base = letters.indexOf(tonic.charAt(0));
    const tonicAcc = tonic.charAt(1) === '♯' ? 1 : (tonic.charAt(1) === '♭' ? -1 : 0);
    const tonicPc = majorSteps[base] + tonicAcc;
    const letterIndex = (base + degree - 1) % 7;
    const target = (tonicPc + majorSteps[degree - 1] + acc + 120) % 12;
    const diff = ((target - majorSteps[letterIndex] + 18) % 12) - 6;
    const spelled = letters[letterIndex] + accidentalText(diff);
    return enharmonicSimple[spelled] || spelled;
  }

  const theory = {
    version: '1.11.0',
    keys: keyOrder,
    circleOfFifths,
    commonChords,
    tunings,
    voiceRanges,
    commonProgressions,
    progressions,
    progressionCategories,
    tonicNames
  };

  const helpers = { version: theory.version, getGuitarTunings:()=>window.KIRIN_GUITAR_THEORY.presets, detectGuitarChord:(notes,flats,slash)=>window.KIRIN_GUITAR_THEORY.detect(notes,flats,slash), getGuitarForms:(tuning,root,symbol)=>window.KIRIN_GUITAR_THEORY.forms(tuning,root,symbol),
    getKeyById(id) {
      return theory.keys.find((key) => key.id === id) || null;
    },
    getCircleOfFifths() {
      return theory.circleOfFifths.slice();
    },
    getRelativeMinor(keyId) {
      const key = this.getKeyById(keyId);
      return key ? key.relativeMinor : null;
    },
    getCommonChords() {
      return theory.commonChords.map((chord) => ({ ...chord }));
    },
    getTuning(id) {
      return theory.tunings.find((tuning) => tuning.id === id) || theory.tunings[0];
    },
    getVoiceRange(name) {
      return theory.voiceRanges.find((item) => item.name === name) || theory.voiceRanges[2];
    },
    getChordProgression(keyId) {
      return commonProgressions[keyId] || ['C', 'F', 'G', 'Am'];
    },
    getTonicName(pc, mode) {
      return tonicNames[mode === 'minor' ? 'minor' : 'major'][((pc % 12) + 12) % 12];
    },
    getProgressionCategories() {
      return progressionCategories.slice();
    },
    getProgressionList(mode) {
      return progressions
        .filter((item) => !mode || mode === 'all' || item.mode === mode)
        .map((item) => ({ ...item, chords: item.chords.slice(), aliases: item.aliases.slice() }));
    },
    resolveProgression(id, pc) {
      const item = progressions.find((p) => p.id === id);
      if (!item) return null;
      const tonic = helpers.getTonicName(pc, item.mode);
      const chords = item.chords.map((token) => {
        const c = parseChord(token);
        return {
          roman: accidentalText(c.acc) + romanNumerals[c.degree - 1] + c.quality,
          name: spellRoot(tonic, c.degree, c.acc) + c.quality
        };
      });
      return { id: item.id, name: item.name, mode: item.mode, summary: item.summary, cat: item.cat, aliases: item.aliases.slice(),
        keyName: tonic + (item.mode === 'minor' ? 'm' : ''), chords };
    }
  };

  window.MUSIC_THEORY_DATA = theory;
  window.musicTheory = helpers;
})();
/* KIRIN-HARMONY:BEGIN */
(function(){'use strict';
const mod=n=>((n%12)+12)%12;
const names=['C','Db','D','Eb','E','F','Gb','G','Ab','A','Bb','B'];
function triads(root,mode='major'){const intervals=mode==='major'?[0,2,4,5,7,9,11]:[0,2,3,5,7,8,10],q=mode==='major'?['','m','m','','','m','dim']:['m','dim','','m','','',''];return intervals.map((v,i)=>({rootPc:mod(root+v),quality:q[i],name:names[mod(root+v)]+q[i],degree:i+1}));}
function compare(root,target,mode='major'){const source=triads(root,mode),dest=triads(target,mode);const common=source.filter(a=>dest.some(b=>b.rootPc===a.rootPc&&b.quality===a.quality));return {source,dest,common,cadence:names[mod(target+7)]+'7 → '+names[mod(target)]+(mode==='minor'?'m':'')};}
function substitutes(root,mode='major'){const chords=triads(root,mode),groups=mode==='major'?[[0,2,5],[1,3],[4,6]]:[[0,2,5],[1,3],[4,6]];return chords.map((c,i)=>({chord:c,options:groups.find(g=>g.includes(i)).filter(j=>j!==i).map(j=>chords[j]),condition:mode==='major'?'機能が近い候補。旋律・声部進行・前後の和音で適否が変わります。':'自然短音階内の機能が近い候補。短調のV7は別の和声的短音階の扱い。'}));}
function tritone(root){return names[mod(root+6)]+'7';}
window.KIRIN_HARMONY=Object.freeze({version:'1.11.0',names,triads,compare,substitutes,tritone});
})();
/* KIRIN-HARMONY:END */
/* KIRIN-SCALE-THEORY:BEGIN */
(function(){
'use strict';
const scales=[{"id":"major","name":"メジャー（アイオニアン）","family":"長短音階・モード","intervals":[0,2,4,5,7,9,11],"degrees":["1","2","3","4","5","6","7"],"description":"長音階。W-W-H-W-W-W-H。","source":"https://openmusictheory.github.io/scales"},{"id":"natural-minor","name":"ナチュラルマイナー（エオリアン）","family":"長短音階・モード","intervals":[0,2,3,5,7,8,10],"degrees":["1","2","♭3","4","5","♭6","♭7"],"description":"自然短音階。","source":"https://openmusictheory.github.io/scales"},{"id":"harmonic-minor","name":"ハーモニックマイナー","family":"長短音階","intervals":[0,2,3,5,7,8,11],"degrees":["1","2","♭3","4","5","♭6","7"],"description":"自然短音階の第7音を半音上げる。","source":"https://openmusictheory.github.io/scales"},{"id":"melodic-minor","name":"メロディックマイナー（上行形）","family":"長短音階","intervals":[0,2,3,5,7,9,11],"degrees":["1","2","♭3","4","5","6","7"],"description":"上行形の固定音列。クラシックの下行形は自然短音階を選択。","source":"https://openmusictheory.github.io/scales"},{"id":"dorian","name":"ドリアン","family":"モード","intervals":[0,2,3,5,7,9,10],"degrees":["1","2","♭3","4","5","6","♭7"],"description":"自然短音階に対し第6音が高い。","source":"https://viva.pressbooks.pub/openmusictheory/chapter/intro-to-diatonic-modes-and-the-chromatic-scale/"},{"id":"phrygian","name":"フリジアン","family":"モード","intervals":[0,1,3,5,7,8,10],"degrees":["1","♭2","♭3","4","5","♭6","♭7"],"description":"自然短音階に対し第2音が低い。","source":"https://viva.pressbooks.pub/openmusictheory/chapter/intro-to-diatonic-modes-and-the-chromatic-scale/"},{"id":"lydian","name":"リディアン","family":"モード","intervals":[0,2,4,6,7,9,11],"degrees":["1","2","3","♯4","5","6","7"],"description":"長音階の第4音を半音上げる。","source":"https://viva.pressbooks.pub/openmusictheory/chapter/intro-to-diatonic-modes-and-the-chromatic-scale/"},{"id":"mixolydian","name":"ミクソリディアン","family":"モード","intervals":[0,2,4,5,7,9,10],"degrees":["1","2","3","4","5","6","♭7"],"description":"長音階の第7音を半音下げる。","source":"https://viva.pressbooks.pub/openmusictheory/chapter/intro-to-diatonic-modes-and-the-chromatic-scale/"},{"id":"locrian","name":"ロクリアン","family":"モード","intervals":[0,1,3,5,6,8,10],"degrees":["1","♭2","♭3","4","♭5","♭6","♭7"],"description":"減5度を含む7音のモード。","source":"https://viva.pressbooks.pub/openmusictheory/chapter/intro-to-diatonic-modes-and-the-chromatic-scale/"},{"id":"major-pentatonic","name":"メジャーペンタトニック","family":"五音音階","intervals":[0,2,4,7,9],"degrees":["1","2","3","5","6"],"description":"長音階から第4・第7音を除いた5音。","source":"https://viva.pressbooks.pub/openmusictheory/chapter/collections/"},{"id":"minor-pentatonic","name":"マイナーペンタトニック","family":"五音音階","intervals":[0,3,5,7,10],"degrees":["1","♭3","4","5","♭7"],"description":"自然短音階から第2・第6音を除いた5音。","source":"https://viva.pressbooks.pub/openmusictheory/chapter/collections/"},{"id":"minor-blues","name":"マイナーブルース","family":"ブルース","intervals":[0,3,5,6,7,10],"degrees":["1","♭3","4","♯4","5","♭7"],"description":"マイナーペンタに♯4（♭5と同音）を追加した一般的な6音形。","source":"https://viva.pressbooks.pub/openmusictheory/chapter/blues-melodies-and-the-blues-scale/"},{"id":"major-blues","name":"メジャーブルース","family":"ブルース","intervals":[0,2,3,4,7,9],"degrees":["1","2","♯2","3","5","6"],"description":"メジャーペンタに♯2（♭3と同音）を追加した6音形。ブルースの実際の音程には揺れがある。","source":"https://viva.pressbooks.pub/openmusictheory/chapter/blues-melodies-and-the-blues-scale/"},{"id":"whole-tone","name":"ホールトーン（全音音階）","family":"対称音階","intervals":[0,2,4,6,8,10],"degrees":["1","2","3","♯4","♯5","♭7"],"description":"全音6音。度数は練習用の代表表記で、綴りは文脈により異なる。","source":"https://viva.pressbooks.pub/openmusictheory/chapter/collections/"},{"id":"octatonic-half-whole","name":"ディミニッシュ（半音・全音）","family":"対称音階","intervals":[0,1,3,4,6,7,9,10],"degrees":["1","♭2","♭3","3","♯4","5","6","♭7"],"description":"半音と全音が交互の8音。度数は代表表記。","source":"https://viva.pressbooks.pub/openmusictheory/chapter/collections/"},{"id":"octatonic-whole-half","name":"ディミニッシュ（全音・半音）","family":"対称音階","intervals":[0,2,3,5,6,8,9,11],"degrees":["1","2","♭3","4","♭5","♭6","6","7"],"description":"全音と半音が交互の8音。度数は代表表記。","source":"https://viva.pressbooks.pub/openmusictheory/chapter/collections/"},{"id":"chromatic","name":"クロマチック（半音階）","family":"半音階","intervals":[0,1,2,3,4,5,6,7,8,9,10,11],"degrees":["1","♭2","2","♭3","3","4","♭5","5","♭6","6","♭7","7"],"description":"12半音。度数は代表表記、厳密な音名綴りは文脈による。","source":"https://openmusictheory.github.io/scales"}];
scales.forEach(s=>{Object.freeze(s.intervals);Object.freeze(s.degrees);Object.freeze(s);});
const mod=n=>((n%12)+12)%12;
function get(id){const s=scales.find(s=>s.id===id);if(!s)throw new Error('Unknown scale: '+id);return s;}
function points(tuning,root,id){const s=get(id),g=window.KIRIN_GUITAR_THEORY;return tuning.flatMap((n,i)=>Array.from({length:25},(_,f)=>({string:6-i,fret:f,midi:g.toMidi(n)+f}))).filter(p=>s.intervals.includes(mod(p.midi-root))).map(p=>({...p,root:mod(p.midi-root)===0,degree:s.degrees[s.intervals.indexOf(mod(p.midi-root))]}));}
function block(tuning,root,id,start,width){return points(tuning,root,id).filter(p=>p.fret>=start&&p.fret<start+width);}
function roots(tuning,root,id,string){return points(tuning,root,id).filter(p=>p.string===string&&p.root).sort((a,b)=>a.fret-b.fret);}
function route(tuning,root,id,string,start,options={}){
const all=points(tuning,root,id),first=roots(tuning,root,id,string).find(p=>p.fret>=start),width=options.width===4?4:5,choices=options.choices||{};if(!first)return {path:[],complete:false,groups:[],octaves:0,blocks:[]};const scale=get(id),blocks=[];let current=first,path=[first];
function makeCandidates(from,to){const tones=scale.intervals.map(n=>from.midi+n).concat(from.midi+12);const seen=new Map(),windows=[];for(let lo=0;lo<=25-width;lo++)if(from.fret>=lo&&from.fret<lo+width&&to.fret>=lo&&to.fret<lo+width)windows.push({lo,hi:lo+width-1,extended:false});if(!windows.length)windows.push({lo:Math.max(0,Math.min(from.fret,to.fret)-1),hi:Math.min(24,Math.max(from.fret,to.fret)+1),extended:true});
function visit(i,last,chain,window){if(i===tones.length){const key=chain.map(p=>p.string+':'+p.fret).join(','),score=chain.reduce((s,p,j)=>j?s+Math.abs(p.fret-chain[j-1].fret)*.4+(p.string!==chain[j-1].string?0:1):s,0);seen.set(key,{points:chain,low:Math.min(...chain.map(p=>p.fret)),high:Math.max(...chain.map(p=>p.fret)),extended:window.extended,score,key});return;}const opts=i===tones.length-1?[to]:all.filter(p=>p.midi===tones[i]&&p.string<=last.string&&p.string>=last.string-1&&p.string>=to.string&&p.fret>=window.lo&&p.fret<=window.hi&&Math.abs(p.fret-last.fret)<=5);for(const p of opts){if(p.string>last.string||Math.abs(p.fret-last.fret)>5)continue;visit(i+1,p,chain.concat(p),window);}}
for(const w of windows)visit(1,from,[from],w);if(!seen.size&&!windows.some(w=>w.extended)){const w={lo:Math.max(0,Math.min(from.fret,to.fret)-2),hi:Math.min(24,Math.max(from.fret,to.fret)+3),extended:true};visit(1,from,[from],w);}return [...seen.values()].sort((a,b)=>a.extended-b.extended||a.score-b.score||a.key.localeCompare(b.key)).slice(0,16);}
while(current.midi+12<=Math.max(...all.map(p=>p.midi))){const targetString=current.string>2?current.string-2:1,to=all.find(p=>p.string===targetString&&p.midi===current.midi+12);if(!to)break;const candidates=makeCandidates(current,to);if(!candidates.length)break;let index=choices[current.midi];if(typeof index==='string')index=candidates.findIndex(c=>c.key===index);index=Number.isInteger(index)&&index>=0?index:0;index%=candidates.length;const selected=candidates[index];blocks.push({octave:blocks.length+1,start:current,end:to,points:selected.points,candidates,index,width,extended:selected.extended});path=path.concat(selected.points.slice(1));current=to;}
const groups=[];let group=[];path.forEach(p=>{if(group.length&&p.string!==group[0].string){groups.push(group);group=[];}group.push(p);});if(group.length)groups.push(group);return {path:path.map((p,i)=>({...p,order:i+1})),complete:current.string===1&&blocks.length>0,groups:groups.map(g=>({string:g[0].string,frets:g.map(p=>p.fret),gaps:g.slice(1).map((p,i)=>p.fret-g[i].fret)})),octaves:(current.midi-first.midi)/12,blocks,width};}
function spell(rootName,degree){const natural={C:0,D:2,E:4,F:5,G:7,A:9,B:11},letters='CDEFGAB',root=mod(natural[rootName[0]]+(rootName.includes('#')?1:rootName.includes('b')?-1:0)),match=degree.match(/^([♭♯]*)([1-7])$/),step=Number(match[2])-1,shift=[...match[1]].reduce((a,c)=>a+(c==='♯'?1:-1),0),target=mod(root+[0,2,4,5,7,9,11][step]+shift),letter=letters[(letters.indexOf(rootName[0])+step)%7];let diff=mod(target-natural[letter]);if(diff>6)diff-=12;return letter+(diff>0?'♯'.repeat(diff):'♭'.repeat(-diff));}
window.KIRIN_SCALE_THEORY=Object.freeze({version:'1.11.0',scales:Object.freeze(scales),get,points,block,roots,route,spell});
})();
/* KIRIN-SCALE-THEORY:END */