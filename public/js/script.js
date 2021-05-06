"use strict";
const watchContainer = document.querySelector("div.watches");
const searchIn = document.querySelector('select#search-in');

const currency = " €";
const tax = 19;
const shipping = 4.99;

let watchCollection;
let sliderCount = 0;
let sliderImagesLength = 0;
let heroImageCount = 0;

let foundSize = 0;
const searchTerm = [
  'Artikel',
  'Glas',
  'Gehaeuse',
  'Jahr',
  'Marke',
  'Modell',
  'Typ',
  'Uhrwerk',
  'Ziffernblatt',
];
let optionValue = 'All';

let cart = localStorage.getItem("cart") ? JSON.parse(localStorage.getItem("cart")) : [];
let favourites = localStorage.getItem("favourites") ? JSON.parse(localStorage.getItem("favourites")) : [];

const isLoggedIn = () => {
  let user =
    sessionStorage.getItem("user")
      ? JSON.parse(sessionStorage.getItem("user"))
      : { userId: null, token: null };

  if (user.token) {

    const authReq = new Request('/isAuth', {
      method: 'post',
      body: JSON.stringify({ token: user.token }),
      headers: { 'content-type': 'application/json' }
    });

    return fetch(authReq)
      .then(response => response.json())
      .then(data => {
        if (data.auth) {
          document.querySelector("div.menu").style.opacity = 1;
          return data;
        }
        else {
          sessionStorage.removeItem('user');
        }
      }).catch(console.log);
  } else {
    return { auth: false }
  }

}

const cartItemsLength = () => {
  document.querySelector("span.cart-icon").setAttribute("data-length", cart.length);
}

const favouritesItemsLength = () => {
  document.querySelector("span.favourite-icon").classList.remove("has");
  if (favourites.length != 0) {
    document.querySelector("span.favourite-icon").setAttribute("data-length", favourites.length);
    document.querySelector("span.favourite-icon").classList.add("has");
  }
}

const isObjectEmpty = (obj) => {
  return Object.keys(obj).length === 0;
}

const convertNumberInReadableStream = (number) => {
  let numString = parseFloat(number).toFixed(2);
  let count = 1;
  let numbersArr = [];
  let lastDigits = "";
  let convertNumber;
  if (numString.indexOf(".") !== -1) {
    lastDigits = "," + numString.substring(numString.indexOf(".") + 1);
    numString = numString.substring(0, numString.indexOf("."));
  }
  for (let i = numString.length - 1; i >= 0; i--) {
    numbersArr.unshift(numString[i]);
    if (count % 3 === 0 && numString.length !== count) {
      numbersArr.unshift(".")
    }
    count++;
  }
  convertNumber = numbersArr.join("") + lastDigits;
  return convertNumber;
}

const changeSliderImage = () => {
  if (sliderCount < 0) sliderCount = sliderImagesLength - 1;
  if (sliderCount > sliderImagesLength - 1) sliderCount = 0;
  const images = document.querySelectorAll("div.slider-images img");
  for (let i = 0; i < images.length; i++) {
    images[i].style.opacity = 0;
    images[sliderCount].style.opacity = 1;
  }
}

const createContainers = () => {
  const favouritePopUp = document.createElement("div");
  favouritePopUp.className = "favourites-popup";
  const favourites = document.createElement("div");
  favourites.className = "favourites";
  const closeFavourites = document.createElement("span");
  closeFavourites.className = "close";
  closeFavourites.textContent = "➔";
  closeFavourites.addEventListener("click", function () {
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

  closePopup.addEventListener("click", function () {
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
  prevBtn.className = "prev";

  prevBtn.addEventListener("click", function () {
    sliderCount--;
    changeSliderImage();
  });

  const nextBtn = document.createElement("span");
  nextBtn.className = "next";

  nextBtn.addEventListener("click", function () {
    sliderCount++;
    changeSliderImage();
  });


  buttons.appendChild(prevBtn);
  buttons.appendChild(nextBtn);
  detailSlider.appendChild(buttons);

  detailContainer.appendChild(detailSlider);

  const details = document.createElement("div");
  details.className = "details";

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

const getWatch = (articleNum) => {
  for (let watch of watchCollection) {
    if (watch.Artikel === articleNum) {
      return watch;
    }
  }
}

const checkForDuplication = (articleNum) => {
  for (let articleInCart of cart) {
    if (articleInCart.Artikel === articleNum) {
      return true;
    }
  }
  return false;
}

const increaseCount = (articleNum) => {
  const cart = JSON.parse(localStorage.getItem("cart"));
  for (let watch of cart) {
    if (watch.Artikel === articleNum) {
      watch.count = watch.count + 1;
      return cart;
    }
  }
}

const addToCart = event => {
  const watchArticle = event.target.getAttribute("data-article");
  let watchCart = {
    Artikel: watchArticle,
    count: 1
  }
  if (checkForDuplication(watchArticle)) {
    cart = increaseCount(watchArticle);
  } else {
    cart.push(watchCart);
  }
  localStorage.setItem("cart", JSON.stringify(cart));
  cartItemsLength();
}

const isFavour = (articleNum) => {
  return favourites.includes(articleNum);
}

// Wurde hinzugefügt, weil bei klick in der FavouritenListe,
// im main content die Klasse nicht entfernt wurde.
// durch this.classList.toggle("favour"); in addToFavourites()
const addClassToFavourites = (favs) => {
  const collectionOfFavsIcons = document.querySelectorAll("span.favourite");
  for (let favIcon of collectionOfFavsIcons) {
    favIcon.classList.remove("favour");
    let favIconDataAttr = favIcon.getAttribute("data-article");
    if (favs.includes(favIconDataAttr)) {
      favIcon.classList.add("favour");
    }
  }
  favouritesItemsLength();
}

const addToFavourites = event => {
  const articleNum = event.target.getAttribute("data-article");
  // this.classList.toggle("favour");
  if (isFavour(articleNum)) {
    favourites = JSON.parse(localStorage.getItem("favourites"));
    favourites.splice(favourites.indexOf(articleNum), 1);
  } else {
    favourites.push(articleNum);
  }
  localStorage.setItem("favourites", JSON.stringify(favourites));
  addClassToFavourites(favourites);
  loadFavourites();
}

const showDetails = (watch) => {
  document.querySelector("div.detail-popup div.slider-images").innerHTML = "";
  document.querySelector("div.detail-popup div.rows").innerHTML = "";

  const rows = document.querySelector("div.detail-popup div.rows");
  const sliderImages = document.querySelector("div.detail-popup div.slider-images");

  for (let key in watch) {
    if (key === "Artikel" || key === "Preis" || key === '_id' || key === '_rev') continue;
    if (key === "images") {
      for (let i = 0; i < watch[key].length; i++) {
        sliderImages.innerHTML += `<img src="${watch[key][i]}" />`;
      }
      sliderImagesLength = watch[key].length;
      continue;
    }
    const row = document.createElement("div");
    row.className = "row";

    if (key === "Besonderheiten") {
      const keyName = document.createElement("p");
      keyName.textContent = key;
      const featureList = document.createElement("ul");
      for (let i = 0; i < watch[key].length; i++) {
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

const createHTML = (watchObj, event) => {
  const watch = document.createElement("div");
  watch.className = "watch";
  const watchImgDiv = document.createElement("div");
  watchImgDiv.className = "watch-img";
  const watchImg = document.createElement("img");
  watchImg.setAttribute("src", watchObj.images[0]);
  watchImgDiv.appendChild(watchImg);

  watchImgDiv.addEventListener("click", function () {
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
  favouriteSpan.className = favouriteSpan.className = favourites.includes(watchObj.Artikel) ? "favourite favour" : "favourite";;
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

const renderHTML = (insertIn, collections) => {
  insertIn.innerHTML = "";
  for (let watch of collections) {
    const createdWatchHtml = createHTML(watch);
    insertIn.appendChild(createdWatchHtml);
  }
}

const loadFavourites = () => {
  const favouritesContainer = document.querySelector("div.favourites");
  const favObjects = [];
  if (favourites.length == 0) {
    favouritesContainer.innerHTML = "<p class=\"empty\">Deine Favoritenliste ist leer</p><p>Du kannst über das Herz Icon deine Favouriten setzen.</p>";
    return;
  }
  const favIds = JSON.parse(localStorage.getItem("favourites"));
  for (let favId of favIds) {
    if (getWatch(favId)) favObjects.push(getWatch(favId));
  }
  renderHTML(favouritesContainer, favObjects);
}

const loadJson = (fileName) => {
  return fetch('/watches')
    .then(response => response.json())
    .then(data => data)
    .catch(err => {
      watchContainer.innerHTML = "<p>Da ist wohl etwas schief gelaufen</p>";
      console.log(err);
    })
}

const sendCartToBackend = async () => {
  const user = await isLoggedIn();

  if (!user.auth) {
    document.querySelector("div.authentication-popup").classList.add("visible");
    const authText = `<p class="auth-text">Bitte registrieren oder einloggen um fortzufahren.`;
    document.querySelector("div.cart-items div.checkout").insertAdjacentHTML("beforeend", authText);
    return;
  }
  const checkoutCart = JSON.parse(localStorage.getItem('cart'));
  const checkout = [];
  if (checkoutCart.length) {
    for (let i = 0; i < checkoutCart.length; i++) {
      const watch = getWatch(checkoutCart[i].Artikel);
      watch.Anzahl = checkoutCart[i].count;
      watch.localeTime = new Date().getTime();
      checkout.push(watch);
    }
  }
  const sessionUser = JSON.parse(sessionStorage.getItem('user'));

  const checkoutReg = new Request('/checkout', {
    method: 'post',
    body: JSON.stringify({
      userId: sessionUser.userId,
      checkout,
    }),
    headers: { 'content-type': 'application/json' }
  });

  fetch(checkoutReg)
    .then(response => response.json())
    .then(data => {
      if (data.ok) {
        document.querySelector("div.cart-wrapper").innerHTML = `</br>
        <h2>Wir haben Ihre Bestellung erhalten.</h2>
        <p style="margin-top:12px;">Vielen Dank für Ihren Einkauf.</p>
        `;
        localStorage.removeItem("cart");
        cart = [];
        cartItemsLength();
      } else {
        alert('Leider ist etwas schief gelaufen, probieren Sie es zu einem späteren Zeitpunkt nochmal')
      }
    }).catch(console.log)

}

const createCartItem = (watch, i) => {
  return {
    Marke: watch.Marke,
    Modell: watch.Modell,
    Preis: watch.Preis,
    Artikel: watch.Artikel,
    Anzahl: cart[i].count,
    Image: watch.images[0]
  }
}

const renderCart = (cartItems) => {
  document.querySelector("div.cart-wrapper").innerHTML = "";
  if (cartItems.length === 0) {
    document.querySelector("div.cart-wrapper").innerHTML = "<p>Ihr Warenkorb ist leeer";
    localStorage.removeItem("cart");
    return;
  };

  const cartItemsDiv = document.createElement("div");
  cartItemsDiv.className = "cart-items";
  let sum = 0;
  for (let cartItem of cartItems) {
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

  const productQuantity = document.querySelectorAll("div.cart-items input");

  for (let quantity of productQuantity) {
    quantity.addEventListener("input", changeCountProduct);
  }

  const checkoutCart = {
    cart: cartItems,
    taxSum,
    shipping,
    finalSum
  }

  document.querySelector("div.checkout button").addEventListener("click", function () {
    sendCartToBackend(checkoutCart);
  });
}

const createCartItems = () => {
  const cartItems = [];
  for (let i = 0; i < cart.length; i++) {
    const watch = getWatch(cart[i].Artikel);
    const cartItem = createCartItem(watch, i);
    cartItems.push(cartItem);
  }
  return cartItems;
}

const changeCountProduct = (e) => {
  const quantity = e.target.value;
  const article = e.target.dataset.article;

  for (let i = 0; i < cart.length; i++) {
    if (cart[i].Artikel === article) {
      if (quantity == 0) {
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

const getShoppingCart = () => {
  if (cart.length === 0) {
    document.querySelector("div.cart-wrapper").innerHTML = "<p>Ihr Warenkorb ist leeer";
    return;
  }
  const cartItems = createCartItems();
  renderCart(cartItems);
}

const logMessageToUser = (authState) => {
  if (authState.token) {
    document.querySelector("div.checkout p.auth-text").remove();
    alert(authState.info);
    document.querySelector("div.authentication-popup").classList.remove("visible");
  } else {
    alert(authState.info);
  }
}

const signin = credentials => {
  const signinReq = new Request('/signin', {
    method: 'post',
    body: JSON.stringify({
      email: credentials.email,
      password: credentials.password
    }),
    headers: { 'content-type': 'application/json' }
  });
  fetch(signinReq)
    .then(response => response.json())
    .then(data => {

      if (data.token) {
        logMessageToUser(data);
        sessionStorage.setItem("user", JSON.stringify(data));
        isLoggedIn();
      }
      else {
        logMessageToUser(data);
      }

    })
    .catch(console.log);
}

const signup = credentials => {
  const signupReq = new Request('/signup', {
    method: 'post',
    body: JSON.stringify({
      email: credentials.email,
      password: credentials.password
    }),
    headers: { 'content-type': 'application/json' }
  });
  fetch(signupReq)
    .then(response => response.json())
    .then(data => {
      logMessageToUser(data);
      sessionStorage.setItem("user", JSON.stringify(data));
      isLoggedIn();
    }).catch(console.log);
}

const createCheckoutHTML = item => {
  const checkoutItem = document.createElement('div');
  checkoutItem.className = 'checkout-item';
  let sum = 0;


  const optionsDate = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }
  const checkoutDate = new Date(item[0].localeTime).toLocaleDateString('de-DE', optionsDate);

  const optionsTime = { hour: '2-digit', minute: '2-digit', second: '2-digit' }
  const checkoutTime = new Date(item[0].localeTime).toLocaleTimeString('de-De', optionsTime);

  const dateHtml = `<p class="date">${checkoutDate} : <span>${checkoutTime}</span> Uhr</p>`;

  checkoutItem.insertAdjacentHTML('beforeend', dateHtml);

  for (let i = 0; i < item.length; i++) {
    sum += (item[i].Preis * item[i].Anzahl);
    const productHtml = `
    <div class="product">
      <div class="product-image">
        <img src="${item[i].images[0]}" />
      </div>
      <div class="product-detail">
        <div class="title">
          <p>${item[i].Modell}</p>
          <p>${item[i].Marke}</p>
        </div>
        <div class="bottom">
          <p data-article="${item[i].Artikel}">Stück: ${item[i].Anzahl}<p>
          <p>${convertNumberInReadableStream(item[i].Preis * item[i].Anzahl)} ${currency}</p>
        </div>
      </div>
    </div>
    `;

    checkoutItem.insertAdjacentHTML('beforeend', productHtml);
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
    </div>
  `;

  checkoutItem.insertAdjacentHTML('beforeend', checkoutHtml);

  return checkoutItem;
}

const renderCheckout = checkoutItems => {
  const checkoutDiv = document.querySelector('div.checkout-wrapper');
  // for (let i = 0; i < checkoutItems.length; i++) {
  for (let i = checkoutItems.length; i--;) {
    const wrapper = document.createElement('div');
    wrapper.className = 'checkout';
    wrapper.append(createCheckoutHTML(checkoutItems[i].checkout));
    checkoutDiv.append(wrapper);
  }
}

const loadCheckout = () => {
  console.log("check")
  const user = JSON.parse(sessionStorage.getItem('user'));
  if (!user) {
    window.location = '/';
    return;
  }

  const getCheckoutReq = new Request('/getCheckout', {
    method: 'post',
    body: JSON.stringify({
      userId: user.userId
    }),
    headers: { 'content-type': 'application/json' }
  });

  fetch(getCheckoutReq)
    .then(response => response.json())
    .then(renderCheckout)
    .catch(console.log);

}

const createOptions = () => {
  for (let i = 0; i < searchTerm.length; i++) {
    const option = document.createElement('option');
    option.textContent = searchTerm[i];
    option.value = searchTerm[i];
    searchIn.append(option);
  }
}

const sortAscPrice = () => {
  // const sortAscCollection = watchCollection.sort((a, b) => a.Preis - b.Preis, 0);
  const sortAscCollection = watchCollection.sort((a, b) => {
    return a.Preis - b.Preis == 0 ? a.Modell > b.Modell : a.Preis - b.Preis;
  }, 0);
  renderHTML(watchContainer, sortAscCollection);
}

const sortDescPrice = () => {
  // const sortDescCollection = watchCollection.sort((a, b) => b.Preis - a.Preis, 0);
  const sortDescCollection = watchCollection.sort((a, b) => {
    return b.Preis - a.Preis == 0 ? a.Modell < b.Modell : b.Preis - a.Preis;
  }, 0);
  renderHTML(watchContainer, sortDescCollection);
}

const sortDescAlphabeticModel = () => {
  const sortDescCollection = watchCollection.sort((a, b) => a.Modell < b.Modell);
  renderHTML(watchContainer, sortDescCollection);
}

const sortAscAlphabeticModel = () => {
  const sortAscCollection = watchCollection.sort((a, b) => a.Modell > b.Modell);
  renderHTML(watchContainer, sortAscCollection);
}

const findWatch = event => {

  const inputVal = event.target.value.toLowerCase().trim();

  if (inputVal.length > 2) {

    const findWatches = watchCollection.filter(el => {
      // if (el.Modell.toLowerCase().indexOf(inputVal) != -1) {return el;}

      const objectValues = Object.values(el);
      if (optionValue == 'All') {
        for (let i = 0; i < objectValues.length; i++) {
          if (!Array.isArray(objectValues[i]) && isNaN(objectValues[i])) {
            if (objectValues[i].toLowerCase().indexOf(inputVal) != -1) {
              return el;
            }
          }
          if (!isNaN(objectValues[i])) {
            if (objectValues[i] == inputVal) {
              return el;
            }
          }
        }
      } else {
        if (el[optionValue].toLowerCase().indexOf(inputVal) != -1) {
          return el;
        }
      }

      if (inputVal[0] == '>') {
        if (el.Preis > inputVal.split('>')[1].trim()) {
          return el;
        }
      }
      if (inputVal[0] == '<') {
        if (el.Preis < inputVal.split('<')[1].trim()) {
          return el;
        }
      }
      if (inputVal.trim()[0].indexOf('>') != -1 && inputVal.indexOf('<') != -1) {
        const num1 = inputVal.split('<')[0].split('>')[1].trim();
        const num2 = inputVal.split('<')[1].trim();
        if (el.Preis > num1 && el.Preis < num2) {
          return el;
        }
      }

    }).sort((a, b) => a.Preis - b.Preis, 0);

    if (findWatches.length != foundSize) {
      foundSize = findWatches.length;
      renderHTML(watchContainer, findWatches);
    }
    if (findWatches.length == 0) {
      renderHTML(watchContainer, findWatches);
    }
  }
  if (inputVal.length === 0) {
    renderHTML(watchContainer, watchCollection);
    foundSize = 0;
  }
}


// EVENT-LISTENERS
document.querySelector("span.favourite-icon").addEventListener("click", function () {
  this.classList.toggle("visible");
  document.querySelector("div.favourites-popup").classList.toggle("visible");
});

document.addEventListener("scroll", function (e) {
  if (window.scrollY > 150) {
    if (!document.querySelector("header").classList.contains("scrolled")) {
      document.querySelector("header").classList.add("scrolled");
    }
  } else {
    if (document.querySelector("header").classList.contains("scrolled")) {
      document.querySelector("header").classList.remove("scrolled");
    }
  }
});

if (document.body.classList.contains("cart")) {
  loadJson("watches").then(data => {
    watchCollection = data;
    loadFavourites();
    getShoppingCart();
  }).catch(console.log);

  document.querySelector("#to-register").addEventListener("click", function () {
    document.querySelector("div.authentication-popup div.auth").classList.toggle("moveLeft");
  });

  document.querySelector("#to-login").addEventListener("click", function () {
    document.querySelector("div.authentication-popup div.auth").classList.toggle("moveLeft");
  });

  document.querySelector("form#register").onsubmit = function () {
    this.querySelector(".repeat").style.backgroundColor = "white";
    const formDatas = new FormData(this);
    if (formDatas.get("password") !== formDatas.get("password-repeat") || formDatas.get("password").length < 5) {
      this.querySelector(".repeat").style.backgroundColor = "red";
      return false;
    }
    const userData = {
      email: formDatas.get("email"),
      password: formDatas.get("password"),
    }
    signup(userData);

    return false;
  };

  document.querySelector("form#login").onsubmit = function () {
    const formDatas = new FormData(this);
    if (formDatas.get("password").length == 0 || formDatas.get("email").length == 0) {
      alert("E-Mail und Passwort darf nicht leer sein.")
      return false;
    }

    const userData = {
      email: formDatas.get("email"),
      password: formDatas.get("password"),
    }

    signin(userData);

    return false;
  }

  document.querySelector("div.authentication-popup span.close-auth").addEventListener("click", function () {
    document.querySelector("div.authentication-popup").classList.remove("visible");
    document.querySelector("p.auth-text").remove();
  });

}

if (document.body.classList.contains('products')) {
  loadJson("watches").then(data => {
    watchCollection = data;
    loadFavourites();
    renderHTML(watchContainer, watchCollection);
    createOptions();
  }).catch(console.log);


  searchIn.addEventListener('change', event => optionValue = event.target.value);
  document.querySelector('input#input-search').addEventListener('input', findWatch);

  document.querySelector('p.numeric-asc').addEventListener('click', sortAscPrice);
  document.querySelector('p.numeric-desc').addEventListener('click', sortDescPrice);
  document.querySelector('p.alphabetic-desc').addEventListener('click', sortDescAlphabeticModel);
  document.querySelector('p.alphabetic-asc').addEventListener('click', sortAscAlphabeticModel);
}

if (document.body.classList.contains('checkout')) {
  loadJson("watches").then(data => {
    watchCollection = data;
    loadFavourites();
    loadCheckout();
  }).catch(console.log);
}

document.querySelector("div.menu a#logout").addEventListener("click", event => {
  const userToken = JSON.parse(sessionStorage.getItem('user'));

  const logoutReq = new Request('/logout', {
    method: 'post',
    body: JSON.stringify({
      token: userToken.token
    }),
    headers: { 'content-type': 'application/json' }
  });

  fetch(logoutReq)
    .then(response => response.json())
    .then(data => {
      if (data.isLoggedOut) {
        sessionStorage.removeItem("user");
      } else {
        event.preventDefault();
        alert('Beim Logout ist etwas schief gelaufen')
      }
    }).catch(console.log);

});

setInterval(function () {
  heroImageCount++;
  const heros = document.querySelectorAll("main section.hero div");
  for (let i = 0; i < heros.length; i++) {
    if (heroImageCount == heros.length) {
      heroImageCount = 0;
    }
    heros[i].style.opacity = 0;
    heros[heroImageCount].style.opacity = 1;
  }
}, 4000);

createContainers();
cartItemsLength();
favouritesItemsLength();
isLoggedIn();