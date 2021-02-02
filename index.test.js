const {animaCounter} = require('./dist/index.js')

const observe = jest.fn();

window.IntersectionObserver = jest.fn(function() {
  this.observe = observe;
});

it('Test element', () => {
    document.body.innerHTML = 
    `<div id="element">
        200.00
    </div>`;
    let element = document.getElementById('element')
    const newAnimaCounter = new animaCounter(element, {effect: 'customize'});
    
    let values = {
        duration: newAnimaCounter.duration,
        numberDuration: newAnimaCounter.numberDuration,
        start: newAnimaCounter.start,
        number: newAnimaCounter.number,
        decimals: newAnimaCounter.decimals,
        effect: newAnimaCounter.effect,
        delay: newAnimaCounter.delay,
        direction: newAnimaCounter.direction,
    }

    let expectedValues = {
        duration: 300,
        numberDuration: 0,
        start: 0,
        number: 20000,
        decimals: 2,
        effect: 'customize',
        delay: 0,
        direction: 'up',
    }

    expect(values).toEqual(expectedValues)
    expect(newAnimaCounter.timers).toEqual([{times: 300, value: 1}])
    expect(newAnimaCounter.counters).toEqual([{times: 100, value: 66}, {times: 200, value: 67}])
});