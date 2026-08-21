/*
ARray methods are built in functions provided by the JS that helps us perform different operations on arrays without lengthy code(logic)

-add elements
-remove elements
-search elements
-iterate over elements
-sort elements
-join elements
-slice elements

1. push()add elements aat the end of the array
2. pop() remove elements from the end of the array
3. unshift() add elements at the start of the array
4 includes()
5. indexOf()
6. slice()-is ude to extract a portion of an array

*/

// let products = ["laptop","mobile","tablet","desktop"];  

// function showProducts(){
//     let page1 = products.slice(0,5);
//     document.getElementById("products").innerHTML = page1.join("<br>");
// }\


const products = [
  {
    id: 1,
    name: "Laptop",
    price: 55000
  },
  {
    id: 2,
    name: "Smartphone",
    price: 25000
  },
  {
    id: 3,
    name: "Headphones",
    price: 2000
  },
  {
    id: 4,
    name: "Smart Watch",
    price: 4500
  },
  {
    id: 5,
    name: "Keyboard",
    price: 1200
  },
  {
    id: 6,
    name: "Mouse",
    price: 800
  },
  {
    id: 7,
    name: "Monitor",
    price: 15000
  },
  {
    id: 8,
    name: "Printer",
    price: 9500
  },
  {
    id: 9,
    name: "Speaker",
    price: 3500
  },
  {
    id: 10,
    name: "Tablet",
    price: 28000
  },
  {
    id: 11,
    name: "Camera",
    price: 42000
  },
  {
    id: 12,
    name: "Power Bank",
    price: 1800
  }
];

let currentPage = 1;

let cart = [];


function showProducts(page){
    let productsPerPage = 4;
    currentPage=page;

    let start = (page-1) * productsPerPage;
    let end = start + productsPerPage;

    let pageProducts = products.slice(start, end);

    let output = "";

    for(let i=0; i<pageProducts.length; i++){
        output += `
<div class="card col-2 shadow-lg border-2 rounded-1 h-100 bg-primary text-white p-3 m-2">

    <p>ID : ${pageProducts[i].id}</p>

    <h3>${pageProducts[i].name}</h3>

    <p>Price : ₹${pageProducts[i].price}</p>

    <button class="btn btn-warning"
        onclick="addToCart(${pageProducts[i].id})">
        Add To Cart
    </button>

</div>
`;
    }
    document.getElementById("products").innerHTML = output;
}

function prevPage(){
    if(currentPage>1){
        currentPage--;
        showProducts(currentPage);
    }
}

function nextPage(){
    let totalPages = Math.ceil(products.length / 4);
    if(currentPage<totalPages){
        currentPage++;
        showProducts(currentPage);
    }
}


function addToCart(id){

    let product = products.find(function(item){

        return item.id === id;

    });

    let exists = cart.find(function(item){

        return item.id === id;

    });

    if(exists){

        alert("Product Already Added");

        return;

    }

    cart.push({

        id:product.id,
        name:product.name,
        price:product.price,
        quantity:1

    });

    updateCartCount();

    displayCart();

}

function updateCartCount(){

    let count = 0;

    for(let i=0;i<cart.length;i++){

        count += cart[i].quantity;

    }

    document.getElementById("cartCount").innerHTML = count;

}

function increaseQuantity(id){

    let product = cart.find(function(item){

        return item.id === id;

    });

    product.quantity++;

    updateCartCount();

    displayCart();

}

function decreaseQuantity(id){

    let product = cart.find(function(item){

        return item.id === id;

    });

    if(product.quantity>1){

        product.quantity--;

    }
    else{

        let index = cart.findIndex(function(item){

            return item.id===id;

        });

        cart.splice(index,1);

    }

    updateCartCount();

    displayCart();

}


function displayCart(){

    let output="";

    let grandTotal=0;

    output += `

    <table class="table table-bordered table-hover text-center">

        <thead class="table-dark">

            <tr>

                <th>Name</th>

                <th>Price</th>

                <th>Quantity</th>

                <th>Total</th>

            </tr>

        </thead>

        <tbody>

    `;

    for(let i=0;i<cart.length;i++){

        let total = cart[i].price * cart[i].quantity;

        grandTotal += total;

        output += `

        <tr>

            <td>${cart[i].name}</td>

            <td>₹${cart[i].price}</td>

            <td>

                <button
                class="btn btn-danger btn-sm"
                onclick="decreaseQuantity(${cart[i].id})">

                -

                </button>

                <span class="mx-3 fw-bold">

                    ${cart[i].quantity}

                </span>

                <button
                class="btn btn-success btn-sm"
                onclick="increaseQuantity(${cart[i].id})">

                +

                </button>

            </td>

            <td>

                ₹${total}

            </td>

        </tr>

        `;

    }

    output += `

        <tr class="table-warning">

            <th colspan="3">

                Grand Total

            </th>

            <th>

                ₹${grandTotal}

            </th>

        </tr>

        </tbody>

    </table>

    `;

    document.getElementById("cart").innerHTML = output;

}