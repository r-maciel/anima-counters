class animaCounter {
    constructor(element, op){
        // Merge default options with user options
        let options = {duration: 300, start: 0, effect: 'scroll', delay: 0, ...op}

        this.element = element

        // Format the incomming number, separating decimals and removing spaces
        let formatNumber = this.element.innerHTML.replace(/\s/g,'').split('.')
        this.decimals = formatNumber[1] ? formatNumber[1].length : 0
        this.number = parseInt(formatNumber.join(''))

        // Getting options
        this.start = element.dataset.animaCounterStart ? parseInt(element.dataset.animaCounterStart) :  options.start
        this.duration = element.dataset.animaCounterDuration ? parseInt(element.dataset.animaCounterDuration) :  options.duration
        this.delay = element.dataset.animaCounterDelay ? parseInt(element.dataset.animaCounterDelay) :  options.delay
        this.direction = this.number >= this.start ? 'up' : 'down'
        this.effect = element.dataset.animaCounterEffect ?? options.effect
        this.style = element.dataset.animaCounterStyle ?? options.style

        this.printNumber()
        this.getCountersTimers()

        switch(this.effect){
            case 'none':
                this.play()
                break;
            case 'scroll':
                this.scrollEffect()
                break;
            case 'customize':
                break;
            default:
                this.scrollEffect()
        }
    }

    scrollEffect(){
        let callback = (entries, observer) => { 
            entries.forEach(entry => {
                if(entry.isIntersecting){
                    this.play()
                }
            })
        }

        // Execute when 40% of element is intersected
        let observer = new IntersectionObserver(callback, {threshold: 0.4})
        observer.observe(this.element)
    }

    getCountersTimers(){
        /* 
            ----------- Get timers and counters ---------------
            Counters are how much is gonna be increment the number in case the duration is less than
            the numbers, value is how many n numbers the count should be incremented, 
            times is how many times the n numbers should be incremented

            Timers are inverse, how many time lapses should be execute per number in case numbers are 
            less than duration, value is how much timelapses is gonna last the transition and times is how many
            times should be execute
        */
        let numbers = Math.abs(this.number - this.start)

        if(numbers > this.duration){
            this.counters = this.calculateCountersTimers(numbers, this.duration)
            this.timers = [{times: this.duration, value: 1}]
        }
        else if(numbers < this.duration){
            this.counters = [{times: numbers, value: 1}]
            this.timers = this.calculateCountersTimers(this.duration, numbers)
        }
        else{
            this.counters = [{times: numbers, value: 1}]
            this.timers = [{times: this.duration, value: 1}]
        }
    }

    calculateCountersTimers(data, iterations){
        /* 
            ---------- Calculate the counters and counters ---------
            We have a max of iterations given by the duration in case numbers > duration
            or by duration in case duration > numbers, then we get the carry with data % iterations
            to see how much extra data we have, we have a min number of data per iteration given by
            Math.floor(data / iterations), so we have a counter/timer with minDataPerIteration 
            that will be execute iteration - carry times, for the second counter/timer
            in case carry exist, will have a value of minDataPerIteration + 1, so we finish with the carry
            and will be execute carry times.
        */

       let carry = data % iterations
       let minDataPerIteration = Math.floor(data / iterations)
       
       let obj1 = {
           times: iterations - carry, 
           value: minDataPerIteration
       }
       
       if(carry > 0){
           let obj2 = {
               times: carry,
               value: minDataPerIteration + 1
           }
           return [obj1, obj2]
       }
       
       return [obj1]
    }

    pause(){
        clearTimeout(this.animationTimer)
    }

    play(){
        setTimeout(
            () => {
                this.direction == 'up' 
                ? this.countUp() 
                : this.countDown()
            }, this.delay)
    }


    countUp(){
        if(this.start < this.number) {
            this.start += this.counters[0].times > 0 
                ? this.counters[0].value 
                : this.counters[1].value 
            
            this.counters[0].times -= 1 

            this.animationTimer = setTimeout(
                () => this.countUp(), 
                // Multiply by 10 for 10 milliseconds as min for interval
                (this.timers[0].times > 0 ? this.timers[0].value : this.timers[1].value) * 10 
            )
            this.timers[0].times -= 1 
        }
        this.printNumber()
    }

    countDown(){
        if(this.start > this.number) {
            this.start -= this.counters[0].times > 0 
                ? this.counters[0].value 
                : this.counters[1].value 
            
            this.counters[0].times -= 1 

            this.animationTimer = setTimeout(
                () => this.countDown(), 
                // Multiply by 10 for 10 milliseconds as min for interval
                (this.timers[0].times > 0 ? this.timers[0].value : this.timers[1].value) * 10 
            )
            this.timers[0].times -= 1 
        }
        this.printNumber()
    }

    printNumber(){
        // Format the number to print it
        if(this.decimals > 0){
            let sign = this.start < 0 ? '-' : ''
            let countWithOutSign = this.start.toString().replace('-', '')

            let integerSide = sign + countWithOutSign.slice(0, -this.decimals)
            let decimalSide = countWithOutSign.slice(-this.decimals)

            decimalSide = decimalSide.length < this.decimals ?  '0'.repeat(this.decimals - decimalSide.length) + decimalSide : decimalSide

            this.element.innerHTML = (parseFloat(`${integerSide}.${decimalSide}`)).toLocaleString(this.style, {minimumFractionDigits: this.decimals})
        }
        else{
            this.element.innerHTML = this.start.toLocaleString(this.style)
        }
    }
}

let initAnimaCounter = (options) => {
    const counterElements = document.querySelectorAll('.anima-counter')
    for (let element of counterElements){
        let animate = new animaCounter(element, options)
    }
}

if(typeof exports != "undefined"){    
    module.exports = {initAnimaCounter, animaCounter}
}