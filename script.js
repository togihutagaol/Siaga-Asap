const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const load=(k,d)=>{try{return JSON.parse(localStorage.getItem(k))??d}catch{return d}};
const save=(k,v)=>{try{localStorage.setItem(k,JSON.stringify(v))}catch{}};
function toast(m,c){const t=document.createElement('div');t.className='toast';if(c)t.style.borderLeftColor=c;t.textContent=m;$('#toasts').append(t);setTimeout(()=>{t.classList.add('out');setTimeout(()=>t.remove(),350)},3800)}

/* DATA CONTOH (bukan data resmi) */
const CITY={Palembang:[162,89,120],Pekanbaru:[178,104,141],Jambi:[121,62,95],Pontianak:[205,128,170],'Palangka Raya':[96,34,58],Banjarmasin:[74,24,45],Medan:[58,18,40]};
const LV=[[50,'Baik','#12a08a','😊'],[100,'Sedang','#c9a100','🙂'],[150,'Tidak sehat bagi kelompok sensitif','#f08a1c','😷'],[200,'Tidak sehat','#f26a2e','😷'],[300,'Sangat tidak sehat','#c8344b','🤢'],[999,'Berbahaya','#7a1f5c','☠️']];
const ADV={
 0:['Udara baik. Tetap beraktivitas seperti biasa.','Tetap pantau kualitas udara secara berkala.'],
 1:['Aktivitas luar masih aman untuk sebagian besar orang.','Kelompok sangat sensitif sebaiknya memantau gejala.'],
 2:['Anak, lansia, dan penderita asma kurangi aktivitas berat di luar.','Siapkan masker yang sesuai.'],
 3:['Gunakan masker, hindari aktivitas berat di luar ruangan.','Perbanyak minum air putih.','Tutup jendela bila asap masuk.'],
 4:['Hindari aktivitas di luar ruangan.','Gunakan masker yang sesuai bila harus keluar.','Ikuti informasi resmi dan catat gejalamu.'],
 5:['Tetap di dalam ruangan dengan jendela tertutup.','Ikuti arahan pihak berwenang.','Segera cari bantuan medis bila sesak napas.']};
const lvl=a=>LV.findIndex(l=>a<=l[0]);

/* navigasi */
const VIEWS=['beranda','edukasi','gejala','faskes'];
function show(){const v=VIEWS.includes(location.hash.slice(1))?location.hash.slice(1):'beranda';
 $$('.view').forEach(s=>s.classList.toggle('active',s.id==='v-'+v));
 $$('[data-v]').forEach(a=>a.classList.toggle('on',a.dataset.v===v));scrollTo({top:0,behavior:'smooth'})}
addEventListener('hashchange',show);

/* beranda */
$('#city').innerHTML=Object.keys(CITY).map(c=>`<option>${c}</option>`).join('');
$('#city').value=load('sa_city','Palembang');
let jit=0;
function count(el,to){const f=+el.textContent||0,t0=performance.now();(function s(t){const p=Math.min((t-t0)/1100,1);el.textContent=Math.round(f+(to-f)*(1-Math.pow(1-p,3)));if(p<1)requestAnimationFrame(s)})(t0)}
function render(){
 const city=$('#city').value,[a0,p25,p10]=CITY[city],k=1+jit,aqi=Math.max(10,Math.round(a0*k)),l=lvl(aqi),[,name,col,emo]=LV[l];
 $('#cName').textContent=city+', Indonesia';$('#aqiCard').style.setProperty('--c',col);document.documentElement.style.setProperty('--c',col);
 $('#aqiS').textContent=emo+' '+name;count($('#aqiN'),aqi);
 $('#arc').style.strokeDashoffset=314.2*(1-Math.min(aqi,300)/300);
 const m25=Math.round(p25*k),m10=Math.round(p10*k);
 $('#p25').innerHTML=m25+' <small>µg/m³</small>';$('#p10').innerHTML=m10+' <small>µg/m³</small>';
 $('#b25').style.width=Math.min(m25/150*100,100)+'%';$('#b10').style.width=Math.min(m10/250*100,100)+'%';
 $('#trend').innerHTML=Array.from({length:12},(_,i)=>{const v=aqi*(.8+.2*Math.sin(i*1.1+city.length)+(i/11)*.12);return `<i style="height:${Math.max(8,Math.min(v/aqi*60,100))}%" title="${Math.round(v)} AQI"></i>`}).join('');
 $('#adv').innerHTML=ADV[l].map((t,i)=>`<li style="animation-delay:${i*.08}s"><span>✅</span>${t}</li>`).join('');
 $('#upd').textContent=new Date().toLocaleString('id-ID',{day:'numeric',month:'short',year:'numeric',hour:'2-digit',minute:'2-digit'});
 const w=$('#warn');if(aqi>=150){w.hidden=false;w.innerHTML=`🔔 <b>Peringatan:</b> udara di ${city} berisiko bagi kesehatan (pesan demonstrasi). <a href="#edukasi">Baca panduan</a>`}else w.hidden=true;
 if(!$('#area').dataset.u)$('#area').value=city;drawFas()}
$('#city').onchange=()=>{save('sa_city',$('#city').value);jit=0;$('#area').dataset.u='';render();toast('Wilayah diganti. Data masih contoh.')};
$('#refresh').onclick=()=>{jit=(Math.random()-.5)*.2;render();toast('Data contoh disegarkan (bukan data real-time).')};
$('#rem').checked=load('sa_rem',false);
$('#rem').onchange=e=>{save('sa_rem',e.target.checked);toast(e.target.checked?'Pengingat aktif (simulasi, belum mengirim notifikasi).':'Pengingat dimatikan.')};

/* edukasi */
const EDU=[
 ['cegah','😷','Pentingnya masker yang tepat','Jenis masker dan cara memakainya.','Masker kain biasa kurang efektif menahan partikel halus. Pilih masker N95/KN95 dan pastikan menutup hidung dan mulut tanpa celah.'],
 ['cegah','🏠','Jaga udara dalam ruangan','Kurangi asap yang masuk ke rumah.','Tutup pintu dan jendela saat asap pekat, hindari membakar sampah atau obat nyamuk bakar, dan gunakan pembersih udara bila ada.'],
 ['cegah','🚸','Lindungi anak dan lansia','Kelompok yang paling rentan.','Batasi main di luar, pantau batuk atau sesak, dan bawa ke fasilitas kesehatan bila keluhan berat.'],
 ['tips','🥗','Makanan baik untuk paru-paru','Nutrisi untuk menjaga kesehatan pernapasan.','Perbanyak buah dan sayur berwarna, cukupi air putih, dan hindari merokok karena memperburuk iritasi saluran napas.'],
 ['tips','🌬️','Apa yang dilakukan saat udara buruk?','Langkah-langkah aman di rumah.','Istirahat cukup, minum air, hindari olahraga berat di luar, dan pantau kualitas udara secara berkala.'],
 ['tips','🚨','Kapan harus ke fasilitas kesehatan','Kenali gejala yang perlu perhatian.','Segera cari bantuan bila sesak napas, nyeri dada, batuk berat, atau gejala memburuk setelah beristirahat.'],
 ['k3','👷','Panduan K3 (pengembangan lanjutan)','Tips keselamatan untuk pekerja area berisiko.','Fitur ini belum tersedia di versi awal dan direncanakan pada tahap pengembangan berikutnya.']];
const EC=[['all','Semua'],['cegah','Pencegahan'],['tips','Tips'],['k3','K3']];let ef='all';
$('#eduC').innerHTML=EC.map(([k,n])=>`<button class="chip${k==='all'?' on':''}" data-k="${k}">${n}</button>`).join('');
function drawEdu(){const q=$('#q').value.toLowerCase();const l=EDU.filter(e=>(ef==='all'||e[0]===ef)&&(e[2]+e[3]+e[4]).toLowerCase().includes(q));
 $('#edu').innerHTML=l.length?l.map((e,i)=>`<div class="ec${e[0]==='k3'?' soon':''}" tabindex="0" style="animation-delay:${i*.05}s"><span class="ic">${e[1]}</span><small>${EC.find(c=>c[0]===e[0])[1]}</small><h3>${e[2]}</h3><p>${e[3]}</p><div class="more">${e[4]}</div></div>`).join(''):'<div class="empty">Tidak ada panduan yang cocok.</div>'}
$('#eduC').onclick=e=>{const b=e.target.closest('.chip');if(!b)return;ef=b.dataset.k;$$('#eduC .chip').forEach(c=>c.classList.toggle('on',c===b));drawEdu()};
$('#q').oninput=drawEdu;
$('#edu').onclick=e=>e.target.closest('.ec')?.classList.toggle('open');
$('#edu').onkeydown=e=>{if(e.key==='Enter'){e.target.click()}};

/* gejala */
const SY=[['Batuk','🤧'],['Pilek','🤒'],['Mata perih / berair','👁️'],['Tenggorokan gatal / iritasi','🗣️'],['Sesak napas','🫁','warn'],['Sakit kepala','🤕'],['Lainnya','➕']];
$('#sym').innerHTML=SY.map(s=>`<label class="sy ${s[2]||''}"><input type="checkbox" value="${s[0]}">${s[1]} ${s[0]}</label>`).join('');
$('#gd').value=new Date().toISOString().slice(0,10);
let hist=load('sa_hist',[]);
const chk=()=>$$('#sym input:checked').map(i=>i.value);
$('#sym').onchange=()=>{const c=chk();$('#other').hidden=!c.includes('Lainnya');$('#sos2').hidden=!c.includes('Sesak napas')};
$('#gForm').onsubmit=e=>{e.preventDefault();const s=chk(),o=$('#other').value.trim();
 if(!s.length)return toast('Pilih minimal satu keluhan.','#e5383b');
 hist.unshift({id:Date.now(),d:$('#gd').value,s:s.map(x=>x==='Lainnya'&&o?'Lainnya: '+o:x),n:$('#gn').value.trim()});save('sa_hist',hist);
 const sos=s.includes('Sesak napas');e.target.reset();$('#gd').value=new Date().toISOString().slice(0,10);$('#other').hidden=true;$('#sos2').hidden=!sos;drawHist();
 toast(sos?'Tersimpan. Sesak napas butuh perhatian medis segera.':'Catatan disimpan di perangkat ini.',sos?'#e5383b':'')};
function drawHist(){
 const cnt={};hist.forEach(h=>h.s.forEach(x=>{x=x.split(':')[0];cnt[x]=(cnt[x]||0)+1}));
 $('#sum').innerHTML=Object.entries(cnt).sort((a,b)=>b[1]-a[1]).map(([k,v])=>`<span>${k} ×${v}</span>`).join('');
 $('#hist').innerHTML=hist.length?hist.map(h=>`<li class="${h.s.includes('Sesak napas')?'bad':''}"><b>${new Date(h.d+'T00:00').toLocaleDateString('id-ID',{weekday:'long',day:'numeric',month:'long',year:'numeric'})}</b><small>${h.s.map(esc).join(', ')}</small>${h.n?`<p>${esc(h.n)}</p>`:''}<button data-id="${h.id}" aria-label="Hapus">🗑️</button></li>`).join(''):'<div class="empty">Belum ada catatan. Simpan gejala pertamamu.</div>'}
$('#hist').onclick=e=>{const b=e.target.closest('button');if(!b)return;hist=hist.filter(h=>h.id!=b.dataset.id);save('sa_hist',hist);drawHist()};
$('#clr').onclick=()=>{if(hist.length&&confirm('Hapus semua catatan gejala?')){hist=[];save('sa_hist',hist);drawHist();toast('Semua catatan dihapus.')}};

/* faskes (contoh) */
const FAS=[['Puskesmas Sukarami','Puskesmas','Jl. Sukarami No. 12','Buka hingga 22.00','Palembang'],['RS Siloam Sriwijaya','RS','Jl. Demang Lebar Daun','Buka 24 jam','Palembang'],['Klinik Sehat Sejahtera','Klinik','Jl. Angkatan 45','Buka hingga 21.00','Palembang']];
const IC={Puskesmas:'🏥',RS:'🚑',Klinik:'🩺'};let ff='Semua';
$('#fC').innerHTML=['Semua','Puskesmas','RS','Klinik'].map(k=>`<button class="chip${k==='Semua'?' on':''}">${k}</button>`).join('');
function drawFas(){const a=$('#area').value.trim().toLowerCase();
 const l=FAS.filter(f=>(ff==='Semua'||f[1]===ff)&&(!a||(f[0]+f[2]+f[4]).toLowerCase().includes(a)));
 $('#fas').innerHTML=l.length?l.map((f,i)=>`<div class="fc" style="animation-delay:${i*.07}s"><div class="fi">${IC[f[1]]}</div><div><b>${f[0]}</b><small>${f[2]}, ${f[4]} · ${f[3]}</small></div><span class="tg">${f[1]} · contoh</span></div>`).join(''):`<div class="empty">Belum ada data contoh untuk wilayah ini. Gunakan tombol Google Maps di bawah untuk mencari fasilitas resmi.</div>`;
 $('#maps').href='https://www.google.com/maps/search/'+encodeURIComponent((ff==='Semua'?'puskesmas rumah sakit':ff)+' '+($('#area').value||$('#city').value))}
$('#fC').onclick=e=>{const b=e.target.closest('.chip');if(!b)return;ff=b.textContent;$$('#fC .chip').forEach(c=>c.classList.toggle('on',c===b));drawFas()};
$('#area').oninput=e=>{e.target.dataset.u=1;drawFas()};

render();drawEdu();drawHist();show();