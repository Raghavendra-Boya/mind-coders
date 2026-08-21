/*




*/


let a;
console.log(a);

function greet(param="greetings of the day"){
    console.log("Hello Students " + param);
}
greet("good afternoon");
greet("good evening");
greet("good morning");
let result1 = greet();
console.log(result1);


function add(a,b){
    return a+b;
}
// console.log(add(2,3));;
let result = add(2,3);
console.log(result);

// let fun1 = function{
//     console.log("this is a function expression");
// }
// fun1()


let bb = aa = 10;
console.log(bb);
console.log(aa);

(function(){}())

/*
passing a function as argumnt to onether function

function functionName(param){
param()
}
functionName(f1)

function f1(){

}
f1()
*/

//recursive function
function showSteps(step){
    if(step>3) return;
    console.log("step " + step);
    showSteps(step+1);
}
showSteps(1);


let count = 0;
let countElement = document.getElementById("count");
function increament(){
    count++;
    countElement.innerText = count;
}

