# AnimaCounters

AnimaCounters is a module to animate counts up or counts down from any number to any number.

## How does it work?

Basically, you define a start number and an end number, if the start number is smaller than the end number the animation is going to be count up, opposite case is going to be count down.

It works for decimal and negative numbers.

## Demo
[AnimaCounters Demo](https://r-maciel.github.io/anima-counters/demo/)


## Usage

### Install

#### NPM

  ```
  npm install anima-counters
  ```
#### CDN

UNPKG
```html
<script src="https://unpkg.com/anima-counters@1.1.1/dist/index.js"></script>
```

JSDELIVR
```html
<script src="https://cdn.jsdelivr.net/npm/anima-counters@1.1.1/dist/index.js"></script>
```


### Basic Usage

#### JS
```javascript
//This line is only if you used NPM, not write this line if you used CDN
const {initAnimaCounter} = require('anima-counters')

initAnimaCounter();
```
#### HTML
```html
<div class="anima-counter">10000</div>
```
Be sure the tag element where you're using the class contains only a number with next rules:

- Number can be without spaces `124586.456`
- Number ca be with spaces as separator `124 586.456`
- Comma is not sopported
- The decimal sign must be decimal point
- You can use negative numbers `- 124 586.456`

*Don't worry about the number style, we talk about it later*

### Configure options

By default, the start number is 0, the duration of the animation is 3 seconds and it's going to be executed when the 40% of the element is shown in the viewport.

You can change this behavior with an options object:

```javascript
//This line is only if you used NPM, not write this line if you used CDN
const {initAnimaCounter} = require('anima-counters')

let options = {
    start: 40,
    duration: 90,
    numberDuration: 1000,
    style: 'es-MX',
    effect: 'scroll',
    delay: 3000
}

initAnimaCounter(options);
```

- **start**.  This option receives an integer number, it can be negative, and it's the *"start"* of the count, it also define the direction of the count, we talked about it in [How does it work?](#how-does-it-work) section. 
  
  For decimals, it's a little tricky but easy to understand. When you define the number inside the tag, the decimals will be linked to the decimals of the **start** option, for example, if your tag number is `10` and your **start** is `start: 40` the count will be from *10 to 40*, but if your tag number is `10.0` and your **start** is `start: 40` the count will be from *4.0 to 10.0*, and if your tag number is `10.00` and your **start** is `start: 40` the count will be from *0.40 to 10.00*, basically, the decimal point will be added to the right of your *start number* according to the decimals in your tag number. 
  
  Default value is 0.

- **duration**. Receives a positive integer, and defines the whole time is going to take to the counter to finish the count, it's given by intervals of 10 milliseconds, so if you pass a value of 100, it will be multiplied by 10, giving us 1000 milliseconds = 1 second. 

- **numberDuration**. Receives a positive integer >= 10, and defines the time of the iteration between each number of the count, it's in milliseconds. It overrides the *duration option*.
  
  Default value is 0.

- **style**. Now is time to talk about the number printing style. It defines the number style to print it, it use `toLocaleString()` function, so the style is given by the locales. 
  
  It receives a locale String. Default value is your default locale.

- **effect**. This define when the counter will be executed. It receives a string with 1 of 3 values:
  - **scroll**. It's the default value, the counter will be executed when the 40% of tag element is shown in the viewport. It use js `IntersectionObserver`.
  - **none**. The counter will be executed as soon as the script has load, it won't wait until the element appears in the viewport.
  - **customize**. Will talk about it in [Customize the counter trigger(effect)](#customize-the-counter-triggereffect) section.

- **delay**. Receives a positive integer, and defines the time the counter will wait to be executed, it's in milliseconds, so 3000 = 3 seconds. This option does not work with `effect: customize`.
  
  Default value is 0.

The passed values in the options object will affect all the tags with **'anima-counter'** class, if you need to add individual options to each tag or you don't want to pass an options object, you can configure the options with the next datasets:

- data-anima-counter-start="-50"
- data-anima-counter-duration="2000"
- data-anima-counter-number-duration="1000"
- data-anima-counter-style="es-MX"
- data-anima-counter-effect="none"
- data-anima-counter-delay="3000"

If you passed options object in the `initAnimaCounter()` function, and you used datasets, the datasets will overwrite the options values only for the element that contains them

#### Using datasets example

```html
    <div class="anima-counter"
        data-anima-counter-start="-500"
        data-anima-counter-duration="1000"
        data-anima-counter-style="es-MX"
        data-anima-counter-effect="none">
        500
    </div>
```

## Customize the counter trigger(effect)
As we established before, for the effect option we have a value of **'customize'**, this allow us to create our own functions to execute the counter. 
This option also will allow us to use **play** and **pause** functions.

### Example
In this example we're going to create a counter that plays when the mouse is over the element and stops when the mouse is out.

#### HTML
First we need to define an identifier to our element, can be whatever name you wish
```html
    <div id="counter-hover">50</div>
```

#### JS
```javascript
//This line is only if you used NPM, not write this line if you used CDN
const {animaCounter} = require('anima-counters')

// The element
let elementCounter = document.getElementById('counter-hover')

//We pass the options we want. Effect option needs to be 'customize'.
let options = {
    duration: 500, 
    start: -50, 
    effect: 'customize'
}

// Create the object
let newAnimaCounter = new animaCounter(elementCounter, options)

// Add events
elementCounter.addEventListener('mouseover', () => newAnimaCounter.play())
elementCounter.addEventListener('mouseout', () => newAnimaCounter.pause())
```