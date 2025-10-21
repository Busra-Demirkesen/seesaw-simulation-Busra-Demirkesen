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
});


