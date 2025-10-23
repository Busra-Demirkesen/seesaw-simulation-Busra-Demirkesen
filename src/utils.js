export const colorForWeight = (w) => {
  const hue = 120 - (w - 1) * (120 / 9);
  return `hsl(${hue}, 70% ,45%)`;
};

export const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
export const sizeForWeight = (w) => 8 + w * 3;

export function sideFromDistance(distanceFromPivot) {
  return distanceFromPivot < 0 ? 'left' : 'right';
}