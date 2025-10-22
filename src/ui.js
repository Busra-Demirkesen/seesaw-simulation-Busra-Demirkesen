

import { objects, addObjectToState, resetState } from './state.js';
import { computeTorques, computeAngle, updatePhysics } from './core.js';
import { loadStorage } from './state.js';



const leftWeightCardEl = document.getElementById('leftWeight');
const rightWeightCardEl = document.getElementById('rightWeight');
const leftTorqueCardEl  = document.getElementById('leftTorque');
const rightTorqueCardEl = document.getElementById('rightTorque');
const leftCountCardEl   = document.getElementById('leftObjectCount');
const rightCountCardEl  = document.getElementById('rightObjectCount');
const angleCardEl = document.getElementById('angleCard');
const seesawEl = document.querySelector('.seesaw');
const hitboxEl = document.getElementById('seesawHitbox'); 
const logEl = document.getElementById('eventLog'); 
const resetBtn = document.getElementById('resetBtn'); 


function randomWeight() {
    return Math.floor(Math.random() * 10) + 1;
}

function sizeForWeight(w){
    return 8 + w * 3;
}

function colorForWeight(w){
    const hue = 120 - (w - 1) * (120 / 9);
    return `hsl(${hue}, 70% ,45%)`;
}

function playDropSound(){
   
    const sound = new Audio('./assets/sound/drop.mp3'); 
    sound.volume = 0.5;
    sound.play().catch(e => console.warn('Sound could not be played:', e));
}


export function updateStatsUI(){
    let leftW = 0, rightW = 0, leftC = 0, rightC = 0;
    for (const o of objects){
        if (o.distanceFromPivot < 0){ leftW += o.weight; leftC++; }
        else { rightW += o.weight; rightC++; }
    }
    const { leftTorque, rightTorque } = computeTorques();
    const angle = computeAngle(leftTorque, rightTorque);

   
    if (leftWeightCardEl) leftWeightCardEl.textContent = leftW;
    if (rightWeightCardEl) rightWeightCardEl.textContent = rightW;
    if (leftTorqueCardEl) leftTorqueCardEl.textContent = Math.round(leftTorque);
    if (rightTorqueCardEl) rightTorqueCardEl.textContent = Math.round(rightTorque);
    if (leftCountCardEl) leftCountCardEl.textContent = leftC;
    if (rightCountCardEl) rightCountCardEl.textContent = rightC;
    if (angleCardEl) angleCardEl.textContent = Math.round(angle) + '°'; 
}

export function createObjectElement(object) {
    if (!seesawEl) return;
    const el = document.createElement('div');
    const w = object.weight;
    const size = sizeForWeight(w);

    el.style.width = size + 'px';
    el.style.height = size + 'px';
    el.style.left = object.x + 'px';
    el.style.transform = 'translateX(-50%)';
    el.style.bottom = '12px';

    el.style.background = colorForWeight(w);
    el.style.boxShadow = `0 0 ${Math.max(4, size / 4)}px rgba(0,0,0,0.25)`;
    el.className = 'object dropping';

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

    seesawEl.appendChild(el);

    setTimeout(() => {
        el.classList.remove('dropping');
    }, 800);
}

export function applyAngle(angle){
    if (seesawEl) {
        seesawEl.style.transform = `translateX(-50%) rotate(${angle}deg)`;
    }
}

export function renderScaleLabels(stepPx = 100){
    const scaleEl = seesawEl ? seesawEl.querySelector('.scale') : null; 
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

export function addLogEntry(weight, distanceFromPivot){
    if (!logEl) return;
    const PX_PER_CM = 4; 
    const cm = Math.round(Math.abs(distanceFromPivot) / PX_PER_CM);
    const side = distanceFromPivot < 0 ? 'left' : 'right';

    const item = document.createElement('div');
    item.className = 'log-item';

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
    const LOG_LIMIT = 50; 
    if(items.length > LOG_LIMIT){
        logEl.removeChild(logEl.lastElementChild);
    }
}


function handleHitboxClick(e) {
    if (!hitboxEl) return;
    const rect = hitboxEl.getBoundingClientRect();
    const localX = e.clientX - rect.left;
    if (localX < 0 || localX > rect.width) return;

    const pivotX = rect.width / 2;
    const distanceFromPivot = localX - pivotX;

    const weight = randomWeight();

    const object = {
        id: crypto.randomUUID ? crypto.randomUUID() : String(Date.now() + Math.random()),
        weight,
        x: localX,
        distanceFromPivot
    };
    

    addObjectToState(object); 
    createObjectElement(object); 
    playDropSound(); 
    updatePhysics(); 
    updateStatsUI(); 
}

function resetSeesawUI() {

    document.querySelectorAll('.object').forEach(el => el.parentNode.removeChild(el));


    if (seesawEl) seesawEl.style.transform = 'translateX(-50%) rotate(0deg)';
    if (leftWeightCardEl) leftWeightCardEl.textContent = '0';
    if (rightWeightCardEl) rightWeightCardEl.textContent = '0';
    if (leftTorqueCardEl) leftTorqueCardEl.textContent = '0';
    if (rightTorqueCardEl) rightTorqueCardEl.textContent = '0';
    if (leftCountCardEl) leftCountCardEl.textContent = '0';
    if (rightCountCardEl) rightCountCardEl.textContent = '0';
    if (angleCardEl) angleCardEl.textContent = '0°';
    if (logEl) logEl.innerHTML = '';
}

function handleResetClick() {
    resetState(); 
    resetSeesawUI();
    updatePhysics(); 
}


export function initializeUI() {
    if(!seesawEl || !hitboxEl) {
        console.error('Seesaw or hitbox elements not found in DOM');
        return;
    }

  
    hitboxEl.addEventListener('click', handleHitboxClick);
    
    if (resetBtn) {
        resetBtn.addEventListener('click', handleResetClick);
    }


    renderScaleLabels(100);
}