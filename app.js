const seesawEl = document.querySelector('.seesaw');
const leftTotalEl = document.getElementById('left-total');
const rightTotalEl = document.getElementById('right-total');

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
}


