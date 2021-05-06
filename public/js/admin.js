'use strict';

const watchContainer = document.querySelector("div.watches");
const searchIn = document.querySelector('select#search-in');

let watchCollection;
const currency = " €";

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

const formFields = [
  { text: 'Marke:', field: 'input', name: 'brand' },
  { text: 'Modell:', field: 'input', name: 'model' },
  { text: 'Artikel:', field: 'input', name: 'article' },
  { text: 'Preis:', field: 'input', name: 'price' },
  { text: 'Typ:', field: 'input', name: 'type' },
  { text: 'Jahr:', field: 'input', name: 'year' },
  { text: 'Gehäuse:', field: 'input', name: 'case' },
  { text: 'Armband:', field: 'input', name: 'bracelet' },
  { text: 'Ziffernblatt:', field: 'input', name: 'dial' },
  { text: 'Uhrwerk:', field: 'input', name: 'clockwork' },
  { text: 'Durchmesser:', field: 'input', name: 'diameter' },
  { text: 'Glas:', field: 'input', name: 'glass' },
  { text: 'Besonderheiten:', field: 'textarea', name: 'features' },
  { text: '', field: 'file', name: 'image' },
];

const isAdmin = () => {
  let admin =
    sessionStorage.getItem("admin")
      ? JSON.parse(sessionStorage.getItem("admin"))
      : { userId: null, token: null };

  if (!admin.token) return false;

  const adminReq = new Request('/isAdmin', {
    method: 'post',
    body: JSON.stringify(admin),
    headers: { 'content-type': 'application/json' }
  });

  return fetch(adminReq)
    .then(response => response.json())
    .then(data => data.isAdmin ? true : false).catch(console.log);
}

const getProductRev = productId => {
  return watchCollection.find(watch => watch['_id'] === productId);
}

const deleteProduct = event => {
  const productId = event.target.dataset.productid;

  const inputId = prompt(`Mit Produkt ID bestättigen: ${productId}`);
  if (productId !== inputId) return;

  const deleteReq = new Request('/deleteProduct', {
    method: 'post',
    body: JSON.stringify({
      id: getProductRev(productId)['_id'],
      rev: getProductRev(productId)['_rev'],
      article: getProductRev(productId)['Artikel'],
    }),
    headers: { 'content-type': 'application/json' }
  });

  fetch(deleteReq).then(loadProducts).catch(console.log);
}

const saveChanges = event => {
  const productId = event.target.dataset.productid

  const brandName = document.querySelector(`
  div.watch[data-productid='${productId}'] p.brand-name
  `).textContent;
  const modelName = document.querySelector(`
  div.watch[data-productid='${productId}'] p.model-name
  `).textContent;
  let price = document.querySelector(`
  div.watch[data-productid='${productId}'] p.price
  `).textContent;

  price = Number(price.slice(0, price.indexOf('€')).trim());
  const product = getProductRev(productId);

  if (
    brandName.trim() === product.Marke &&
    modelName.trim() === product.Modell &&
    price === product.Preis
  ) return;

  product.Marke = brandName;
  product.Modell = modelName;
  product.Preis = price;

  const updateReq = new Request('/updateProduct', {
    method: 'post',
    body: JSON.stringify(product),
    headers: { 'content-type': 'application/json' }
  });

  fetch(updateReq).then(loadProducts).catch(console.log);

}

const createHTML = (watchObj) => {
  const watch = document.createElement("div");
  watch.className = "watch";
  watch.setAttribute('data-productid', watchObj['_id']);
  const watchImgDiv = document.createElement("div");
  watchImgDiv.className = "watch-img";
  const watchImg = document.createElement("img");
  watchImg.setAttribute("src", watchObj.images[0]);
  watchImgDiv.appendChild(watchImg);


  watch.appendChild(watchImgDiv);
  const watchDetail = document.createElement("div");
  watchDetail.className = "watch-detail";
  const labelDiv = document.createElement("div");
  labelDiv.className = "label";
  const leftColDiv = document.createElement("div");
  const brandName = document.createElement("p");
  brandName.className = 'brand-name';
  brandName.textContent = watchObj.Marke;
  brandName.setAttribute('contenteditable', 'true');
  leftColDiv.appendChild(brandName);
  const modelName = document.createElement("p");
  modelName.textContent = watchObj.Modell;
  modelName.setAttribute('contenteditable', 'true');
  modelName.className = 'model-name';
  leftColDiv.appendChild(modelName);
  labelDiv.appendChild(leftColDiv);

  const rightColDiv = document.createElement("div");
  const deleteIcon = document.createElement("span");
  deleteIcon.className = 'delete';
  deleteIcon.setAttribute('data-productid', watchObj['_id']);
  deleteIcon.addEventListener("click", deleteProduct);

  rightColDiv.appendChild(deleteIcon);
  labelDiv.appendChild(rightColDiv);

  watchDetail.appendChild(labelDiv);

  const infoDiv = document.createElement("div");
  infoDiv.className = "info";
  const button = document.createElement("button");
  button.className = "cart";
  button.textContent = "Daten speichern";
  button.addEventListener("click", saveChanges);
  button.setAttribute('data-productid', watchObj['_id']);

  infoDiv.appendChild(button);

  const priceDiv = document.createElement("p");
  priceDiv.textContent = watchObj.Preis + currency;
  priceDiv.className = 'price';
  priceDiv.setAttribute('contenteditable', 'true');

  infoDiv.appendChild(priceDiv);
  watchDetail.appendChild(infoDiv);

  watch.appendChild(watchDetail);

  return watch;

}

const renderHTML = (insertIn, watches) => {
  insertIn.innerHTML = "";
  for (let watch of watches) {
    const createdWatchHtml = createHTML(watch);
    insertIn.appendChild(createdWatchHtml);
  }
}

const renderProducts = products => {
  watchCollection = products;
  renderHTML(watchContainer, products);
}

const loadProducts = () => {
  fetch('/watches')
    .then(response => response.json())
    .then(renderProducts)
    .catch(console.log)
}

const addProduct = event => {
  event.preventDefault();
  const form = document.querySelector('div.form-wrapper form#add-product');
  const formDatas = new FormData(form);

  if (!formDatas.get('image') || !formDatas.get('article').length) {
    return;
  }

  const addProductReq = new Request('/addProduct', {
    method: 'post',
    body: formDatas,
  });

  fetch(addProductReq)
    .then(response => response.json())
    .then(response => {
      if (response.ok) {
        init();
      } else {
        alert(response.info)
      }
    })
    .catch(console.log);
}

const renderForm = () => {
  document.querySelector('div.form-wrapper').innerHTML = '';
  const form = document.createElement('form');
  form.id = 'add-product';
  form.method = 'post';

  for (let i = 0; i < formFields.length; i++) {
    const fieldset = document.createElement('fieldset');
    const label = document.createElement('label');
    label.textContent = formFields[i].text;

    let formField = document.createElement(formFields[i].field);
    formField.setAttribute('name', formFields[i].name);

    if (formFields[i].field === 'input') {
      formField.setAttribute('type', 'text');
    }


    if (formFields[i].field === 'file') {
      formField = document.createElement('input');
      formField.setAttribute('type', 'file');
      formField.setAttribute('multiple', 'multiple');
      formField.setAttribute('name', formFields[i].name);

      const submitBtn = document.createElement('button');
      submitBtn.textContent = 'Produkt speichern';
      submitBtn.addEventListener('click', addProduct);
      fieldset.className = 'file';
      fieldset.append(submitBtn);
    }
    fieldset.append(label);
    fieldset.append(formField);
    form.append(fieldset);
  }
  document.querySelector('div.form-wrapper').append(form);
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

const init = async () => {
  const ifAdmin = await isAdmin();
  if (!ifAdmin) {
    window.location = '/backend';
    return;
  };
  loadProducts();
  renderForm();
  createOptions();

  searchIn.addEventListener('change', event => optionValue = event.target.value);
  document.querySelector('input#input-search').addEventListener('input', findWatch);
  document.querySelector('p.numeric-asc').addEventListener('click', sortAscPrice);
  document.querySelector('p.numeric-desc').addEventListener('click', sortDescPrice);
  document.querySelector('p.alphabetic-desc').addEventListener('click', sortDescAlphabeticModel);
  document.querySelector('p.alphabetic-asc').addEventListener('click', sortAscAlphabeticModel);
}

init();