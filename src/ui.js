import { objects, addObjectToState, resetState } from './state.js';
import { computeTorques, computeAngle, updatePhysics } from './core.js';

// Constants
const dropSoundSrc = './assets/sound/drop.mp3';
let dropAudio = null;
const PX_PER_CM = 4;
const SEESAW_WIDTH = 400;

// Cards map
const cards = {};
document.querySelectorAll('[data-card]').forEach(el => {
  cards[el.dataset.card] = el;
});

const {
  leftWeightCardEl,
  rightWeightCardEl,
  leftTorqueCardEl,
  rightTorqueCardEl,
  leftCountCardEl,
  rightCountCardEl,
  angleCard: angleCardEl // alias
} = cards;

// DOM refs
const seesawEl = document.querySelector('.seesaw');
const hitboxEl = document.getElementById('seesaw-hitbox');
const logEl = document.getElementById('event-log');
const resetBtn = document.getElementById('reset-btn');

const randomWeight = () => Math.floor(Math.random() * 10) + 1;

export const sizeForWeight = (w) => 8 + w * 3;

export const colorForWeight = (w) => {
  const hue = 120 - (w - 1) * (120 / 9);
  return `hsl(${hue}, 70% ,45%)`;
};

export const playDropSound = () => {
  if (!dropAudio) {
    dropAudio = new Audio(dropSoundSrc);
    dropAudio.preload = 'auto';
  }
  const sound = dropAudio.cloneNode(true);
  sound.volume = 0.5;
  sound.play().catch(() => {});
};

export function updateStatsUI() {
  let leftW = 0, rightW = 0, leftC = 0, rightC = 0;
  for (const o of objects) {
    if (o.distanceFromPivot < 0) { leftW += o.weight; leftC++; }
    else { rightW += o.weight; rightC++; }
  }
  const { leftTorque, rightTorque } = computeTorques();
  const angle = computeAngle(leftTorque, rightTorque);

  const stats = {
    leftWeightCardEl: leftW,
    rightWeightCardEl: rightW,
    leftTorqueCardEl: Math.round(leftTorque),
    rightTorqueCardEl: Math.round(rightTorque),
    leftCountCardEl: leftC,
    rightCountCardEl: rightC,
    angleCard: Math.round(angle) + '°' // ✅ doğru anahtar
  };

  for (const [key, value] of Object.entries(stats)) {
    if (cards[key]) cards[key].textContent = value;
  }
}

export function createObjectElement(object) {
  if (!seesawEl) return;
  const el = document.createElement('div');
  const w = object.weight;
  const size = sizeForWeight(w);

  el.className = 'object dropping';

  // ✅ doğrudan left px ver
  el.style.left = object.x + 'px';

  // size & styles
  el.style.width = size + 'px';
  el.style.height = size + 'px';
  el.style.background = colorForWeight(w);
  el.style.boxShadow = `0 0 ${Math.max(4, size / 4)}px rgba(0,0,0,0.25)`;
  el.style.fontSize = Math.max(9, Math.floor(size / 2.8)) + 'px';

  el.textContent = w;
  el.title = w + ' kg';
  el.setAttribute('aria-label', w + ' kilograms');

  seesawEl.appendChild(el);

  // ✅ animationend dinle
  const onEnd = () => {
    el.classList.remove('dropping');
    el.removeEventListener('animationend', onEnd);
  };
  el.addEventListener('animationend', onEnd, { once: true });
}

export function applyAngle(angle) {
  if (seesawEl) {
    seesawEl.style.transform = `translateX(-50%) rotate(${angle}deg)`;
  }
}

export function renderScaleLabels(stepPx = 100) {
  const scaleEl = seesawEl ? seesawEl.querySelector('.scale') : null;
  if (!scaleEl) return;

  scaleEl.querySelectorAll('.tick-label').forEach(n => n.remove());

  const width = seesawEl.offsetWidth;
  const pivot = width / 2;

  for (let dx = -pivot; dx <= pivot; dx += stepPx) {
    const label = document.createElement('span');
    label.className = 'tick-label';
    label.textContent = dx === 0 ? '0' : (dx > 0 ? `+${dx}` : `${dx}`);
    label.style.left = (pivot + dx) + 'px';
    scaleEl.appendChild(label);
  }
}

export function createLogItemElement(weight, distanceFromPivot) {
  const cm = Math.round(Math.abs(distanceFromPivot) / PX_PER_CM);
  const side = distanceFromPivot < 0 ? 'left' : 'right';

  const item = document.createElement('div');
  item.className = 'log-item';
  item.innerHTML = `
    <span class="log-emoji">🧱</span>
    <span class="log-weight">${weight}kg</span>
    dropped on <span class="log-side">${side}</span> side
    at <span class="log-distance">${cm}cm</span> from center
  `;
  return item;
}

export function addLogEntry(weight, distanceFromPivot) {
  if (!logEl) return;
  const item = createLogItemElement(weight, distanceFromPivot);
  logEl.prepend(item);

  const items = logEl.querySelectorAll('.log-item');
  const LOG_LIMIT = 50;
  if (items.length > LOG_LIMIT) {
    logEl.removeChild(logEl.lastElementChild);
  }
}

function handleHitboxClick(e) {
  if (!hitboxEl || !seesawEl) return;

  const hitRect = hitboxEl.getBoundingClientRect();
  const sawRect = seesawEl.getBoundingClientRect();

  const xOnHitbox = e.clientX - hitRect.left;
  if (xOnHitbox < 0 || xOnHitbox > hitRect.width) return;

  const deltaLeft = (hitRect.width - sawRect.width) / 2;
  let xOnSeesaw = xOnHitbox - deltaLeft;

  xOnSeesaw = Math.max(0, Math.min(SEESAW_WIDTH, xOnSeesaw));

  const FIXED_PIVOT_X = SEESAW_WIDTH / 2; // 200px
  const distanceFromPivot = xOnSeesaw - FIXED_PIVOT_X;

  const weight = randomWeight();

  const object = {
    id: crypto.randomUUID ? crypto.randomUUID() : String(Date.now() + Math.random()),
    weight,
    x: xOnSeesaw,
    distanceFromPivot
  };

  addObjectToState(object);
  createObjectElement(object);
  playDropSound();
  updatePhysics();
  updateStatsUI();
}

function resetSeesawUI() {
  document.querySelectorAll('.object').forEach(el => el.remove());
  if (seesawEl) seesawEl.style.transform = 'translateX(-50%) rotate(0deg)';

  const cardsToReset = [
    leftWeightCardEl, rightWeightCardEl,
    leftTorqueCardEl, rightTorqueCardEl,
    leftCountCardEl, rightCountCardEl, angleCardEl
  ];
  cardsToReset.forEach(el => { if (el) el.textContent = el === angleCardEl ? '0°' : '0'; });

  if (logEl) logEl.innerHTML = '';
}

function handleResetClick() {
  resetState();
  resetSeesawUI();
  updatePhysics();
  updateStatsUI();
}

export function initializeUI() {
  if (!seesawEl || !hitboxEl) {
    console.error('Seesaw or hitbox elements not found in DOM');
    return;
  }
  hitboxEl.addEventListener('click', handleHitboxClick);
  if (resetBtn) resetBtn.addEventListener('click', handleResetClick);
  renderScaleLabels(100);
}
