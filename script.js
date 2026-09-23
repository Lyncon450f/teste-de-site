const matches=[
 {home:"Flamengo",away:"Palmeiras",hb:"🔴",ab:"🟢",time:"16:00",odds:["1.85","3.40","4.10"]},
 {home:"Santos",away:"Grêmio",hb:"⚪",ab:"🔵",time:"18:30",odds:["2.10","3.20","2.80"]},
 {home:"Corinthians",away:"São Paulo",hb:"⚫",ab:"⚪",time:"21:00",odds:["2.35","3.10","2.65"]},
 {home:"Bahia",away:"Cruzeiro",hb:"🔵",ab:"🔷",time:"19:00",odds:["2.25","3.15","2.90"]},
 {home:"Fluminense",away:"Botafogo",hb:"🟢",ab:"⚫",time:"20:30",odds:["2.05","3.30","3.05"]},
 {home:"Atlético-MG",away:"Internacional",hb:"⚫",ab:"🔴",time:"21:00",odds:["1.95","3.35","3.55"]}
];
let current=0,score=0,history=[],notes=JSON.parse(localStorage.getItem("brbet_notes")||"[]");
const $=id=>document.getElementById(id);
function renderMatch(){
 const m=matches[current],pct=((current+1)/matches.length)*100;
 $("roundNumber").textContent=current+1;$("matchNumber").textContent="JOGO "+String(current+1).padStart(2,"0");
 $("progressBar").style.width=pct+"%";$("matchTime").textContent="Hoje • "+m.time;$("matchClock").textContent=m.time;
 $("homeTeam").textContent=m.home;$("awayTeam").textContent=m.away;$("homeBadge").textContent=m.hb;$("awayBadge").textContent=m.ab;
 $("homeOdd").textContent=m.odds[0];$("drawOdd").textContent=m.odds[1];$("awayOdd").textContent=m.odds[2];
 document.querySelector("[data-pick=home] strong").textContent=m.home;document.querySelector("[data-pick=away] strong").textContent=m.away;
}
function addNote(title,msg){notes.unshift({title,msg});notes=notes.slice(0,8);localStorage.setItem("brbet_notes",JSON.stringify(notes));renderNotes();toast(title,msg)}
function renderNotes(){$("notificationCount").textContent=notes.length;$("notificationCount").classList.toggle("show",notes.length>0);$("notificationsList").innerHTML=notes.length?notes.map(n=>`<div class="notification"><strong>${safe(n.title)}</strong><p>${safe(n.msg)}</p></div>`).join(""):"<div class='notification'>Tudo certo por aqui.</div>"}
function safe(v){return String(v).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[c]))}
function toast(title,msg){const t=document.createElement("div");t.className="toast";t.innerHTML=`<strong>${safe(title)}</strong><p>${safe(msg)}</p>`;$("toastContainer").appendChild(t);setTimeout(()=>t.remove(),2800)}
function renderHistory(){if(!history.length){$("history").className="history-empty";$("history").textContent="Você ainda não fez nenhum palpite.";return}$("history").className="history-list";$("history").innerHTML=history.map((h,i)=>`<div class="history-item"><span>Jogo ${i+1}: ${safe(h.game)}</span><b>${safe(h.pick)}</b></div>`).join("")}
function makePick(type){
 const m=matches[current],pick=type==="home"?m.home:type==="away"?m.away:"Empate",odd=m.odds[type==="home"?0:type==="draw"?1:2];
 history.push({game:m.home+" x "+m.away,pick:pick+" • "+odd});score++;
 $("score").textContent=score;renderHistory();addNote("Palpite registrado",m.home+" x "+m.away+" → "+pick);
 current=(current+1)%matches.length;
 setTimeout(()=>{renderMatch();window.scrollTo({top:$("palpite").offsetTop-80,behavior:"smooth"});toast("Próximo jogo",matches[current].home+" x "+matches[current].away)},350);
}
document.addEventListener("DOMContentLoaded",()=>{
 renderMatch();renderHistory();renderNotes();
 document.querySelectorAll(".choice").forEach(b=>b.addEventListener("click",()=>makePick(b.dataset.pick)));
 $("notificationButton").addEventListener("click",e=>{$("notificationPanel").classList.toggle("open");e.stopPropagation()});
 $("clearNotifications").addEventListener("click",()=>{notes=[];localStorage.removeItem("brbet_notes");renderNotes()});
 document.addEventListener("click",e=>{if(!e.target.closest(".notifications")&&!e.target.closest("#notificationButton"))$("notificationPanel").classList.remove("open")});
});