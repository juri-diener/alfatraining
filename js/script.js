"use strict";

const watchContainer = document.querySelector("div.watches");

const currency = " €";
const tax = 19;
const shipping = 4.99;

let watchCollection;
let sliderCount = 0;
let sliderImagesLength = 0;
let heroImageCount = 0;

let cart = localStorage.getItem("cart") ? JSON.parse(localStorage.getItem("cart")) : [];
let favourites = localStorage.getItem("favourites") ? JSON.parse(localStorage.getItem("favourites")) : [];

const isLoggedIn = function() {
  let user = sessionStorage.getItem("user") ? JSON.parse(sessionStorage.getItem("user")) : {auth:false};
  if(user.auth) document.querySelector("div.menu").style.opacity = 1;
  return user;
}

const cartItemsLength = function() {
  document.querySelector("span.cart-icon").setAttribute("data-length", cart.length);
}

const favouritesItemsLength = function() {
  document.querySelector("span.favourite-icon").classList.remove("has");
  if(favourites.length != 0) {
    document.querySelector("span.favourite-icon").setAttribute("data-length", favourites.length);
    document.querySelector("span.favourite-icon").classList.add("has");
  }
}

const isObjectEmpty = function (obj) {
  return Object.keys(obj).length === 0;
}

const convertNumberInReadableStream = function(number) {
  let numString = parseFloat(number).toFixed(2);
  let count = 1;
  let numbersArr = [];
  let lastDigits = "";
  let convertNumber;
  if(numString.indexOf(".") !== -1) {
    lastDigits = "," + numString.substring(numString.indexOf(".")+1);
    numString = numString.substring(0, numString.indexOf("."));
  }
  for(let i = numString.length -1; i >= 0; i--){
    numbersArr.unshift(numString[i]);
    if(count % 3 === 0 && numString.length !== count) {
      numbersArr.unshift(".")
    }
    count++;
  }
  convertNumber = numbersArr.join("") + lastDigits;
  return convertNumber;
}

const changeSliderImage = function() {
  if(sliderCount < 0)sliderCount = sliderImagesLength -1;
  if(sliderCount > sliderImagesLength-1) sliderCount = 0;
  const images = document.querySelectorAll("div.slider-images img");
  for(let i = 0; i < images.length; i++ ) {
    images[i].style.opacity = 0;
    images[sliderCount].style.opacity = 1;
  }
}

const createContainers = function() {
  const favouritePopUp = document.createElement("div");
  favouritePopUp.className = "favourites-popup";
  const favourites = document.createElement("div");
  favourites.className = "favourites";
  const closeFavourites = document.createElement("span");
  closeFavourites.className = "close";
  closeFavourites.textContent = "➔";
  closeFavourites.addEventListener("click", function(){
    document.querySelector("div.favourites-popup").classList.toggle("visible");
  });
  favouritePopUp.appendChild(closeFavourites);

  favouritePopUp.appendChild(favourites);
  document.body.appendChild(favouritePopUp);

  const detailPopup = document.createElement("div");
  detailPopup.className = "detail-popup";
  const closePopup = document.createElement("span");
  closePopup.className = "close";
  closePopup.textContent = "X";

  closePopup.addEventListener("click", function(){
    detailPopup.style.display = "none";
    sliderCount = 0;
  });

  detailPopup.appendChild(closePopup);

  const detailContainer = document.createElement("div");
  detailContainer.className = "detail-container";

  const detailSlider = document.createElement("div");
  detailSlider.className = "detail-slider";

  const sliderImages = document.createElement("div");
  sliderImages.className = "slider-images";
  detailSlider.appendChild(sliderImages);

  const buttons = document.createElement("div");
  buttons.className = "buttons";

  const prevBtn = document.createElement("span");
  prevBtn.className ="prev";

  prevBtn.addEventListener("click", function(){
    sliderCount--;
    changeSliderImage();
  });

  const nextBtn = document.createElement("span");
  nextBtn.className ="next";

  nextBtn.addEventListener("click", function(){
    sliderCount++;
    changeSliderImage();
  });


  buttons.appendChild(prevBtn);
  buttons.appendChild(nextBtn);
  detailSlider.appendChild(buttons);
  
  detailContainer.appendChild(detailSlider);

  const details = document.createElement("div");
  details.className ="details";

  const headline = document.createElement("h2");
  headline.textContent = "Produktdetails";
  details.appendChild(headline);

  const rows = document.createElement("div");
  rows.className = "rows";
  details.appendChild(rows);

  detailContainer.appendChild(details);

  detailPopup.appendChild(detailContainer);
  detailPopup.style.display = "none";

  document.body.appendChild(detailPopup);
}

const getWatch = function(articleNum) {
  for(let watch of watchCollection) {
    if(watch.Artikel === articleNum) {
      return watch;
    }
  }
}

const checkForDuplication = function(articleNum) {
  for (let articleInCart of cart) {
    if(articleInCart.Artikel === articleNum) {
      return true;
    }
  }
  return false;
}

const increaseCount = function(articleNum) {
  const cart = JSON.parse(localStorage.getItem("cart"));
  for(let watch of cart) {
    if(watch.Artikel === articleNum) {
      watch.count = watch.count + 1;
      return cart;
    }
  }
}

const addToCart = function() {
  const watchArticle = this.getAttribute("data-article");
  let watchCart = {
    Artikel:watchArticle,
    count : 1
  }
  if(checkForDuplication(watchArticle)) {
    cart = increaseCount(watchArticle);
  } else {
    cart.push(watchCart);
  }
  localStorage.setItem("cart", JSON.stringify(cart));
  cartItemsLength();
}

const isFavour = function(articleNum) {
  return favourites.includes(articleNum);
}

// Wurde hinzugefügt, weil bei klick in der FavouritenListe,
// im main content die Klasse nicht entfernt wurde.
// durch this.classList.toggle("favour"); in addToFavourites()
const addClassToFavourites = function(favs) {
  const collectionOfFavsIcons = document.querySelectorAll("span.favourite");
  for (let favIcon of collectionOfFavsIcons) {
    favIcon.classList.remove("favour");
    let favIconDataAttr = favIcon.getAttribute("data-article");
    if(favs.includes(favIconDataAttr)) {
      favIcon.classList.add("favour");
    }
  }
  favouritesItemsLength();
}

const addToFavourites = function() {
  const articleNum = this.getAttribute("data-article");
  // this.classList.toggle("favour");
  if(isFavour(articleNum)) {
    favourites = JSON.parse(localStorage.getItem("favourites"));
    favourites.splice(favourites.indexOf(articleNum), 1);
  } else {
    favourites.push(articleNum);
  }
  localStorage.setItem("favourites", JSON.stringify(favourites));
  addClassToFavourites(favourites);
  loadFavourites();
}

const showDetails = function(watch) {
  document.querySelector("div.detail-popup div.slider-images").innerHTML = "";
  document.querySelector("div.detail-popup div.rows").innerHTML = "";

  const rows = document.querySelector("div.detail-popup div.rows");
  const sliderImages = document.querySelector("div.detail-popup div.slider-images");

  for(let key in watch) {
    if(key === "Artikel" || key === "Preis") continue;
    if(key === "images") {
      for(let i = 0; i < watch[key].length; i++) {
        sliderImages.innerHTML += `<img src="${watch[key][i]}" />`;
      }
      sliderImagesLength = watch[key].length;
      continue;
    }
    const row = document.createElement("div");
    row.className = "row";

    if(key === "Besonderheiten") {
      const keyName = document.createElement("p");
      keyName.textContent = key;
      const featureList = document.createElement("ul");
      for(let i = 0; i < watch[key].length; i++) {
        featureList.innerHTML += `<li>${watch[key][i]}</li>`;
      }
      row.appendChild(keyName);
      row.appendChild(featureList);
    }
    else {
      const keyName = document.createElement("p");
      keyName.textContent = key;
      const valueName = document.createElement("p");
      valueName.textContent = watch[key];
      row.appendChild(keyName);
      row.appendChild(valueName);
    }
    rows.appendChild(row);
  }
  document.querySelector("div.detail-popup").style.display = "block";
}

const createHTML = function(watchObj) {
  const watch = document.createElement("div");
  watch.className = "watch";
  const watchImgDiv = document.createElement("div");
  watchImgDiv.className = "watch-img";
  const watchImg = document.createElement("img");
  watchImg.setAttribute("src", watchObj.images[0]);
  watchImgDiv.appendChild(watchImg);

  watchImgDiv.addEventListener("click", function(){
    showDetails(watchObj);
  })

  watch.appendChild(watchImgDiv);
  const watchDetail = document.createElement("div");
  watchDetail.className = "watch-detail";
  const labelDiv = document.createElement("div");
  labelDiv.className = "label";
  const leftColDiv = document.createElement("div");
  const brandName = document.createElement("p");
  brandName.textContent = watchObj.Marke;
  leftColDiv.appendChild(brandName);
  const modelName = document.createElement("p");
  modelName.textContent = watchObj.Modell;
  leftColDiv.appendChild(modelName);
  labelDiv.appendChild(leftColDiv);

  const rightColDiv = document.createElement("div");
  const favouriteSpan = document.createElement("span");
  favouriteSpan.className =   favouriteSpan.className = favourites.includes(watchObj.Artikel) ? "favourite favour" : "favourite";  ;
  favouriteSpan.setAttribute("data-article", watchObj.Artikel);
  favouriteSpan.addEventListener("click", addToFavourites);

  rightColDiv.appendChild(favouriteSpan);
  labelDiv.appendChild(rightColDiv);

  watchDetail.appendChild(labelDiv);

  const infoDiv = document.createElement("div");
  infoDiv.className = "info";
  const button = document.createElement("button");
  button.className = "cart";
  button.textContent = "In den Warenkorb";
  button.setAttribute("data-article", watchObj.Artikel);
  button.addEventListener("click", addToCart);

  infoDiv.appendChild(button);

  const priceDiv = document.createElement("p");
  priceDiv.textContent = watchObj.Preis + currency;

  infoDiv.appendChild(priceDiv);
  watchDetail.appendChild(infoDiv);

  watch.appendChild(watchDetail);

  return watch;

}

const renderHTML = function(insertIn, collections) {
  insertIn.innerHTML = "";
  for(let watch of collections) {
    const createdWatchHtml = createHTML(watch);
    insertIn.appendChild(createdWatchHtml);
  }
}

const loadFavourites = function() {
  const favouritesContainer = document.querySelector("div.favourites");
  const favObjects = [];
  if(favourites.length == 0) {
    favouritesContainer.innerHTML = "<p class=\"empty\">Deine Favoritenliste ist leer</p><p>Du kannst über das Herz Icon deine Favouriten setzen.</p>";
    return;
  } 
  const favIds = JSON.parse(localStorage.getItem("favourites"));
  for(let favId of favIds) {
    if(getWatch(favId)) favObjects.push(getWatch(favId));
  }
  renderHTML(favouritesContainer, favObjects);
}

const loadJson = function(fileName) {
  const xhr = new XMLHttpRequest();
  
  xhr.onload = function() {
    if(xhr.status != 200) {
      watchContainer.innerHTML = "<p>Da ist wohl etwas schief gelaufen</p>";
    }
    watchCollection = xhr.response.watches;
    if(!document.body.classList.contains("cart")) {
      renderHTML(watchContainer, watchCollection);
    } else {
      getShoppingCart();
    }
    loadFavourites();
  }
  xhr.open("GET", fileName + ".json");
  xhr.responseType = "json";
  xhr.send();
}

const sendCartToBackend = function(checkoutCart) {
  const user = isLoggedIn();
  if(!user.auth) {
    document.querySelector("div.authentication-popup").classList.add("visible");
    const authText = `<p class="auth-text">Bitte registrieren oder einloggen um fortzufahren.`;
    document.querySelector("div.cart-items div.checkout").insertAdjacentHTML("beforeend", authText);
    return;
  }
  document.querySelector("div.cart-wrapper").innerHTML = `</br>
  <h2>Wir haben Ihre Bestellung erhalten.</h2>
  <p style="margin-top:12px;">Vielen Dank für Ihren Einkauf.</p>
  `;
  localStorage.removeItem("cart");
  cart = [];
  cartItemsLength();
}

const createCartItem = function(watch, i) {
  return {
    Marke:watch.Marke,
    Modell:watch.Modell,
    Preis:watch.Preis,
    Artikel:watch.Artikel,
    Anzahl:cart[i].count,
    Image:watch.images[0]
  }
}

const renderCart = function(cartItems) {
  document.querySelector("div.cart-wrapper").innerHTML = "";
  if(cartItems.length === 0){
    document.querySelector("div.cart-wrapper").innerHTML = "<p>Ihr Warenkorb ist leeer";
    localStorage.removeItem("cart");
    return;
  };

  const cartItemsDiv = document.createElement("div");
  cartItemsDiv.className = "cart-items";
  let sum = 0;
  for(let cartItem of cartItems) {
    const productHtml = `
    <div class="product">
      <div class="product-image">
        <img src="${cartItem.Image}" />
      </div>
      <div class="product-detail">
        <div class="title">
          <p>${cartItem.Modell}</p>
          <p>${cartItem.Marke}</p>
        </div>
        <div class="bottom">
          <input data-article="${cartItem.Artikel}" type="number" min="0" value="${cartItem.Anzahl}" />
          <p>${convertNumberInReadableStream(cartItem.Preis * cartItem.Anzahl)} ${currency}</p>
        </div>
      </div>
    </div>
    `;
    sum += (cartItem.Preis * cartItem.Anzahl);
    cartItemsDiv.insertAdjacentHTML("beforeend", productHtml);
  }

  let taxSum = (sum * tax) / 100;
  let finalSum = (sum + taxSum + shipping).toFixed(2);
  const checkoutHtml = `
    <div class="checkout">
      <div class="top-row">
        <p>Zwischensumme</p>
        <p>${convertNumberInReadableStream(sum)} ${currency}</p>
      </div>
      <div class="top-row">
          <p>Steuer</p>
          <p>${convertNumberInReadableStream(taxSum)} ${currency}</p>
        </div>
      <div class="top-row">
          <p>Versand</p>
          <p>${convertNumberInReadableStream(shipping)} ${currency}</p>
      </div>
      <div class="top-row">
          <p></p>
          <p>${convertNumberInReadableStream(finalSum)} ${currency}</p>
      </div>
      <button>Kaufen</button>
    </div>
  `;
  cartItemsDiv.insertAdjacentHTML("beforeend", checkoutHtml);
  document.querySelector("div.cart-wrapper").appendChild(cartItemsDiv);

  const productQuantity  = document.querySelectorAll("div.cart-items input");

  for(let quantity of productQuantity) {
    quantity.addEventListener("input", changeCountProduct);
  }

  const checkoutCart = {
    cart:cartItems,
    taxSum,
    shipping,
    finalSum
  }
  
  document.querySelector("div.checkout button").addEventListener("click", function(){
    sendCartToBackend(checkoutCart);
  });
}

const createCartItems = function() {
  const cartItems = [];
  for(let i = 0; i < cart.length; i++) {
    const watch = getWatch(cart[i].Artikel);
    const cartItem = createCartItem(watch, i);
    cartItems.push(cartItem);
  }
  return cartItems;
}

const changeCountProduct = function(e){
  const quantity = e.target.value;
  const article = e.target.dataset.article;
  
  for(let i = 0; i < cart.length; i++){
    if(cart[i].Artikel === article) {
      if(quantity == 0) {
        cart.splice(i, 1);
        break;
      }
      cart[i].count = quantity;
    }
  }
  const cartItems = createCartItems();
  renderCart(cartItems);
  localStorage.setItem("cart", JSON.stringify(cart));
  cartItemsLength();
}

const getShoppingCart = function() {
  if(cart.length === 0) {
    document.querySelector("div.cart-wrapper").innerHTML = "<p>Ihr Warenkorb ist leeer";
    return;
  }
  const cartItems = createCartItems();
  renderCart(cartItems);
}

const logMessageToUser = function(authState) {
  if(authState.auth) {
    document.querySelector("div.checkout p.auth-text").remove();
    alert("Du hast dich erfolgreich registriert");
    document.querySelector("div.authentication-popup").classList.remove("visible");
  } else {
    alert("Diese E-Mail ist schon in benutzung!");
  }
}

loadJson("watches");
createContainers();
cartItemsLength();
favouritesItemsLength();
isLoggedIn();

document.querySelector("span.favourite-icon").addEventListener("click", function(){
  this.classList.toggle("visible");
  document.querySelector("div.favourites-popup").classList.toggle("visible");
});

document.addEventListener("scroll", function(e){
  if(window.scrollY > 150) {
    if(!document.querySelector("header").classList.contains("scrolled")) {
      document.querySelector("header").classList.add("scrolled");
    }
  } else {
    if(document.querySelector("header").classList.contains("scrolled")) {
      document.querySelector("header").classList.remove("scrolled");
    }
  }
});

if(document.body.classList.contains("cart")) {

  document.querySelector("#to-register").addEventListener("click", function(){
    document.querySelector("div.authentication-popup div.auth").classList.toggle("moveLeft");
  });

  document.querySelector("#to-login").addEventListener("click", function(){
    document.querySelector("div.authentication-popup div.auth").classList.toggle("moveLeft");
  });

  document.querySelector("form#register").onsubmit = function(){
    this.querySelector(".repeat").style.backgroundColor = "white";
    const formDatas = new FormData(this);
    if(formDatas.get("password") !== formDatas.get("password-repeat") || formDatas.get("password").length < 5) {
      this.querySelector(".repeat").style.backgroundColor = "red";
      return false;
    }
    const userData = {
      email:formDatas.get("email"),
      password:formDatas.get("password"),
      id:'_' + Math.random().toString(36).substr(2, 9)
    }
  
    const xhr = new XMLHttpRequest();
    xhr.onload = function() {
      if(xhr.status !== 200) {
        return;
      }
      const resultString = xhr.responseText;
      const resultJson = JSON.parse(resultString);
      if(resultJson.auth) {
        sessionStorage.setItem("user", JSON.stringify(resultJson));
        logMessageToUser(resultJson);
        isLoggedIn();
      } else {
        logMessageToUser(resultJson);
      }
    }
    xhr.open("POST", "register.php");
    xhr.send(JSON.stringify(userData));
  
    return false;
  };
  
  document.querySelector("form#login").onsubmit = function() {
    const formDatas = new FormData(this);
    if(formDatas.get("password").length == 0 || formDatas.get("email").length == 0) {
      alert("E-Mail und Passwort darf nicht leer sein.")
      return false;
    }
  
    const userData = {
      email:formDatas.get("email"),
      password:formDatas.get("password"),
    }
  
    const xhr = new XMLHttpRequest();
    xhr.onload = function() {
      if(xhr.status !== 200) {
        return;
      }
      const resultString = xhr.responseText;
      const resultJson = JSON.parse(resultString);
      if(resultJson.auth) {
        sessionStorage.setItem("user", JSON.stringify(resultJson));
        document.querySelector("div.checkout p.auth-text").remove();
        alert("Du bist nun eingeloggt.");
        document.querySelector("div.authentication-popup").classList.remove("visible");
        isLoggedIn();
      } else {
        alert("Zugangsdaten stimmen nicht überein.");
      }
    }
    xhr.open("POST", "login.php");
    xhr.send(JSON.stringify(userData));
    return false;
  }

  document.querySelector("div.authentication-popup span.close-auth").addEventListener("click", function(){
    document.querySelector("div.authentication-popup").classList.remove("visible");
    document.querySelector("p.auth-text").remove();
  });

}

document.querySelector("div.menu a#logout").addEventListener("click", function(){
  sessionStorage.removeItem("user");
  isLoggedIn();
});

// document.body.addEventListener("click", function(){
//   if(document.querySelector("div.favourites-popup").classList.contains("visible")) {
//     document.querySelector("div.favourites-popup").classList.remove("visible");
//   }
// })

/*
  123       => 123
  1234      => 1.234
  12345     => 12.345
  123456    => 123.456
  1234567   => 1.234.567
  12345.50  => 12.345,50
*/

setInterval(function(){
  heroImageCount++;
  const heros = document.querySelectorAll("main section.hero div");
  for(let i = 0; i < heros.length; i++) {
    if(heroImageCount == heros.length) {
      heroImageCount = 0;
    }
    heros[i].style.opacity = 0;
    heros[heroImageCount].style.opacity = 1;
  }
 }, 4000);