import { computeTorques, computeAngle, updatePhysics } from './core.js';
import { updateStatsUI, createObjectElement, addLogEntry, createLogItemElement } from './ui.js';

export let objects = [];
export let dropLogs = [];
const LOG_LIMIT = 50;
const STORAGE_KEY = 'seesaw_stage_v1';

function sideFromDistance(distanceFromPivot) {
  return distanceFromPivot < 0 ? 'left' : 'right';
}

export function saveState() {
  const data = { objects, dropLogs };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function loadStorage() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return;

  try {
    const data = JSON.parse(raw);

    if (Array.isArray(data.objects)) {
      objects = data.objects;
      objects.forEach(o => createObjectElement(o));
      updatePhysics();
      updateStatsUI();
    }

    if (Array.isArray(data.dropLogs)) {
      dropLogs = data.dropLogs;
      const logEl = document.getElementById('event-log');
      if (logEl) {
        logEl.innerHTML = '';
        dropLogs.slice().reverse().forEach(l => {
          const item = createLogItemElement(l.weight, l.distanceFromPivot);
          logEl.appendChild(item);
        });
      }
    }
  } catch (err) {
    console.warn('Failed to parse stored state', err);
  }
}

export function addObjectToState(objectData) {
  objects.push(objectData);

  dropLogs.unshift({
    weight: objectData.weight,
    distanceFromPivot: objectData.distanceFromPivot,
    side: sideFromDistance(objectData.distanceFromPivot),
    time: new Date().toISOString()
  });

  if (dropLogs.length > LOG_LIMIT) dropLogs.pop();

  addLogEntry(objectData.weight, objectData.distanceFromPivot);
  saveState();
}

export function resetState() {
  objects = [];
  dropLogs = [];
  localStorage.removeItem(STORAGE_KEY);
}
