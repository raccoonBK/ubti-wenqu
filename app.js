/* ============================================================
   UBTI · 十六型人格 → 预演你的大学生活 → 引流问渠每日一问
   纯静态。默认本地叙事引擎；可选接入 OpenAI 兼容接口。

   四个维度（自建体系，非 MBTI 换名）：
     一 你和自己的关系   H 感受确认 / A 行动解决
     二 你和人的关系     C 相伴充电 / I 独处充电
     三 你和时间的关系   E 提前铺好 / D 卡点爆发
     四 你和可能性的关系 P 深耕一条 / T 广撒网试
   四字母直接拼成类型代码，例：HCEP / AIDT
   ============================================================ */

/* ---------------- 四维度 · 八字母 ---------------- */
const DIMS = [
  { a: { l: 'H', n: '感受确认' }, b: { l: 'A', n: '行动解决' }, qs: [
    ['室友半夜跟你抱怨一件事，你先做的是——', '先听他把话说完，让他知道被听见了', '先问清楚发生了什么，想下一步怎么办'],
    ['自己状态很差的那天，你更需要——', '有人陪着说说话，把情绪放出来', '先搞清楚卡在哪，解决掉就踏实了'],
    ['朋友来问你意见，你更常给的是——', '先接住他的感受', '先给他一个能走的方向'],
    ['一件事搞砸之后，你最先处理——', '心里那股难受', '事情本身怎么补救'],
  ] },
  { a: { l: 'C', n: '相伴充电' }, b: { l: 'I', n: '独处充电' }, qs: [
    ['报到第一晚，宿舍都在互相认识，你——', '门开着，谁来都聊两句', '先理好自己的床位，等等看'],
    ['一整周课排满，你的周末更像——', '约人出去，在热闹里充电', '关起门来，在安静里充电'],
    ['心情不好的时候你更想——', '找人说', '一个人待着'],
    ['认识三个月后，你在班里的位置更像——', '很多人点头之交，谁都能聊', '三两深交，其余不熟'],
  ] },
  { a: { l: 'E', n: '提前铺好' }, b: { l: 'D', n: '卡点爆发' }, qs: [
    ['开学第一周你会——', '把日程表先排出来', '走一步看一步'],
    ['交作业你通常——', '提前做完放着', '截止前才进入状态'],
    ['计划被打乱时你——', '烦躁，想把它拉回来', '无所谓，换条路走'],
    ['出趟远门之前你——', '路线、时间都先查好', '到了再说，随缘'],
  ] },
  { a: { l: 'P', n: '深耕一条' }, b: { l: 'T', n: '广撒网试' }, qs: [
    ['选课时你先看——', '这门课和我认准的方向搭不搭', '这门课有没有意思、能打开什么'],
    ['社团招新你——', '挑一两个，打算做久', '先都试试，试过才知道'],
    ['面对一个新领域你更想——', '先把一条路走深', '先把面铺开看看'],
    ['别人问你以后做什么，你——', '有个大概方向，不打算改', '有很多个可能，还在挑'],
  ] },
];

/* 字母 → 短词，用于类型卡上的"四词拼接" */
const LETTER = { H:'感受', A:'行动', C:'相伴', I:'独处', E:'提前', D:'卡点', P:'深耕', T:'广撒网' };

/* ---------------- 16 型 ----------------
   name 传播名 / tag 一句话标签 / persona 人设句
   cute 可爱之处 / blind 盲点提醒
   strength 名词短语（场景里当主语）/ move 动词短语 / fear 短句（场景收尾）
   ---------------------------------------- */
const TYPES = {
  /* ---------- HC 热气组：在意感受，人堆里充电 ---------- */
  HCEP: { name: '人形迎新手册', tag: '开学第一周就把整层楼认全的人',
    persona: '开学第一周你就把整层楼认全了，还悄悄认准了几个人准备深交一辈子。',
    cute: '别人的名字你记一遍就忘不掉，谁没来吃饭你第一时间发现。',
    blind: '你把太多人放进心里照看，别忘了给自己也留一盏灯。',
    strength: '先把人接住的人', move: '进门先扫一圈，看谁还没被接住', fear: '怕自己照顾不过来' },

  HCET: { name: '社团集邮册', tag: '每个新开始都真心喜欢过的人',
    persona: '百团大战你盖了七个章，每一个都真心喜欢过至少三天。',
    cute: '你的热情是真的，每个新开始你都全力以赴。',
    blind: '热情不是欠条，中途退场也不算辜负谁。',
    strength: '每个新开始都全力以赴的人', move: '见到新东西先凑上去，加入再说', fear: '怕半途退场辜负了谁' },

  HCDP: { name: '踩点热闹选手', tag: '最后一分钟到场，气氛就到位',
    persona: '你永远在最后一分钟推门进来，但只要你到了，气氛就算到位了。',
    cute: '你的到场本身就是礼物，没人会怪你晚。',
    blind: '不是每次迟到都会被原谅，有些人等不起。',
    strength: '一推门就能把气氛带起来的人', move: '卡着最后几分钟推门进来，一进来场子就活了', fear: '怕自己是被落下的那个' },

  HCDT: { name: '客厅野生吉祥物', tag: '不需要主场，在场就够',
    persona: '你不需要计划，也不需要主场，你只要在场就够了。',
    cute: '客厅因为你变得像个客厅，而不是一条过道。',
    blind: '被人喜欢不等于被人了解，你也值得被认真问一句。',
    strength: '让一个空间像个空间的人', move: '往客厅一窝，谁进来都能自然坐下', fear: '怕自己只是被喜欢，而不是被了解' },

  /* ---------- HI 潮汐组：在意感受，独处才恢复 ---------- */
  HIEP: { name: '提前焦虑冠军', tag: '考试周前两周已考完三轮的人',
    persona: '考试周前两周，你已经在心里考完三轮了。',
    cute: '你把在意的人的事，也一起提前担心了。',
    blind: '预演了十种坏结果，现实通常只发生一种，还常常不发生。',
    strength: '把最坏情况先想一遍的人', move: '事情还没来，就先在心里演完三轮', fear: '怕自己撑不住' },

  HIET: { name: '攻略型社恐', tag: '把一切查好才敢说"随便"的人',
    persona: '去之前你把点评、路线、厕所位置全查好了，然后才敢说自己"随便"。',
    cute: '跟你出门不用带脑子，你连备选方案都准备好了。',
    blind: '不是所有事都查得到攻略，迷路一次也不会死。',
    strength: '出门前把一切查好的人', move: '先把路线、点评、备选方案全查一遍', fear: '怕失控' },

  HIDP: { name: '熄灯后才开机', tag: '白天省电，夜里才真正活着',
    persona: '白天你在省电，宿舍熄灯之后，你才真正开始活着。',
    cute: '深夜里你说的话，比白天所有人都真。',
    blind: '夜里的情绪会被放大，天亮再决定一次也不迟。',
    strength: '深夜里才真正醒着的人', move: '白天省电，熄灯之后才开始说真话', fear: '怕自己的重没人看见' },

  HIDT: { name: '窗边观察员', tag: '不抢话，但把每个人都看见了',
    persona: '你不抢话，但你把每个人都看见了，包括那个一直没说话的人。',
    cute: '你记得很多别人以为没人注意到的小事。',
    blind: '看见不等于到场，想加入的时候，你可以自己拉开那把椅子。',
    strength: '把每个人都看见的人', move: '站在窗边看全场，连没说话的那个也看见', fear: '怕自己一直都只是个旁观者' },

  /* ---------- AC 开干组：先解决事情，人堆里充电 ---------- */
  ACEP: { name: '日程表本人', tag: '日程表有颜色分区的人',
    persona: '你的日程表有颜色分区，而且你已经默默发给了全宿舍。',
    cute: '跟着你走，事情真的会一件件落地。',
    blind: '别人跟不上你的节奏时，那不是不配合，只是节奏不同。',
    strength: '把事排成表的人', move: '事情一落下来就先排成表，顺手发给所有人', fear: '怕事情悬着没人管' },

  ACET: { name: '课表填色师', tag: '把课表填成调色盘的人',
    persona: '选课那几天，你把课表填成了一张调色盘，还顺手帮室友也填了一份。',
    cute: '你的精力是真的旺盛，而且是会分给别人的那种。',
    blind: '排满不等于过好，空着的格子也有它的用处。',
    strength: '把选项铺满再挑的人', move: '先把所有选项铺开摆一排，再慢慢挑', fear: '怕自己选错了，不是最优的那个' },

  ACDP: { name: 'DDL 战神', tag: '只有截止日期能叫醒的人',
    persona: '截止日期是你的第二心脏，只有它跳动的时候你才真正醒着。',
    cute: '压力下你的效率能吓到所有人，包括你自己。',
    blind: '不是每一次心跳都撑得到终点，别把身体也当成可压缩的资源。',
    strength: '被期限逼出全力的人', move: '总要等到截止日期临近，才整个人亮起来', fear: '怕来不及' },

  ACDT: { name: '顺手主义者', tag: '遇到就解决，解决完就翻篇',
    persona: '垃圾满了顺手带走，衣服淋了顺手收进来，遇到就解决，解决完就翻篇。',
    cute: '你从不记账，因为你觉得帮忙这种事本来就不需要还。',
    blind: '你顺手接下的事，久了会变成别人默认的"你来"。',
    strength: '顺手就把事解决的人', move: '遇到就顺手解决，解决完就翻篇，从不记账', fear: '怕自己变成别人默认的那个人' },

  /* ---------- AI 自走组：先解决事情，独处才恢复 ---------- */
  AIEP: { name: '四年倒计时', tag: '大一就在想大四要交什么的人',
    persona: '大一刚开学，你已经在想大四要交出去的那份东西长什么样。',
    cute: '你是那种会把路走通的人，别人跟着你走很安心。',
    blind: '四年很长，计划之外的那部分，往往才是大学给你的东西。',
    strength: '早早看见终点的人', move: '大一就开始想大四要交出什么，一条线串到底', fear: '怕自己白走一趟' },

  AIET: { name: '人形对比表', tag: '把选择在心里排完序的人',
    persona: '你收藏了十一个备选方案，然后在心里默默排完了序。',
    cute: '你做的决定几乎不会后悔，因为该想的你都想过了。',
    blind: '有些事比出来的不是好坏，只有试过才知道。',
    strength: '把选择排完序的人', move: '把所有选项摆一起对比，心里默默排完序', fear: '怕自己选错' },

  AIDP: { name: '静音模式', tag: '不说话就把事做完的人',
    persona: '通知常年免打扰，但交代给你的事，一件都没掉过。',
    cute: '你不用说话就能把事做完，这在人群里很稀有。',
    blind: '不说话不等于不需要，你想要什么也可以说出口。',
    strength: '安静把事做完的人', move: '不吭声，但交代过的事一件没掉', fear: '怕开口是在麻烦别人' },

  AIDT: { name: '离线也通关', tag: '一个人也能走通的人',
    persona: '组队可以，但你发现独行更快，于是你慢慢就不等别人了。',
    cute: '你从不拖累任何人，也不需要被谁救。',
    blind: '走得快不等于走得远，偶尔被人等一次也没关系。',
    strength: '一个人也能走通的人', move: '发现独行更快，就慢慢不等别人了', fear: '怕自己拖累别人' },
};

/* ---------------- 七幕预演 ----------------
   每一幕都由类型字段 + 三个维度字母共同决定：
     上课     H/A · C/I · P/T      破冰   C/I · E/D · P/T
     恋爱     H/A · E/D · P/T      社交   C/I · E/D · P/T
     社团     H/A · E/D · P/T      考试周 H/A · C/I · E/D
     宿舍夜聊 H/A · C/I · E/D
   四个维度均匀铺进七幕，任意两种类型最多只会有两幕读到相同文字。
   gen(t, anx, c)  c = 四字母代码，c[0]=H/A c[1]=C/I c[2]=E/D c[3]=P/T
   -------------------------------------------- */
const SCENES = [
  { emoji: '📚', title: '上课', gen: (t, anx, c) => [
    `头几节大课你坐在后排，半节课没抬头。脑子里过的不是公式，是${c[0] === 'H' ? '刚才那句话是不是说错了' : '这周的清单还剩几项'}。`,
    c[1] === 'C'
      ? `同桌是个刚认识的人，你顺手把笔记推过去，下课时你们已经约好一起去食堂。`
      : `一屋子陌生人，你戴上耳机，先给自己隔出一小块地方。`,
    c[3] === 'P'
      ? `你早就想清楚要走哪条路，所以听着听着会走神——不是不认真，是嫌它绕远。`
      : `你什么都想学一点，笔记记得很散，可每一页都还带着当时的兴奋。`,
    `期末你发现，真正记住的不是知识点，是"${t.fear}"这件事本身。`,
  ] },

  { emoji: '🤝', title: '破冰', gen: (t, anx, c) => [
    `新生破冰那场，别人还在找借口溜，你${t.move}。`,
    c[1] === 'C'
      ? `散场时你手机里多了十几个好友，四个小时后群里还有人说话。`
      : `你提前撤了，回去的路上才觉得终于喘上气——社交对你从来不是充电，是耗电。`,
    `${c[2] === 'E' ? '你提前想好了要说什么、几点撤，所以那天比想象中顺。' : '你什么都没准备就去了，结果意外地撑到了最后。'}${c[3] === 'P' ? '最后你只和一个人聊了很久，那一个后来成了你四年里最常联系的人。' : '你加了一堆人，大半没再说过话，但那天你觉得自己什么都沾了一点。'}`,
    anx ? `你曾写下：「${anx}」。可那天你忙着把场子接住，差点忘了自己原本也怕。`
        : `你原本以为自己会缩在角落，结果那一晚比想象中好过。`,
  ] },

  { emoji: '💌', title: '恋爱', gen: (t, anx, c) => [
    `感情这件事你学得很慢。${c[0] === 'H' ? '你会先问自己难不难受，再决定要不要说出口。' : '你会先想清楚问题出在哪，再开口谈。'}`,
    c[2] === 'E'
      ? `你喜欢在关系开始之前就把话说清楚，这让一些人觉得你太认真。`
      : `你总是先走了再说，走到哪算哪，也因此绕了一些远路。`,
    c[3] === 'P'
      ? `某次争执你第一次说清了底线，对方愣了一下，然后认真点了头。`
      : `某次争执你们吵到半夜，第二天谁也没提，但两个人都松了一点。`,
    `你慢慢明白，好的关系不是把你改造成谁，是让你更像自己。`,
  ] },

  { emoji: '🌃', title: '社交', gen: (t, anx, c) => [
    `迎新夜的操场人声鼎沸。${c[1] === 'C' ? '你身边很快聚起几个同频的，散场还约了第二天一起吃饭。' : '你在边上站了一会儿，和一个同样站着的人聊起来——通常这种更聊得来。'}`,
    `${c[2] === 'E' ? '你出门前就想好了待多久、什么时候走。' : '你是被拉来的，连跟谁一起来的都记不太清。'}${c[3] === 'P' ? '你只在乎有没有遇到真正对的那一个。' : '你谁都聊两句，一晚上下来收获了不少名字。'}`,
    anx ? `那句「${anx}」，后来变成你筛掉无效热闹的标准，反而轻松了。`
        : `你不再强迫自己场场都在，留下的都是真的。`,
  ] },

  { emoji: '🎯', title: '社团', gen: (t, anx, c) => [
    `你报了三个社团，两周后只留了一个——因为只有那里，是真的需要${t.strength}。`,
    c[3] === 'P'
      ? `你把留下的那一个做得很深，深到后来别人一提这件事，第一个想到的就是你。`
      : `留下来的那个你也没做太久，但你在另外三个地方，各认识了几个后来很重要的人。`,
    `${c[0] === 'H' ? '真正让你留下的是那里的人。' : '真正让你留下的是那件事本身还有东西可做。'}${c[2] === 'E' ? '你提前把流程都问清楚了才决定，所以从没后悔。' : '你是先加入了再说，后来才发现自己比想象中适合。'}`,
    `换届那天，前辈把一块硬盘交给你，里面是三年的资料和你还没听过的故事。`,
  ] },

  { emoji: '☕', title: '考试周', gen: (t, anx, c) => [
    c[2] === 'E'
      ? `考试周前两周你就排好了复习表，到考前那一晚反而最松——该做的都做完了。`
      : `前两周你一直没动，直到考前三天才真正打开书，然后发现自己居然能连轴转。`,
    c[0] === 'H'
      ? `焦虑最凶的时候，你给家里打了个电话，说完就好了大半。`
      : `焦虑最凶的时候，你把要背的东西拆成小块，一块一块往下过。`,
    c[1] === 'C'
      ? `图书馆你占了一整排位置，顺手也帮同学留了座。`
      : `你找了个最角落的位置，一个人待到闭馆。`,
    anx ? `你写在便签上的「${anx}」，考完随手塞进书里，后来再看到，已经像别人的事了。`
        : `你学会了和紧绷共处，它不再是你的问题，只是背景音。`,
  ] },

  { emoji: '🌙', title: '宿舍夜聊', gen: (t, anx, c) => [
    `熄灯后的宿舍夜聊，是你大学里最私密的剧场。${c[1] === 'C' ? '你总能把话题接下去，谁有心事你都听得出来。' : '你不怎么开口，但那一晚每个人说了什么，你后来都记得。'}`,
    c[0] === 'H'
      ? `有人讲起家里的难处，你没给建议，只说了句「真的挺难的」——他后来一直记得这句。`
      : `有人讲起家里的难处，你帮他把接下来能做的理了一遍——他后来真的照着做了。`,
    c[2] === 'E'
      ? `你早就想好了四年之后要去哪，所以那晚你听得格外安静。`
      : `你从来没想过四年之后的事，所以那晚你听得格外起劲。`,
    anx ? `你也曾把「${anx}」咽回去没说，可那晚你发现，说出来的人，反而睡得最沉。`
        : `你学会了一件事：脆弱被看见，不是弱点，是连接开始的信号。`,
    `很多年后你忘了考过的试，却记得这几个夜里，谁先开了口。`,
  ] },
];

/* ---------------- 问渠 · 每日一问题库 ----------------
   口径对齐问渠 prompts.ts：特殊疑问句 / ≤50字 / 完全自包含 /
   禁止比喻文学化 / 禁止总结式("今天你学到什么") / 只挖自身不挖事件 */
const DAILY_Q = [
  '最近一次说"没事"，是真的没事，还是没想好怎么开口？',
  '这周有哪件事，你做完之后不想跟任何人提？',
  '你现在最常待在一起的那个人，是你自己选的吗？',
  '有没有一件你一直在准备、却始终没开始的事？',
  '别人夸你的时候，你心里第一个冒出来的反驳是什么？',
  '这一个月，你有没有为了不落单，去过一个你根本不想去的场合？',
  '你最近一次改变主意，是因为想通了，还是因为扛不住了？',
  '如果今晚没人找你，你是松一口气，还是会空一下？',
  '你现在坚持的某个习惯，是它真的有用，还是你不敢停？',
  '有没有一句别人随口说的话，你到现在还在琢磨？',
  '你最近一次觉得"我不属于这儿"，是在什么场合？',
  '你手机里最舍不得删的那张照片，拍的是什么时候？',
  '你答应过自己的事里，有哪件已经拖了三个月？',
  '你最不想被人看穿的那一点，具体是什么？',
];

/* 追问：沿用问渠"不挖事件、只挖这件事碰到了你的什么"的原则 */
const FOLLOWUPS = [
  '这件事里，最让你自己在意的是哪一点？',
  '顺着这个答案再往下问一句，你会问自己什么？',
  '这件事碰到的，是你身上哪个旧毛病？',
  '如果不用顾任何人的看法，你这一步会怎么走？',
];

/* ---------------- 状态 ---------------- */
const state = { answers: [], qi: 0, code: '', dailyIdx: 0 };

const $ = (id) => document.getElementById(id);
const SCREENS = ['landing', 'quiz', 'result', 'anxiety', 'loading', 'preview', 'daily'];
function show(n) { SCREENS.forEach(s => $(s).classList.toggle('active', s === n)); }

/* ---------------- 测验 ---------------- */
const FLAT = [];
DIMS.forEach((d, di) => d.qs.forEach(q => FLAT.push({ di, text: q[0], a: q[1], b: q[2] })));

function renderQ() {
  const i = state.qi, it = FLAT[i];
  $('qCount').textContent = `第 ${i + 1} / ${FLAT.length} 题 · ${DIMS[it.di].a.n} / ${DIMS[it.di].b.n}`;
  $('progBar').style.width = (i / FLAT.length * 100) + '%';
  $('qText').textContent = it.text;
  const box = $('qOptions'); box.innerHTML = '';
  [it.a, it.b].forEach((txt, k) => {
    const b = document.createElement('button');
    b.className = 'opt'; b.textContent = txt;
    b.onclick = () => { state.answers[i] = k === 0 ? 'a' : 'b'; nextQ(b); };
    box.appendChild(b);
  });
}
function nextQ(el) {
  [...$('qOptions').children].forEach(o => o.classList.remove('chosen'));
  el.classList.add('chosen');
  setTimeout(() => {
    state.qi++;
    if (state.qi < FLAT.length) renderQ(); else finishQuiz();
  }, 170);
}

function finishQuiz() {
  let code = '';
  const bars = [];
  DIMS.forEach((d, di) => {
    const picks = [];
    FLAT.forEach((f, i) => { if (f.di === di) picks.push(state.answers[i]); });
    const a = picks.filter(p => p === 'a').length;
    const b = picks.length - a;
    const win = a >= b ? 'a' : 'b';
    const pct = Math.round(Math.max(a, b) / picks.length * 100);
    code += d[win].l;
    bars.push({ pole: d[win], other: d[win === 'a' ? 'b' : 'a'], pct });
  });
  state.code = code;
  renderResult(code, bars);
  show('result');
}

/* ---------------- 类型卡 ---------------- */
function renderResult(code, bars) {
  const t = TYPES[code] || TYPES.HCEP;
  ['archAvatar', 'previewAvatar'].forEach(id => {
    const el = $(id);
    if (el) el.src = `assets/${TYPES[code] ? code : 'HCEP'}.png`;
  });
  $('archCode').textContent = code;
  $('archWords').textContent = code.split('').map(c => LETTER[c] || '').join(' · ');
  $('archName').textContent = t.name;
  $('archTag').textContent = t.tag;
  $('archDesc').textContent = t.persona;
  $('archCute').textContent = t.cute;
  $('archBlind').textContent = t.blind;
  $('prevCode').textContent = code + ' · ' + t.name;

  const box = $('dimBars'); box.innerHTML = '';
  bars.forEach(b => {
    const row = document.createElement('div');
    row.className = 'dim';
    row.innerHTML = `<span class="dim-l">${b.pole.l} ${b.pole.n}</span>
      <div class="dim-bar"><span style="width:${b.pct}%"></span></div>
      <span class="dim-r">${b.pct}%</span>
      <span class="dim-o">${b.other.l} ${b.other.n}</span>`;
    box.appendChild(row);
  });
}

/* ---------------- 预演 ---------------- */
function shortAnx() {
  const raw = ($('anxietyInput').value || '').trim();
  return raw ? (raw.length > 28 ? raw.slice(0, 28) + '…' : raw) : '';
}
function buildScenes(t, anx, c) {
  return SCENES.map(s => ({ emoji: s.emoji, title: s.title, body: s.gen(t, anx, c || state.code).join('') }));
}

function loadCfg() { try { return JSON.parse(localStorage.getItem('ubti_cfg') || 'null'); } catch { return null; } }

async function callLLM(t, anx) {
  const cfg = loadCfg();
  if (!cfg || !cfg.base || !cfg.key) return null;
  const list = SCENES.map(s => s.title).join('、');
  const prompt = `你在帮大学新生预演生活。用户的 UBTI 类型是「${state.code} ${t.name}」：${t.persona}
他的特质是：${t.strength}，习惯${t.move}，心里怕的是「${t.fear}」。
用户写下的期待/焦虑是：「${anx || '（未填写）'}」。
请为这 7 个场景各写一段 3-4 句、以"你"为主角的预演文字，把人格特质和那句焦虑自然织进去。语气真诚克制，像真的会发生。场景：${list}。
只输出 JSON 数组，7 个字符串，顺序对应，不要多余说明。`;
  try {
    const res = await fetch(`${cfg.base.replace(/\/$/, '')}/chat/completions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${cfg.key}` },
      body: JSON.stringify({ model: cfg.model || 'gpt-4o-mini', messages: [{ role: 'user', content: prompt }], temperature: 0.9 })
    });
    if (!res.ok) return null;
    const data = await res.json();
    const arr = JSON.parse((data.choices?.[0]?.message?.content || '').replace(/```json|```/g, '').trim());
    if (Array.isArray(arr) && arr.length === 7) return SCENES.map((s, i) => ({ emoji: s.emoji, title: s.title, body: arr[i] }));
  } catch (e) { /* 回落到本地引擎 */ }
  return null;
}

async function generate() {
  const t = TYPES[state.code] || TYPES.HCEP;
  const anx = shortAnx();
  show('loading');
  const dots = ['正在把你写下的忐忑，预演成会发生的日常……', '正在对照你的 UBTI 类型，编织每一幕……', '快好了，最后把焦虑折成开头……'];
  let i = 0; const timer = setInterval(() => { i = (i + 1) % dots.length; $('loadingText').textContent = dots[i]; }, 700);

  let scenes = await callLLM(t, anx);
  const usedLLM = !!scenes;
  if (!scenes) scenes = buildScenes(t, anx, state.code);
  clearInterval(timer);

  $('archAnxiety').textContent = anx
    ? `「${anx}」——你带来的忐忑，下面是被它牵着走、又把它接住的四年。`
    : `你什么都没写，可下面这四年，依然会替你把那些没说出口的忐忑，一幕幕演完。`;
  const box = $('scenes'); box.innerHTML = '';
  scenes.forEach(s => {
    const d = document.createElement('div'); d.className = 'scene';
    d.innerHTML = `<div class="scene-head"><span class="scene-emoji">${s.emoji}</span><span class="scene-title">${s.title}</span></div><div class="scene-body">${s.body}</div>`;
    box.appendChild(d);
  });
  $('engineNote').textContent = usedLLM ? '＊ 本预演由接入的大模型实时生成。' : '＊ 本预演由本地叙事引擎生成（无需联网/密钥）。接入 OpenAI 兼容接口后可升级为真模型生成。';
  show('preview');
  window.scrollTo(0, 0);
}

/* ---------------- 每日一问引流 ---------------- */
function renderDaily() {
  const q = DAILY_Q[state.dailyIdx % DAILY_Q.length];
  $('dailyQ').textContent = q;
  $('dailyAnswer').value = '';
  $('dailyFollow').textContent = '';
  $('dailyFollow').classList.add('hidden');
}
async function submitDaily() {
  const ans = $('dailyAnswer').value.trim();
  if (!ans) { toast('先写一句，哪怕是"不知道"'); return; }
  const cfg = loadCfg();
  if (cfg && cfg.base && cfg.key) {
    // 真模型追问：按问渠口径——不挖事件，只挖"这件事碰到了你的什么"
    try {
      const res = await fetch(`${cfg.base.replace(/\/$/, '')}/chat/completions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${cfg.key}` },
        body: JSON.stringify({
          model: cfg.model || 'gpt-4o-mini',
          messages: [{ role: 'user', content: `你是「问渠」。用户刚回答：${ans}\n原问题：${DAILY_Q[state.dailyIdx % DAILY_Q.length]}\n严格规则：只输出一句追问，≤40字，特殊疑问句；严禁挖事件的客观内容（谁/几点/多久/结果）；严禁名词解释式追问；严禁比喻文学化；问的是"这件事碰到了你的什么"。` }],
          temperature: 0.9
        })
      });
      const d = await res.json();
      const txt = (d.choices?.[0]?.message?.content || '').trim();
      if (txt) { $('dailyFollow').textContent = txt; $('dailyFollow').classList.remove('hidden'); return; }
    } catch (e) { /* 回落本地 */ }
  }
  const f = FOLLOWUPS[Math.floor(Math.random() * FOLLOWUPS.length)];
  $('dailyFollow').textContent = f;
  $('dailyFollow').classList.remove('hidden');
}

function toast(msg) {
  const el = $('toast'); el.textContent = msg; el.classList.add('show');
  setTimeout(() => el.classList.remove('show'), 1800);
}

/* ---------------- 绑定 ---------------- */
$('startBtn').onclick = () => { state.qi = 0; state.answers = []; renderQ(); show('quiz'); };
$('toAnxietyBtn').onclick = () => show('anxiety');
$('previewBtn').onclick = generate;
$('toDailyBtn').onclick = () => { renderDaily(); show('daily'); };
$('dailySubmit').onclick = submitDaily;
$('dailyShuffle').onclick = () => { state.dailyIdx++; renderDaily(); };
$('restartBtn').onclick = () => { state.qi = 0; state.answers = []; show('landing'); };
$('printBtn').onclick = () => window.print();

$('settingsToggle').onclick = () => $('settingsPanel').classList.toggle('hidden');
$('saveCfg').onclick = () => {
  const cfg = { base: $('cfgBase').value.trim(), key: $('cfgKey').value.trim(), model: $('cfgModel').value.trim() };
  localStorage.setItem('ubti_cfg', JSON.stringify(cfg));
  $('cfgStatus').textContent = cfg.key ? '已保存，将用真模型生成' : '已保存（未填密钥，仍用本地引擎）';
};

(function init() {
  const cfg = loadCfg();
  if (cfg) { $('cfgBase').value = cfg.base || ''; $('cfgKey').value = cfg.key || ''; $('cfgModel').value = cfg.model || ''; }
  renderDaily();
})();
