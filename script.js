const matches=[
{home:"Flamengo",away:"Palmeiras",hb:"🔴",ab:"🟢",time:"16:00",odds:[1.85,3.40,4.10]},
{home:"Santos",away:"Grêmio",hb:"⚪",ab:"🔵",time:"18:30",odds:[2.10,3.20,2.80]},
{home:"Corinthians",away:"São Paulo",hb:"⚫",ab:"⚪",time:"21:00",odds:[2.35,3.10,2.65]},
{home:"Bahia",away:"Cruzeiro",hb:"🔵",ab:"🔷",time:"19:00",odds:[2.25,3.15,2.90]},
{home:"Fluminense",away:"Botafogo",hb:"🟢",ab:"⚫",time:"20:30",odds:[2.05,3.30,3.05]},
{home:"Atlético-MG",away:"Internacional",hb:"⚫",ab:"🔴",time:"21:00",odds:[1.95,3.35,3.55]}
];

let current=0,balance=100,history=[],selected=null,notes=[];
const $=id=>document.getElementById(id);
const money=v=>"R$ "+Number(v).toFixed(2).replace(".",",");

function probabilities(match){
  const raw=match.odds.map(o=>1/o),sum=raw.reduce((a,b)=>a+b,0);
  return raw.map(v=>Math.round(v/sum*100));
}
function safe(v){return String(v).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[c]));}

function updateBalance(){
  if($("balance"))$("balance").textContent=money(balance);
  if($("heroBalance"))$("heroBalance").textContent=balance.toFixed(2).replace(".",",");
  if($("miniBalance"))$("miniBalance").textContent=money(balance);
}

function renderMatch(){
  const m=matches[current],p=probabilities(m);
  $("roundNumber").textContent=current+1;
  $("matchRound").textContent=current+1;
  $("matchNumber").textContent="JOGO "+String(current+1).padStart(2,"0");
  $("progressBar").style.width=((current+1)/matches.length*100)+"%";
  $("matchTime").textContent="Hoje • "+m.time;
  $("matchClock").textContent=m.time;
  $("homeTeam").textContent=m.home;
  $("awayTeam").textContent=m.away;
  $("homeChoice").textContent=m.home;
  $("awayChoice").textContent=m.away;
  $("homeBadge").textContent=m.hb;
  $("awayBadge").textContent=m.ab;
  ["home","draw","away"].forEach((x,i)=>{
    $(x+"Odd").textContent=m.odds[i].toFixed(2);
    $(x+"Chance").textContent="Chance "+p[i]+"%";
    if($(x+"ChanceBar"))$(x+"ChanceBar").style.width=p[i]+"%";
  });
  selected=null;
  document.querySelectorAll(".choice").forEach(b=>b.classList.remove("selected"));
  document.querySelectorAll(".choice").forEach(b=>b.disabled=false);
  $("stake").max=balance;
  $("stake").value=Math.min(10,Math.max(1,balance));
  updateBet();
}

function updateBet(){
  const stake=Math.min(Math.max(Number($("stake").value)||0,0),balance);
  const m=matches[current];
  $("stake").max=balance;
  const idx=selected==="home"?0:selected==="draw"?1:2;
  const ret=selected?stake*m.odds[idx]:0;
  $("potentialReturn").textContent=money(ret);
  $("potentialProfit").textContent="Lucro possível: "+money(Math.max(0,ret-stake));
  const btn=$("confirmButton");
  if(!selected){
    $("selectionInfo").className="selection-info";
    $("selectionInfo").textContent="Selecione uma opção para conferir a chance estimada.";
    btn.disabled=true;
    btn.textContent="ESCOLHA UM RESULTADO";
    return;
  }
  const p=probabilities(m);
  $("selectionInfo").className="selection-info active";
  $("selectionInfo").innerHTML='Chance estimada de ganhar: <span class="win">'+p[idx]+'%</span> • chance estimada de perder: <span class="lose">'+(100-p[idx])+'%</span>';
  btn.disabled=stake<1||stake>balance;
  btn.textContent=btn.disabled?"VALOR INVÁLIDO":"CONFIRMAR PALPITE • "+money(stake);
}

function addNote(title,msg){
  notes.unshift({title,msg});
  notes=notes.slice(0,8);
  renderNotes();
  showToast(title,msg);
}
function renderNotes(){
  if(!$("notificationCount"))return;
  $("notificationCount").textContent=notes.length;
  $("notificationCount").classList.toggle("show",notes.length>0);
  $("notificationsList").innerHTML=notes.length?notes.map(n=>'<div class="notification"><strong>'+safe(n.title)+'</strong><p>'+safe(n.msg)+'</p></div>').join(""):"<div class='notification'>Tudo certo por aqui.</div>";
}
function showToast(title,msg){
  if(!$("toastContainer"))return;
  const t=document.createElement("div");
  t.className="toast";
  t.innerHTML="<strong>"+safe(title)+"</strong><p>"+safe(msg)+"</p>";
  $("toastContainer").appendChild(t);
  setTimeout(()=>t.remove(),2800);
}
function renderHistory(){
  if(!history.length){
    $("history").className="history-empty";
    $("history").textContent="Você ainda não fez nenhum palpite.";
    return;
  }
  $("history").className="history-list";
  $("history").innerHTML=history.map((h,i)=>'<div class="history-item"><span>Jogo '+(i+1)+': '+safe(h.game)+' • '+money(h.stake)+'</span><b class="'+(h.won?"history-win":"history-loss")+'">'+safe(h.status)+'</b></div>').join("");
}

function showResult(match,pick,actual,stake,odd,won){
  const old=$("resultOverlay");if(old)old.remove();
  const returned=won?stake*odd:0;
  const overlay=document.createElement("div");
  overlay.id="resultOverlay";
  overlay.className="result-overlay";
  overlay.innerHTML='<div class="result-card '+(won?"result-win":"result-loss")+'">'+
    '<div class="result-icon">'+(won?"✓":"×")+'</div>'+
    '<span class="result-label">RESULTADO DO PALPITE</span>'+
    '<h2>'+(won?"VOCÊ GANHOU!":"VOCÊ PERDEU")+'</h2>'+
    '<p class="result-game">'+safe(match.home+" x "+match.away)+'</p>'+
    '<div class="result-lines">'+
      '<div><span>Seu palpite</span><b>'+safe(pick)+'</b></div>'+
      '<div><span>Resultado sorteado</span><b>'+safe(actual)+'</b></div>'+
      '<div><span>Valor apostado</span><b>'+money(stake)+'</b></div>'+
      '<div><span>'+(won?"Retorno":"Perda")+'</span><b class="'+(won?"positive":"negative")+'">'+(won?"+ "+money(returned):"- "+money(stake))+'</b></div>'+
    '</div><button id="nextGameButton" type="button">PRÓXIMO JOGO&nbsp; →</button></div>';
  document.body.appendChild(overlay);
  $("nextGameButton").addEventListener("click",()=>{
    overlay.remove();
    current=(current+1)%matches.length;
    renderMatch();
    $("palpite").scrollIntoView({behavior:"smooth",block:"start"});
    showToast("Próximo jogo",matches[current].home+" x "+matches[current].away);
  });
}

function makePick(){
  const match=matches[current];
  const stake=Math.min(Math.max(Number($("stake").value)||0,0),balance);
  if(!selected||stake<1||stake>balance)return;
  const index=selected==="home"?0:selected==="draw"?1:2;
  const p=probabilities(match);
  const pick=selected==="home"?match.home:selected==="away"?match.away:"Empate";
  const odd=match.odds[index];

  balance-=stake;

  const roll=Math.random()*100;
  let total=0,resultIndex=0;
  for(let i=0;i<p.length;i++){
    total+=p[i];
    if(roll<total){resultIndex=i;break;}
  }
  const actual=resultIndex===0?match.home:resultIndex===1?"Empate":match.away;
  const won=resultIndex===index;
  const returned=won?stake*odd:0;
  if(won)balance+=returned;

  history.push({
    game:match.home+" x "+match.away,
    stake,
    won,
    status:won?"GANHOU":"PERDEU"
  });

  updateBalance();
  renderHistory();
  addNote(won?"Você ganhou!":"Você perdeu",match.home+" x "+match.away+" • Resultado: "+actual);
  document.querySelectorAll(".choice").forEach(b=>b.disabled=true);
  $("confirmButton").disabled=true;

  setTimeout(()=>showResult(match,pick,actual,stake,odd,won),300);
}

document.addEventListener("DOMContentLoaded",()=>{
  renderMatch();
  renderHistory();
  updateBalance();

  document.querySelectorAll(".choice").forEach(button=>{
    button.addEventListener("click",()=>{
      selected=button.dataset.pick;
      document.querySelectorAll(".choice").forEach(b=>b.classList.toggle("selected",b===button));
      updateBet();
    });
  });

  $("stake").addEventListener("input",updateBet);
  document.querySelectorAll("[data-stake]").forEach(button=>{
    button.addEventListener("click",()=>{
      $("stake").value=Math.min(Number(button.dataset.stake),balance);
      updateBet();
    });
  });

  $("confirmButton").addEventListener("click",makePick);

  $("notificationButton").addEventListener("click",e=>{
    e.stopPropagation();
    $("notificationPanel").classList.toggle("open");
  });
  $("clearNotifications").addEventListener("click",()=>{
    notes=[];
    renderNotes();
  });
  document.addEventListener("click",e=>{
    if(!e.target.closest(".notifications")&&!e.target.closest("#notificationButton"))$("notificationPanel").classList.remove("open");
  });
});