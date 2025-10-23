import { objects } from './state.js';
import { applyAngle } from './ui.js';
import { clamp } from './utils.js';


export function computeTorques() {
  if (!objects?.length) return { leftTorque: 0, rightTorque: 0 };

  let leftTorque = 0;
  let rightTorque = 0;

  for (const obj of objects) {
    const torque = obj.weight * Math.abs(obj.distanceFromPivot);
    if (obj.distanceFromPivot < 0) leftTorque += torque;
    else rightTorque += torque;
  }

  return {
    leftTorque: parseFloat(leftTorque.toFixed(2)),
    rightTorque: parseFloat(rightTorque.toFixed(2))
  };
}

export function computeAngle(leftTorque, rightTorque) {
  const raw = (rightTorque - leftTorque) / 10;
  return clamp(raw, -30, 30);
}

export function updatePhysics() {
  const { leftTorque, rightTorque } = computeTorques();
  const angle = computeAngle(leftTorque, rightTorque);
  applyAngle(angle);
}

export function initializeCore() { }
