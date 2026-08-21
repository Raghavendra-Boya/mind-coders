/*
GLobal Scope
functional scope
block scope

var,let,const

place
type

all three are going act as a global scoped variables if you declare variable as global variables



*/

let name ="Nandini";
var age = 50;

{
console.log(name);
}
function greet(){
    var age = 22;
    console.log(name);
    console.log(age);//22
    {
        var age = 25;
        console.log(name);
        console.log(age);//25
        function gree1(){
            console.log(name);
            console.log(age);//25
        }
        gree1()
    }
}

greet()
console.log(age);


function greet2(){
    var a = 10;
    console.log(a);
}
greet2()
// console.log(a);

{
    var b = 100;
    console.log(b);
}
console.log(b);