const firebaseConfig = {
  apiKey:"AIzaSyAtwEjmP_CIcIlb6jHHucHfMa2Nr5elWMw",
  authDomain: "crownnailsvale.firebaseapp.com",
  databaseURL: "https://crownnailsvale-default-rtdb.firebaseio.com",
  projectId: "crownnailsvale",
  storageBucket: "crownnailsvale.firebasestorage.app",
  messagingSenderId: "555865537429",
  appId: "1:555865537429:web:cba1159621bb31f9d6149c",
  measurementId: "G-Z3440R9V2J"
};
// 👇 CUANDO TE PASEN EL CORREO DE LA DUEÑA, CAMBIÁS SOLO ESTA LÍNEA
const MI_CORREO = "breteweb0@gmail.com";
firebase.initializeApp(firebaseConfig);
const db = firebase.database();
const auth = firebase.auth();
let servicios={}, fotos={}, citas={}, resenasList={};
function loginGoogle(){ const p = new firebase.auth.GoogleAuthProvider(); auth.signInWithRedirect(p); }
function salirGoogle(){ auth.signOut(); location.reload(); }
auth.getRedirectResult().then(r=>{ if(r.user) revisarAcceso(r.user); });
auth.onAuthStateChanged(u=>{ if(u) revisarAcceso(u); });
function revisarAcceso(user){
  document.getElementById('quienSoy').innerText = 'Conectada como: ' + user.email;
  if(user.email === MI_CORREO){ document.getElementById('adminPanel').style.display='block'; document.getElementById('btnLogin').innerText='✅ Ya estás dentro'; }
  else document.getElementById('quienSoy').innerText += ' - ❌ Este correo no tiene permiso. Solo la dueña.';
}
db.ref('servicios').on('value', s=>{servicios=s.val()||{}; mostrarAdmin();});
db.ref('fotos').on('value', s=>{fotos=s.val()||{}; mostrarAdmin();});
db.ref('citas').on('value', s=>{citas=s.val()||{}; mostrarAdmin();});
db.ref('resenas').on('value', s=>{resenasList=s.val()||{}; mostrarAdmin();});
function mostrarAdmin(){
  document.getElementById('stats').innerText=`${Object.keys(servicios).length} servicios | ${Object.keys(fotos).length} diseños | ${Object.keys(citas).length} citas | ${Object.keys(resenasList).length} reseñas | Pendientes: ${Object.values(citas).filter(c=>c.estado==='Pendiente').length}`;
  let selEdit='', selBorrar=''; for(let k in servicios){ selEdit+=`<option value="${k}">${servicios[k].nombre} - ₡${servicios[k].precio}</option>`; selBorrar+=`<option value="${k}">${servicios[k].nombre}</option>`; }
  document.getElementById('servicioEditar').innerHTML=selEdit; document.getElementById('servicioBorrar').innerHTML=selBorrar;
  let h=''; for(let k in citas){let c=citas[k]; h+=`<div class="tabla"><b>${c.nombre}</b> - ${c.tel} - ${c.serv} - ${c.fecha} ${c.hora} - ${c.nota||''} - <b>${c.estado}</b> <br><button onclick="cambiarCita('${k}','Aceptada')">✅ Aceptar</button> <button onclick="cambiarCita('${k}','Rechazada')">❌ Rechazar</button> <button onclick="borrarCita('${k}')">🗑️</button></div>`;}
  document.getElementById('adminCitas').innerHTML=h||'Sin citas';
  let hf=''; for(let k in fotos){let f=fotos[k]; hf+=`<div class="tabla"><img src="${f.img}" style="width:60px;height:60px;object-fit:cover;border-radius:8px"> ${f.nom} - ${f.cat} <button onclick="borrarFoto('${k}')">🗑️ Eliminar</button></div>`;}
  document.getElementById('adminFotos').innerHTML=hf;
  let hr=''; for(let k in resenasList){let r=resenasList[k]; hr+=`<div class="tabla">${r.n} ${r.e} - ${r.t} <button onclick="borrarResena('${k}')">🗑️</button></div>`;}
  document.getElementById('adminResenas').innerHTML=hr;
}
function cambiarCita(k,e){db.ref('citas/'+k+'/estado').set(e);}
function borrarCita(k){if(confirm('¿Borrar cita?')) db.ref('citas/'+k).remove();}
function borrarFoto(k){if(confirm('¿Borrar foto?')) db.ref('fotos/'+k).remove();}
function borrarResena(k){db.ref('resenas/'+k).remove();}
function agregarServicio(){let n=document.getElementById('nuevoServNombre').value; let p=parseInt(document.getElementById('nuevoServPrecio').value); if(!n||!p) return alert('Poné nombre y precio'); db.ref('servicios').push({nombre:n,precio:p}); alert('✅ Publicado para todos');}
function cambiarPrecio(){let k=document.getElementById('servicioEditar').value; let p=parseInt(document.getElementById('nuevoPrecioEditar').value); if(!p) return alert('Poné el nuevo precio'); db.ref('servicios/'+k+'/precio').set(p); alert('💲 ¡Precio cambiado para TODAS!');}
function borrarServicio(){let k=document.getElementById('servicioBorrar').value; if(confirm('¿Borrar este servicio?')) db.ref('servicios/'+k).remove();}
function guardarPromo(){let t=document.getElementById('nuevaPromo').value; if(!t) return; db.ref('promo').set({texto:'🎉 '+t}); alert('✅ Promo publicada');}
function agregarFoto(){let u=document.getElementById('urlFoto').value||'https://images.unsplash.com/photo-1604654894610-df63bc536371?w=500'; db.ref('fotos').push({img:u,cat:document.getElementById('catFoto').value,tipo:document.getElementById('tipoFoto').value,nom:'Nuevo diseño'}); alert('✅ Foto agregada');}