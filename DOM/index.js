var result = [];
var n = prompt("What's your number?");

function fibonacciGenerator(n){
    for(var i = 0; i < n; i++){
        if(i === 0){
            result.push(0);
        } else if(i === 1){
            result.push(1);
        } else{
            result.push(result[i-2]+result[i-1]);
        }
    }
    alert(result);    
}
fibonacciGenerator(n);