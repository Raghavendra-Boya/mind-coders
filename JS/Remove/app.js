let products = ["taptop","Mobile","Watch","Tablet"]


displyProducts()
function displyProducts(){
    let output="";
    
    for(let i = 0;i<products.length;i++){
        output += `
        <tr>
            <td>${i+1}</td>
            <td>${products[i]}</td>
            <td>
                <button onclick="removeProduct(${i})">Remove</button>
            </td>
        </tr>
        `
    }
    document.getElementById("tableBody").innerHTML = output;
}
 



function removeProduct(index){
    products.splice(index,1);
    displyProducts()

}