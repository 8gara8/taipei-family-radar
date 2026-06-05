/* Taipei Family Radar — shared data + helpers (window.TFR)
 * Real content lifted from the repo's data/events.json + digests.json.
 * Today is 2026-06-05 (週五), ISO week 2026-W23.
 */
(function () {
  const TODAY = "2026-06-05";

  const CATEGORY = {
    music:       { label: "音樂",   emoji: "🎵" },
    dance:       { label: "舞蹈",   emoji: "🕺" },
    performance: { label: "表演",   emoji: "🎭" },
    competition: { label: "競賽",   emoji: "🏆" },
    film:        { label: "電影",   emoji: "🎬" },
    workshop:    { label: "工作坊", emoji: "🧩" },
    market:      { label: "市集",   emoji: "🧺" },
    festival:    { label: "節慶",   emoji: "🎉" },
    exhibition:  { label: "展覽",   emoji: "🖼️" },
    other:       { label: "其他",   emoji: "✨" },
  };

  const STREAM = {
    cultural: { label: "文化機構", short: "文化", color: "#3d7dd6" },
    outdoor:  { label: "戶外表演", short: "戶外", color: "#e07a5f" },
  };

  const AGEFIT = {
    great: { label: "很適合", short: "👶 很適合", color: "#2f9e7e", bg: "#e6f4ef" },
    ok:    { label: "可考慮", short: "可考慮",     color: "#b5810a", bg: "#fbf1d8" },
    older: { label: "大小孩", short: "大小孩",     color: "#6f7d75", bg: "#eef0ee" },
  };

  // ── events (subset of fields the mockups use) ──────────────
  const events = [
    { id:"chaojingbay-keelung-sailing-2026-06-07", title:"基隆國際帆船賽 岸上觀賽", stream:"outdoor", category:"competition", venue:"潮境公園・101高地", area:"基隆市中正區", city:"基隆", startDate:"2026-06-07", isFree:true, ageFit:"ok", ageFitReason:"遠眺帆船較靜態，幼兒專注有限；潮境公園大草坪可搭配放電。", summary:"12國36艘重型帆船在基隆嶼周邊競速，到潮境公園或101高地就能免費看帆船群出海，看完還能在草坪野餐、看潮間帶。", tags:["戶外","海洋","免費"] },
    { id:"klpas-dongxin-concert-2026-06-12", title:"東信藝起飛 孩子的舞台夢音樂會", stream:"cultural", category:"music", venue:"基隆表演藝術中心 演藝廳", area:"基隆市中正區", city:"基隆", startDate:"2026-06-12", startTime:"19:00", isFree:true, ageFit:"older", ageFitReason:"晚上7點開演約110分鐘，對2歲偏晚偏長；森巴鼓開場很熱鬧。", summary:"在地學校年度聯合音樂會：森巴鼓、國樂、管弦樂、踢踏舞輪番上陣。自由入座免索票，氣氛輕鬆。", tags:["室內","免費","音樂會"] },
    { id:"klpas-sea-spirit-puppet-2026-06-13", title:"海底奇幻世界 海精靈的報恩（掌中戲）", stream:"cultural", category:"performance", venue:"基隆表演藝術中心 島嶼實驗劇場", area:"基隆市中正區", city:"基隆", startDate:"2026-06-13", startTime:"14:30", isFree:true, ageFit:"great", ageFitReason:"午後場、僅一小時、免費自由入場，掌中戲偶視覺豐富，幼兒容易投入。", summary:"掌中戲版的海底冒險：美人魚、海豚與自然精靈帶出海洋保育故事。週六下午一小時，節奏剛好，免費入場。", tags:["室內","免費","掌中戲"] },
    { id:"klpas-forest-invitation-2026-06-13", title:"兒童藝術祭《來自森林的邀請》弦樂團公演", stream:"cultural", category:"performance", venue:"基隆表演藝術中心 演藝廳", area:"基隆市中正區", city:"基隆", startDate:"2026-06-13", startTime:"19:00", isFree:true, ageFit:"ok", ageFitReason:"沉浸互動式設計適合幼兒，但晚上7點開演90分鐘，2歲撐到尾聲較吃力。", summary:"近400位小學生用弦樂、舞蹈和戲劇打造的沉浸式音樂劇，觀眾可揮手燈互動、上台當森林守護者。需先索票。", tags:["室內","免費","互動"] },
    { id:"daan-busker-2026-06-14", title:"大安森林公園露天音樂台 街頭藝人展演", stream:"outdoor", category:"performance", venue:"大安森林公園露天音樂台", area:"台北市大安區", city:"台北", startDate:"2026-06-14", startTime:"14:00", isFree:true, ageFit:"great", ageFitReason:"戶外、免費、可隨進隨出，幼兒走動吵鬧也沒關係。", summary:"週末午後露天音樂台的街頭藝人展演，常有音樂、雜耍或互動表演。空間開闊、有大片草地，適合帶推車待一下午。", tags:["戶外","推車友善","免費"] },
    { id:"ntpcdragonboat-yizhangbei-2026-06-19", title:"新北市議長盃 第十六屆龍舟錦標賽", stream:"outdoor", category:"competition", venue:"蘆洲微風運河", area:"新北市蘆洲區", city:"新北", startDate:"2026-06-19", endDate:"2026-06-20", isFree:true, ageFit:"great", ageFitReason:"河岸開放空間隨進隨出，鼓聲與加油聲熱鬧，幼兒看龍舟超有感。", summary:"端午連假在蘆洲微風運河登場，108支隊伍競速。河岸視野開闊、免費觀賽，現場常有發粽子香包等應景活動。", tags:["戶外","龍舟","端午","河濱","免費"] },
    { id:"traveltaipei-dragonboat-champ-2026-06-19", title:"2026臺北國際龍舟錦標賽暨端午嘉年華", titleOriginal:"Taipei International Dragon Boat Championships", stream:"outdoor", category:"competition", venue:"大佳河濱公園", area:"台北市中山區", city:"台北", startDate:"2026-06-19", endDate:"2026-06-21", isFree:true, ageFit:"great", ageFitReason:"河濱開放空間免費觀賽、可隨進隨出，鼓聲熱鬧，幼兒走動都自在。", summary:"端午連假三天，223支國內外隊伍在大佳河濱競速，大直橋下同步有端午市集與體驗。河濱腹地大、推車好推。", tags:["戶外","龍舟","端午","河濱","免費"] },
    { id:"goethe-kids-story-2026-06-20", title:"歌德學院 德語親子故事工作坊", titleOriginal:"Deutsch mit Spaß für Kinder", stream:"cultural", category:"workshop", venue:"歌德學院（台北）", area:"台北市大安區", city:"台北", startDate:"2026-06-20", startTime:"10:30", isFree:true, ageFit:"ok", ageFitReason:"室內、有固定時段並需報名，4歲較能參與，2歲需家長全程陪同。", summary:"為學齡前孩子設計的德語故事與律動工作坊，以歌謠、繪本與遊戲帶入簡單德語。室內冷氣場地約一小時。", tags:["室內","需報名","親子限定"] },
    { id:"fete-musique-2026-06-21", title:"法國音樂節（新北夏至音樂節）", titleOriginal:"Fête de la Musique", stream:"cultural", category:"festival", venue:"新北市美術館 戶外園區", area:"新北市鶯歌區", city:"新北", startDate:"2026-06-20", endDate:"2026-06-21", startTime:"16:00", isFree:true, ageFit:"great", ageFitReason:"露天音樂節、免費入場，音樂輕鬆，可席地而坐或自由走動。", summary:"法國在台協會首度與新北合作，夏至週末於新北市美術館戶外園區舉辦。法國爵士、留尼旺歌手與台灣音樂人輪番演出，現場有40多攤好日市集。", tags:["戶外","市集","法國","推車友善","免費"] },
    { id:"npac-plaza-summer-2026-06-21", title:"兩廳院藝文廣場 夏夜露天音樂會", stream:"outdoor", category:"music", venue:"兩廳院藝文廣場", area:"台北市中正區", city:"台北", startDate:"2026-06-21", startTime:"18:30", isFree:true, ageFit:"great", ageFitReason:"戶外廣場、免費聆賞，傍晚較涼爽，鋪野餐墊全家同樂剛好。", summary:"以輕古典與爵士小品為主的夏夜露天音樂會。廣場開闊、傍晚涼爽，帶野餐墊就能坐下聽音樂，鄰近捷運中正紀念堂站。", tags:["戶外","音樂","免費","傍晚"] },
    { id:"huashan-family-market-2026-06-27", title:"華山1914 夏日親子市集", stream:"outdoor", category:"market", venue:"華山1914 中央藝文公園", area:"台北市中正區", city:"台北", startDate:"2026-06-27", endDate:"2026-06-28", startTime:"11:00", isFree:true, ageFit:"great", ageFitReason:"戶外草坪市集、免費進場，有手作攤位與點心，可推車慢逛。", summary:"中央藝文公園的週末親子市集，集合手作、童書、點心攤位，常搭配小型表演與氣球活動。戶外草坪空間大、可推車。", tags:["戶外","市集","免費","週末"] },
    { id:"celebration-canada-2026-06-27", title:"加拿大日慶典 Celebration Canada 2026", titleOriginal:"Celebration Canada 2026", stream:"cultural", category:"festival", venue:"臺北市客家文化主題公園", area:"台北市中正區", city:"台北", startDate:"2026-06-27", startTime:"13:00", isFree:true, ageFit:"great", ageFitReason:"戶外免費園遊會、設有親子家庭專區，可隨進隨出，幼兒走動自在。", summary:"全球最大的海外加拿大國慶慶典，現場有live音樂、楓糖點心、poutine等美食，並設親子專區提供遊戲與工作坊。免費入場。", tags:["戶外","美食","親子專區","免費"] },
    { id:"daan-eco-walk-2026-07-02", title:"大安森林公園 免費生態解說導覽（7月場）", stream:"outdoor", category:"workshop", venue:"大安森林公園", area:"台北市大安區", city:"台北", startDate:"2026-07-02", startTime:"09:30", isFree:true, ageFit:"ok", ageFitReason:"兩小時走讀導覽需報名，4歲可跟著聽，2歲建議推車隨行隨時休息。", summary:"由公園志工帶路的免費生態走讀，認識花草樹木與生態池的鷺鷥、五色鳥。平日上午場人少舒適，邊走邊看剛剛好。", tags:["戶外","需報名","平日上午"] },
    { id:"tpac-tcaf-outdoor-hands-2026-07-02", title:"臺北兒童藝術節 戶外演出《大手牽小手》", stream:"outdoor", category:"music", venue:"青年公園露天音樂台", area:"台北市萬華區", city:"台北", startDate:"2026-07-02", startTime:"19:30", isFree:true, ageFit:"great", ageFitReason:"戶外免費隨進隨出，Baby Shark、龍貓神曲大合唱，2歲也能跟著搖擺。", summary:"拉縴人歌手男聲合唱團領銜的戶外親子音樂會，從民歌唱到〈Baby Shark〉、《龍貓》與吉伊卡哇，全場大合唱。60分鐘無中場。", tags:["戶外","音樂","傍晚","兒藝節","免費"] },
    { id:"tpac-tcaf-outdoor-starmission-2026-07-03", title:"臺北兒童藝術節 戶外演出《星星任務大作戰》", stream:"outdoor", category:"performance", venue:"青年公園露天音樂台", area:"台北市萬華區", city:"台北", startDate:"2026-07-03", startTime:"19:30", isFree:true, ageFit:"ok", ageFitReason:"輕快音樂劇互動多，4歲看得開心；2歲可隨時進出走動。", summary:"佳評如潮的原創親子音樂劇，五個小學生被困在道具倉庫，要完成星星任務才能回家。歌曲輕快、互動滿滿，60分鐘無中場。", tags:["戶外","音樂劇","傍晚","兒藝節","免費"] },
    { id:"ntpc-civic-plaza-2026-07-04", title:"新北市民廣場 親子夏日音樂會", stream:"outdoor", category:"music", venue:"新北市民廣場", area:"新北市板橋區", city:"新北", startDate:"2026-07-04", startTime:"17:30", isFree:true, ageFit:"great", ageFitReason:"戶外廣場、免費，鄰近捷運與府中商圈，週邊親子設施完善。", summary:"傍晚親子音樂會，曲目以兒歌、電影配樂與互動演奏為主。廣場寬敞、緊鄰板橋車站與府中商圈，吃飯購物都方便。", tags:["戶外","音樂","新北","免費"] },
    { id:"tpac-tcaf-outdoor-mingxing-2026-07-04", title:"臺北兒童藝術節 戶外演出《明星節度使》", stream:"outdoor", category:"performance", venue:"青年公園露天音樂台", area:"台北市萬華區", city:"台北", startDate:"2026-07-04", startTime:"19:30", isFree:true, ageFit:"ok", ageFitReason:"兒童歌仔戲視覺華麗鑼鼓熱鬧，4歲看熱鬧剛好，2歲注意音量。", summary:"改編自金鼎獎童書的兒童歌仔戲，融合傳統唱腔與數位視覺。週六傍晚免費演出60分鐘，是孩子接觸台灣戲曲的輕鬆入門。", tags:["戶外","歌仔戲","傍晚","兒藝節","免費"] },
    { id:"cksmh-busker-2026-07-05", title:"中正紀念堂自由廣場 假日街頭藝人展演", stream:"outdoor", category:"performance", venue:"中正紀念堂 自由廣場", area:"台北市中正區", city:"台北", startDate:"2026-07-05", startTime:"15:00", isFree:true, ageFit:"great", ageFitReason:"超大廣場開放空間、免費，孩子能奔跑，看表演不必久坐。", summary:"自由廣場週末固定有街頭藝人輪番演出，從魔術、泡泡秀到音樂演奏。腹地極大、好停推車，旁邊就是捷運站與遮陽迴廊。", tags:["戶外","表演","免費"] },
    { id:"tpac-tcaf-outdoor-beepbop-2026-07-05", title:"臺北兒童藝術節 戶外演出《嗶啵！外星人來襲！》", stream:"outdoor", category:"performance", venue:"青年公園露天音樂台", area:"台北市萬華區", city:"台北", startDate:"2026-07-05", startTime:"19:30", isFree:true, ageFit:"great", ageFitReason:"世界小丑大賽冠軍團隊的馬戲喜劇，肢體搞笑不需語言，幼兒也買單。", summary:"2017世界小丑大賽冠軍團隊帶來的音樂馬戲喜劇，外星人闖進天籟村展開接納差異的冒險。肢體喜劇加馬戲特技，週日傍晚免費60分鐘。", tags:["戶外","馬戲","傍晚","兒藝節","免費"] },
    { id:"majorevent-yannick-sketch-2026-07-10", title:"第22屆亞尼克寫生比賽（二二八和平公園）", stream:"outdoor", category:"competition", venue:"二二八和平公園 音樂台", area:"台北市中正區", city:"台北", startDate:"2026-07-10", endDate:"2026-07-11", isFree:true, ageFit:"ok", ageFitReason:"歷屆設幼兒園組，4歲可下場塗鴉參賽，2歲在公園陪玩散步即可。", summary:"人氣甜點品牌的年度大型親子寫生活動，歷屆均免費報名，常設幼兒園組並加碼點心與親子陪伴日。帶野餐墊與畫具，畫完還能逛公園。", tags:["戶外","寫生","親子","公園"] },
    { id:"traveltaipei-taloma-music-fest-2026-07-28", title:"TALOMA' 台北原住民族音樂節", titleOriginal:"Taipei Indigenous Music Festival", stream:"cultural", category:"festival", venue:"華山1914 北側綠地", area:"台北市中正區", city:"台北", startDate:"2026-07-28", endDate:"2026-08-01", startTime:"13:00", isFree:true, ageFit:"great", ageFitReason:"戶外草地音樂節、免費隨進隨出，孩子可在綠地走動聽歌逛市集。", summary:"以「回家的聲音」為主題的原住民族音樂節，舞台演出、原樂好市市集與林班歌大賽輪番上陣，歷屆均免費入場。大草地好鋪野餐墊。", tags:["戶外","音樂","市集","原住民族","免費"] },
    { id:"ntpcyouth-streetdance-2026-08-01", title:"2026新北國際街舞大賽", titleOriginal:"New Taipei International Street Dance", stream:"outdoor", category:"dance", venue:"致理科技大學 誠信館", area:"新北市板橋區", city:"新北", startDate:"2026-08-01", endDate:"2026-08-02", isFree:true, ageFit:"older", ageFitReason:"館內賽事音樂大聲、節奏緊湊，4歲看得目不轉睛，2歲需留意音量。", summary:"邁入第18年的大型街舞賽事，法、美、日、韓、馬好手齊聚。霹靂舞一對一、排舞賽等四大賽事輪番上陣，免費觀賽但需線上索票。", tags:["街舞","免費","需索票","新北"] },
    { id:"chaojingbay-tide-music-2026-08-15", title:"基隆潮境海灣節「潮音樂」星光音樂會", stream:"outdoor", category:"music", venue:"潮境公園", area:"基隆市中正區", city:"基隆", startDate:"2026-08-15", isFree:true, ageFit:"great", ageFitReason:"背山面海大草坪隨進隨出，音樂加市集，幼兒跑跳自在；備防曬與薄外套。", summary:"潮境海灣節壓軸「潮音樂」回到潮境公園，星光舞台結合山海意象，多組歌手接力開唱，並有山、海、世界三大主題市集。大草坪聽歌看夕陽。", tags:["戶外","音樂","市集","海洋","免費"] },
    { id:"npac-summer-jazz-party-2026-08-15", title:"2026兩廳院夏日爵士戶外派對", titleOriginal:"NTCH Summer Jazz Outdoor Party", stream:"outdoor", category:"music", venue:"兩廳院藝文廣場", area:"台北市中正區", city:"台北", startDate:"2026-08-15", startTime:"18:30", isFree:true, ageFit:"great", ageFitReason:"台北最大免費露天音樂會，鋪野餐墊隨進隨出，幼兒走動吵鬧都自在。", summary:"台北夏天最大的免費露天音樂會，彭郁雯五重奏、台灣拉丁重擊與李竺芯接力演出，民謠、拉丁與台語爵士輪番上陣，現場另有永續市集。", tags:["戶外","音樂","傍晚","野餐","免費"] },
  ];

  const digest = {
    weekOf: "2026-W23",
    weekNo: 23,
    title: "端午雙龍舟，戶外免費演出接力",
    intro: "端午週末雙龍舟：大佳河濱臺北國際龍舟錦標賽（223隊）＋蘆洲微風運河議長盃（108隊），兩場都免費觀賽。本週日基隆有國際帆船賽可看。六月底接力：法國音樂節、加拿大日慶典、兒藝節青年公園連四晚免費戶外演出。",
    highlightEventIds: [
      "chaojingbay-keelung-sailing-2026-06-07",
      "traveltaipei-dragonboat-champ-2026-06-19",
      "fete-musique-2026-06-21",
      "tpac-tcaf-outdoor-hands-2026-07-02",
      "npac-summer-jazz-party-2026-08-15",
    ],
  };

  // ── sources (data/sources.json) ───────────────────────────
  const SOURCE_TYPE = {
    "gov-calendar": "政府行事曆",
    "cultural-institute": "文化機構",
    "aggregator": "活動匯整",
    "venue": "場館",
  };
  const sources = [
    { name:"外交部 駐台外國機構名錄", type:"gov-calendar", stream:"cultural", url:"https://www.mofa.gov.tw/OfficesInROC.aspx", lastStatus:"partial" },
    { name:"歌德學院（台北）德國文化中心", type:"cultural-institute", stream:"cultural", url:"https://www.goethe.de/ins/tw/", lastStatus:"ok" },
    { name:"法國在台協會 / Alliance Française", type:"cultural-institute", stream:"cultural", url:"https://france-taipei.org/", lastStatus:"ok" },
    { name:"美國在台協會 AIT", type:"cultural-institute", stream:"cultural", url:"https://www.ait.org.tw/", lastStatus:"partial" },
    { name:"日本台灣交流協會", type:"cultural-institute", stream:"cultural", url:"https://www.koryu.or.jp/taipei/", lastStatus:"ok" },
    { name:"加拿大商會 CCCT", type:"cultural-institute", stream:"cultural", url:"https://www.canchamtw.com/", lastStatus:"ok" },
    { name:"國立中正紀念堂（表演/其他活動）", type:"venue", stream:"outdoor", url:"https://www.cksmh.gov.tw/", lastStatus:"ok" },
    { name:"大安森林公園之友基金會", type:"venue", stream:"outdoor", url:"https://www.daanforestpark.org.tw/", lastStatus:"ok" },
    { name:"臺北表演藝術中心（兒藝節）", type:"venue", stream:"outdoor", url:"https://tpac.org.taipei/festival-tcaf", lastStatus:"ok" },
    { name:"國家兩廳院（夏日爵士/藝文廣場）", type:"venue", stream:"outdoor", url:"https://npac-ntch.org/", lastStatus:"ok" },
    { name:"華山 1914 文創園區", type:"venue", stream:"outdoor", url:"https://www.huashan1914.com/", lastStatus:"ok" },
    { name:"松山文創園區", type:"venue", stream:"outdoor", url:"https://www.songshanculturalpark.org/", lastStatus:"partial" },
    { name:"OPENTIX 兩廳院文化生活", type:"aggregator", stream:"outdoor", url:"https://www.opentix.life/", lastStatus:"ok" },
    { name:"小藝行事曆（中正紀念堂）", type:"aggregator", stream:"outdoor", url:"https://yii.tw/taipei/calendar?place=cksmh", lastStatus:"ok" },
    { name:"Accupass（親子/戶外）", type:"aggregator", stream:"both", url:"https://www.accupass.com/", lastStatus:"partial" },
    { name:"臺北市大型群聚活動行事曆", type:"gov-calendar", stream:"both", url:"https://majorevent.gov.taipei/", lastStatus:"ok" },
    { name:"台北旅遊網 活動", type:"gov-calendar", stream:"both", url:"https://www.travel.taipei/zh-tw/event/calendar", lastStatus:"ok" },
    { name:"臺北市文化快遞", type:"gov-calendar", stream:"both", url:"https://cultureexpress.taipei/", lastStatus:"partial" },
    { name:"全國藝文活動資訊系統", type:"gov-calendar", stream:"both", url:"https://event.culture.tw/", lastStatus:"partial" },
    { name:"新北市政府文化局 / 新北旅客", type:"gov-calendar", stream:"both", url:"https://www.tourism.ntpc.gov.tw/", lastStatus:"partial" },
    { name:"新北市政府青年局", type:"gov-calendar", stream:"outdoor", url:"https://www.youth.ntpc.gov.tw/", lastStatus:"ok" },
    { name:"基隆市表演藝術網（文化觀光局）", type:"gov-calendar", stream:"cultural", url:"https://klpas.klcg.gov.tw/", lastStatus:"ok" },
    { name:"交通部觀光署 觀光活動", type:"gov-calendar", stream:"both", url:"https://www.taiwan.net.tw/", lastStatus:"ok" },
  ];

  const CITIES = [
    { key: "台北市", label: "台北" },
    { key: "新北市", label: "新北" },
    { key: "基隆市", label: "基隆" },
  ];
  function parseArea(area) {
    if (!area) return { city: "", district: "" };
    return { city: area.slice(0, 3), district: area.slice(3) };
  }
  function isWeekend(iso) { const g = parse(iso).getDay(); return g === 0 || g === 6; }

  // ── helpers ───────────────────────────────────────────────
  const WD = ["週日", "週一", "週二", "週三", "週四", "週五", "週六"];
  const WD1 = ["日", "一", "二", "三", "四", "五", "六"];

  function parse(iso) { const [y, m, d] = iso.split("-").map(Number); return new Date(y, m - 1, d); }
  function weekday(iso) { return WD[parse(iso).getDay()]; }
  function weekdayShort(iso) { return WD1[parse(iso).getDay()]; }
  function md(iso) { const d = parse(iso); return `${d.getMonth() + 1}/${d.getDate()}`; }
  function dayNum(iso) { return parse(iso).getDate(); }
  function fmtRange(s, e) {
    if (!e || e === s) return `${md(s)}（${weekdayShort(s)}）`;
    return `${md(s)}–${md(e)}`;
  }
  function isThisWeek(iso) { return iso >= "2026-06-05" && iso <= "2026-06-21"; }
  function highlights() { return digest.highlightEventIds.map((id) => events.find((e) => e.id === id)).filter(Boolean); }
  function upcoming() { return events.filter((e) => (e.endDate || e.startDate) >= TODAY).sort((a, b) => a.startDate.localeCompare(b.startDate)); }

  // events occurring on a given YYYY-MM-DD (covers multi-day spans)
  function onDate(iso) {
    return events.filter((e) => {
      const s = e.startDate, en = e.endDate || e.startDate;
      return iso >= s && iso <= en;
    });
  }
  // map date->events for a given month (year, month0)
  function monthMap(year, month0) {
    const map = {};
    events.forEach((e) => {
      const s = parse(e.startDate), en = parse(e.endDate || e.startDate);
      for (let d = new Date(s); d <= en; d.setDate(d.getDate() + 1)) {
        if (d.getFullYear() === year && d.getMonth() === month0) {
          const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
          (map[key] = map[key] || []).push(e);
        }
      }
    });
    return map;
  }
  // group an event list by startDate -> [{date, events}]
  function groupByDate(list) {
    const m = {};
    list.forEach((e) => { (m[e.startDate] = m[e.startDate] || []).push(e); });
    return Object.keys(m).sort().map((date) => ({ date, events: m[date] }));
  }

  window.TFR = {
    TODAY, events, digest, sources, SOURCE_TYPE, CITIES, CATEGORY, STREAM, AGEFIT, WD, WD1,
    parse, weekday, weekdayShort, md, dayNum, fmtRange, isThisWeek, isWeekend, parseArea,
    highlights, upcoming, onDate, monthMap, groupByDate,
  };
})();
