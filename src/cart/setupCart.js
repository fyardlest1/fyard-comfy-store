// import
import {
  getStorageItem,
  setStorageItem,
  formatPrice,
  getElement,
} from '../utils.js';
import { openCart } from './toggleCart.js';
import { findProduct } from '../store.js';
import addToCartDOM from './addToCartDOM.js';

// set items
const cartItemCountDOM = getElement('.cart-item-count')
const cartItemsDOM = getElement('.cart-items')
const cartTotalDOM = getElement('.cart-total')

let cart = getStorageItem('cart')

export const addToCart = (id) => {
  let item = cart.find(cartItem => cartItem.id === id)
  if (!item) {
    let product = findProduct(id)
    // add item to the cart
    product = {...product, amount:1}
    cart = [...cart, product]
    // add item to the DOM
    addToCartDOM(product)
  }
  else {
    // update values
    const amount = increaseAmount(id)
    const items = [...cartItemsDOM.querySelectorAll('.cart-item-amount')]
    const newAmount = items.find(value => value.dataset.id === id)
    newAmount.textContent = amount
  }
  // add one to the item count
  displayCartItemCount()
  // display cart totals
  displayCartTotals()
  // set cart in localStorage
  setStorageItem('cart', cart)
  // more stuff
  openCart()
};

function displayCartItemCount() {
  const amount = cart.reduce((total, cartItem) => {
    return total += cartItem.amount
  }, 0)
  cartItemCountDOM.textContent = amount
}

function displayCartTotals() {
  let total = cart.reduce((total, cartItem) => {
    return total += cartItem.price * cartItem.amount
  }, 0)
  cartTotalDOM.textContent = `Total : ${formatPrice(total)}`
}

function displayCartItemsDOM() {
  cart.forEach(cartItem => {
    addToCartDOM(cartItem)
  });
}
function removeItem(id) {
  cart = cart.filter(cartItem => cartItem.id !== id)
}
function increaseAmount(id) {
  let newAmount;
  cart = cart.map((cartItem) => {
    if(cartItem.id === id) {
      newAmount = cartItem.amount + 1
      cartItem = {...cartItem, amount: cartItem.amount + 1}
    }
    return cartItem
  })
  return newAmount
}

function setupCartFunctionality() {
  cartItemsDOM.addEventListener('click', function(e) {
    const element = e.target
    const parent = e.target.parentElement
    const id = e.target.dataset.id
    const parentID = e.target.parentElement.dataset.id

    // remove
    if(element.classList.contains('cart-item-remove-btn')){
      removeItem(id)
      parent.parentElement.remove()
      element.parentElement.parentElement.remove()
    }
    // increase

    displayCartItemCount()
    displayCartTotals()
    setStorageItem('cart', cart)
  })
}

const init = () => {
  // display amout of cart items
  displayCartItemCount()
  // display total
  displayCartTotals()
  // add all cart items to the DOM
  displayCartItemsDOM()
  // setup cart functionality
  setupCartFunctionality()
}

init()
