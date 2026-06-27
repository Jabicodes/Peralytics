
// PERALYTICS — Clean JS (no patch accumulation)
// ═══════════════════════════════════════════════

// ── STATE ────────────────────────────────────────────────────────
var incomes=[], expenses=[], goals=[], debts=[], transactions=[], receivables=[], envelopes=[];
var walletBalance=0, currentYear=new Date().getFullYear(), currentMonth=new Date().getMonth();
var monthHistory={}, receipts=[];
var pieChart,barChart,hbarChart,histChart;
var txnType='out';

var MONTHS=['January','February','March','April','May','June','July','August','September','October','November','December'];
var CAT_COLORS={Housing:'#534AB7',Food:'#1D9E75',Transport:'#BA7517',Utilities:'#378ADD',Entertainment:'#D4537E',Health:'#3B6D11',Shopping:'#D85A30',Education:'#185FA5',Other:'#888780'};

// ── GAMIFICATION STATE ───────────────────────────────────────────
var gameState={
  xp:0, level:1, totalPoints:0,
  badges:[], collection:[],
  streak:0, lastActiveDate:null,
  gachaDifficulty:'medium',
  gachaPulls:3,
  gachaPullsSpent:0,
  questsCompleted:[],
  totalSaved:0,
  goalsCompleted:0,
  debtsCleared:0
};

var LEVELS=[
  {level:1, title:'Budol Beginner',    xpNeeded:0,    xpNext:100},
  {level:2, title:'Tipid Tito/Tita',   xpNeeded:100,  xpNext:250},
  {level:3, title:'Ipon Apprentice',   xpNeeded:250,  xpNext:500},
  {level:4, title:'Pera Padawan',      xpNeeded:500,  xpNext:900},
  {level:5, title:'Savings Sentinel',  xpNeeded:900,  xpNext:1500},
  {level:6, title:'Kuripot Knight',    xpNeeded:1500, xpNext:2500},
  {level:7, title:'Finance Wizard',    xpNeeded:2500, xpNext:4000},
  {level:8, title:'Pera Paladin',      xpNeeded:4000, xpNext:6500},
  {level:9, title:'Money Maestro',     xpNeeded:6500, xpNext:10000},
  {level:10,title:'Peralytics Legend', xpNeeded:10000,xpNext:99999}
];

var GACHA_DIFFICULTY={
  easy:  {label:'Easy',   pointsPerPull:50,  description:'50 chars per pull'},
  medium:{label:'Medium', pointsPerPull:150, description:'150 chars per pull'},
  hard:  {label:'Hard',   pointsPerPull:350, description:'350 chars per pull'}
};

var GACHA_COLLECTION=[
  {id:"piggy",    emoji:"🐷", name:"Pisong",           type:"character",  rarity:"common",    desc:"Your original savings piggy buddy!",         weight:28},
  {id:"chick",    emoji:"🐥", name:"Kikay Chick",      type:"character",  rarity:"common",    desc:"Cute little saver just hatching out!",       weight:26},
  {id:"cat",      emoji:"🐱", name:"Tipid Cat",        type:"character",  rarity:"common",    desc:"Cool, calm, and always saving.",             weight:24},
  {id:"frog",     emoji:"🐸", name:"Kuripot Frog",     type:"character",  rarity:"common",    desc:"Jumps on every good deal!",                  weight:22},
  {id:"bear",     emoji:"🐻", name:"Ipon Bear",        type:"character",  rarity:"common",    desc:"Hibernate mode: saving every piso.",         weight:20},
  {id:"hat",      emoji:"🎩", name:"Savings Top Hat",  type:"accessory",  rarity:"common",    desc:"For the classy saver in you.",               weight:30},
  {id:"coin_acc", emoji:"🪙", name:"Lucky Coin",       type:"accessory",  rarity:"common",    desc:"Carry it for good financial luck!",          weight:28},
  {id:"bag",      emoji:"🎒", name:"Ipon Backpack",    type:"accessory",  rarity:"common",    desc:"Always packed and ready to save.",           weight:25},
  {id:"sprout",   emoji:"🌱", name:"Money Sprout",     type:"accessory",  rarity:"common",    desc:"Small savings grow into big trees.",         weight:23},
  {id:"fox",      emoji:"🦊", name:"Diskwento Fox",    type:"character",  rarity:"rare",      desc:"Always finds the best deals in town.",       weight:12},
  {id:"rabbit",   emoji:"🐰", name:"Pabilis Rabbit",   type:"character",  rarity:"rare",      desc:"Fast at saving, faster at growing!",         weight:10},
  {id:"panda",    emoji:"🐼", name:"Budget Panda",     type:"character",  rarity:"rare",      desc:"Chill but serious about finances.",          weight:9},
  {id:"gem",      emoji:"💎", name:"Sapphire Gem",     type:"accessory",  rarity:"rare",      desc:"Rare treasure for dedicated savers.",        weight:13},
  {id:"glasses",  emoji:"🕶", name:"Finance Shades",   type:"accessory",  rarity:"rare",      desc:"See your budget clearly.",                   weight:11},
  {id:"rocket",   emoji:"🚀", name:"Ipon Rocket",      type:"accessory",  rarity:"rare",      desc:"Strap this on and watch savings fly!",       weight:9},
  {id:"dragon",   emoji:"🐉", name:"Ipon Dragon",      type:"character",  rarity:"epic",      desc:"Hoards gold like an absolute pro.",          weight:4},
  {id:"unicorn",  emoji:"🦄", name:"Budget Unicorn",   type:"character",  rarity:"epic",      desc:"Magical and rare budget keeper.",            weight:3},
  {id:"wolf",     emoji:"🐺", name:"Alpha Saver",      type:"character",  rarity:"epic",      desc:"Leads the pack in financial discipline.",    weight:3},
  {id:"wizard_hat",emoji:"🧙",name:"Wizard Hat",       type:"accessory",  rarity:"epic",      desc:"Grants +1 financial wisdom.",                weight:4},
  {id:"crystal",  emoji:"🔮", name:"Pera Crystal",     type:"accessory",  rarity:"epic",      desc:"See your financial future clearly.",         weight:3},
  {id:"trophy",   emoji:"🏆", name:"Gold Trophy",      type:"accessory",  rarity:"epic",      desc:"Only for real goal crushers.",               weight:3},
  {id:"wings",    emoji:"🪽", name:"Saver Wings",      type:"accessory",  rarity:"epic",      desc:"Your savings have reached new heights!",     weight:2},
  {id:"phoenix",  emoji:"🦅", name:"Bangon Phoenix",   type:"character",  rarity:"legendary", desc:"Rose from debt to financial freedom.",       weight:2},
  {id:"lion",     emoji:"🦁", name:"Hari ng Ipon",     type:"character",  rarity:"legendary", desc:"The king of saving. True Peralytics legend.",weight:1},
  {id:"crown",    emoji:"👑", name:"Peralytics Crown", type:"accessory",  rarity:"legendary", desc:"Worn only by the true Money Maestro.",       weight:1},
  {id:"star",     emoji:"🌟", name:"Golden Star",      type:"accessory",  rarity:"legendary", desc:"Shines brighter than all your debts.",       weight:1},
  {id:"dragon2",  emoji:"🐲", name:"Gold Dragon Acc",  type:"accessory",  rarity:"legendary", desc:"The rarest Peralytics item. You legend.",    weight:1}
];

var BADGES=[
  {id:'first_income',  emoji:'💰', name:'First Peso',      desc:'Add your first income source',    check:function(s){return (s.incomeCount||0)>=1;}},
  {id:'first_expense', emoji:'📝', name:'Expense Tracker', desc:'Log your first expense',          check:function(s){return (s.expenseCount||0)>=1;}},
  {id:'first_goal',    emoji:'🎯', name:'Goal Setter',     desc:'Create your first savings goal',  check:function(s){return (s.goalCount||0)>=1;}},
  {id:'first_save',    emoji:'🐖', name:'First Deposit',   desc:'Add money to a savings goal',     check:function(s){return (s.goalDeposits||0)>=1;}},
  {id:'goal_complete', emoji:'🏆', name:'Goal Crusher',    desc:'Complete a savings goal',         check:function(s){return (s.goalsCompleted||0)>=1;}},
  {id:'saver_1k',      emoji:'💵', name:'1K Club',         desc:'Save 1,000 toward goals',         check:function(s){return (s.totalSaved||0)>=1000;}},
  {id:'saver_10k',     emoji:'💸', name:'10K Milestone',   desc:'Save 10,000 toward goals',        check:function(s){return (s.totalSaved||0)>=10000;}},
  {id:'saver_50k',     emoji:'🤑', name:'50K Hustler',     desc:'Save 50,000 toward goals',        check:function(s){return (s.totalSaved||0)>=50000;}},
  {id:'debt_free',     emoji:'🔓', name:'Debt Slayer',     desc:'Clear your first debt',           check:function(s){return (s.debtsCleared||0)>=1;}},
  {id:'streak_3',      emoji:'🔥', name:'On Fire',         desc:'Use the app 3 days in a row',     check:function(s){return (s.streak||0)>=3;}},
  {id:'streak_7',      emoji:'⚡', name:'Week Warrior',    desc:'7-day streak',                    check:function(s){return (s.streak||0)>=7;}},
  {id:'streak_30',     emoji:'🌙', name:'Month Master',    desc:'30-day streak',                   check:function(s){return (s.streak||0)>=30;}},
  {id:'log_10',        emoji:'📊', name:'Data Nerd',       desc:'Log 10 wallet transactions',      check:function(s){return (s.txnCount||0)>=10;}},
  {id:'collector_5',   emoji:'🎴', name:'Collector',       desc:'Own 5 gacha items',               check:function(s){return (s.collCount||0)>=5;}},
  {id:'collector_all', emoji:'🌈', name:'Completionist',   desc:'Collect all gacha items',         check:function(s){return (s.collCount||0)>=GACHA_COLLECTION.length;}},
  {id:'level_5',       emoji:'⭐', name:'Rising Star',     desc:'Reach level 5',                   check:function(s){return (s.level||1)>=5;}},
  {id:'level_10',      emoji:'👑', name:'Legend Status',   desc:'Reach max level',                 check:function(s){return (s.level||1)>=10;}}
];

var SAVING_MILESTONES=[
  {label:'Starter',  emoji:'🌱', amount:1000},
  {label:'Saver',    emoji:'🐖', amount:5000},
  {label:'Hustler',  emoji:'💼', amount:10000},
  {label:'Builder',  emoji:'🏗', amount:25000},
  {label:'Grower',   emoji:'🌳', amount:50000},
  {label:'Investor', emoji:'📈', amount:100000},
  {label:'Legend',   emoji:'👑', amount:500000}
];

var PET_STATES={
  happy:   {emoji:'🐷', msgs:['Great savings rate! Keep it up!','You are crushing your goals!','Money master mode activated!','Oink oink! Amazing work!']},
  neutral: {emoji:'🐱', msgs:['Track expenses for better insights!','Do not forget to log transactions!','How is the budget today?','Every piso saved counts!']},
  worried: {emoji:'🐶', msgs:['Expenses are getting high!','Budget alert! Time to cut back!','Spending more than you earn!','Let us fix those savings together!']},
  excited: {emoji:'🦊', msgs:['GOAL REACHED! You are amazing!','Level up! You are on fire!','New badge unlocked!','Gacha time! Go to Arcade!']},
  sleeping:{emoji:'😴', msgs:['Tap me to wake up!','It has been a while!','I missed you! Welcome back!']}
};

// ── UTILITIES ────────────────────────────────────────────────────
function toMonthly(a,f){if(f==='weekly')return a*4.3;if(f==='biweekly')return a*2;if(f==='annual')return a/12;return a;}
function fmt(n){return String.fromCharCode(8369)+Math.round(n).toLocaleString();}
function fmtD(n){return String.fromCharCode(8369)+n.toFixed(2);}
function currentKey(){return currentYear+'-'+(currentMonth+1).toString().padStart(2,'0');}
function el(id){return document.getElementById(id);}
function qs(sel){return document.querySelector(sel);}

// ── COMPUTED STATE ────────────────────────────────────────────────
function getTotalIncome(){return incomes.reduce(function(s,x){return s+x.monthly;},0);}
function getTotalExpenses(){return expenses.reduce(function(s,x){return s+x.monthly;},0);}
function getNetSavings(){return getTotalIncome()-getTotalExpenses();}
function getSavingsRate(){var i=getTotalIncome();return i>0?(getNetSavings()/i)*100:0;}
function nowTimestamp(){var n=new Date();return n.toLocaleDateString('en-PH',{month:'short',day:'numeric',year:'numeric'})+' '+n.toLocaleTimeString('en-PH',{hour:'2-digit',minute:'2-digit'});}

// ── HTML BUILDERS ─────────────────────────────────────────────────
function emptyItem(icon,text){return '<li class="empty"><i class="ti ti-'+icon+'"></i> '+text+'</li>';}
function tipCard(type,icon,heading,body){return '<div class="tip '+type+'"><div class="tip-t"><i class="ti '+icon+'"></i> '+heading+'</div><div class="tip-b">'+body+'</div></div>';}
function pbarHTML(pct,color){return '<div class="pbar-bg"><div class="pbar-fill" style="width:'+pct+'%;background:'+color+';"></div></div>';}
function metCard(cls,icon,label,value,vcls,sub){return '<div class="met '+cls+'"><div class="met-icon">'+icon+'</div><div class="met-lbl">'+label+'</div><div class="met-val'+(vcls?' '+vcls:'')+'">'+value+'</div>'+(sub?'<div class="met-sub">'+sub+'</div>':'')+'</div>';}
function clearFields(){[].slice.call(arguments).forEach(function(id){var e=el(id);if(e)e.value='';});}

// ── THEME ────────────────────────────────────────────────────────
function toggleTheme(){
  var isLight=document.body.classList.toggle('light');
  var btn=el('themeToggle');
  if(btn) btn.textContent=isLight?'Dark Mode':'Light Mode';
  localStorage.setItem('pera_theme',isLight?'light':'dark');
}
function loadTheme(){
  if(localStorage.getItem('pera_theme')==='light'){
    document.body.classList.add('light');
    var btn=el('themeToggle');
    if(btn) btn.textContent='Dark Mode';
  }
}

// ── XP & LEVELING ────────────────────────────────────────────────
function addXP(amount){
  gameState.xp+=amount;
  gameState.totalPoints+=amount;
  var oldLevel=gameState.level;
  for(var i=LEVELS.length-1;i>=0;i--){
    if(gameState.xp>=LEVELS[i].xpNeeded){gameState.level=LEVELS[i].level;break;}
  }
  if(gameState.level>oldLevel){
    var lvl=LEVELS.filter(function(l){return l.level===gameState.level;})[0];
    showToast('achievement','Level Up! '+lvl.title,'You reached Level '+gameState.level+'! Free gacha pull earned!');
    spawnConfetti();
    gameState.gachaPulls++;
  }
  updateSidebarXP();
  checkBadges();
  updateGachaUI();
  saveData();
}

function getLevelInfo(){
  var lvl=LEVELS.filter(function(l){return l.level===gameState.level;})[0]||LEVELS[0];
  var next=LEVELS.filter(function(l){return l.level===gameState.level+1;})[0];
  var xpCur=lvl.xpNeeded;
  var xpNext=next?next.xpNeeded:lvl.xpNeeded+1;
  var pct=Math.min(100,Math.round(((gameState.xp-xpCur)/(xpNext-xpCur))*100));
  return {lvl:lvl,next:next,pct:pct,xpNext:xpNext};
}

function updateSidebarXP(){
  var info=getLevelInfo();
  var fill=el('sb-xp-fill'); if(fill) fill.style.width=info.pct+'%';
  var lbl=el('sb-xp-label'); if(lbl) lbl.textContent='Lv.'+gameState.level+' '+info.lvl.title;
  var val=el('sb-xp-val');   if(val) val.textContent=gameState.xp+' chars';
}

// ── STREAK ───────────────────────────────────────────────────────
function updateStreak(){
  var today=new Date().toDateString();
  if(gameState.lastActiveDate===today) return;
  var yesterday=new Date(Date.now()-86400000).toDateString();
  if(gameState.lastActiveDate===yesterday){
    gameState.streak++;
  } else {
    gameState.streak=1;
  }
  gameState.lastActiveDate=today;
  if(gameState.streak>1){
    showToast('success','Day '+gameState.streak+' Streak! On fire!','Keep using Peralytics daily!');
    addXP(10*gameState.streak);
  }
}

// ── BADGES ───────────────────────────────────────────────────────
function checkBadges(){
  var state={
    incomeCount:incomes.length,
    expenseCount:expenses.length,
    goalCount:goals.length,
    goalDeposits:goals.filter(function(g){return g.saved>0;}).length,
    goalsCompleted:gameState.goalsCompleted,
    totalSaved:gameState.totalSaved,
    debtsCleared:gameState.debtsCleared,
    streak:gameState.streak,
    txnCount:transactions.length,
    collCount:(gameState.collection||[]).length,
    level:gameState.level
  };
  BADGES.forEach(function(badge){
    if(!(gameState.badges||[]).includes(badge.id) && badge.check(state)){
      if(!gameState.badges) gameState.badges=[];
      gameState.badges.push(badge.id);
      showToast('achievement',badge.emoji+' Badge: '+badge.name,badge.desc);
      addXP(50);
      spawnConfetti();
    }
  });
}

// ── GACHA ────────────────────────────────────────────────────────
function setGachaDifficulty(diff){
  gameState.gachaDifficulty=diff;
  document.querySelectorAll('.diff-btn').forEach(function(b){
    b.className='diff-btn';
    if(b.dataset.diff===diff) b.classList.add('active-'+diff);
  });
  updateGachaUI();
  saveData();
}

function updateGachaUI(){
  var pulls=el('gacha-pulls-count'); if(pulls) pulls.textContent=gameState.gachaPulls||0;
  var btn=el('gacha-pull-btn'); if(btn) btn.disabled=(gameState.gachaPulls||0)<=0;
  var cost=el('gacha-cost');
  if(cost){var d=GACHA_DIFFICULTY[gameState.gachaDifficulty];if(d)cost.textContent=d.description;}
  // Check if user earned new pulls from points
  var diff=GACHA_DIFFICULTY[gameState.gachaDifficulty];
  if(diff){
    var earned=Math.floor(gameState.totalPoints/diff.pointsPerPull);
    var spent=gameState.gachaPullsSpent||0;
    var available=Math.max(gameState.gachaPulls||0, earned-spent);
    if(available>(gameState.gachaPulls||0)){
      gameState.gachaPulls=available;
      if(pulls) pulls.textContent=gameState.gachaPulls;
      if(btn) btn.disabled=false;
    }
  }
}

function doGachaPull(){
  if((gameState.gachaPulls||0)<=0){showToast('success','No pulls left!','Earn more points to pull!');return;}
  gameState.gachaPulls--;
  gameState.gachaPullsSpent=(gameState.gachaPullsSpent||0)+1;
  var total=GACHA_COLLECTION.reduce(function(s,c){return s+c.weight;},0);
  var rand=Math.random()*total;
  var picked=GACHA_COLLECTION[0];
  for(var i=0;i<GACHA_COLLECTION.length;i++){rand-=GACHA_COLLECTION[i].weight;if(rand<=0){picked=GACHA_COLLECTION[i];break;}}
  if(!gameState.collection) gameState.collection=[];
  var existing=gameState.collection.filter(function(c){return c.id===picked.id;})[0];
  if(existing){existing.count=(existing.count||1)+1;}
  else{gameState.collection.push({id:picked.id,count:1});}
  var xpMap={common:10,rare:25,epic:60,legendary:150};
  addXP(xpMap[picked.rarity]||10);
  showGachaReveal(picked);
  updateGachaUI();
  renderCollection();
  checkBadges();
  saveData();
}

function showGachaReveal(item){
  var rarityColors={common:"#9090a0",rare:"#74c0fc",epic:"#8b7cf8",legendary:"#FFD700"};
  var modal=el("gacha-modal");
  var typePrefix=item.type==="character"?"🧑 Character":"🎒 Accessory";
  el("gacha-reveal-stars").textContent=typePrefix+" — "+item.rarity.toUpperCase();
  el("gacha-reveal-emoji").textContent=item.emoji;
  el("gacha-reveal-rarity").textContent=item.rarity.toUpperCase();
  el("gacha-reveal-rarity").style.color=rarityColors[item.rarity];
  el("gacha-reveal-name").textContent=item.name;
  el("gacha-reveal-desc").textContent=item.desc;
  modal.classList.add("open");
  if(item.rarity==="legendary"||item.rarity==="epic") spawnConfetti();
}

function closeGachaModal(){el('gacha-modal').classList.remove('open');}

function renderCollection(){
  var grid=el("collection-grid");
  if(!grid) return;
  var rarityColors={common:"#9090a0",rare:"#74c0fc",epic:"#8b7cf8",legendary:"#FFD700"};
  var ct=_collTab||"all";
  var items=GACHA_COLLECTION;
  if(ct==="characters") items=GACHA_COLLECTION.filter(function(x){return x.type==="character";});
  if(ct==="accessories") items=GACHA_COLLECTION.filter(function(x){return x.type==="accessory";});
  var tabs=el("collection-tabs");
  if(tabs){
    var aC=GACHA_COLLECTION.length;
    var cC=GACHA_COLLECTION.filter(function(x){return x.type==="character";}).length;
    var aCC=GACHA_COLLECTION.filter(function(x){return x.type==="accessory";}).length;
    var mkBtn=function(tab,label,count){
      var active=ct===tab?" active-tab":"";
      var b=document.createElement("button");
      b.className="coll-tab"+active;
      b.textContent=label+" ("+count+")";
      b.onclick=function(){setCollTab(tab);};
      b.ontouchend=function(e){e.preventDefault();setCollTab(tab);};
      return b.outerHTML;
    };
    tabs.innerHTML=mkBtn("all","All",aC)+mkBtn("characters","🧑 Characters",cC)+mkBtn("accessories","🎒 Accessories",aCC);
  }
  grid.innerHTML=items.map(function(item){
    var owned=(gameState.collection||[]).filter(function(c){return c.id===item.id;})[0];
    var tb="<div class=\"coll-type-badge\">"+(item.type==="character"?"🧑":"🎒")+"</div>";
    return "<div class=\"collect-card "+(owned?"owned":"not-owned")+"\" title=\""+item.desc+"\">"
      +(owned&&owned.count>1?"<div class=\"collect-count\">x"+owned.count+"</div>":"")
      +tb
      +"<span class=\"collect-emoji\">"+item.emoji+"</span>"
      +"<div class=\"collect-name\">"+item.name+"</div>"
      +"<div class=\"collect-rarity rarity-"+item.rarity+"\" style=\"color:"+rarityColors[item.rarity]+"\">"+item.rarity+"</div>"
      +"</div>";
  }).join("");
  var cc=el("collection-count"); if(cc) cc.textContent=(gameState.collection||[]).length;
}
var _collTab="all";
function setCollTab(tab){_collTab=tab;renderCollection();}

// ── TOAST ────────────────────────────────────────────────────────
function showToast(type,title,body){
  var container=el('toast-container');
  if(!container) return;
  var toast=document.createElement('div');
  toast.className='toast '+type;
  var icons={success:'info',achievement:'medal','gacha-result':'dice'};
  toast.innerHTML='<div class="toast-icon">'+(type==='achievement'?'🏅':type==='gacha-result'?'🎰':'✅')+'</div>'
    +'<div class="toast-content"><div class="toast-title">'+title+'</div><div class="toast-body">'+body+'</div></div>'
    +'<button class="toast-close" onclick="this.parentElement.remove()">x</button>';
  container.appendChild(toast);
  setTimeout(function(){toast.classList.add('leaving');setTimeout(function(){if(toast.parentElement)toast.remove();},300);},4000);
}

// ── CONFETTI ─────────────────────────────────────────────────────
function spawnConfetti(){
  var canvas=el('confetti-canvas');
  if(!canvas) return;
  var ctx=canvas.getContext('2d');
  canvas.width=window.innerWidth; canvas.height=window.innerHeight;
  var colors=['#FFD700','#8b7cf8','#00d4aa','#ff6b6b','#74c0fc'];
  var particles=[];
  for(var i=0;i<80;i++){
    particles.push({x:Math.random()*canvas.width,y:Math.random()*-100,vx:(Math.random()-.5)*4,vy:Math.random()*3+2,color:colors[Math.floor(Math.random()*5)],size:Math.random()*8+4,rot:Math.random()*360,rotV:(Math.random()-.5)*10});
  }
  var frame;
  function draw(){
    ctx.clearRect(0,0,canvas.width,canvas.height);
    var alive=false;
    particles.forEach(function(p){
      p.x+=p.vx; p.y+=p.vy; p.rot+=p.rotV; p.vy+=0.05;
      if(p.y<canvas.height) alive=true;
      ctx.save(); ctx.globalAlpha=Math.max(0,1-p.y/canvas.height);
      ctx.translate(p.x,p.y); ctx.rotate(p.rot*Math.PI/180);
      ctx.fillStyle=p.color; ctx.fillRect(-p.size/2,-p.size/2,p.size,p.size*0.5);
      ctx.restore();
    });
    if(alive) frame=requestAnimationFrame(draw);
    else ctx.clearRect(0,0,canvas.width,canvas.height);
  }
  cancelAnimationFrame(frame); draw();
  setTimeout(function(){cancelAnimationFrame(frame);ctx.clearRect(0,0,canvas.width,canvas.height);},3000);
}

// ── PET COMPANION ────────────────────────────────────────────────
var petBubbleTimer=null;

function getPetState(){
  var totalInc=getTotalIncome();
  var savings=getNetSavings();
  var rate=totalInc>0?(savings/totalInc)*100:0;
  if((gameState.gachaPulls||0)>0) return 'excited';
  if(!incomes.length&&!expenses.length) return 'sleeping';
  if(savings<0||rate<5) return 'worried';
  if(rate>=20) return 'happy';
  return 'neutral';
}

function updatePet(showMsg){
  var petBody=el('petBody');
  if(!petBody) return;
  var state=getPetState();
  var pet=PET_STATES[state];
  petBody.textContent=pet.emoji;
  if(showMsg){
    var msgs=pet.msgs;
    showPetBubble(msgs[Math.floor(Math.random()*msgs.length)]);
  }
}

function showPetBubble(msg){
  var bubble=el('petBubble');
  if(!bubble) return;
  bubble.textContent=msg;
  bubble.classList.remove('hidden');
  clearTimeout(petBubbleTimer);
  petBubbleTimer=setTimeout(function(){var b=el('petBubble');if(b)b.classList.add('hidden');},5000);
}

function petTapped(){
  var pet=el('petBody');
  if(!pet) return;
  pet.classList.add('bounce');
  setTimeout(function(){var p=el('petBody');if(p)p.classList.remove('bounce');},500);
  updatePet(true);
}

// ── ARCADE TAB ───────────────────────────────────────────────────
function renderArcade(){
  updateSidebarXP();
  updateGachaUI();
  renderPlayerBanner();
  renderBadgesGrid();
  renderMilestones();
  renderCollection();
  renderDailyQuests();
  var cc=el('collection-count'); if(cc) cc.textContent=(gameState.collection||[]).length;
  var bc=el('badges-count'); if(bc) bc.textContent=(gameState.badges||[]).length;
}

function renderPlayerBanner(){
  var banner=el('player-banner');
  if(!banner) return;
  var info=getLevelInfo();
  banner.innerHTML='<div class="player-level-badge">Level '+gameState.level+'</div>'
    +'<div class="player-name">Money Adventurer</div>'
    +'<div class="player-title">'+info.lvl.title+'</div>'
    +'<div class="xp-bar-wrap"><div class="xp-bar-bg"><div class="xp-bar-fill" style="width:'+info.pct+'%"></div></div>'
    +'<div class="xp-bar-labels"><span>'+gameState.xp+' XP</span><span>'+info.xpNext+' to next</span></div></div>'
    +'<div class="player-stats">'
    +'<div class="player-stat"><div class="player-stat-val">'+gameState.totalPoints.toLocaleString()+'</div><div class="player-stat-lbl">Points</div></div>'
    +'<div class="player-stat"><div class="player-stat-val">'+(gameState.badges||[]).length+'</div><div class="player-stat-lbl">Badges</div></div>'
    +'<div class="player-stat"><div class="player-stat-val">'+(gameState.collection||[]).length+'</div><div class="player-stat-lbl">Items</div></div>'
    +'<div class="player-stat"><div class="player-stat-val">'+(gameState.streak||0)+'</div><div class="player-stat-lbl">Streak</div></div>'
    +'</div>';
}

function renderBadgesGrid(){
  var grid=el('badges-grid');
  if(!grid) return;
  grid.innerHTML=BADGES.map(function(badge){
    var earned=(gameState.badges||[]).includes(badge.id);
    return '<div class="badge-item '+(earned?'earned':'locked')+'" title="'+badge.desc+'">'
      +'<div class="badge-icon">'+badge.emoji+'</div>'
      +'<div class="badge-name">'+badge.name+'</div>'
      +'<div class="badge-desc">'+(earned?badge.desc:'???')+'</div>'
      +'</div>';
  }).join('');
}

function renderMilestones(){
  var el_=el('milestone-track');
  if(!el_) return;
  var totalSaved=gameState.totalSaved||0;
  var maxAmt=SAVING_MILESTONES[SAVING_MILESTONES.length-1].amount;
  var pct=Math.min(100,(totalSaved/maxAmt)*100);
  var html='<div class="milestone-line"></div>'
    +'<div class="milestone-progress-line" style="width:calc('+pct+'% - 16px)"></div>'
    +'<div class="milestones-row">';
  SAVING_MILESTONES.forEach(function(m){
    var reached=totalSaved>=m.amount;
    html+='<div class="milestone-node">'
      +'<div class="milestone-dot'+(reached?' reached':'')+'"></div>'
      +'<div class="milestone-label">'+m.emoji+'<br>'+m.label+'</div>'
      +'<div class="milestone-amt">'+fmt(m.amount)+'</div>'
      +'</div>';
  });
  html+='</div><div style="margin-top:12px;font-size:12px;color:var(--text2);text-align:center;">Total saved: <span style="color:var(--teal);font-weight:700;">'+fmt(totalSaved)+'</span></div>';
  el_.innerHTML=html;
}

function renderDailyQuests(){
  var el_=el('daily-quests');
  if(!el_) return;
  var today=new Date().toDateString();
  var quests=getDailyQuests();
  el_.innerHTML=quests.map(function(q){
    var done=(gameState.questsCompleted||[]).includes(q.id+'_'+today);
    return '<div class="quest-item'+(done?' completed':'')+'">'
      +'<div class="quest-icon">'+q.icon+'</div>'
      +'<div class="quest-info"><div class="quest-name">'+q.name+'</div><div class="quest-desc">'+q.desc+'</div></div>'
      +(done?'<div class="quest-check">Done</div>':'<div class="quest-reward">+'+q.xp+' XP</div>')
      +'</div>';
  }).join('');
}

function getDailyQuests(){
  return [
    {id:'login',   icon:'📅', name:'Daily Check-in',     desc:'Open Peralytics today',           xp:10},
    {id:'log_txn', icon:'💳', name:'Log a Transaction',   desc:'Record a wallet transaction',     xp:20},
    {id:'add_goal',icon:'🎯', name:'Goal Progress',       desc:'Add funds to any savings goal',   xp:30},
    {id:'insights',icon:'🔍', name:'Review Insights',     desc:'Visit the Insights tab',          xp:15},
    {id:'log_debt',icon:'💸', name:'Debt Payment',        desc:'Log a debt payment today',        xp:25}
  ];
}

function completeQuest(questId){
  var today=new Date().toDateString();
  var key=questId+'_'+today;
  if(!(gameState.questsCompleted||[]).includes(key)){
    if(!gameState.questsCompleted) gameState.questsCompleted=[];
    gameState.questsCompleted.push(key);
    var quest=getDailyQuests().filter(function(q){return q.id===questId;})[0];
    if(quest){addXP(quest.xp);showToast('success','Quest: '+quest.name+' done!','+'+quest.xp+' XP earned');}
    renderDailyQuests();
  }
}

// ── NAV ──────────────────────────────────────────────────────────
function updateMonthLabel(){
  var label=MONTHS[currentMonth]+' '+currentYear;
  var ml=el('monthLabel'); if(ml) ml.textContent=label;
  var mm=el('mobMonth'); if(mm) mm.textContent=label;
  var now=new Date();
  var isNow=currentYear===now.getFullYear()&&currentMonth===now.getMonth();
  var hs=el('hdrSub'); if(hs) hs.textContent=isNow?'Current month':'Viewing past month';
}

function changeMonth(d){
  currentMonth+=d;
  if(currentMonth>11){currentMonth=0;currentYear++;}
  if(currentMonth<0){currentMonth=11;currentYear--;}
  saveCurrentMonth(); loadMonth(); updateMonthLabel(); renderAll();
}
function saveCurrentMonth(){monthHistory[currentKey()]={incomes:JSON.parse(JSON.stringify(incomes)),expenses:JSON.parse(JSON.stringify(expenses))};}
function loadMonth(){
  var k=currentKey();
  if(monthHistory[k]){incomes=JSON.parse(JSON.stringify(monthHistory[k].incomes||[]));expenses=JSON.parse(JSON.stringify(monthHistory[k].expenses||[]));}
  else{incomes=[];expenses=[];}
}

// ── TABS ─────────────────────────────────────────────────────────
function switchTab(name){
  var names=['overview','board','income','expenses','wallet','goals','debts','receivables','tools','insights','arcade','faq','coach'];
  document.querySelectorAll('.sb-item').forEach(function(t,i){t.classList.toggle('active',names[i]===name);});
  document.querySelectorAll('.mobile-nav-btn').forEach(function(b){ b.classList.toggle('active', b.dataset.tab === name); });
  document.querySelectorAll('.section').forEach(function(s){s.classList.remove('active');});
  var sec=el('tab-'+name); if(sec) sec.classList.add('active');
  closeSidebar();
  if(name==='overview') refreshCharts();
  if(name==='insights'){renderInsights();completeQuest('insights');}
  if(name==='goals') renderGoals();
  if(name==='debts') renderDebts();
  if(name==='wallet') renderWallet();
  if(name==='receivables') renderReceivables();
  if(name==='board') renderBoard();
  if(name==='tools') renderReceiptGallery();
  if(name==='arcade') renderArcade();
  if(name==='coach') initAICoach();
}

function openSidebar(){var sb=el('sidebar');var ov=el('overlay');if(sb)sb.classList.add('open');if(ov)ov.style.display='block';}
function closeSidebar(){var sb=el('sidebar');var ov=el('overlay');if(sb)sb.classList.remove('open');if(ov)ov.style.display='none';}

function renderAll(){
  renderIncomes(); renderExpenses(); renderGoals(); renderDebts();
  renderWallet(); renderReceivables(); updateMetrics(); refreshCharts();
}

// ── INCOME ───────────────────────────────────────────────────────
function addIncome(){
  var name=el('incName').value.trim();
  var amount=parseFloat(el('incAmount').value);
  var freq=el('incFreq').value;
  if(!name||isNaN(amount)||amount<=0){alert('Please fill in name and amount.');return;}
  incomes.push({name:name,amount:amount,freq:freq,monthly:toMonthly(amount,freq)});
  clearFields('incName','incAmount');
  addXP(15); checkBadges(); renderIncomes(); saveData();
}
function removeIncome(i){incomes.splice(i,1);renderIncomes();saveData();}
function renderIncomes(){
  var list=el('incomeList');
  var freqLabel={monthly:'Monthly',weekly:'Weekly',biweekly:'Bi-weekly',annual:'Annual'};
  if(!incomes.length){list.innerHTML=emptyItem('coin','No income added yet');}
  else list.innerHTML=incomes.map(function(x,i){return '<li><div class="il"><span class="tag t-inc">'+freqLabel[x.freq]+'</span><span class="iname">'+x.name+'</span></div><div class="ir"><span class="a-green">'+fmt(x.monthly)+'/mo</span><button class="del" onclick="removeIncome('+i+')"><i class="ti ti-trash"></i></button></div></li>';}).join('');
  el('totalIncome').textContent=fmt(incomes.reduce(function(s,x){return s+x.monthly;},0));
  updateMetrics();
}

// ── EXPENSES ─────────────────────────────────────────────────────
function addExpense(){
  var name=el('expName').value.trim();
  var amount=parseFloat(el('expAmount').value);
  var type=el('expType').value;
  var cat=el('expCat').value;
  var budget=parseFloat(el('expBudget').value)||0;
  if(!name||isNaN(amount)||amount<=0){alert('Please fill in name and amount.');return;}
  var timestamp=nowTimestamp();
  expenses.push({name:name,amount:amount,type:type,cat:cat,budget:budget,monthly:amount,timestamp:timestamp});
  walletBalance-=amount;
  transactions.unshift({amount:amount,cat:cat,note:name,dir:'out',date:timestamp,source:'expense'});
  if(transactions.length>100) transactions.pop();
  clearFields('expName','expAmount','expBudget');
  addXP(10); checkBadges();
  renderExpenses(); renderWallet();
  showToast('success','Expense logged!',name+' — '+fmt(amount)+' deducted from wallet.');
  saveData();
}
function removeExpense(i){expenses.splice(i,1);renderExpenses();saveData();}
function renderExpenses(){
  var list=el('expenseList');
  if(!expenses.length){list.innerHTML=emptyItem('receipt','No expenses added yet');}
  else list.innerHTML=expenses.map(function(x,i){
    return '<li><div class="il"><span class="tag '+(x.type==='fixed'?'t-fixed':'t-var')+'">'+(x.type==='fixed'?'Fixed':'Variable')+'</span>'
      +'<div><div class="iname">'+x.name+'</div>'+(x.timestamp?'<div class="isub">'+x.timestamp+'</div>':'')+'</div>'
      +'<span class="tag t-cat">'+x.cat+'</span></div>'
      +'<div class="ir"><span class="a-red">'+fmt(x.monthly)+'/mo</span><button class="del" onclick="removeExpense('+i+')"><i class="ti ti-trash"></i></button></div></li>';
  }).join('');
  el('totalExpenses').textContent=fmt(expenses.reduce(function(s,x){return s+x.monthly;},0));
  renderCatBudgets(); updateMetrics();
}
function renderCatBudgets(){
  var withBudget=expenses.filter(function(x){return x.budget;});
  var card=el('catBudgetCard');
  if(!withBudget.length){card.style.display='none';return;}
  card.style.display='block';
  var catSpend={};expenses.forEach(function(e){catSpend[e.cat]=(catSpend[e.cat]||0)+e.monthly;});
  var catBudget={};expenses.filter(function(x){return x.budget;}).forEach(function(e){catBudget[e.cat]=Math.max(catBudget[e.cat]||0,e.budget);});
  el('catBudgetList').innerHTML=Object.entries(catBudget).map(function(entry){
    var cat=entry[0],bgt=entry[1];
    var spent=catSpend[cat]||0;var pct=Math.min(100,Math.round(spent/bgt*100));
    var color=pct>=90?'var(--red)':pct>=70?'var(--amber)':'var(--teal)';
    return '<div style="margin-bottom:12px;"><div style="display:flex;justify-content:space-between;font-size:13px;margin-bottom:4px;"><span>'+cat+'</span><span>'+fmt(spent)+' / '+fmt(bgt)+'</span></div>'
      +'<div class="pbar-bg"><div class="pbar-fill" style="width:'+pct+'%;background:'+color+';"></div></div>'
      +'<div style="font-size:11px;color:var(--text3);margin-top:2px;">'+pct+'% used'+(pct>=100?' — over budget!':'')+'</div></div>';
  }).join('');
}

// ── WALLET ───────────────────────────────────────────────────────
function selTxnType(t){
  txnType=t;
  el('txnIn').className='txn-type-btn'+(t==='in'?' sel-in':'');
  el('txnOut').className='txn-type-btn'+(t==='out'?' sel-out':'');
}
function setWallet(){el('walletSetForm').style.display='block';}
function confirmSetWallet(){
  var v=parseFloat(el('walletInput').value);
  if(isNaN(v)){alert('Enter a valid amount');return;}
  walletBalance=v;
  el('walletSetForm').style.display='none';
  el('walletInput').value='';
  renderWallet(); saveData();
}
function addTransaction(){
  var amount=parseFloat(el('txnAmount').value);
  var cat=el('txnCat').value;
  var note=el('txnNote').value.trim();
  if(isNaN(amount)||amount<=0){alert('Enter a valid amount');return;}
  walletBalance+=txnType==='in'?amount:-amount;
  var now=new Date();
  var date=now.toLocaleDateString('en-PH',{month:'short',day:'numeric',hour:'2-digit',minute:'2-digit'});
  transactions.unshift({amount:amount,cat:cat,note:note,dir:txnType,date:date});
  if(transactions.length>100) transactions.pop();
  el('txnAmount').value=''; el('txnNote').value='';
  addXP(5); completeQuest('log_txn');
  renderWallet(); saveData();
}
function removeTransaction(i){
  var t=transactions[i];
  walletBalance+=t.dir==='in'?-t.amount:t.amount;
  transactions.splice(i,1);
  renderWallet(); saveData();
}
function renderWallet(){
  var wa=el('walletAmount');
  if(wa){wa.textContent=fmt(walletBalance);wa.style.color=walletBalance>=0?'var(--text)':'var(--red)';}
  var list=el('txnList');
  if(!transactions.length){list.innerHTML=emptyItem('list','No transactions yet');return;}
  list.innerHTML=transactions.map(function(t,i){
    return '<li><div class="il"><span style="font-size:18px;">'+(t.dir==='in'?'↓':'↑')+'</span>'
      +'<div><div class="iname">'+(t.note||t.cat)+'</div><div class="isub">'+t.cat+' · '+t.date+'</div></div></div>'
      +'<div class="ir"><span class="'+(t.dir==='in'?'a-green':'a-red')+'">'+(t.dir==='in'?'+':'−')+fmt(t.amount)+'</span>'
      +'<button class="del" onclick="removeTransaction('+i+')"><i class="ti ti-trash"></i></button></div></li>';
  }).join('');
}

// ── GOALS ────────────────────────────────────────────────────────
function addGoal(){
  var name=el('goalName').value.trim();
  var target=parseFloat(el('goalTarget').value);
  var saved=parseFloat(el('goalSaved').value)||0;
  var contrib=parseFloat(el('goalContrib').value)||0;
  var deadline=el('goalDeadline').value;
  if(!name||isNaN(target)||target<=0){alert('Enter goal name and target amount.');return;}
  goals.push({name:name,target:target,saved:saved,contrib:contrib,deadline:deadline});
  clearFields('goalName','goalTarget','goalSaved','goalContrib','goalDeadline');
  addXP(20); gameState.totalSaved=(gameState.totalSaved||0)+saved; checkBadges();
  renderGoals(); saveData();
}
function removeGoal(i){goals.splice(i,1);renderGoals();saveData();}
function addToGoal(i){
  var amt=parseFloat(prompt('Add how much? (P)'));
  if(isNaN(amt)||amt<=0) return;
  var before=goals[i].saved;
  goals[i].saved=Math.min(goals[i].target,goals[i].saved+amt);
  var actual=goals[i].saved-before;
  gameState.totalSaved=(gameState.totalSaved||0)+actual;
  SAVING_MILESTONES.forEach(function(m){
    if(before<m.amount&&goals[i].saved>=m.amount){
      showToast('achievement','Milestone: '+m.label+'!','You hit '+fmt(m.amount)+' saved!');
      addXP(100); spawnConfetti();
    }
  });
  if(goals[i].saved>=goals[i].target&&before<goals[i].target){
    gameState.goalsCompleted=(gameState.goalsCompleted||0)+1;
    showToast('achievement','Goal Complete! '+goals[i].name,'Amazing work! +200 XP');
    addXP(200); spawnConfetti(); completeQuest('add_goal');
  } else {
    addXP(10); completeQuest('add_goal');
  }
  checkBadges(); renderGoals(); saveData();
}
function renderGoals(){
  var container=el('goalsList');
  if(!goals.length){container.innerHTML='<div class="card"><div class="empty"><i class="ti ti-target"></i> No goals yet. Add one above!</div></div>';return;}
  container.innerHTML=goals.map(function(g,i){
    var pct=Math.min(100,Math.round((g.saved/g.target)*100));
    var remaining=g.target-g.saved;
    var color=pct>=100?'var(--teal)':pct>=60?'var(--purple)':'var(--amber)';
    var eta='';
    if(g.contrib>0&&remaining>0){var months=Math.ceil(remaining/g.contrib);eta='~'+months+' month'+(months!==1?'s':'')+' to go';}
    if(g.deadline){var dl=new Date(g.deadline);var daysLeft=Math.ceil((dl-new Date())/(1000*60*60*24));eta+=(eta?' · ':'')+( daysLeft>0?daysLeft+' days left':'Deadline passed');}
    var next=SAVING_MILESTONES.filter(function(m){return m.amount>g.saved;})[0];
    var hint=next?'<div style="font-size:11px;color:var(--purple);margin-top:4px;">Next milestone: '+next.emoji+' '+next.label+' ('+fmt(next.amount)+')</div>':'';
    return '<div class="card" style="'+(pct>=100?'border-color:rgba(0,212,170,0.3);':'')+'">'
      +'<div class="card-hdr">'
      +'<div><div class="card-item-name">'+(pct>=100?'Trophy ':'')+ g.name+'</div>'
      +'<div class="card-item-sub">'+fmt(g.saved)+' saved of '+fmt(g.target)+(eta?' · '+eta:'')+'</div></div>'
      +'<div class="btn-group"><button class="btn btn-outline" style="padding:5px 10px;font-size:12px;" onclick="addToGoal('+i+')"><i class="ti ti-plus"></i> Add</button>'
      +'<button class="del" onclick="removeGoal('+i+')"><i class="ti ti-trash"></i></button></div></div>'
      +pbarHTML(pct,color)
      +'<div class="pbar-meta"><span>'+pct+'% complete</span><span>'+(pct<100?fmt(remaining)+' remaining':'Goal reached!')+'</span></div>'
      +hint+'</div>';
  }).join('');
}

// ── DEBTS ────────────────────────────────────────────────────────
function addDebt(){
  var name=el('debtName').value.trim();
  var total=parseFloat(el('debtTotal').value);
  var paid=parseFloat(el('debtPaid').value)||0;
  var payment=parseFloat(el('debtPayment').value)||0;
  var rate=parseFloat(el('debtRate').value)||0;
  var type=el('debtType').value;
  if(!name||isNaN(total)||total<=0){alert('Enter debt name and total amount.');return;}
  debts.push({name:name,total:total,paid:paid,payment:payment,rate:rate,type:type});
  clearFields('debtName','debtTotal','debtPaid','debtPayment','debtRate');
  addXP(10); renderDebts(); saveData();
}
function removeDebt(i){debts.splice(i,1);renderDebts();saveData();}
function addDebtPayment(i){
  var amt=parseFloat(prompt('Log a payment (P):'));
  if(isNaN(amt)||amt<=0) return;
  var before=debts[i].paid;
  debts[i].paid=Math.min(debts[i].total,debts[i].paid+amt);
  if(debts[i].paid>=debts[i].total&&before<debts[i].total){
    gameState.debtsCleared=(gameState.debtsCleared||0)+1;
    showToast('achievement','Debt Cleared! '+debts[i].name,'Fully paid off! +150 XP');
    addXP(150); spawnConfetti(); checkBadges();
  } else {
    addXP(15); completeQuest('log_debt');
  }
  renderDebts(); saveData();
}
function renderDebts(){
  var container=el('debtsList');
  var summCard=el('debtSummaryCard');
  if(!debts.length){container.innerHTML='<div class="card"><div class="empty"><i class="ti ti-credit-card"></i> No debts tracked yet.</div></div>';if(summCard)summCard.style.display='none';return;}
  if(summCard) summCard.style.display='block';
  container.innerHTML=debts.map(function(d,i){
    var remaining=d.total-d.paid;var pct=Math.min(100,Math.round((d.paid/d.total)*100));
    var eta='';if(d.payment>0&&remaining>0){var m=Math.ceil(remaining/d.payment);eta='~'+m+' month'+(m!==1?'s':'')+' to payoff';}
    var color=pct>=80?'var(--teal)':pct>=40?'var(--amber)':'var(--red)';
    return '<div class="card" style="'+(pct>=100?'border-color:rgba(0,212,170,0.3)':'')+'">'
      +'<div class="card-hdr">'
      +'<div><div class="card-item-name">'+(pct>=100?'Done! ':'')+d.name+'</div>'
      +'<div class="card-item-sub">'+fmt(d.paid)+' paid · '+fmt(remaining)+' remaining'+(eta?' · '+eta:'')+'</div></div>'
      +'<div class="btn-group"><button class="btn btn-outline" style="padding:5px 10px;font-size:12px;" onclick="addDebtPayment('+i+')"><i class="ti ti-plus"></i> Pay</button>'
      +'<button class="del" onclick="removeDebt('+i+')"><i class="ti ti-trash"></i></button></div></div>'
      +pbarHTML(pct,color)
      +'<div class="pbar-meta"><span>'+pct+'% paid</span><span>'+(pct<100?fmt(remaining)+' left':'Paid off!')+'</span></div></div>';
  }).join('');
  var tD=debts.reduce(function(s,d){return s+d.total;},0);
  var tP=debts.reduce(function(s,d){return s+d.paid;},0);
  el('debtSummary').innerHTML='<div style="display:flex;gap:12px;flex-wrap:wrap;">'
    +'<div class="met" style="flex:1;min-width:120px;"><div class="met-lbl">Total debt</div><div class="met-val bad">'+fmt(tD)+'</div></div>'
    +'<div class="met" style="flex:1;min-width:120px;"><div class="met-lbl">Total paid</div><div class="met-val good">'+fmt(tP)+'</div></div>'
    +'<div class="met" style="flex:1;min-width:120px;"><div class="met-lbl">Still owed</div><div class="met-val warn">'+fmt(tD-tP)+'</div></div></div>';
}

// ── METRICS ──────────────────────────────────────────────────────
function updateMetrics(){
  var totalInc=getTotalIncome();
  var totalExp=getTotalExpenses();
  var savings=getNetSavings();
  var savingsRate=getSavingsRate();
  var fixedExp=expenses.filter(function(x){return x.type==='fixed';}).reduce(function(s,x){return s+x.monthly;},0);
  var today=new Date();var daysInMonth=new Date(today.getFullYear(),today.getMonth()+1,0).getDate();var daysLeft=daysInMonth-today.getDate()+1;
  var dailyBudget=savings>0?savings/daysLeft:0;
  el('metricsGrid').innerHTML=
    metCard('c-teal','💰','Monthly income',fmt(totalInc),'good')
    +metCard('c-red','💸','Total expenses',fmt(totalExp),'bad')
    +metCard(savings>=0?'c-purple':'c-red','🏦','Net savings',fmt(savings),savings>=0?'good':'bad')
    +metCard(savingsRate>=20?'c-green':savingsRate>=10?'c-amber':'c-red','📊','Savings rate',Math.round(savingsRate)+'%',savingsRate>=20?'good':savingsRate>=10?'warn':'bad','Target: 20%')
    +metCard('c-purple','🔒','Fixed costs',fmt(fixedExp),null,(totalInc>0?Math.round(fixedExp/totalInc*100):0)+'% of income')
    +metCard('c-amber','🎮','Discretionary',fmt(totalExp-fixedExp))
    +metCard(dailyBudget>0?'c-blue':'c-red','📅','Daily budget',fmtD(dailyBudget),dailyBudget>0?'good':'bad',daysLeft+' days left')
    +metCard(walletBalance>=0?'c-teal':'c-red','👛','Wallet balance',fmt(walletBalance),walletBalance>=0?'':'bad');
  var pct=totalInc>0?Math.min(100,Math.round(totalExp/totalInc*100)):0;
  var barColor=pct>=90?'var(--red)':pct>=70?'var(--amber)':'var(--teal)';
  el('budgetBar').style.width=pct+'%'; el('budgetBar').style.background=barColor;
  el('budgetSpent').textContent=fmt(totalExp)+' spent ('+pct+'%)';
  el('budgetLeft').textContent=fmt(Math.max(0,totalInc-totalExp))+' left';
}

// ── CHARTS ───────────────────────────────────────────────────────
function refreshCharts(){updateMetrics();renderPieChart();renderBarChart();renderHBarChart();renderHistoryChart();}
function renderPieChart(){
  var catTotals={};expenses.forEach(function(e){catTotals[e.cat]=(catTotals[e.cat]||0)+e.monthly;});
  var labels=Object.keys(catTotals);var data=labels.map(function(l){return Math.round(catTotals[l]);});var colors=labels.map(function(l){return CAT_COLORS[l]||'#888780';});
  var total=data.reduce(function(s,x){return s+x;},0);
  var legend=el('pieLegend');
  if(!labels.length){if(legend)legend.innerHTML='';return;}
  if(legend)legend.innerHTML=labels.map(function(l,i){return '<span><span class="ldot" style="background:'+colors[i]+';"></span>'+l+' '+(total>0?Math.round(data[i]/total*100)+'%':'')+'</span>';}).join('');
  if(pieChart) pieChart.destroy();
  pieChart=new Chart(el('pieChart').getContext('2d'),{type:'doughnut',data:{labels:labels,datasets:[{data:data,backgroundColor:colors,borderWidth:2,borderColor:'transparent'}]},options:{responsive:true,maintainAspectRatio:false,plugins:{legend:{display:false},tooltip:{callbacks:{label:function(c){return ' '+c.label+': '+fmt(c.raw);}}}}}});
}
function renderBarChart(){
  var totalInc=Math.round(incomes.reduce(function(s,x){return s+x.monthly;},0));
  var totalExp=Math.round(expenses.reduce(function(s,x){return s+x.monthly;},0));
  var sav=Math.max(0,totalInc-totalExp);
  if(barChart) barChart.destroy();
  barChart=new Chart(el('barChart').getContext('2d'),{type:'bar',data:{labels:['Income','Expenses','Savings'],datasets:[{data:[totalInc,totalExp,sav],backgroundColor:['#1D9E75','#D85A30','#534AB7'],borderRadius:6,borderWidth:0}]},options:{responsive:true,maintainAspectRatio:false,plugins:{legend:{display:false},tooltip:{callbacks:{label:function(c){return fmt(c.raw);}}}},scales:{y:{grid:{color:'rgba(255,255,255,0.05)'},ticks:{color:'#9090a0',callback:function(v){return fmt(v);}}},x:{grid:{display:false},ticks:{color:'#9090a0'}}}}});
}
function renderHBarChart(){
  var catTotals={};expenses.forEach(function(e){catTotals[e.cat]=(catTotals[e.cat]||0)+e.monthly;});
  var sorted=Object.entries(catTotals).sort(function(a,b){return b[1]-a[1];}).slice(0,6);
  if(!sorted.length) return;
  var labels=sorted.map(function(x){return x[0];});var data=sorted.map(function(x){return Math.round(x[1]);});var colors=labels.map(function(l){return CAT_COLORS[l]||'#888780';});
  if(hbarChart) hbarChart.destroy();
  hbarChart=new Chart(el('hbarChart').getContext('2d'),{type:'bar',data:{labels:labels,datasets:[{data:data,backgroundColor:colors,borderRadius:4,borderWidth:0}]},options:{indexAxis:'y',responsive:true,maintainAspectRatio:false,plugins:{legend:{display:false},tooltip:{callbacks:{label:function(c){return fmt(c.raw);}}}},scales:{x:{grid:{color:'rgba(255,255,255,0.05)'},ticks:{color:'#9090a0',callback:function(v){return fmt(v);}}},y:{grid:{display:false},ticks:{color:'#9090a0'}}}}});
}
function renderHistoryChart(){
  var keys=Object.keys(monthHistory).sort().slice(-6);
  if(!keys.length) return;
  var labels=keys.map(function(k){var parts=k.split('-');return MONTHS[parseInt(parts[1])-1].slice(0,3);});
  var incData=keys.map(function(k){return Math.round((monthHistory[k].incomes||[]).reduce(function(s,x){return s+x.monthly;},0));});
  var expData=keys.map(function(k){return Math.round((monthHistory[k].expenses||[]).reduce(function(s,x){return s+x.monthly;},0));});
  if(histChart) histChart.destroy();
  histChart=new Chart(el('histChart').getContext('2d'),{type:'line',data:{labels:labels,datasets:[{label:'Income',data:incData,borderColor:'#00d4aa',backgroundColor:'rgba(0,212,170,0.1)',tension:.3,fill:true,pointRadius:4,borderWidth:2},{label:'Expenses',data:expData,borderColor:'#ff6b6b',backgroundColor:'rgba(255,107,107,0.1)',tension:.3,fill:true,pointRadius:4,borderWidth:2}]},options:{responsive:true,maintainAspectRatio:false,plugins:{legend:{labels:{color:'#9090a0',font:{size:11}}},tooltip:{callbacks:{label:function(c){return c.dataset.label+': '+fmt(c.raw);}}}},scales:{y:{grid:{color:'rgba(255,255,255,0.05)'},ticks:{color:'#9090a0',callback:function(v){return fmt(v);}}},x:{grid:{display:false},ticks:{color:'#9090a0'}}}}});
}

// ── RECEIVABLES ──────────────────────────────────────────────────
function addReceivable(){
  var name=el('recName').value.trim();var amount=parseFloat(el('recAmount').value);
  var due=el('recDue').value;var note=el('recNote').value.trim();var status=el('recStatus').value;
  if(!name||isNaN(amount)||amount<=0){alert('Enter name and amount.');return;}
  receivables.push({name:name,amount:amount,due:due,note:note,status:status,collected:status==='paid'?amount:0});
  el('recName').value='';el('recAmount').value='';el('recDue').value='';el('recNote').value='';
  addXP(5); renderReceivables(); saveData();
}
function removeReceivable(i){receivables.splice(i,1);renderReceivables();saveData();}
function markReceivable(i,status){receivables[i].status=status;if(status==='paid')receivables[i].collected=receivables[i].amount;renderReceivables();saveData();}
function logPartialPayment(i){
  var amt=parseFloat(prompt('How much collected? (P)'));
  if(isNaN(amt)||amt<=0) return;
  receivables[i].collected=Math.min(receivables[i].amount,(receivables[i].collected||0)+amt);
  receivables[i].status=receivables[i].collected>=receivables[i].amount?'paid':'partial';
  renderReceivables(); saveData();
}
function renderReceivables(){
  var pending=receivables.filter(function(r){return r.status!=='paid';});
  var paid=receivables.filter(function(r){return r.status==='paid';});
  var tOwed=receivables.reduce(function(s,r){return s+r.amount;},0);
  var tColl=receivables.reduce(function(s,r){return s+(r.collected||0);},0);
  var summCard=el('recSummaryCard');
  if(receivables.length){
    if(summCard) summCard.style.display='block';
    el('recSummary').innerHTML='<div class="met" style="flex:1;min-width:110px;"><div class="met-lbl">To collect</div><div class="met-val a-blue">'+fmt(tOwed)+'</div></div>'
      +'<div class="met" style="flex:1;min-width:110px;"><div class="met-lbl">Collected</div><div class="met-val good">'+fmt(tColl)+'</div></div>'
      +'<div class="met" style="flex:1;min-width:110px;"><div class="met-lbl">Pending</div><div class="met-val warn">'+fmt(tOwed-tColl)+'</div></div>';
  } else {if(summCard) summCard.style.display='none';}
  var pendingList=el('recPendingList');
  if(!pending.length){pendingList.innerHTML=emptyItem('clock','No pending receivables');}
  else pendingList.innerHTML=pending.map(function(r){
    var i=receivables.indexOf(r);
    var today=new Date();var dueLabel='';
    if(r.due){var dl=new Date(r.due);var diff=Math.ceil((dl-today)/(1000*60*60*24));dueLabel=diff<0?' Overdue by '+Math.abs(diff)+'d':diff===0?' Due today':' Due in '+diff+'d';}
    var pct=r.amount>0?Math.round((r.collected||0)/r.amount*100):0;
    return '<li style="flex-direction:column;align-items:flex-start;gap:8px;padding:11px 0;">'
      +'<div style="display:flex;justify-content:space-between;width:100%;align-items:center;">'
      +'<div class="il"><span class="tag '+(r.status==='partial'?'t-var':'t-debt')+'">'+(r.status==='partial'?'Partial':'Pending')+'</span>'
      +'<div><div class="iname">'+r.name+'</div><div class="isub">'+(r.note||'')+dueLabel+'</div></div></div>'
      +'<div class="ir"><div class="a-blue">'+fmt(r.amount)+'</div>'
      +'<button class="del" onclick="logPartialPayment('+i+')" title="Log payment"><i class="ti ti-coin"></i></button>'
      +'<button class="del" onclick="markReceivable('+i+',\'paid\')" style="color:var(--teal);"><i class="ti ti-circle-check"></i></button>'
      +'<button class="del" onclick="removeReceivable('+i+')"><i class="ti ti-trash"></i></button></div></div>'
      +(r.status==='partial'?'<div style="width:100%;"><div class="pbar-bg"><div class="pbar-fill" style="width:'+pct+'%;background:var(--amber);"></div></div></div>':'')
      +'</li>';
  }).join('');
  var paidList=el('recPaidList');
  if(!paid.length){paidList.innerHTML=emptyItem('circle-check','Nothing collected yet');}
  else paidList.innerHTML=paid.map(function(r){
    var i=receivables.indexOf(r);
    return '<li><div class="il"><span class="tag t-inc">Paid</span><div class="iname">'+r.name+'</div></div>'
      +'<div class="ir"><span class="a-green">'+fmt(r.amount)+'</span><button class="del" onclick="removeReceivable('+i+')"><i class="ti ti-trash"></i></button></div></li>';
  }).join('');
}

// ── INSIGHTS ─────────────────────────────────────────────────────
function renderInsights(){
  var totalInc=getTotalIncome();
  var totalExp=getTotalExpenses();
  var savings=getNetSavings();
  var savingsRate=getSavingsRate();
  var fixedExp=expenses.filter(function(x){return x.type==='fixed';}).reduce(function(s,x){return s+x.monthly;},0);
  var catTotals={};expenses.forEach(function(e){catTotals[e.cat]=(catTotals[e.cat]||0)+e.monthly;});
  var sorted=Object.entries(catTotals).sort(function(a,b){return b[1]-a[1];});
  if(!incomes.length&&!expenses.length){
    el('insightsContent').innerHTML=tipCard('info','ti-info-circle','Add your data first','Add income and expenses to unlock personalized insights.');return;
  }
  var tips=[];
  if(savingsRate>=20) tips.push({t:'positive',i:'ti-circle-check',h:'Great savings rate!',b:'Saving '+Math.round(savingsRate)+'% — above the 20% target! Consider MP2, UITF, or PSEi ETF to grow idle cash.'});
  else if(savingsRate>=10) tips.push({t:'warning',i:'ti-trending-up',h:'Getting there',b:'Saving '+Math.round(savingsRate)+'%. Push toward 20%. Cutting small expenses adds up fast!'});
  else tips.push({t:'warning',i:'ti-alert-triangle',h:'Low savings rate',b:'Only saving '+Math.round(savingsRate)+'%. Try the 50/30/20 rule in Tools. Cut the biggest non-essential first.'});
  if(goals.length>0){var avgPct=goals.reduce(function(s,g){return s+(g.saved/g.target)*100;},0)/goals.length;tips.push({t:'info',i:'ti-target',h:'Goal progress: '+Math.round(avgPct)+'% average',b:goals.length+' active goal'+(goals.length!==1?'s':'')+'. '+(avgPct>=50?'More than halfway — keep going!':'Consistent small deposits beat large one-time payments.')});}
  if(sorted.length>0){var top=sorted[0];tips.push({t:'info',i:'ti-chart-bar',h:'Biggest spend: '+top[0],b:top[0]+' costs '+fmt(top[1])+'/month ('+(totalInc>0?Math.round(top[1]/totalInc*100):0)+'% of income). A 15% cut here has the highest impact.'});}
  var fixedPct=totalInc>0?(fixedExp/totalInc)*100:0;
  if(fixedPct>60) tips.push({t:'warning',i:'ti-lock',h:'High fixed costs',b:Math.round(fixedPct)+'% of income is locked. Aim under 50%. Look for subscriptions to cut.'});
  if(savings<0) tips.push({t:'warning',i:'ti-minus-circle',h:'Over budget!',b:'Over by '+fmt(Math.abs(savings))+'/month. Cut variable expenses first — entertainment, dining, shopping.'});
  var today2=new Date();var dIM=new Date(today2.getFullYear(),today2.getMonth()+1,0).getDate();var dLeft=dIM-today2.getDate()+1;
  if(savings>0) tips.push({t:'blue',i:'ti-calendar',h:'Daily safe-to-spend',b:fmt(Math.round(savings))+' monthly surplus = '+fmtD(savings/dLeft)+'/day for the next '+dLeft+' days.'});
  if(debts.length>0){var tRem=debts.reduce(function(s,d){return s+(d.total-d.paid);},0);tips.push({t:'info',i:'ti-credit-card',h:'Active debts: '+fmt(tRem)+' remaining',b:debts.length+' debt'+(debts.length!==1?'s':'')+' total. Pay highest-interest first (avalanche method).'});}
  var lvlInfo=getLevelInfo();
  tips.push({t:'positive',i:'ti-star',h:'Level '+gameState.level+' — '+lvlInfo.lvl.title,b:'You have earned '+gameState.xp+' XP. '+(gameState.gachaPulls>0?gameState.gachaPulls+' gacha pull'+(gameState.gachaPulls>1?'s':'')+' waiting in Arcade!':'Keep earning XP to unlock gacha pulls in Arcade!')});
  el('insightsContent').innerHTML=tips.map(function(t){return tipCard(t.t,t.i,t.h,t.b);}).join('');
}

// ── BUDGET BOARD ─────────────────────────────────────────────────
var activeEnvelopeIdx=null;
function renderBoard(){
  var totalInc=getTotalIncome();
  var totalAssigned=envelopes.reduce(function(s,e){return s+e.budget;},0);
  var unassigned=totalInc-totalAssigned;
  el('boardIncomeLabel').textContent=fmt(totalInc);
  var unassEl=el('boardUnassigned');
  unassEl.textContent=fmt(Math.abs(unassigned))+(unassigned<0?' over!':' left');
  unassEl.style.background=unassigned<0?'var(--red-l)':'var(--amber-l)';
  unassEl.style.color=unassigned<0?'var(--red)':'var(--amber)';
  var board=el('envelopeBoard');
  var addCard=board.querySelector('.add-env-card');
  var envHTML=envelopes.map(function(env,i){
    var spent=(env.spends||[]).reduce(function(s,x){return s+x.amount;},0);
    var pct=env.budget>0?Math.min(100,Math.round(spent/env.budget*100)):0;
    var left=env.budget-spent;
    var barColor=pct>=90?'var(--red)':pct>=70?'var(--amber)':'var(--teal)';
    return '<div class="envelope"><div class="envelope-hdr">'
      +'<div class="env-name">'+env.name+'<button class="env-del" onclick="removeEnvelope('+i+')"><i class="ti ti-x"></i></button></div>'
      +'<div class="env-bar-bg"><div class="env-bar-fill" style="width:'+pct+'%;background:'+barColor+'"></div></div>'
      +'<div class="env-amounts"><span class="env-spent">'+fmt(spent)+' spent</span><span class="env-left" style="color:'+(left<0?'var(--red)':'var(--text)')+'">'+fmt(Math.abs(left))+' '+(left<0?'over':'left')+'</span></div></div>'
      +'<div class="env-body">'+(env.spends||[]).map(function(s,j){return '<div class="spend-card"><div class="spend-card-top"><span class="spend-card-name">'+s.name+'</span><span class="spend-card-amt">'+fmt(s.amount)+'</span><button class="spend-card-del" onclick="removeSpend('+i+','+j+')"><i class="ti ti-x"></i></button></div>'+(s.note?'<div class="spend-card-note">'+s.note+'</div>':'')+'</div>';}).join('')+'</div>'
      +'<button class="env-add-btn" onclick="openSpendModal('+i+')"><i class="ti ti-plus"></i> Add spend</button></div>';
  }).join('');
  board.innerHTML=envHTML+(addCard?addCard.outerHTML:'<div class="add-env-card"><input type="text" id="newEnvName" placeholder="Category name"><input type="number" id="newEnvBudget" placeholder="Budget (P)"><button class="btn btn-full" style="font-size:13px;padding:8px;" onclick="addEnvelope()"><i class="ti ti-plus"></i> Add</button></div>');
}
function addEnvelope(){
  var name=el('newEnvName')&&el('newEnvName').value.trim();
  var budget=parseFloat(el('newEnvBudget')&&el('newEnvBudget').value)||0;
  if(!name) return;
  envelopes.push({name:name,budget:budget,spends:[]});
  addXP(10); renderBoard(); saveData();
}
function removeEnvelope(i){envelopes.splice(i,1);renderBoard();saveData();}
function openSpendModal(i){activeEnvelopeIdx=i;el('spendModal').classList.add('open');el('spendEnvName').textContent=envelopes[i].name;}
function closeSpendModal(){el('spendModal').classList.remove('open');activeEnvelopeIdx=null;}
function addSpend(){
  if(activeEnvelopeIdx===null) return;
  var name=el('spendName').value.trim();var amount=parseFloat(el('spendAmount').value);var note=el('spendNote').value.trim();
  if(!name||isNaN(amount)||amount<=0) return;
  envelopes[activeEnvelopeIdx].spends=envelopes[activeEnvelopeIdx].spends||[];
  envelopes[activeEnvelopeIdx].spends.push({name:name,amount:amount,note:note});
  el('spendName').value='';el('spendAmount').value='';el('spendNote').value='';
  closeSpendModal(); renderBoard(); saveData();
}
function removeSpend(ei,si){envelopes[ei].spends.splice(si,1);renderBoard();saveData();}

// ── CALCULATOR ───────────────────────────────────────────────────
var calcVal='0', calcPrev='', calcOp='', calcNewNum=true;
function calcOperate(a,op,b){
  a=parseFloat(a); b=parseFloat(b);
  if(op==='+') return a+b;
  if(op==='-') return a-b;
  if(op==='*') return a*b;
  if(op==='/'){if(b===0){showToast('success','Cannot divide by zero','Try a different number.');return a;}return a/b;}
  return b;
}
function calcUpdateDisplay(){
  var n=parseFloat(calcVal);
  var s=isNaN(n)?calcVal:(Number.isInteger(n)?n.toLocaleString('en'):parseFloat(n.toFixed(10)).toLocaleString('en',{maximumFractionDigits:10}));
  el('calcDisplay').textContent=calcVal.endsWith('.')?s+'.':s;
}
function calcInput(v,btn){
  if(v==='clear'){calcVal='0';calcPrev='';calcOp='';calcNewNum=true;el('calcHistory').textContent='';document.querySelectorAll('.calc-op').forEach(function(b){b.classList.remove('active-op');});}
  else if(v==='sign'){if(calcVal!=='0')calcVal=calcVal.startsWith('-')?calcVal.slice(1):'-'+calcVal;}
  else if(v==='%'){calcVal=String(parseFloat(calcVal)/100);}
  else if(v==='+'||v==='-'||v==='*'||v==='/'){
    if(calcOp&&!calcNewNum){var r=calcOperate(calcPrev,calcOp,calcVal);calcVal=String(parseFloat(r.toFixed(10)));el('calcHistory').textContent=calcPrev+' '+calcOp+' ';}
    calcPrev=calcVal;calcOp=v;calcNewNum=true;
    document.querySelectorAll('.calc-op').forEach(function(b){b.classList.remove('active-op');});
    if(btn) btn.classList.add('active-op');
  } else if(v==='='){
    if(calcOp&&calcPrev!==''){var r=calcOperate(calcPrev,calcOp,calcVal);el('calcHistory').textContent=calcPrev+' '+calcOp+' '+calcVal+' =';calcVal=String(parseFloat(r.toFixed(10)));calcOp='';calcPrev='';calcNewNum=true;document.querySelectorAll('.calc-op').forEach(function(b){b.classList.remove('active-op');});}
  } else if(v==='.'){
    if(calcNewNum){calcVal='0.';calcNewNum=false;}else if(!calcVal.includes('.'))calcVal+='.';
  } else {
    if(calcNewNum){calcVal=v==='0'?'0':v;calcNewNum=false;}else{if(calcVal.replace('-','').length>=12)return;calcVal=calcVal==='0'?v:calcVal+v;}
  }
  calcUpdateDisplay();
}
function calcHourly(){
  var t=parseFloat(el('hrTarget').value);var h=parseFloat(el('hrHours').value)||8;var d=parseFloat(el('hrDays').value)||5;var w=parseFloat(el('hrWeeks').value)||4.3;
  if(isNaN(t)){alert('Enter target income');return;}
  var hrs=h*d*w;var rate=t/hrs;
  el('hrResult').style.display='block';
  el('hrResultVal').textContent=fmtD(rate)+'/hour';
  el('hrResultSub').textContent='Working '+Math.round(hrs)+' hours/month to earn '+fmt(t)+'/month';
}
function calcPlan(){
  var inc=parseFloat(el('planIncome').value);
  if(isNaN(inc)||inc<=0){alert('Enter monthly income');return;}
  el('planResult').style.display='block';
  el('planResult').innerHTML='<div class="tip positive"><div class="tip-t">Needs (50%)</div><div class="tip-b">'+fmt(inc*0.5)+'/month — rent, food, transport, utilities</div></div>'
    +'<div class="tip warning"><div class="tip-t">Wants (30%)</div><div class="tip-b">'+fmt(inc*0.3)+'/month — entertainment, dining, shopping</div></div>'
    +'<div class="tip info"><div class="tip-t">Savings (20%)</div><div class="tip-b">'+fmt(inc*0.2)+'/month — emergency fund, investments, goals</div></div>';
}
function calcSplit(){
  var bill=parseFloat(el('splitBill').value);var people=parseFloat(el('splitPeople').value)||2;
  var tip=parseFloat(el('splitTip').value)||0;var myShare=parseFloat(el('splitMyShare').value);
  if(isNaN(bill)||bill<=0){alert('Enter bill amount');return;}
  var total=bill*(1+tip/100);
  var mine=!isNaN(myShare)&&myShare>0?(total*myShare/100):(total/people);
  var others=!isNaN(myShare)&&myShare>0?(total-mine)/(people-1):total/people;
  var res=el('splitResult');res.classList.add('show');
  el('splitOutput').innerHTML='<div style="font-size:13px;color:var(--text2);margin-bottom:6px;">Total with tip: <strong>'+fmt(total)+'</strong></div>'
    +'<div style="font-size:16px;font-weight:700;color:var(--teal);">Your share: '+fmtD(mine)+'</div>'
    +(!isNaN(myShare)&&myShare>0&&people>1?'<div style="font-size:12px;color:var(--text3);margin-top:4px;">Others each: '+fmtD(others)+'</div>':'');
}
function calcEF(){
  var exp=parseFloat(el('efExpenses').value)||expenses.reduce(function(s,x){return s+x.monthly;},0);
  var sav=parseFloat(el('efSavings').value)||walletBalance;
  var needed=exp*3;var ideal=exp*6;
  var pct=needed>0?Math.min(100,Math.round(sav/needed*100)):0;
  var color=pct>=100?'var(--teal)':pct>=50?'var(--amber)':'var(--red)';
  el('efResult').style.display='block';
  el('efResult').innerHTML='<div class="tip '+(pct>=100?'positive':'warning')+'"><div class="tip-t">'+(pct>=100?'Emergency fund funded!':'Emergency fund status')+'</div><div class="tip-b">3-month target: '+fmt(needed)+' | 6-month: '+fmt(ideal)+'<br>Current: '+fmt(sav)+'</div></div>'
    +'<div class="pbar-bg" style="margin-top:8px;"><div class="pbar-fill" style="width:'+pct+'%;background:'+color+';"></div></div>'
    +'<div style="font-size:12px;color:var(--text3);margin-top:4px;">'+pct+'% funded'+(pct<100?' — need '+fmt(needed-sav)+' more':'')+'</div>';
}

// ── RECEIPTS ─────────────────────────────────────────────────────
var pendingFiles=[], currentReceiptIdx=null, activeFilter='all';
function handleReceiptFiles(files){
  pendingFiles=Array.from(files);
  if(!pendingFiles.length) return;
  el('receiptTagForm').style.display='block';
  el('receiptTagTitle').textContent='Tag '+pendingFiles.length+' receipt'+(pendingFiles.length>1?'s':'');
}
function handleReceiptDrop(e){e.preventDefault();handleReceiptFiles(e.dataTransfer.files);}
function saveReceipts(){
  var amt=parseFloat(el('receiptAmt').value)||0;var cat=el('receiptCat').value;var note=el('receiptNote').value.trim();
  pendingFiles.forEach(function(file){
    var reader=new FileReader();
    reader.onload=function(e2){receipts.push({src:e2.target.result,type:file.type,name:file.name,amt:amt,cat:cat,note:note,date:new Date().toLocaleDateString('en-PH',{month:'short',day:'numeric',year:'numeric'})});renderReceiptGallery();saveData();};
    reader.readAsDataURL(file);
  });
  cancelReceiptUpload(); addXP(5);
}
function cancelReceiptUpload(){pendingFiles=[];el('receiptTagForm').style.display='none';el('receiptAmt').value='';el('receiptNote').value='';el('receiptFileInput').value='';}
function filterReceipts(f){
  activeFilter=f;
  document.querySelectorAll('.rcpt-filter').forEach(function(b){b.classList.toggle('active',b.textContent.trim()===f||(f==='all'&&b.textContent.trim()==='All'));});
  renderReceiptGallery();
}
function renderReceiptGallery(){
  var filtered=activeFilter==='all'?receipts:receipts.filter(function(r){return r.cat===activeFilter;});
  el('receiptEmpty').style.display=filtered.length?'none':'block';
  el('receiptFilterRow').style.display=receipts.length?'flex':'none';
  el('receiptGallery').innerHTML=filtered.map(function(r){
    var idx=receipts.indexOf(r);
    return '<div class="rcpt-card" onclick="openLightbox('+idx+')">'
      +(r.type==='application/pdf'?'<div class="rcpt-thumb-pdf"><i class="ti ti-file-type-pdf"></i></div>':'<img class="rcpt-thumb" src="'+r.src+'" alt="receipt">')
      +'<div class="rcpt-info"><div class="rcpt-cat">'+r.cat+'</div><div class="rcpt-note">'+(r.note||r.name)+'</div>'
      +'<div style="display:flex;justify-content:space-between;margin-top:2px;"><span class="rcpt-amt">'+(r.amt>0?fmt(r.amt):'')+'</span><span class="rcpt-date">'+r.date+'</span></div></div></div>';
  }).join('');
}
function openLightbox(i){currentReceiptIdx=i;var r=receipts[i];el('receiptLightbox').style.display='flex';el('lbTitle').textContent=r.note||r.name;el('lbImg').src=r.src;el('lbImg').style.display=r.type==='application/pdf'?'none':'block';el('lbMeta').innerHTML='<span>'+r.cat+'</span>'+(r.amt>0?'<span>'+fmt(r.amt)+'</span>':'')+'<span>'+r.date+'</span>';}
function closeLightbox(){el('receiptLightbox').style.display='none';currentReceiptIdx=null;}
function deleteReceiptFromLightbox(){if(currentReceiptIdx===null)return;receipts.splice(currentReceiptIdx,1);closeLightbox();renderReceiptGallery();saveData();}

// ── EXPORT ───────────────────────────────────────────────────────
function exportToCSV(){
  var rows=[];var esc=function(v){return '"'+String(v).replace(/"/g,'""')+'"';};
  rows.push(['EXPENSES']);rows.push(['Name','Type','Category','Monthly','Budget','Date']);
  expenses.forEach(function(e){rows.push([esc(e.name),esc(e.type),esc(e.cat),e.monthly,e.budget||0,esc(e.timestamp||'')]);});
  rows.push([]);rows.push(['INCOME']);rows.push(['Name','Frequency','Amount','Monthly']);
  incomes.forEach(function(i){rows.push([esc(i.name),esc(i.freq),i.amount,i.monthly]);});
  rows.push([]);rows.push(['WALLET TRANSACTIONS']);rows.push(['Description','Category','In/Out','Amount','Date']);
  transactions.forEach(function(t){rows.push([esc(t.note||t.cat),esc(t.cat),esc(t.dir),t.amount,esc(t.date||'')]);});
  rows.push([]);rows.push(['SAVINGS GOALS']);rows.push(['Name','Target','Saved','Remaining','% Done','Monthly Contrib','Deadline']);
  goals.forEach(function(g){rows.push([esc(g.name),g.target,g.saved,g.target-g.saved,Math.round((g.saved/g.target)*100)+'%',g.contrib||0,esc(g.deadline||'')]);});
  rows.push([]);rows.push(['DEBTS']);rows.push(['Name','Total','Paid','Remaining','% Paid','Payment','Rate','Type']);
  debts.forEach(function(d){rows.push([esc(d.name),d.total,d.paid,d.total-d.paid,Math.round((d.paid/d.total)*100)+'%',d.payment||0,d.rate||0,esc(d.type)]);});
  rows.push([]);rows.push(['SUMMARY']);
  var tI=incomes.reduce(function(s,x){return s+x.monthly;},0);var tE=expenses.reduce(function(s,x){return s+x.monthly;},0);
  rows.push(['Monthly Income',fmt(tI)]);rows.push(['Monthly Expenses',fmt(tE)]);rows.push(['Net Savings',fmt(tI-tE)]);
  rows.push(['Savings Rate',tI>0?Math.round(((tI-tE)/tI)*100)+'%':'0%']);rows.push(['Wallet Balance',fmt(walletBalance)]);
  rows.push(['XP Level','Level '+gameState.level]);rows.push(['Total XP',gameState.xp]);rows.push(['Exported',new Date().toLocaleString('en-PH')]);
  var csv=rows.map(function(r){return Array.isArray(r)?r.join(','):r;}).join('\n');
  var blob=new Blob([csv],{type:'text/csv'});var a=document.createElement('a');
  a.href=URL.createObjectURL(blob);a.download='peralytics_'+new Date().toISOString().slice(0,10)+'.csv';a.click();
  showToast('success','Export Ready!','Your data has been downloaded as CSV.');addXP(5);
}

// ── AI COACH ─────────────────────────────────────────────────────
var aiHistory=[], aiInitialized=false;

function getFinancialContext(){
  var tI=getTotalIncome();
  var tE=getTotalExpenses();
  var sav=getNetSavings(); var savRate=tI>0?Math.round((sav/tI)*100):0;
  var topExp=[].concat(expenses).sort(function(a,b){return b.monthly-a.monthly;}).slice(0,5).map(function(e){return e.name+' ('+e.cat+'): '+fmt(Math.round(e.monthly))+'/mo';}).join(', ');
  var goalsInfo=goals.map(function(g){return g.name+': '+fmt(g.saved)+'/'+fmt(g.target)+' ('+Math.round((g.saved/g.target)*100)+'%)';}).join('; ');
  var debtsInfo=debts.map(function(d){return d.name+': '+fmt(d.total-d.paid)+' remaining';}).join('; ');
  var tDebt=debts.reduce(function(s,d){return s+(d.total-d.paid);},0);
  var lvlInfo=getLevelInfo();
  return 'You are Pisong, a friendly Filipino personal finance AI coach inside Peralytics. Be warm, concise (3-5 sentences), use Philippine peso and Filipino context (GCash, Pag-IBIG, SSS). REAL DATA:\n'
    +'INCOME: '+fmt(Math.round(tI))+'/month ('+incomes.length+' source'+(incomes.length!==1?'s':'')+': '+incomes.map(function(i){return i.name;}).join(', ')+')\n'
    +'EXPENSES: '+fmt(Math.round(tE))+'/month ('+expenses.length+' items). Top: '+topExp+'\n'
    +'NET SAVINGS: '+fmt(Math.round(sav))+'/month ('+savRate+'% rate)\n'
    +'WALLET: '+fmt(Math.round(walletBalance))+'\n'
    +'GOALS: '+(goalsInfo||'none')+'\n'
    +'DEBT: '+fmt(Math.round(tDebt))+' across '+debts.length+' item'+(debts.length!==1?'s':'')+(debtsInfo?' ('+debtsInfo+')':'')+'\n'
    +'LEVEL: '+gameState.level+' — '+lvlInfo.lvl.title+' | XP: '+gameState.xp+' | Streak: '+(gameState.streak||0)+' days\n'
    +'Always use this real data. Be encouraging and actionable.';
}

function initAICoach(){
  if(aiInitialized) return;
  aiInitialized=true;
  var msgs=el('ai-messages');if(!msgs)return;
  msgs.innerHTML='';aiHistory=[];
  appendAIMessage('bot','Kamusta! I am Pisong, your Peralytics financial coach! I already have your numbers — ask me anything about your finances, goals, or how to save more!');
}

function appendAIMessage(role,text){
  var msgs=el('ai-messages');if(!msgs)return;
  var div=document.createElement('div');
  div.className='ai-msg'+(role==='user'?' user':'');
  div.innerHTML='<div class="ai-avatar">'+(role==='user'?'😊':'🐷')+'</div><div class="ai-bubble">'+text.replace(/\n/g,'<br>')+'</div>';
  msgs.appendChild(div);
  msgs.scrollTop=msgs.scrollHeight;
}

function appendAITyping(){
  var msgs=el('ai-messages');if(!msgs)return;
  var div=document.createElement('div');div.className='ai-msg';div.id='ai-typing-indicator';
  div.innerHTML='<div class="ai-avatar">🐷</div><div class="ai-bubble ai-typing"><span class="ai-dot"></span><span class="ai-dot"></span><span class="ai-dot"></span></div>';
  msgs.appendChild(div);msgs.scrollTop=msgs.scrollHeight;
}

function sendAIMessage(){
  var input=el('ai-input');if(!input)return;
  var text=input.value.trim();if(!text)return;
  input.value='';
  if(!aiInitialized) initAICoach();
  appendAIMessage('user',text);
  aiHistory.push({role:'user',content:text});
  appendAITyping();
  var sendBtn=qs('.ai-input-row button');if(sendBtn) sendBtn.disabled=true;

  fetch('https://api.anthropic.com/v1/messages',{
    method:'POST',
    headers:{'Content-Type':'application/json','anthropic-dangerous-direct-browser-access':'true'},
    body:JSON.stringify({model:'claude-sonnet-4-20250514',max_tokens:1000,system:getFinancialContext(),messages:aiHistory.slice(-10)})
  }).then(function(res){return res.json();}).then(function(data){
    var reply=data.content&&data.content[0]&&data.content[0].text?data.content[0].text:null;
    var indicator=el('ai-typing-indicator');if(indicator)indicator.remove();
    if(reply){appendAIMessage('bot',reply);aiHistory.push({role:'assistant',content:reply});addXP(3);}
    else{appendAIMessage('bot',generateLocalAdvice(text));}
    if(sendBtn) sendBtn.disabled=false;
  }).catch(function(){
    var indicator=el('ai-typing-indicator');if(indicator)indicator.remove();
    appendAIMessage('bot',generateLocalAdvice(text));
    if(sendBtn) sendBtn.disabled=false;
  });
}

function sendAIChip(btn){el('ai-input').value=btn.textContent;sendAIMessage();}

function generateLocalAdvice(question){
  var tI=getTotalIncome();
  var tE=getTotalExpenses();
  var sav=getNetSavings(); var rate=tI>0?Math.round((sav/tI)*100):0;
  var tDebt=debts.reduce(function(s,d){return s+(d.total-d.paid);},0);
  var q=question.toLowerCase();
  if(!tI&&!tE) return 'Kamusta! You have not added any income or expenses yet. Start in the Income tab and add your salary — then I can give you real personalized advice!';
  if(q.includes('save')||q.includes('ipon')||q.includes('saving')) return rate>=20?'You are saving '+rate+'% which is above the 20% target — great job! Consider putting idle cash into Pag-IBIG MP2 or a UITF for more growth. Your current net savings is '+fmt(sav)+'/month.':'You are saving '+rate+'% right now. To hit 20%, try cutting your biggest variable expense by 15-20%. Even '+fmt(Math.round(tI*0.2-sav))+' more saved monthly would hit the target!';
  if(q.includes('debt')||q.includes('utang')||q.includes('loan')) return !debts.length?'Good news — no debts tracked! If you have loans or credit card balances, add them in the Debts tab so I can help plan payoff.':'You have '+fmt(tDebt)+' in total debt. Use the avalanche method — pay minimums everywhere, then throw extra at the highest-interest debt. Every payment earns XP!';
  if(q.includes('goal')||q.includes('target')) return !goals.length?'You have not set any savings goals yet! Go to Goals and add one — whether emergency fund, gadget, or vacation. Goals with a deadline and monthly contribution give you a clear roadmap.':'You have '+goals.length+' active goal'+(goals.length!==1?'s':'')+'. Keep depositing consistently — even small amounts add up fast and earn XP!';
  if(q.includes('overall')||q.includes('how am i')||q.includes('kumusta')) return 'Your finances: Income '+fmt(tI)+'/mo, Expenses '+fmt(tE)+'/mo, Net savings '+fmt(sav)+'/mo ('+rate+'%). '+(tDebt>0?fmt(tDebt)+' in debt. ':'')+goals.length+' goal'+(goals.length!==1?'s':'')+' in progress. Level '+gameState.level+' — keep going!';
  if(q.includes('budget')||q.includes('gastos')||q.includes('spend')){var top=expenses.length?[].concat(expenses).sort(function(a,b){return b.monthly-a.monthly;})[0]:null;return top?'Your biggest expense is '+top.name+' ('+top.cat+') at '+fmt(top.monthly)+'/month. Try setting a budget limit on it in the Expenses tab, or use the Budget Board for envelope budgeting!':'Add some expenses so I can analyze your spending patterns!';}
  return 'Your savings rate is '+rate+'%. '+( rate<20?'To reach 20%, try the 50/30/20 rule in Tools: 50% needs, 30% wants, 20% savings. ':'Great rate! ') +'Your wallet balance is '+fmt(walletBalance)+'. Keep logging transactions to stay accurate and earn XP!';
}

// ── FAQ TOGGLE ───────────────────────────────────────────────────
function toggleFaq(btn){
  var item=btn.closest('.faq-item');
  var isOpen=item.classList.contains('open');
  document.querySelectorAll('.faq-item.open').forEach(function(e){e.classList.remove('open');});
  if(!isOpen) item.classList.add('open');
}

// ── STORAGE ──────────────────────────────────────────────────────
function saveData(){
  try{
    localStorage.setItem('pera_v4',JSON.stringify({incomes:incomes,expenses:expenses,goals:goals,debts:debts,transactions:transactions,receivables:receivables,envelopes:envelopes,walletBalance:walletBalance,monthHistory:monthHistory,receipts:receipts,gameState:gameState}));
  }catch(e){console.warn('Save failed',e);}
}
function loadData(){
  try{
    var raw=localStorage.getItem('pera_v4')||localStorage.getItem('pera_v3')||localStorage.getItem('pera_v2');
    if(!raw) return;
    var d=JSON.parse(raw);
    incomes=d.incomes||[];expenses=d.expenses||[];goals=d.goals||[];debts=d.debts||[];
    transactions=d.transactions||[];receivables=d.receivables||[];envelopes=d.envelopes||[];
    walletBalance=d.walletBalance||0;monthHistory=d.monthHistory||{};receipts=d.receipts||[];
    if(d.gameState) gameState=Object.assign(gameState,d.gameState);
  }catch(e){console.warn('Load failed',e);}
}

// ── REMINDERS ────────────────────────────────────────────────────
function checkReminders(){
  var overdue=receivables.filter(function(r){return r.status!=='paid'&&r.due&&new Date(r.due)<new Date();});
  if(overdue.length>0) setTimeout(function(){showToast('success',overdue.length+' Overdue Receivable'+(overdue.length>1?'s':''),'Check Receivables tab!');},1500);
  var soonGoals=goals.filter(function(g){if(!g.deadline)return false;var days=Math.ceil((new Date(g.deadline)-new Date())/(1000*60*60*24));return days>0&&days<=7;});
  if(soonGoals.length>0) setTimeout(function(){showToast('success','Goal Deadline Soon!','"'+soonGoals[0].name+'" deadline in 7 days or less!');},2500);
  if((gameState.gachaPulls||0)>0) setTimeout(function(){showToast('gacha-result',gameState.gachaPulls+' Gacha Pull'+(gameState.gachaPulls>1?'s':'')+' Waiting!','Visit the Arcade tab!');},3500);
}

// ── INIT ─────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded',function(){
  document.addEventListener('touchstart',function(){},{passive:true});
  document.addEventListener('touchmove',function(){},{passive:true});
  loadData();
  loadMonth();
  updateMonthLabel();
  renderAll();
  updateSidebarXP();
  updateStreak();
  completeQuest('login');
  addXP(10);
  checkReminders();
  loadTheme();
  setTimeout(function(){updatePet(true);},2000);
  setInterval(function(){updatePet(false);},30000);
});

