
const { createStore } = window.Redux;
//
const initstalState = JSON.parse(localStorage.getItem('cart')) || [];

const cartReducer = (state = initstalState, action) => {
    switch (action.type) {
        case 'ADD_CART': {
            const newCart = [...state]
            const tontaiIndex = newCart.findIndex(cart => cart.id === action.payload.id)
            if (tontaiIndex !== -1) {
                newCart[tontaiIndex].quantity += 1
            }

            else
                newCart.push({ ...action.payload, quantity: 1 })
            return newCart
        }
        case 'UPDATE_QUANTITY': {
            let newCart = [...state]
            const tontaiIndex = newCart.findIndex(cartItem => cartItem.id == action.payload.id)
            if (tontaiIndex !== -1) {
                console.log(action.payload.quantity)
                newCart[tontaiIndex].quantity = action.payload.quantity
                return newCart
            }
            else
                return state
        }
        case 'REMOVE_CART': {
            let newCart = [...state]
            newCart = newCart.filter(cartItem => cartItem.id !== action.payload.id)
            return newCart
        }
        default: return state
    }
}

const store = createStore(cartReducer)

const renderNumCart = (cart) => {
    if (cart.length === 0) return

    const cartNum = document.getElementById('cartNum')
    cartNum.innerHTML = ''
    cartNum.innerHTML = cart.length
}

function numberWithCommas(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
}

function updateQuantity(id) {
    const quantity = document.getElementById(`quantity_${id}`).value
    if (isNaN(quantity))
        return
    else {
        console.log(id)
        const action = {
            type: 'UPDATE_QUANTITY',
            payload: { id, quantity }
        }
        store.dispatch(action)
    }
}

function removeCartItem(id) {
    const action = {
        type: 'REMOVE_CART',
        payload: { id }
    }
    store.dispatch(action)
}


const renderCart = (cart) => {
    const cartBody = document.getElementById('cartBody')
    if (cartBody === null) return

    cartBody.innerHTML = ''
    if (cart.length !== 0) {
        let total = 0
        cart.forEach(cartItem => {
            total += cartItem.price * cartItem.quantity
            cartBody.innerHTML +=
                `
                <tr>
                <td class="thumbnail-img">
                    <a href="#">
                <img class="img-fluid-cart" src=${cartItem.img} alt="" />
            </a>
                </td>
                <td class="name-pr">
                    <a href="#">
                ${cartItem.name}
            </a>
                </td>
                <td class="price-pr">
                    <p>${numberWithCommas(cartItem.price)}VND</p>
                </td>
                <td class="quantity-box"><input id="quantity_${cartItem.id}" onChange="updateQuantity(${cartItem.id})" type="number" size="4" value=${cartItem.quantity} min="1" step="1" class="c-input-text qty text"></td>
                <td class="total-pr">
                    <p>${numberWithCommas(cartItem.price * cartItem.quantity)}VND</p>
                </td>
                <td class="remove-pr">
                    <a href="#">
                <i onClick="removeCartItem(${cartItem.id})"class="fa fa-remove"></i>
            </a>
                </td>
            </tr>
            `
        });
        const total_price = document.getElementById('total_price')
        total_price.innerText = `${numberWithCommas(total)}VND`
    }
}

// goi rendercart

const initalCart = store.getState()
renderNumCart(initalCart)
renderCart(initalCart)

const addToCart = (id, name, price, img) => {
    const chitiet = document.getElementById(`sanphamchon${id}`)
    const action = {
        type: 'ADD_CART',
        payload: { id: chitiet.value, name: name + '-' + chitiet.innerText, price, img, }
    }//
    store.dispatch(action)
    alert("đặt hàng thành công !!")
}
function updateCart() {
    const newCart = store.getState();
    renderNumCart(newCart);
    renderCart(newCart)
    localStorage.setItem('cart', JSON.stringify(newCart));
}
store.subscribe(updateCart);


