import { initializeCore } from './src/core.js';
import { loadStorage } from './src/state.js';
import { initializeUI, updateStatsUI } from './src/ui.js';

const init = () => {
  initializeUI();
  initializeCore();
  loadStorage();
  updateStatsUI();
  console.log('Seesaw Simulation initialized with modular structure.');
};

document.addEventListener('DOMContentLoaded', init);
