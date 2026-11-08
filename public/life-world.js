// METAVERSE WORLD 5.0 - local prototype life systems
(() => {
  const KEY='metaverse-world-life-v5';
  const defaults={coins:120,house:false,inventory:[],furniture:[],business:false,visits:0};
  let state={...defaults,...JSON.parse(localStorage.getItem(KEY)||'{}')};
  const save=()=>{localStorage.setItem(KEY,JSON.stringify(state));const el=document.querySelector('#coins');if(el)el.textContent=state.coins;};
  const modal=document.querySelector('#modal'),title=document.querySelector('#modalTitle'),body=document.querySelector('#modalBody');
  const toast=(msg)=>{const t=document.querySelector('#toast');if(t){t.textContent=msg;t.classList.add('show');setTimeout(()=>t.classList.remove('show'),2200);}};
  const open=(name,html)=>{title.textContent=name;body.innerHTML=html;modal.classList.add('open');};
  const close=()=>modal.classList.remove('open');
  document.addEventListener('click',e=>{
    const trigger=e.target.closest('[data-life]');if(!trigger)return;e.preventDefault();e.stopImmediatePropagation();
    const kind=trigger.dataset.life;
    if(kind==='home'){
      open('🏠 나의 집과 인테리어',`<p>내 집을 소유하고 가구를 배치하는 생활 시스템입니다. 구매 및 배치 기록은 이 브라우저에 저장됩니다.</p><p>주택 소유: <b>${state.house?'보유 중':'미보유'}</b> · 가구 ${state.furniture.length}개</p>${state.house?'': '<button class="btn" id="buyHouse">작은 집 구매 · 80 코인</button>'}<div class="row"><button class="pill" data-furn="소파">🛋 소파 · 15</button><button class="pill" data-furn="침대">🛏 침대 · 20</button><button class="pill" data-furn="화분">🪴 화분 · 8</button></div><p>${state.furniture.map(x=>'· '+x).join('<br>')||'아직 배치한 가구가 없습니다.'}</p><button class="btn" id="resetFurniture">가구 배치 기록 초기화</button>`);
      const buy=body.querySelector('#buyHouse');if(buy)buy.onclick=()=>{if(state.coins<80)return toast('코인이 부족합니다. 미니게임으로 코인을 모아보세요.');state.coins-=80;state.house=true;save();toast('내 집을 구매했습니다!');close();};
      body.querySelectorAll('[data-furn]').forEach(b=>b.onclick=()=>{const item=b.dataset.furn,price=item==='소파'?15:item==='침대'?20:8;if(!state.house)return toast('먼저 집을 구매하세요.');if(state.coins<price)return toast('코인이 부족합니다.');state.coins-=price;state.furniture.push(item);save();toast(item+'를 인테리어 목록에 추가했습니다.');open('🏠 나의 집과 인테리어',`<p>가구 보유: ${state.furniture.join(', ')}</p><p>가구 배치 기록이 저장되었습니다. 실제 3D 배치 편집은 후속 구현 대상입니다.</p>`);});
      const reset=body.querySelector('#resetFurniture');if(reset)reset.onclick=()=>{state.furniture=[];save();toast('가구 목록을 초기화했습니다.');close();};
    } else if(kind==='inventory'){
      open('🎒 소지품 / 창고',`<p>보유 코인: <b>${state.coins}</b></p><p>구매한 아이템</p><p>${state.inventory.map(x=>'• '+x).join('<br>')||'보유 아이템이 없습니다.'}</p><p class="tag">브라우저 로컬 저장</p>`);
    } else if(kind==='business'){
      open('🏪 나의 상점 운영',`<p>가상 상점을 개설해 월드 상점 운영 기능을 체험할 수 있습니다.</p><p>상점 상태: <b>${state.business?'운영 중':'미개설'}</b></p>${state.business?'<p>오늘의 방문 기록: '+state.visits+'회</p><button class="btn" id="visitShop">상점 방문 이벤트 (+5 코인)</button>':'<button class="btn" id="openShop">상점 개설 · 40 코인</button>'}`);
      const b=body.querySelector('#openShop');if(b)b.onclick=()=>{if(state.coins<40)return toast('코인이 부족합니다.');state.coins-=40;state.business=true;save();toast('나의 상점이 개설되었습니다.');close();};
      const v=body.querySelector('#visitShop');if(v)v.onclick=()=>{state.visits++;state.coins+=5;save();toast('상점 운영 보상 +5 코인');close();};
    } else if(kind==='friends'){
      const online=document.querySelector('#online')?.textContent||'1';
      open('💬 친구 / 쪽지',`<p>현재 접속자: ${online}명</p><p>온라인 친구에게는 오른쪽 월드 채팅으로 메시지를 보낼 수 있습니다.</p><input id="friendMessage" maxlength="120" placeholder="메시지 입력"><button class="btn" id="sendFriend">월드 채팅으로 보내기</button><p class="tag">친구 목록과 개인 쪽지 서버 저장은 후속 개발 대상</p>`);
      body.querySelector('#sendFriend').onclick=()=>{const value=body.querySelector('#friendMessage').value.trim();if(!value)return;const input=document.querySelector('#chatInput');input.value='[쪽지] '+value;document.querySelector('#send')?.click();close();};
    }
  },true);
  save();
})();
