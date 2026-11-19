const firebaseConfig = {
  apiKey: "AIzaSyAtwEjmP_CIcI1b6jHHucHfMa2Nr5e1WMw",
  authDomain: "crownnailsvale.firebaseapp.com",
  databaseURL: "https://crownnailsvale-default-rtdb.firebaseio.com",
  projectId: "crownnailsvale",
  storageBucket: "crownnailsvale.firebasestorage.app",
  messagingSenderId: "555865537429",
  appId: "1:555865537429:web:cba1159621bb31f9d6149c",
  measurementId: "G-Z3440R9V2J"
};
const TU_WHATSAPP = "50661559678";
firebase.initializeApp(firebaseConfig);
const db = firebase.database();
let servicios={}, fotos={}, resenasList={}, filtroActual='todos';

db.ref('servicios').once('value', snap=>{
  if(!snap.exists()){
    db.ref('servicios').set({s1:{nombre:'Semipermanente',precio:12000},s2:{nombre:'Acrílicas',precio:18000},s3:{nombre:'Press-On Personalizadas',precio:15000},s4:{nombre:'Manicure + Pedicure',precio:20000}});
    db.ref('fotos').set({f1:{img:'https://images.unsplash.com/photo-1604654894610-df63bc536371?w=500',cat:'acrilicas',tipo:'popular',nom:'Rosa Corona'},f2:{img:'https://images.unsplash.com/photo-1583001931096-959e9a1a6227?w=500',cat:'semi',tipo:'nuevo',nom:'Rojo Elegante'},f3:{img:'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=500',cat:'press',tipo:'popular',nom:'Dorada Glam'},f4:{img:'https://images.unsplash.com/photo-1606806739054-47e2b3e5e6b6?w=500',cat:'semi',tipo:'',nom:'Francesa Clásica'}});
    db.ref('promo').set({texto:'🎉 PROMO DE HOY: 20% en Semipermanente'});
    db.ref('resenas').set({r1:{n:'María',e:'⭐⭐⭐⭐⭐',t:'Me encantaron, las mejores de Cartago!'}});
  }
});
db.ref('servicios').on('value', s=>{servicios=s.val()||{}; mostrarServicios();});
db.ref('fotos').on('value', s=>{fotos=s.val()||{}; mostrarGaleria();});
db.ref('resenas').on('value', s=>{resenasList=s.val()||{}; mostrarResenas();});
db.ref('promo').on('value', s=>{let v=s.val(); if(v) document.getElementById('promoBox').innerText=v.texto;});
function mostrarServicios(){
  let h=''; let sel='';
  for(let k in servicios){let s=servicios[k]; h+=`<div class="card"><h3>${s.nombre}</h3><p class="precio">₡${s.precio.toLocaleString()}</p><button onclick="elegirServicio('${s.nombre}')">Agendar este</button></div>`; sel+=`<option>${s.nombre} - ₡${s.precio.toLocaleString()}</option>`;}
  document.getElementById('listaServicios').innerHTML=h;
  document.getElementById('servicioSelect').innerHTML=sel;
}
function mostrarGaleria(){
  let h=''; for(let k in fotos){let f=fotos[k]; if(filtroActual!='todos' && f.cat!=filtroActual && f.tipo!=filtroActual) continue; h+=`<div class="card"><img src="${f.img}"><b>${f.nom}</b><br><small>${f.cat} ${f.tipo=='popular'?'🔥 Popular':''} ${f.tipo=='nuevo'?'🆕 Nuevo':''}</small><br><button onclick="elegirDiseno('${f.nom}')">Quiero este</button></div>`;}
  document.getElementById('galeria').innerHTML=h||'Sin diseños';
}
function filtrar(c){filtroActual=c; mostrarGaleria();}
function elegirServicio(n){document.getElementById('citas').scrollIntoView(); document.getElementById('msgCita').innerText='Elegiste: '+n;}
function elegirDiseno(n){document.getElementById('nota').value='Quiero el diseño: '+n; document.getElementById('citas').scrollIntoView();}
function enviarCita(){
  let c={nombre:document.getElementById('nombre').value||'Sin nombre',tel:document.getElementById('telefono').value,serv:document.getElementById('servicioSelect').value,fecha:document.getElementById('fecha').value,hora:document.getElementById('hora').value,nota:document.getElementById('nota').value,estado:'Pendiente'};
  if(!c.nombre||!c.tel) return alert('Poné nombre y teléfono');
  db.ref('citas').push(c); document.getElementById('msgCita').innerText='✅ ¡Enviada! Te confirmamos por WhatsApp 👑';
}
function enviarWhats(){
  let n=document.getElementById('nombre').value||'Hola'; let s=document.getElementById('servicioSelect').value; let f=document.getElementById('fecha').value; let h=document.getElementById('hora').value;
  window.open('https://wa.me/'+TU_WHATSAPP+'?text='+encodeURIComponent(`Hola CROWN 👑 Soy ${n}, quiero ${s} el ${f} a las ${h}`),'_blank');
}
function dejarResena(){let r={n:document.getElementById('miNombreR').value||'Clienta',e:document.getElementById('estrellas').value,t:document.getElementById('textoR').value}; if(!r.t) return alert('Escribí tu opinión'); db.ref('resenas').push(r);}
function mostrarResenas(){let h=''; for(let k in resenasList){let r=resenasList[k]; h+=`<div class="resena"><b>${r.n}</b> ${r.e}<br>${r.t}</div>`;} document.getElementById('resenas').innerHTML=h;}