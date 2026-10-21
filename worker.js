const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
  "Cache-Control": "no-store"
};
const json = (data, status=200) => new Response(JSON.stringify(data), { status, headers: { ...corsHeaders, "Content-Type": "application/json; charset=utf-8" } });
const enc = new TextEncoder();
const SEED_LINKS = [{"id":"apk-contoh-001","name":"CIKA V2I","url":"https://www.mediafire.com/file/cgcp1y3zxj5oi9k/CIKA_STORE_V2.apk/file","note":"Isi keterangan atau versi APK di sini","createdAt":1792540800000}];
function b64url(bytes) { let s = btoa(String.fromCharCode(...new Uint8Array(bytes))); return s.replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,''); }
function unb64url(s) { s=s.replace(/-/g,'+').replace(/_/g,'/'); while(s.length%4)s+='='; return Uint8Array.from(atob(s), c=>c.charCodeAt(0)); }
async function sign(secret, text) { const key=await crypto.subtle.importKey('raw', enc.encode(secret), {name:'HMAC',hash:'SHA-256'}, false, ['sign']); return b64url(await crypto.subtle.sign('HMAC',key,enc.encode(text))); }
async function issueToken(secret) { const payload=b64url(enc.encode(JSON.stringify({ exp: Date.now()+8*60*60*1000 }))); return payload+'.'+await sign(secret,payload); }
async function validToken(request, secret) { const h=request.headers.get('Authorization')||''; if(!h.startsWith('Bearer '))return false; const t=h.slice(7).split('.'); if(t.length!==2)return false; if(await sign(secret,t[0])!==t[1])return false; try{return JSON.parse(new TextDecoder().decode(unb64url(t[0]))).exp>Date.now()}catch{return false} }
export default {
 async fetch(request, env) {
  if(request.method==='OPTIONS') return new Response(null,{status:204,headers:corsHeaders});
  const url=new URL(request.url); const path=url.pathname.replace(/\/$/,'')||'/';
  if(!env.ADMIN_PASSWORD || !env.LINKS_KV) return json({error:'Worker setup belum lengkap. Atur ADMIN_PASSWORD dan binding LINKS_KV.'},500);
  if(path==='/api/login' && request.method==='POST') {
   let body; try{body=await request.json()}catch{return json({error:'JSON tidak valid'},400)}
   if(typeof body.password!=='string' || body.password!==env.ADMIN_PASSWORD) return json({error:'Password admin salah.'},401);
   return json({token:await issueToken(env.ADMIN_PASSWORD)});
  }
  if(path==='/api/links' && request.method==='GET') {
   let raw=await env.LINKS_KV.get('links'); let links=SEED_LINKS; try{if(raw!==null)links=JSON.parse(raw)}catch{}
   return json({links:Array.isArray(links)?links:[]});
  }
  if(path==='/api/links' && request.method==='PUT') {
   if(!await validToken(request,env.ADMIN_PASSWORD)) return json({error:'Sesi admin habis atau tidak valid. Login ulang.'},401);
   let body; try{body=await request.json()}catch{return json({error:'JSON tidak valid'},400)}
   if(!Array.isArray(body.links) || body.links.length>5000) return json({error:'Format daftar link tidak valid.'},400);
   const clean=[];
   for(const l of body.links){ if(!l||typeof l.name!=='string'||typeof l.url!=='string')continue; let u; try{u=new URL(l.url)}catch{continue}; if(!['mediafire.com','www.mediafire.com','mfi.re'].includes(u.hostname.toLowerCase())&&!u.hostname.toLowerCase().endsWith('.mediafire.com'))continue; clean.push({id:String(l.id||crypto.randomUUID()),name:l.name.slice(0,120),url:u.href,note:String(l.note||'').slice(0,500),createdAt:Number(l.createdAt)||Date.now()}); }
   await env.LINKS_KV.put('links',JSON.stringify(clean)); return json({ok:true,links:clean});
  }
  return json({error:'Not found'},404);
 }
};
