(() => {
  const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
  const store={get(k,d){try{const v=localStorage.getItem(k);return v===null?d:JSON.parse(v)}catch{return d}},set(k,v){try{localStorage.setItem(k,JSON.stringify(v))}catch{}}};
  const gate=$('#gate'),intro=$('#intro'),introVideo=$('#introVideo'),nextWrap=$('#nextWrap'),nextBtn=$('#nextBtn'),app=$('#app');
  const dashVideo=$('#dashboardVideo'),mute=$('#dashboardMute'),musicIsland=$('#musicIsland');
  const gateReference=$('#gateReference'),gateFallback=$('#gateFallback');
  gateReference?.addEventListener('error',()=>gateFallback?.classList.remove('hidden'));
  const introSources=['assets/intro.mp4','./intro.mp4'],dashSources=['assets/dashboard-base.mp4','./dashboard-base.mp4'];
  let introIndex=0,dashIndex=0,firstIntroEnd=false,dashStarted=false;
  const mount=()=>window.LearnXIcons?.mount(document);
  const source=(video,list,i)=>{if(i>=list.length)return false;video.src=list[i];video.load();return true};
  const safePlay=v=>{const p=v.play();p?.catch?.(()=>{});return p};

  $('#fingerprint').addEventListener('click',()=>{
    gate.classList.add('hidden');intro.classList.remove('hidden');firstIntroEnd=false;nextWrap.classList.add('hidden');introIndex=0;
    source(introVideo,introSources,introIndex);introVideo.muted=false;introVideo.volume=.82;safePlay(introVideo);
  });
  introVideo.addEventListener('error',()=>{introIndex++;if(source(introVideo,introSources,introIndex)){introVideo.muted=false;introVideo.volume=.82;safePlay(introVideo)}});
  introVideo.addEventListener('ended',()=>{firstIntroEnd=true;nextWrap.classList.remove('hidden');introVideo.currentTime=0;safePlay(introVideo)});
  nextBtn.addEventListener('click',()=>{if(!firstIntroEnd)return;introVideo.pause();intro.classList.add('hidden');app.classList.remove('hidden');document.body.classList.add('app-open');musicIsland.classList.add('ready');window.scrollTo({top:0,behavior:'auto'});startDashboard();store.set('sessions',store.get('sessions',0)+1);renderProgress()});

  function startDashboard(){
    // The greeting owns the first seconds: the anime video must stay paused until speech finishes.
    dashStarted=false;dashIndex=0;dashVideo.preload='auto';source(dashVideo,dashSources,dashIndex);dashVideo.pause();dashVideo.currentTime=0;dashVideo.muted=true;dashVideo.volume=.72;updateMute();
    let greetingFinished=false,videoReady=false;
    const start=()=>{if(dashStarted||!greetingFinished)return; if(!videoReady){dashVideo.addEventListener('canplay',start,{once:true});return} dashStarted=true;dashVideo.muted=false;updateMute();safePlay(dashVideo)};
    dashVideo.addEventListener('canplay',()=>{videoReady=true;start()},{once:true});
    if(!('speechSynthesis' in window)){setTimeout(start,900);return}
    try{speechSynthesis.cancel()}catch{}
    const u=new SpeechSynthesisUtterance('Hello everyone, welcome to LearnX');u.lang='en-US';u.rate=.84;u.pitch=1.06;u.volume=.72;
    let spoken=false;
    const speak=()=>{if(spoken)return;spoken=true;
      try{const voices=speechSynthesis.getVoices();const v=voices.find(x=>/female|samantha|zira|aria|jenny|ava|google us english/i.test(x.name));if(v)u.voice=v}catch{}
      let done=false;const finish=()=>{if(done)return;done=true;greetingFinished=true;start()};u.onend=finish;u.onerror=finish;
      try{speechSynthesis.speak(u)}catch{setTimeout(finish,1200)}
      setTimeout(finish,7000);
    };
    if(speechSynthesis.getVoices().length)speak();else{speechSynthesis.onvoiceschanged=()=>{speechSynthesis.onvoiceschanged=null;speak()};setTimeout(speak,450)}
  }
  dashVideo.addEventListener('error',()=>{dashIndex++;if(source(dashVideo,dashSources,dashIndex)){dashVideo.muted=!dashStarted;if(dashStarted)safePlay(dashVideo);else dashVideo.pause()}});
  function updateMute(){mute.innerHTML=`<span data-icon="${dashVideo.muted?'volume-off':'volume'}"></span>`;mount();mute.setAttribute('aria-label',dashVideo.muted?'Nyalakan suara video':'Matikan suara video')}
  mute.addEventListener('click',()=>{dashVideo.muted=!dashVideo.muted;updateMute();safePlay(dashVideo)});

  function showPage(id){
    if(id==='dashboard'){$$('.page').forEach(p=>p.classList.add('hidden'));$('#dashboard').classList.remove('hidden');window.scrollTo({top:0,behavior:'smooth'});return}
    $('#dashboard').classList.add('hidden');$$('.page').forEach(p=>p.classList.add('hidden'));const page=$('#'+id);if(page)page.classList.remove('hidden');window.scrollTo({top:0,behavior:'smooth'});renderProgress();
  }
  document.addEventListener('click',e=>{const el=e.target.closest('[data-page]');if(el){e.preventDefault();showPage(el.dataset.page)}});
  document.addEventListener('pointerdown',e=>{const b=e.target.closest('button');if(!b)return;const r=document.createElement('span');r.className='touch-glow';const rect=b.getBoundingClientRect();r.style.left=(e.clientX-rect.left)+'px';r.style.top=(e.clientY-rect.top)+'px';b.appendChild(r);setTimeout(()=>r.remove(),320)},{passive:true});

  const moduleData={
    'Matematika':{icon:'math',desc:'Aljabar, fungsi, geometri, statistika.',lessons:[['Aljabar','Kenali variabel, koefisien, konstanta, operasi bentuk aljabar.'],['Persamaan linear','Pindahkan suku dengan operasi yang sama di kedua ruas.'],['Fungsi','Pelajari domain, range, notasi f(x), dan grafik.'],['Geometri','Gunakan sifat sudut, segitiga, lingkaran, dan luas.'],['Statistika','Mean, median, modus, jangkauan, dan membaca data.']]},
    'Bahasa Indonesia':{icon:'indonesia',desc:'LHO, eksposisi, argumentasi, sastra, dan kaidah bahasa.',lessons:[['Teks LHO','Cari definisi umum, deskripsi bagian, dan deskripsi manfaat.'],['Kalimat definisi','Biasanya menjelaskan pengertian suatu objek secara umum.'],['Kalimat deskripsi','Menjelaskan ciri, bagian, atau keadaan objek secara khusus.'],['Imbuhan di-','Bedakan di- sebagai imbuhan dengan di sebagai kata depan.']]},
    'Bahasa Inggris':{icon:'english',desc:'Grammar, reading, vocabulary, dan speaking.',lessons:[['Simple Present','Subject + V1; gunakan untuk kebiasaan dan fakta.'],['Simple Past','Subject + V2 untuk peristiwa yang sudah terjadi.'],['Vocabulary','Belajar kata dalam konteks kalimat, bukan hanya hafalan.'],['Reading','Cari main idea, detail pendukung, dan inference.']]},
    'Bahasa Jepang':{icon:'japan',desc:'Hiragana, katakana, kosakata, dan dialog.',lessons:[['Hiragana','Mulai あいうえお lalu lanjut baris K, S, T, N.'],['Katakana','Pelajari ア イ ウ エ オ dan gunakan untuk kata serapan.'],['Kosakata','あいさつ (salam), angka, hari, sekolah, keluarga.'],['Kalimat dasar','わたしは ___ です。 = Saya adalah ___.']]},
    'IPA':{icon:'science',desc:'Fisika, kimia, biologi, dan metode ilmiah.',lessons:[['Metode ilmiah','Pertanyaan → hipotesis → eksperimen → data → kesimpulan.'],['Biologi','Sel, organ, sistem tubuh, ekosistem.'],['Fisika','Besaran, satuan, gerak, gaya, energi.'],['Kimia','Materi, atom, unsur, senyawa, perubahan.']]},
    'IPS':{icon:'social',desc:'Sejarah, ekonomi, geografi, dan sosiologi.',lessons:[['Sejarah','Susun kronologi, sebab-akibat, tokoh, dan dampak.'],['Geografi','Baca lokasi, ruang, peta, lingkungan, dan interaksi manusia.'],['Ekonomi','Pahami kebutuhan, kelangkaan, produksi, distribusi, konsumsi.'],['Sosiologi','Pelajari interaksi, norma, kelompok, dan perubahan sosial.']]},
    'PKN':{icon:'civics',desc:'Pancasila, konstitusi, hak, kewajiban, dan kewarganegaraan.',lessons:[['Pancasila','Pahami nilai setiap sila dan penerapannya dalam kehidupan.'],['Konstitusi','Pelajari fungsi UUD, lembaga negara, dan aturan dasar.'],['Hak & kewajiban','Keduanya berjalan seimbang dalam kehidupan warga negara.']]},
    'Informatika':{icon:'code',desc:'Algoritma, data, jaringan, keamanan digital, dan coding.',lessons:[['Algoritma','Input → proses → output adalah pola dasar banyak sistem.'],['Data','Bedakan data mentah, informasi, struktur data, dan visualisasi.'],['Jaringan','Kenali perangkat, alamat, protokol, dan alur komunikasi.'],['Coding','Pecah masalah menjadi fungsi kecil yang dapat diuji.']]},
    'Seni Budaya':{icon:'art',desc:'Seni rupa, musik, tari, dan teater.',lessons:[['Seni rupa','Unsur: titik, garis, bidang, bentuk, warna, tekstur, ruang.'],['Musik','Melodi, ritme, harmoni, tempo, dinamika, timbre.'],['Tari','Gerak, ruang, waktu, tenaga, dan ekspresi.']]},
    'PJOK':{icon:'sport',desc:'Kebugaran, permainan, kesehatan, dan keselamatan.',lessons:[['Kebugaran','Latihan teratur dan seimbang untuk kesehatan, bukan mengejar bentuk tubuh.'],['Permainan','Pahami aturan, teknik dasar, strategi, dan sportivitas.'],['Kesehatan','Tidur, aktivitas, kebersihan, dan pola hidup sehat.']]},
    'Filsafat & Sosial':{icon:'philosophy',desc:'Berpikir kritis, etika, filsafat, dan kecakapan sosial.',lessons:[['Logika','Periksa premis, bukti, hubungan sebab-akibat, dan kesimpulan.'],['Etika','Nilai tindakan berdasarkan alasan, dampak, dan tanggung jawab.'],['Epistemologi','Tanyakan: bagaimana kita tahu sesuatu dan seberapa kuat buktinya?'],['Filsafat klasik','Socrates, Plato, dan Aristoteles memberi dasar penting bagi tradisi filsafat Barat.']]},
    'Komunikasi Etis':{icon:'strategy',desc:'Persuasi etis dan pertahanan diri dari manipulasi.',lessons:[['Persuasi etis','Gunakan alasan, bukti, transparansi, dan beri orang ruang memilih.'],['Deteksi manipulasi','Waspadai ancaman, guilt-tripping, tekanan waktu, dan klaim tanpa bukti.'],['Batasan sehat','Belajar berkata tidak, meminta waktu berpikir, dan memeriksa fakta.']]}
  };
  const modules=Object.entries(moduleData);
  $('#moduleGrid').innerHTML=modules.map(([name,m],i)=>`<article class="module-card"><div class="module-icon" data-icon="${m.icon}"></div><small>MODULE ${String(i+1).padStart(2,'0')}</small><h3>${name}</h3><p>${m.desc}</p><button class="module-open" data-module="${name}">Buka materi <span data-icon="arrow"></span></button></article>`).join('');
  mount();
  $('#moduleGrid').addEventListener('click',e=>{const b=e.target.closest('[data-module]');if(!b)return;openModule(b.dataset.module)});
  $('#curriculumRail').addEventListener('click',e=>{const b=e.target.closest('[data-module]');if(!b)return;$$('.course-card',$('#curriculumRail')).forEach(x=>x.classList.toggle('active',x===b));openModule(b.dataset.module)});
  const studyTemplates={
    default:{goal:'Pahami konsep inti, lihat contoh, lalu uji diri tanpa melihat catatan.',book:['Konsep inti','Contoh terarah','Latihan aktif','Rangkuman'],tips:'Gunakan pola 10 menit baca → 5 menit tutup buku → 5 menit jelaskan kembali dengan kata-katamu sendiri.'},
  };
  function lessonBook(subject,topic,desc){
    const special={
      'Aljabar':['Aljabar mempelajari simbol dan aturan operasi untuk mewakili bilangan yang belum diketahui. Fokus pada variabel, koefisien, konstanta, dan suku sejenis.','Contoh: 3x + 2x = 5x karena suku x sejenis. Saat menjumlahkan bentuk aljabar, operasi dilakukan pada koefisien yang sejenis.','Latihan: sederhanakan 4x + 3 - 2x + 5. Jelaskan setiap langkah.'],
      'Hiragana':['Hiragana adalah salah satu sistem tulisan Jepang. Mulailah dari vokal あ い う え お, lalu baris K, S, T, N dan seterusnya.','Contoh: あ = a, い = i, う = u, え = e, お = o. Baca tanpa melihat romanisasi setelah beberapa pengulangan.','Latihan: tulis あいうえお dari ingatan, lalu cocokkan dengan bunyinya.'],
      'Teks LHO':['Teks Laporan Hasil Observasi menyajikan hasil pengamatan secara objektif dan sistematis. Struktur yang umum adalah definisi umum/klasifikasi lalu deskripsi bagian dan dapat diikuti deskripsi manfaat.','Contoh cara membaca teks: tandai kalimat yang mendefinisikan objek, lalu cari bagian yang menjelaskan ciri atau bagian objek.','Latihan: ambil satu objek di sekitar sekolah dan tulis definisi umum + tiga cirinya.'],
      'Simple Past':['Simple past digunakan untuk kejadian yang telah selesai di masa lalu. Kata kerja dapat berubah ke bentuk V2, sedangkan pertanyaan/negatif umumnya menggunakan did + V1.','Contoh: I studied yesterday. / Did you study yesterday? / I did not study yesterday.','Latihan: buat tiga kalimat tentang kegiatan kemarin: positif, negatif, dan pertanyaan.']
    };
    const x=special[topic]||[desc,`Cara belajar: pecah topik “${topic}” menjadi definisi → bagian penting → contoh → latihan. Setelah membaca, tutup buku dan jelaskan kembali tanpa melihat.`,`Latihan mandiri: tulis 3 hal yang baru dipahami, 1 hal yang masih membingungkan, lalu buat 1 pertanyaan untuk menguji diri.`];
    return {core:x[0],example:x[1],practice:x[2],summary:`${topic}: ${desc}`};
  }
  function openModule(name){
    const m=moduleData[name];if(!m)return;
    $('#moduleContent').innerHTML=`<div class="module-hero"><div class="module-icon large" data-icon="${m.icon}"></div><small>LEARNX MODULE · RUANG BELAJAR</small><h1>${name}</h1><p>${m.desc}</p><div class="study-meta"><span>${m.lessons.length} bab tersedia</span><span>Mode: Buku + Latihan</span></div></div><div class="lesson-list">${m.lessons.map((l,i)=>`<article><div><span>${String(i+1).padStart(2,'0')}</span><h3>${l[0]}</h3><p>${l[1]}</p></div><button class="mini-learn" data-topic="${name}|${l[0]}">Buka ruang <span data-icon="book"></span></button></article>`).join('')}</div>`;
    mount();showPage('moduleDetail');
  }
  document.addEventListener('click',e=>{const b=e.target.closest('.mini-learn');if(b){const [subject,topic]=b.dataset.topic.split('|');openStudyRoom(subject,topic)}});
  function openStudyRoom(subject,topic){
    const m=moduleData[subject],lesson=m?.lessons.find(x=>x[0]===topic);if(!lesson)return;
    const book=lessonBook(subject,topic,lesson[1]);
    $('#moduleContent').innerHTML=`<div class="study-room"><div class="study-room-head"><button class="back" id="studyBack"><span data-icon="back"></span>${subject}</button><div class="study-badge">LEARNX STUDY ROOM</div></div><div class="study-book"><div class="book-top"><div class="module-icon" data-icon="${m.icon}"></div><div><small>${subject}</small><h1>${topic}</h1><p>Ruang belajar khusus · baca → pahami → ingat → latihan</p></div></div><div class="book-tabs"><button class="book-tab active" data-tab="core">Buku</button><button class="book-tab" data-tab="example">Contoh</button><button class="book-tab" data-tab="practice">Latihan</button><button class="book-tab" data-tab="summary">Rangkuman</button></div><div class="book-page" id="bookPage"></div><div class="book-controls"><button id="prevStudy">‹</button><span id="bookCounter">1 / 4</span><button id="nextStudy">›</button></div></div><div class="study-coach"><span data-icon="brain"></span><div><b>Metode belajar LearnX</b><p>${studyTemplates.default.tips}</p></div></div></div>`;
    mount();$('#studyBack').onclick=()=>openModule(subject);
    const tabs=[['core','Konsep inti',book.core],['example','Contoh terarah',book.example],['practice','Latihan aktif',book.practice],['summary','Rangkuman',book.summary]];let pos=0;
    const page=$('#bookPage'),counter=$('#bookCounter');
    const render=()=>{const t=tabs[pos];page.innerHTML=`<small>BAB ${String(pos+1).padStart(2,'0')}</small><h2>${t[1]}</h2><p>${t[2]}</p>${pos===2?'<div class="recall-box"><b>Uji ingatan</b><p>Coba jawab dengan suara atau tulisan tanpa membuka bagian sebelumnya.</p><textarea id="studyAnswer" placeholder="Jawabanmu..."></textarea></div>':''}`;counter.textContent=`${pos+1} / ${tabs.length}`;$$('.book-tab').forEach((b,i)=>b.classList.toggle('active',i===pos))};
    $$('.book-tab').forEach((b,i)=>b.onclick=()=>{pos=i;render()});$('#prevStudy').onclick=()=>{pos=(pos+tabs.length-1)%tabs.length;render()};$('#nextStudy').onclick=()=>{pos=(pos+1)%tabs.length;render()};render();
  }

  // Japanese interactive micro-lessons.
  const jp={hiragana:{title:'Hiragana dasar',text:'Mulai dari vokal: あ a · い i · う u · え e · お o. Ucapkan keras-keras, tulis dari ingatan, lalu cek kembali.'},katakana:{title:'Katakana dasar',text:'Vokal: ア a · イ i · ウ u · エ e · オ o. Katakana sering dipakai untuk kata serapan dan nama asing.'},vocab:{title:'Kosakata dasar',text:'こんにちは konnichiwa = halo · ありがとう arigatou = terima kasih · せんせい sensei = guru · がくせい gakusei = siswa.'},conversation:{title:'Percakapan dasar',text:'わたしは ___ です。 Watashi wa ___ desu. = Saya ___. こんにちは。 Konnichiwa. = Halo.'}};
  $$('.lesson-btn').forEach(b=>b.addEventListener('click',()=>{const x=jp[b.dataset.lesson];$('#japanLesson').classList.remove('hidden');$('#japanLesson').innerHTML=`<b>${x.title}</b><p>${x.text}</p><small>Teknik: baca → tutup → ingat → tulis → cek → ulangi.</small>`}));
  const phil={critical:['Berpikir kritis','Tanyakan: apa klaimnya, apa buktinya, apa asumsi tersembunyinya, dan apakah ada penjelasan alternatif?'],persuasion:['Persuasi etis','Sampaikan alasan dan bukti dengan jujur. Jangan menyamarkan niat, memaksa, menipu, atau mengeksploitasi kelemahan orang.'],defense:['Deteksi manipulasi','Kenali pola tekanan seperti rasa bersalah yang dipaksakan, ancaman, isolasi, tekanan waktu, gaslighting, atau klaim “semua orang bilang begitu”. Berhenti, beri jarak, cek fakta, dan cari bantuan tepercaya bila perlu.'],philosophy:['Filsafat dasar','Socrates menekankan pemeriksaan diri dan pertanyaan; Plato membahas pengetahuan dan bentuk; Aristoteles mengembangkan logika dan etika kebajikan.']};
  $$('.lesson-card [data-phil]').forEach(b=>b.addEventListener('click',()=>{const x=phil[b.dataset.phil];$('#philLesson').classList.remove('hidden');$('#philLesson').innerHTML=`<b>${x[0]}</b><p>${x[1]}</p><small>Latihan: tulis satu contoh dari kehidupan sehari-hari dan jelaskan alasannya.</small>`}));

  // Q&A bank: offline and expandable. It intentionally gives learning-oriented explanations, not a fake claim of unlimited AI.
  const qaBank=[
    [/mitokondria|energi sel/,'IPA','Mitokondria adalah organel yang menghasilkan sebagian besar ATP melalui respirasi sel.'],[/luas segitiga/,'Matematika','Luas segitiga = ½ × alas × tinggi. Pastikan alas dan tinggi tegak lurus.'],[/persamaan kuadrat/,'Matematika','Bentuk umum ax² + bx + c = 0. Salah satu cara mencari akar adalah rumus kuadrat: x = (−b ± √(b²−4ac)) / 2a.'],[/teks lho|laporan hasil observasi/,'Bahasa Indonesia','Teks LHO menyajikan hasil pengamatan secara objektif. Struktur umum: definisi umum/klasifikasi lalu deskripsi bagian dan dapat dilanjutkan deskripsi manfaat.'],[/simple past|past tense/,'Bahasa Inggris','Simple past dipakai untuk kejadian yang sudah selesai di masa lalu. Pola umum: Subject + V2; negatif/interogatif biasanya memakai did + V1.'],[/hiragana|vokal hiragana/,'Bahasa Jepang','Lima vokal hiragana dasar adalah あ(a), い(i), う(u), え(e), お(o).'],[/sila ketiga|persatuan indonesia/,'PKN','Sila ketiga adalah Persatuan Indonesia. Penerapannya antara lain menghargai perbedaan dan menjaga persatuan.'],[/algoritma/,'Informatika','Algoritma adalah urutan langkah logis dan terstruktur untuk menyelesaikan masalah. Pola sederhana: input → proses → output.'],[/fotosintesis/,'IPA','Fotosintesis mengubah energi cahaya menjadi energi kimia; pada tumbuhan, karbon dioksida dan air digunakan untuk membentuk glukosa serta menghasilkan oksigen.'],[/newton|gaya/,'IPA','Hukum II Newton menyatakan resultan gaya berhubungan dengan massa dan percepatan: F = m × a.'],[/pancasila/,'PKN','Pancasila terdiri dari lima sila dan menjadi dasar negara Indonesia. Untuk tugas sekolah, jelaskan makna sila serta contoh penerapannya.'],[/fungsi matematika|f\(x\)/,'Matematika','Fungsi memasangkan setiap anggota domain dengan tepat satu nilai keluaran pada kodomain. Notasi yang umum adalah f(x).'],[/filsafat|socrates|plato|aristoteles/,'Filsafat','Filsafat melatih pertanyaan mendasar tentang pengetahuan, kenyataan, nilai, dan cara bernalar. Gunakan argumen dan bukti, bukan sekadar menerima klaim.']
  ];
  function answerQuestion(q){const s=q.trim();if(!s)return['LearnX','Tulis pertanyaan dulu. Contoh: “Apa fungsi mitokondria?” atau “Jelaskan persamaan kuadrat.”'];const hit=qaBank.find(([re])=>re.test(s.toLowerCase()));if(hit)return[hit[1],hit[2]];return['Belum ada di bank lokal','Pertanyaan ini belum memiliki jawaban khusus di versi offline LearnX. Coba pecah menjadi kata kunci yang lebih spesifik atau tambahkan materi ke bank Q&A.'];}
  $('#qaAsk').addEventListener('click',()=>{const [tag,ans]=answerQuestion($('#qaInput').value);$('#qaAnswer').classList.remove('hidden');$('#qaAnswer').innerHTML=`<small>${tag}</small><p>${ans}</p>`});
  $('#qaInput').addEventListener('keydown',e=>{if((e.ctrlKey||e.metaKey)&&e.key==='Enter')$('#qaAsk').click()});
  $$('.qa-chips button').forEach(b=>b.addEventListener('click',()=>{$('#qaInput').value=b.dataset.q;$('#qaAsk').click()}));

  // IQ / reasoning practice.
  const bank=[['2, 4, 8, 16, …','24|30|32|34',2],['Semua L adalah M dan semua M adalah N. Maka…','Semua L adalah N|Semua N adalah L|Sebagian N adalah L|Tidak ada hubungan',0],['3, 6, 11, 18, 27, …','36|38|40|42',1],['Jika ▲=4 dan ■=7, maka ▲ + ■ × ▲ = …','32|28|44|35',0],['Yang berbeda adalah…','Apel|Mangga|Wortel|Jeruk',2],['A, C, F, J, O, …','T|U|V|W',0],['Jam terlambat 10 menit setiap jam. Setelah 3 jam…','10 menit|20 menit|30 menit|40 menit',2],['5, 10, 20, 40, …','60|70|80|90',2],['4 pekerja selesai 6 hari. 8 pekerja memerlukan…','2 hari|3 hari|4 hari|6 hari',1],['Semua mawar adalah bunga. Kesimpulan pasti…','Semua mawar cepat layu|Sebagian mawar cepat layu|Mawar termasuk bunga|Tidak ada mawar',2],['1, 1, 2, 3, 5, 8, …','11|12|13|14',2],['CAT→DBU. DOG→…','EPH|EOG|DPH|FPI',0],['12, 15, 21, 30, 42, …','54|55|57|60',2],['BUKU : MEMBACA = …','Pensil : Menulis|Kursi : Berlari|Sepatu : Makan|Jam : Tidur',0],['Jika Rabu, 17 hari lagi…','Jumat|Sabtu|Minggu|Senin',0],['9, 18, 36, 72, …','108|126|144|152',2],['3 bola merah + 2 biru. Peluang biru…','1/5|2/5|3/5|1/2',1],['Semua siswa A suka membaca. Rina di A. Maka…','Rina suka membaca|Rina tidak suka membaca|Rina guru|Tidak dapat disimpulkan',0],['4, 7, 13, 25, 49, …','73|85|97|101',2],['2, 5, 10, 17, 26, …','35|36|37|38',2]];
  let iq={set:[],pos:0,score:0,answered:false};const shuffle=a=>{for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a};
  function newIq(){let used=store.get('iqUsed',[]),pool=bank.map((_,i)=>i).filter(i=>!used.includes(i));if(pool.length<10){used=[];pool=bank.map((_,i)=>i)}iq={set:shuffle(pool).slice(0,10),pos:0,score:0,answered:false};store.set('iqUsed',[...used,...iq.set].slice(-bank.length));renderIq()}
  function renderIq(){const q=bank[iq.set[iq.pos]],opts=q[1].split('|').map((t,i)=>({t,i}));shuffle(opts);$('#iqProgress').textContent=`SOAL ${iq.pos+1} / 10`;$('#iqBar').style.width=(iq.pos*10)+'%';$('#iqQuestion').textContent=q[0];const box=$('#iqAnswers');box.innerHTML='';opts.forEach(o=>{const b=document.createElement('button');b.className='answer';b.textContent=o.t;b.onclick=()=>answer(b,o.i,q[2]);box.appendChild(b)});$('#iqResult').classList.add('hidden');iq.answered=false}
  function answer(btn,choice,correct){if(iq.answered)return;iq.answered=true;$$('.answer').forEach(b=>b.disabled=true);if(choice===correct){btn.classList.add('correct');iq.score++}else btn.classList.add('wrong');setTimeout(()=>{if(iq.pos<9){iq.pos++;renderIq()}else{$('#iqBar').style.width='100%';$('#iqResult').classList.remove('hidden');const score=iq.score*10;store.set('bestIq',Math.max(score,store.get('bestIq',0)));$('#iqResult').innerHTML=`<b>Set selesai · ${score}/100</b><br><small>Skor latihan aplikasi; bukan IQ klinis.</small>`;renderProgress()}},420)}
  $('#newIq').addEventListener('click',newIq);newIq();

  const notes=$('#notesArea');notes.value=store.get('notes','');notes.addEventListener('input',()=>{store.set('notes',notes.value);renderProgress()});let time=1500,timerId=null;function timerRender(){const m=String(Math.floor(time/60)).padStart(2,'0'),s=String(time%60).padStart(2,'0');$('#timer').textContent=`${m}:${s}`}timerRender();$('#timerStart').addEventListener('click',()=>{if(timerId){clearInterval(timerId);timerId=null;$('#timerStart').textContent='Mulai'}else{timerId=setInterval(()=>{time=Math.max(0,time-1);timerRender();if(time===0){clearInterval(timerId);timerId=null;$('#timerStart').textContent='Mulai'}},1000);$('#timerStart').textContent='Jeda'}});$('#timerReset').addEventListener('click',()=>{clearInterval(timerId);timerId=null;time=1500;timerRender();$('#timerStart').textContent='Mulai'});

  // Music: lightweight audio engine. Local files use the native player; generated tones keep one AudioContext alive.
  const tracks=[['Night Vector','Ambient'],['Quiet Orbit','Focus'],['Purple Room','Minimal'],['Soft Circuit','Study']];let current=null,audio=$('#audio'),ctx=null,osc=null,gain=null,playing=false,localUrl=null;
  function setIslandPlaying(on){playing=on;musicIsland.classList.toggle('playing',on);$('#musicPlay').textContent=on?'Pause':'Play';$('#trackState').textContent=on?($('#audio').src?'File perangkat':'Ambient lokal'):'Siap diputar'}
  async function ensureCtx(){if(!ctx)ctx=new(window.AudioContext||window.webkitAudioContext)();if(ctx.state==='suspended')await ctx.resume();}
  function stopTone(){try{osc?.stop()}catch{}osc=null;if(gain){try{gain.disconnect()}catch{}}gain=null}
  async function playTone(name){audio.pause();audio.removeAttribute('src');stopTone();await ensureCtx();gain=ctx.createGain();gain.gain.value=.022;gain.connect(ctx.destination);osc=ctx.createOscillator();osc.type='sine';osc.frequency.value=name==='Night Vector'?174:name==='Quiet Orbit'?196:name==='Purple Room'?220:147;osc.connect(gain);osc.start();current=name;$('#trackName').textContent=name;$('#trackState').textContent='Ambient lokal';setIslandPlaying(true)}
  function pauseCurrent(){if(audio.src){audio.pause()}else{stopTone();setIslandPlaying(false)}}
  function resumeCurrent(){if(audio.src){audio.play().then(()=>setIslandPlaying(true)).catch(()=>{})}else if(current){playTone(current)}else{playTone(tracks[0][0])}}
  function renderMusic(q=''){const list=$('#musicList'),safe=q.trim();list.innerHTML=tracks.filter(t=>t[0].toLowerCase().includes(safe.toLowerCase())).map(t=>`<div class="track"><div><b>${t[0]}</b><small>${t[1]}</small></div><button data-track="${t[0]}">Pilih</button></div>`).join('')+`<div class="web-search"><button data-web="youtube">Cari “${safe||'musik'}”</button><button data-web="soundcloud">SoundCloud</button></div>`}
  renderMusic();$('#musicToggle').addEventListener('click',()=>$('#musicPanel').classList.toggle('hidden'));$('#musicSearch').addEventListener('input',e=>renderMusic(e.target.value));
  $('#musicList').addEventListener('click',e=>{const b=e.target.closest('[data-track]');if(b){playTone(b.dataset.track);return}const web=e.target.closest('[data-web]');if(web){const q=encodeURIComponent($('#musicSearch').value.trim()||'study music');window.open(web.dataset.web==='youtube'?`https://www.youtube.com/results?search_query=${q}`:`https://soundcloud.com/search?q=${q}`,'_blank','noopener,noreferrer')}});
  $('#musicPlay').addEventListener('click',()=>playing?pauseCurrent():resumeCurrent());
  audio.addEventListener('play',()=>setIslandPlaying(true));audio.addEventListener('pause',()=>{if(audio.src)setIslandPlaying(false)});audio.addEventListener('ended',()=>setIslandPlaying(false));
  $('#musicFile').addEventListener('change',e=>{const f=e.target.files?.[0];if(!f)return;stopTone();audio.pause();if(localUrl)URL.revokeObjectURL(localUrl);localUrl=URL.createObjectURL(f);audio.src=localUrl;audio.loop=true;current=null;$('#trackName').textContent=f.name;$('#trackState').textContent='File perangkat';audio.play().then(()=>setIslandPlaying(true)).catch(()=>{setIslandPlaying(false);$('#trackState').textContent='Tekan Play untuk memulai'})});
  document.addEventListener('visibilitychange',()=>{if(document.hidden){if(audio.src)audio.pause();else if(playing){stopTone();setIslandPlaying(false)}}});

  function renderProgress(){$('#sessionCount').textContent=store.get('sessions',0);const b=store.get('bestIq',null);$('#bestIq').textContent=b===null?'—':b;$('#noteCount').textContent=(notes.value||'').length}
  renderProgress();mount();
})();
