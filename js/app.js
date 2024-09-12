const carButton = document.querySelector('#carButton');
const shoppingCar = document.querySelector('#shoppingCar');
const closeButton = document.querySelector('#shoppingButtonClose');
const productList = document.querySelector('#productList');
const carContent = document.querySelector('#shoppingContent');
const emptyCar = document.querySelector('#emptyCar');
const priceCarTotal = document.querySelector('#priceTotal');

let articleList = [];

// carga los eventos del proyecto
loadEvent();
function loadEvent() {
    carButton.addEventListener('click', toogle);
    closeButton.addEventListener('click', toogle);
    productList.addEventListener('click', selectProduct);
    shoppingCar.addEventListener('click', handleProduct)
    emptyCar.addEventListener('click', cleanCar)

    document.addEventListener('DOMContentLoaded', () => {
        articleList = JSON.parse(localStorage.getItem('products')) || [];
        showCar()
    })
}


// muestra y oculta carrito
function toogle() {
    shoppingCar.classList.toggle('active');
}

// selecciona el producto
function selectProduct(event) {
    const button = event.target.closest('.productItem__button');

    if(button) {
        const product = button.closest('.productItem');

        getData(product);
    }
}

// extrae los datos del producto seleccionado
function getData(product) {
    const productInfo = {
        img: product.querySelector('.productItem__img').src,
        imgAlt: product.querySelector('.productItem__img').alt,
        title: product.querySelector('.productItem__name').textContent,
        price: parseFloat(product.querySelector('.productItem__price span:first-child').textContent),
        id: product.querySelector('.productItem__button').getAttribute('data-id'),
        quantity: 1,
    }
    update(productInfo)
}


// manipula producto
function handleProduct(event) {
    event.preventDefault();

    if(event.target.closest('.resta')) {
        const item = event.target.closest('.item');
        const id = item.querySelector('.item__deleted').getAttribute('id');

        update({id: id, quantity: -1});
    }

    if(event.target.closest('.suma')) {
        const item = event.target.closest('.item');
        const id = item.querySelector('.item__deleted').getAttribute('id');

        update({id: id, quantity: 1});
    }

    if(event.target.closest('.item__deleted')) {
        const id = event.target.closest('.item__deleted').getAttribute('id')
        deletedProduct(id);
    }
}


// modifica producto: agrega, resta cantidad y elimina producto
function update(productInfo) {
    
    const productRepeat = articleList.find(product => product.id === productInfo.id);

    if(productRepeat) {
        productRepeat.quantity += productInfo.quantity;
        articleList.push[productRepeat];

        if(productRepeat.quantity <= 0) {
            deletedProduct(productRepeat.id)
        }

    } else {
        articleList = [...articleList, productInfo]
    }
    
    showCar()
}


function deletedProduct(id) {
    articleList = articleList.filter(product => product.id !== id)
    showCar()
}


// limpia carrito de compra
function cleanCar() {
    while(carContent.firstChild) {
        carContent.removeChild(carContent.firstChild);
    }
}


// muestra los productos seleccionados en el carrito
function showCar() {

    cleanCar();

    articleList.forEach(producto => {
        const {img, imgAlt, title, price, id, quantity, subtotal} = producto;
        const item = document.createElement('div');
        item.classList.add('item');
        item.innerHTML = `
            <div class="item__detailProduct">
                <img src="${img}" alt="${imgAlt}" class="item__img">
                <p class="item__name">${title}</p>
            </div>
            <div class="item__detailPrice">
                <span class="item__textPrice">Precio:</span>
                <p class="item__price">$${price}</p>
            </div>
            <div class="item__detailQuantity">
                <div class="item__quantity">
                    <button class="item__button resta" aria-label="restar cantidad">-</button>
                    <span class="item__number">${quantity}</span>
                    <button class="item__button suma" aria-label="sumar cantidad">+</button>
                </div>
                <p class="item__subtotal">$${(price * quantity).toFixed(2)}</p>
            </div>
            <a class="item__deleted" href="#" id="${id}">Eliminar</a>

        `;

        carContent.appendChild(item)
    })

    sumar()
    syncStorage();
}

// accede a los datos almacenados del documento
function syncStorage() {
    localStorage.setItem('products', JSON.stringify(articleList));
}

function sumar() {
    let price = 0;

    if (articleList.length === 0) {
        priceCarTotal.textContent = '0.00';
    } else {
        articleList.forEach(product => {
            price += parseFloat(product.price * product.quantity);
        });

        priceCarTotal.textContent = price.toFixed(2);
    }
    
}






