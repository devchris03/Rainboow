const carButton = document.querySelector('#carButton');
const shoppingCar = document.querySelector('#shoppingCar');
const carClose = document.querySelector('#shoppingButtonClose');
const productList = document.querySelector('#productList');
const carContent = document.querySelector('#shoppingContent');

let articleList = [];


//carga los eventos del proyecto
loadEvent()
function loadEvent() {
    carButton.addEventListener('click', openCar);
    carClose.addEventListener('click', closeCar);
    productList.addEventListener('click', selectProduct);
    shoppingCar.addEventListener('click', deleteProduct);
    shoppingCar.addEventListener('click', addQty);
}

// funciones

// muestra el carrito
function openCar(event) {
    event.preventDefault();
    shoppingCar.classList.add('active');
}

// oculta el carrito 
function closeCar() {
    shoppingCar.classList.remove('active');
}


// selecciona el producto
function selectProduct(event) {
    if(event.target.closest('.productItem__button')) {
        const button = event.target.closest('.productItem__button');
        const productSelected = button.closest('.productItem');

        getData(productSelected)
    }
}

// extrae los datos del producto seleccionado
function getData(productSelected) {
    const productInfo = {
        img: productSelected.querySelector('.productItem__img').src,
        imgAlt: productList.querySelector('.productItem__img').alt,
        title: productSelected.querySelector('.productItem__name').textContent,
        price: parseFloat(productSelected.querySelector('.productItem__price span:first-child').textContent),
        quantity: 1,
        id: productSelected.querySelector('.productItem__button').getAttribute('data-id'),
    }

    updateProduct(productInfo)
}

// actualiza la cantidad 
function addQty(event) { 
    event.preventDefault();
    if(event.target.classList.contains('suma')) {
        const suma = event.target.closest('.suma');
        const product = suma.closest('.item');
        const productInfo = {id: product.querySelector('.item__deleted').getAttribute('id')};
        updateProduct(productInfo)
    }

    if(event.target.closest('.resta')) {
        const resta = event.target.closest('.resta');
        const product = resta.closest('.item');
        const productInfo = {id: product.querySelector('.item__deleted').getAttribute('id')};
        const products = articleList.map(product => {
            if(product.id == productInfo.id) {
                product.quantity--;
                return product;
            } else {
                return product;
            }
        });

        articleList = products;
        
        cleanCar()
    }

}


//actualiza el curso si se volvio ha agregar 
function updateProduct(productInfo) {
    const exist = articleList.some(product => product.id == productInfo.id);
    
    if(exist) {
        
        const products = articleList.map(product => {
            if(product.id == productInfo.id) {
                product.quantity++;
                return product;
            } else {
                return product;
            }
        });

        articleList = products;
    
    } else {
        articleList = [...articleList, productInfo]
    }

    cleanCar()

}

// elimina un producto 
function deleteProduct(event) {
    event.preventDefault();
    if(event.target.classList.contains('item__deleted')) {
        const id = event.target.id;

        const products = articleList.filter(product => {
            if (product.id !== id) {
                return product;
            }
        })

        articleList = products
        cleanCar()
    }
}


// limpia el contenido del carrito
function cleanCar() {
    while(carContent.firstChild) {
        carContent.removeChild(carContent.firstChild);
    }

    showCar()
}

// muestra los cursos agregados al carrito
function showCar() {
    articleList.forEach(product => {
        const {img, title, price, quantity, id, imgAlt} = product
        const productItem = document.createElement('div');
        productItem.classList.add('item');
        productItem.innerHTML = `
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
                <p class="item__subtotal">$${price * quantity}</p>
            </div>
            <a class="item__deleted" href="#" id="${id}">Eliminar</a>
        `;

        carContent.appendChild(productItem);
    })
}