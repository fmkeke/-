const person = {
    name:'ceshi'
}
const name = 'wer'

function sayName (age){
    console.log(this.name,age,'age');
}

Function.prototype.myCall = function() {
let [context,...rest] = arguments

context = context || window

context.fn = this

console.log(rest,'rest');
context.fn(...rest)
delete context.fn
}
const result =  sayName.apply(person,[12])
const result2 =  sayName.myCall(person,12)

sayName.apply(person,[12])
console.log(result);

let tempObj = {name:'ceshi'}
const set1 = new WeakMap()
set1.set(tempObj,'ces2222')
tempObj = null
console.log(set1,'set1');


const nullobj = Object.create(null)
console.log(nullobj instanceof  null)