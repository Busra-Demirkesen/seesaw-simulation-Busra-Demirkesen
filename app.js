
window.addEventListener('load', () => {
  renderScaleLabels(100);
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

function createObjectElement(object) {
    const el = document.createElement('div');
    el.className = 'object';
    el.style.left = (object.x -6 ) + 'px';
    el.style.bottom = '14px';
    el.title = object.weight + ' kg';
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



