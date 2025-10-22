

import { computeTorques, computeAngle, updatePhysics } from './core.js';
import { updateStatsUI, createObjectElement, addLogEntry } from './ui.js';


export let objects = [];
export let dropLogs = [];
const LOG_LIMIT = 50;
const STORAGE_KEY = 'seesaw_stage_v1';


const PX_PER_CM = 4;

function formatDistanceCm(distanceFromPivot){
    const cm = Math.round(Math.abs(distanceFromPivot) / PX_PER_CM);
    return cm;
}

function sideFromDistance(distanceFromPivot){
    return distanceFromPivot < 0 ? 'left' : 'right';
}



export function saveState(){
    const {leftTorque, rightTorque} = computeTorques(objects);
    const angle = computeAngle(leftTorque, rightTorque);

    const data = {
        objects,
        angle,
        dropLogs
    };

    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function loadStorage() {
    const raw = localStorage.getItem(STORAGE_KEY);
    if(!raw) return;

    try {
        const data = JSON.parse(raw);
        if (Array.isArray(data.objects)) {
            objects = data.objects;     
            objects.forEach(o => createObjectElement(o)); 
            updatePhysics(objects); 
            updateStatsUI(); 
        }

        if(Array.isArray(data.dropLogs)){
            dropLogs = data.dropLogs;
            
        
            const logEl = document.getElementById('eventLog'); 
            if(logEl){
                logEl.innerHTML = '';
               
                dropLogs.slice().reverse().forEach(l => { 
                    const cm = formatDistanceCm(l.distanceFromPivot);
                    const side = sideFromDistance(l.distanceFromPivot);
                    const item = document.createElement('div');
                    item.className = 'log-item';
                    item.innerHTML = `
                        <span class="log-emoji">🧱</span>
                        <span class="log-weight">${l.weight}kg</span>
                        dropped on <span class="log-side">${side}</span> side
                        at <span class="log-distance">${cm}cm</span> from center
                    `;
                    logEl.appendChild(item); 
                });
            }
        }
        
    } catch (err) {
        console.warn("Failed to parse stored state", err);
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

export function resetState(){
    objects = [];
    dropLogs = [];
    localStorage.removeItem(STORAGE_KEY);
}