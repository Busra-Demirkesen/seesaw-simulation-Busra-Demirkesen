
window.addEventListener('load', () => {
  renderScaleLabels(100);
  loadStorage();
});



const leftWeightCardEl = document.getElementById('left-weight-card');
const rightWeightCardEl = document.getElementById('right-weight-card');
const leftTorqueCardEl  = document.getElementById('left-torque-card');
const rightTorqueCardEl = document.getElementById('right-torque-card');
const leftCountCardEl   = document.getElementById('left-count-card');
const rightCountCardEl  = document.getElementById('right-count-card');
const angleCardEl = document.getElementById('angle-card');


const seesawEl = document.querySelector('.seesaw');
const leftTotalEl = document.getElementById('left-total');
const rightTotalEl = document.getElementById('right-total');



function updateStatsUI(){
  let leftW = 0, rightW = 0, leftC = 0, rightC = 0;
  for (const o of objects){
    if (o.distanceFromPivot < 0){ leftW += o.weight; leftC++; }
    else { rightW += o.weight; rightC++; }
  }
  const { leftTorque, rightTorque } = computeTorques();
  const angle = computeAngle(leftTorque, rightTorque);

  if (leftWeightCardEl)  leftWeightCardEl.textContent  = leftW;
  if (rightWeightCardEl) rightWeightCardEl.textContent = rightW;
  if (leftTorqueCardEl)  leftTorqueCardEl.textContent  = Math.round(leftTorque);
  if (rightTorqueCardEl) rightTorqueCardEl.textContent = Math.round(rightTorque);
  if (leftCountCardEl)   leftCountCardEl.textContent   = leftC;
  if (rightCountCardEl)  rightCountCardEl.textContent  = rightC;
  if (angleCardEl)       angleCardEl.textContent       = Math.round(angle);
}


if(!seesawEl || !leftTotalEl || !rightTotalEl){
    console.error('Required elements not found in DOM');
}

seesawEl.addEventListener('click', (e) =>{
    const rect = seesawEl.getBoundingClientRect();
    const localX = e.clientX - rect.left;

    if (localX < 0 || localX > rect.width) return;
    const pivotX= rect.width / 2 ;
    const distanceFromPivot = localX - pivotX;

    console.log({
        localX: Math.round(localX),
        pivotX:Math.round(pivotX),
        distanceFromPivot: Math.round(distanceFromPivot)
    });


    addObject({ x: localX, distanceFromPivot });
});


let objects = [];

function randomWeight() {
    return Math.floor(Math.random() * 10) + 1;
}

function sizeForWeight(w){
    return 8+ w * 3;
}

function colorForWeight(w){
    const hue = 120 - (w-1) * (120/9);
    return `hsl(${hue}, 70% ,%45)`;
}

function createObjectElement(object) {
    const el = document.createElement('div');
    const w= object.weight;
    const size = sizeForWeight(w);

      el.className = 'object';
  el.style.width  = size + 'px';
  el.style.height = size + 'px';


  el.style.left   = (object.x - size / 2) + 'px';
  el.style.bottom = '12px'; 

  el.style.background = colorForWeight(w);
  el.style.boxShadow  = `0 0 ${Math.max(4, size/4)}px rgba(0,0,0,0.25)`;

  
  el.textContent = w; 
  el.style.display = 'flex';
  el.style.alignItems = 'center';
  el.style.justifyContent = 'center';
  el.style.color = '#fff';
  el.style.fontWeight = '700';
  el.style.fontSize = Math.max(9, Math.floor(size / 2.8)) + 'px';
  el.style.lineHeight = 1;

  el.title = w + ' kg';
  el.setAttribute('aria-label', w + ' kilograms');

  el.style.pointerEvents = 'none';
  seesawEl.appendChild(el);
}

function updateTotals(){

    let left= 0, right = 0;
    for(const obj of objects) {
        if(obj.distanceFromPivot < 0) left+= obj.weight;
        else right += obj.weight;
    }

    leftTotalEl.textContent = left + ' kg';
    rightTotalEl.textContent = right + ' kg';

}


function addObject({ x, distanceFromPivot }) {
  const weight = randomWeight();

  const object = {
    id: crypto.randomUUID ? crypto.randomUUID() : String(Date.now() + Math.random()),
    weight,
    x,
    distanceFromPivot
  };

  objects.push(object);
  createObjectElement(object);
  updateTotals();
  updatePhysics();
  updateStatsUI();
  addLogEntry(weight, distanceFromPivot);
  saveState()

}


function computeTorques() {
    let leftTorque = 0;
    let rightTorque = 0;

    for(const obj of objects) {
        const torque = obj.weight * Math.abs(obj.distanceFromPivot);
        if(obj.distanceFromPivot < 0) leftTorque += torque;
        else rightTorque += torque;
    }

    return{leftTorque, rightTorque};
}


function clamp(value, min, max){
    return Math.max(min, Math.min(max,value));
}

function computeAngle(leftTorque,rightTorque){
    const raw = (rightTorque - leftTorque) / 10 ;
    return clamp(raw, -30,30);
}

function applyAngle(angle){
  seesawEl.style.transform = `translateX(-50%) rotate(${angle}deg)`;
}



function updatePhysics() {
  const { leftTorque, rightTorque } = computeTorques();
  const angle = computeAngle(leftTorque, rightTorque);
  applyAngle(angle);
}

updateTotals();
updatePhysics();



function renderScaleLabels(stepPx = 100){
  const scaleEl = document.getElementById('scale');
  if (!scaleEl) return;


  scaleEl.querySelectorAll('.tick-label').forEach(n => n.remove());

  const width = seesawEl.offsetWidth;
  const pivot = width / 2;

 
  for (let dx = -pivot; dx <= pivot; dx += stepPx){
    const label = document.createElement('span');
    label.className = 'tick-label';
    
    label.textContent = dx === 0 ? '0' : (dx > 0 ? `+${dx}` : `${dx}`);
    label.style.left = (pivot + dx) + 'px';
    scaleEl.appendChild(label);
  }
}

const PX_PER_CM = 4;

const logEl = document.getElementById('event-log');
const LOG_LIMIT= 50;

function formatDistanceCm(distanceFromPivot){
    const cm = Math.round(Math.abs(distanceFromPivot) / PX_PER_CM);
    return cm;
}


function sideFromDistance(distanceFromPivot){
  return distanceFromPivot < 0 ? 'left' : 'right';
}

function addLogEntry(weight, distanceFromPivot){
  if (!logEl) return;
  const cm = formatDistanceCm(distanceFromPivot);
  const side = sideFromDistance(distanceFromPivot);

  const item = document.createElement('div');
  item.className= 'log-item';

  const icon = document.createElement('span');
  icon.className = 'log-emoji';
  icon.textContent = '🧱';

    const text = document.createElement('span');
  text.innerHTML = `
    <span class="log-weight">${weight}kg</span>
    dropped on <span class="log-side">${side}</span> side
    at <span class="log-distance">${cm}cm</span> from center
  `;

  item.appendChild(icon);
  item.appendChild(text);

  logEl.prepend(item);

  const items = logEl.querySelectorAll('.log-item');
  if(items.length > LOG_LIMIT){
    logEl.removeChild(logEl.lastElementChild);
  }

}

const STORAGE_KEY = 'seesaw_stage_v1';

function saveState(){
    const {leftTorque, rightTorque} = computeTorques();
    const angle = computeAngle(leftTorque,rightTorque);

    const data = {
        objects,
        angle
    };

    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));

}

function loadStorage() {
    const raw = localStorage.getItem(STORAGE_KEY);
    if(!raw) return;

try {
    const data = JSON.parse(raw);
    if (Array.isArray(data.objects)) {
      objects = data.objects;
      
      objects.forEach(o => createObjectElement(o));
      updatePhysics(); 
      updateStatsUI && updateStatsUI();
    }
  } catch (err) {
    console.warn("Failed to parse stored state", err);
  }

  function clearStorage(){
        localStorage.removeItem(STORAGE_KEY);
    }
}

    

const resetBtn = document.getElementById('reset-btn');

if(resetBtn){
    resetBtn.addEventListener('click', resetSeesaw);
}

function resetSeesaw(){
    objects = [];

   document.querySelectorAll('.object').forEach(el => el.parentNode.removeChild(el));


    seesawEl.style.transform = 'translateX(-50%) rotate(0deg)';

  if (leftWeightCardEl)  leftWeightCardEl.textContent  = '0';
  if (rightWeightCardEl) rightWeightCardEl.textContent = '0';
  if (leftTorqueCardEl)  leftTorqueCardEl.textContent  = '0';
  if (rightTorqueCardEl) rightTorqueCardEl.textContent = '0';
  if (leftCountCardEl)   leftCountCardEl.textContent   = '0';
  if (rightCountCardEl)  rightCountCardEl.textContent  = '0';
  if (angleCardEl)       angleCardEl.textContent       = '0';

  const logEl = document.getElementById('event-log');
  if(logEl) logEl.innerHTML = '';
  localStorage.removeItem(STORAGE_KEY);


  const emptyState = {
    objects: [],
    leftWeight:0,
    rightWeight:0,
    angle:0,
    dropLogs:[]
  };

  localStorage.setItem('seesawState', JSON.stringify(emptyState));
  
    updatePhysics();
    updateStatsUI && updateStatsUI();

}