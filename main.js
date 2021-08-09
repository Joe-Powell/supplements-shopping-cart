

let products = [
    {
        name: 'Citrulline',
        tag: 'citrulline',
        price: 15,
        inCart: 0
    },
    {
        name: 'Creatine',
        tag: 'creatine',
        price: 25,
        inCart: 0
    },
    {
        name: 'Fish Oil',
        tag: 'fishoil',
        price: 20,
        inCart: 0
    },
    {
        name: 'Whey Protein',
        tag: 'wheyprotein',
        price: 35,
        inCart: 0
    },
    {
        name: 'Plant Protein',
        tag: 'plantprotein',
        price: 45,
        inCart: 0
    }

];


let addCartBtn = document.querySelectorAll('.add-cart');


for (let i = 0; i < addCartBtn.length; i++) {
    addCartBtn[i].addEventListener('click', (e) => {
        e.preventDefault();
        cartNumbers(products[i]);
        totalCost(products[i]);

        const productsInCart = JSON.parse(localStorage.getItem('productsInCart'));

        if (productsInCart.citrulline) {
            const citTotalItems = document.getElementById('citTotalItems');
            citTotalItems.innerHTML = "Quantity:" + productsInCart.citrulline.inCart;
        }

        if (productsInCart.creatine) {
            const creaTotalItems = document.getElementById('creaTotalItems');
            creaTotalItems.innerHTML = "Quantity:" + productsInCart.creatine.inCart;
        }

        if (productsInCart.fishoil) {
            const fishTotalItems = document.getElementById('fishTotalItems');
            fishTotalItems.innerHTML = "Quantity:" + productsInCart.fishoil.inCart;
        }

        if (productsInCart.wheyprotein) {
            const wheyTotalItems = document.getElementById('wheyTotalItems');
            wheyTotalItems.innerHTML = "Quantity:" + productsInCart.wheyprotein.inCart;
        }

        if (productsInCart.plantprotein) {
            const plantTotalItems = document.getElementById('plantTotalItems');
            plantTotalItems.innerHTML = "Quantity:" + productsInCart.plantprotein.inCart;
        }
    })

}

// onLoadNumbers makes sure that when refresh the page it keeps the totalItems in blue cart button
function onLoadCartNumbers() {
    let productNumbers = localStorage.getItem('totalItems');

    if (productNumbers) {
        document.querySelector('.cart span').textContent = productNumbers;
    }



}

// cartNumbers is invoked inside the addCartBtn[i].addEventListener
// cartNumbers updates the quantity of all items in localstorage and blue cart button
function cartNumbers(product, action) {
    let productNumbers = localStorage.getItem('totalItems');
    productNumbers = parseInt(productNumbers);


    let productsInCart = localStorage.getItem('productsInCart');
    productsInCart = JSON.parse(productsInCart);

    if (action == 'decrease') {
        localStorage.setItem('totalItems', productNumbers - 1);
        document.querySelector('.cart span').textContent = productNumbers - 1;
    } else if (productNumbers) {
        localStorage.setItem('totalItems', productNumbers + 1);
        document.querySelector('.cart span').textContent = productNumbers + 1;

    } else {
        localStorage.setItem('totalItems', + 1)
        document.querySelector('.cart span').textContent = 1;
    }
    setItems(product);

}



function setItems(product) {
    let productsInCart = localStorage.getItem('productsInCart');
    productsInCart = JSON.parse(productsInCart);

    if (productsInCart) {
        if (productsInCart[product.tag] == undefined) {
            productsInCart = {
                ...productsInCart,
                [product.tag]: product
            }
        }
        productsInCart[product.tag].inCart += 1;

    } else {
        product.inCart = 1;
        productsInCart = {
            [product.tag]: product
        }


    }

    localStorage.setItem('productsInCart', JSON.stringify(productsInCart))


}



// calculates total cost 
function totalCost(product, action) {
    // console.log("the product price is", product.price)
    let cartCost = localStorage.getItem('totalCost');

    console.log('my CartCost is', cartCost);
    console.log(typeof cartCost);

    if (action == 'decrease') {
        cartCost = parseInt(cartCost);
        localStorage.setItem('totalCost', cartCost - product.price)
    } else if (cartCost != null) {
        cartCost = parseInt(cartCost);
        localStorage.setItem('totalCost', cartCost + product.price)
    } else {
        cartCost = parseInt(cartCost);
        // console.log(typeof cartCost);
        localStorage.setItem('totalCost', product.price);

    }




}




function displayCart() {
    let productsInCart = localStorage.getItem('productsInCart');
    productsInCart = JSON.parse(productsInCart);
    let productContainer = document.querySelector('.products');
    let cartCost = localStorage.getItem('totalCost');


    if (productsInCart && productContainer) {
        productContainer.innerHTML = '';

        Object.values(productsInCart).map(item => {
            productContainer.innerHTML += `
                <div class='product'>
                    <ion-icon name="close-circle-outline"></ion-icon>
                    <img src='./images/${item.tag}.jpg'>
                    <span>${item.name}</span>

               </div>
                <div class='price'>$${item.price}.00</div>
                <div class = 'quantity'>
                    <ion-icon class='decrease'name="arrow-back-circle-outline"></ion-icon>   
                    <span>${item.inCart}</span>
                    <ion-icon class='increase' name="arrow-forward-circle-outline"></ion-icon>
                </div>
                <div class='total'>
                     $${item.inCart * item.price}.00
                </div> 

                `;
        })

        productContainer.innerHTML += `
        <div class = 'basketTotalContainer'>
            <h4 class='basketTotalTitle'>
            Basket Total
            </h4>
             <h4 class='basketTotal'>
                $${cartCost}.00
             </h4>
       </div>
   `;


        // sets up event listener on deleteButtons .product ion-icon the for loop which could just be put in here too
        deleteButtons();
        manageQuantity();
    }






}


function deleteButtons() {
    let deleteButtons = document.querySelectorAll('.product ion-icon');
    let productName;
    let totalItems = localStorage.getItem('totalItems');
    let productsInCart = localStorage.getItem('productsInCart');
    productsInCart = JSON.parse(productsInCart);
    let totalCost = localStorage.getItem('totalCost');


    for (let i = 0; i < deleteButtons.length; i++) {
        deleteButtons[i].addEventListener('click', () => {
            //  goes into the parent and grabs the textContent which is the span..
            // this updates the local storage and cart display 
            productName = deleteButtons[i].parentElement.textContent.trim().toLowerCase().replace(/ /g, '');

            localStorage.setItem('totalItems', totalItems - productsInCart[productName].inCart);
            localStorage.setItem('totalCost', totalCost - (productsInCart[productName].price * productsInCart[productName].inCart));

            delete productsInCart[productName];
            localStorage.setItem('productsInCart', JSON.stringify(productsInCart));

            displayCart();
            onLoadCartNumbers();
        })
    }


}


function manageQuantity() {
    let decreaseButtons = document.querySelectorAll('.decrease');
    let increaseButtons = document.querySelectorAll('.increase');
    let productsInCart = localStorage.getItem('productsInCart');
    productsInCart = JSON.parse(productsInCart);
    let currentQuantity;  // made this variable to catch the quantity, made it globlly so can use in both increase and decrease
    currentProduct = "";



    for (let i = 0; i < decreaseButtons.length; i++) {
        decreaseButtons[i].addEventListener('click', () => {
            currentQuantity = decreaseButtons[i].parentElement.querySelector('span').textContent;
            currentProduct = decreaseButtons[i].parentElement.previousElementSibling.previousElementSibling.querySelector('span').textContent.toLowerCase().replace(/ /g, '').trim();

            if (productsInCart[currentProduct].inCart > 1) {

                productsInCart[currentProduct].inCart = productsInCart[currentProduct].inCart - 1;
                cartNumbers(productsInCart[currentProduct], 'decrease');
                totalCost(productsInCart[currentProduct], 'decrease')

                localStorage.setItem('productsInCart', JSON.stringify(productsInCart));

                displayCart(); // to re-render the cart page kind of like to refresh
            }
        })
    }


    for (let i = 0; i < increaseButtons.length; i++) {
        increaseButtons[i].addEventListener('click', () => {
            currentQuantity = increaseButtons[i].parentElement.querySelector('span').textContent;

            currentProduct = increaseButtons[i].parentElement.previousElementSibling.previousElementSibling.querySelector('span').textContent.toLowerCase().replace(/ /g, '').trim();



            productsInCart[currentProduct].inCart = productsInCart[currentProduct].inCart + 1;
            cartNumbers(productsInCart[currentProduct]);
            totalCost(productsInCart[currentProduct]);

            localStorage.setItem('productsInCart', JSON.stringify(productsInCart));

            displayCart(); // to re-render the cart page kind of like to refresh

        })


    }

}

onLoadCartNumbers();
displayCart()

// made to grab items amount when page loads 

let productsInCart = JSON.parse(localStorage.getItem('productsInCart'));

if (productsInCart.citrulline) {
    const citTotalItems = document.getElementById('citTotalItems');
    citTotalItems.innerHTML = "Quantity:" + productsInCart.citrulline.inCart;
}

if (productsInCart.creatine) {
    const creaTotalItems = document.getElementById('creaTotalItems');
    creaTotalItems.innerHTML = "Quantity:" + productsInCart.creatine.inCart;
}

if (productsInCart.fishoil) {
    const fishTotalItems = document.getElementById('fishTotalItems');
    fishTotalItems.innerHTML = "Quantity:" + productsInCart.fishoil.inCart;
}

if (productsInCart.wheyprotein) {
    const wheyTotalItems = document.getElementById('wheyTotalItems');
    wheyTotalItems.innerHTML = "Quantity:" + productsInCart.wheyprotein.inCart;
}

if (productsInCart.plantprotein) {
    const plantTotalItems = document.getElementById('plantTotalItems');
    plantTotalItems.innerHTML = "Quantity:" + productsInCart.plantprotein.inCart;
}
