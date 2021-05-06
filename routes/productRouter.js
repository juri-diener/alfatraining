// MODULES
const express = require('express');
const formidable = require('formidable');
const fs = require('fs-extra');

// IMPORTS
const databaseLayer = require('../model/Database');

// VARIABLES
const router = express.Router();
const dbLayer = new databaseLayer.Database;

// ROUTES
router.get('/watches', (req, res) => {
  dbLayer.getProducts()
    .then(data => res.send(JSON.stringify(data)))
    .catch(console.log);
});

router.post('/deleteProduct', (req, res) => {
  dbLayer.deleteProduct(req.body)
    .then(response => {
      fs.remove(
        `./public/images/${req.body.article}`
      ).catch(console.log);

      res.send(JSON.stringify(response))
    }).catch(console.log)
});

router.post('/updateProduct', (req, res) => {
  dbLayer.updateProduct(req.body)
    .then(response => res.send(JSON.stringify(response)))
    .catch(console.log)
});

router.post('/addProduct', (req, res) => {

  const options = {
    keepExtensions: true,
    multiples: true,
    uploadDir: './public/images'
  }

  const form = formidable(options);

  let folderName, found = false, filePaths = [], inputFields;

  form.parse(req, (err, fields, files) => {
    if (err) console.log(err);
    else {
      inputFields = { ...fields }
    }
  });

  form.on('field', (name, value) => {
    if (!found) {
      if (name == 'article') {
        found = true;
        folderName = value;
      }
    }
  });

  form.on('fileBegin', (formName, file) => {
    file.path = './public/images/temp/' + file.name;
    filePaths.push(file.path);
  });

  const createFolder = async () => {
    const dir = `./public/images/${folderName}`;
    try {
      await fs.ensureDir(dir);
    } catch (error) {
      console.log(error);
    }
  }

  const moveFilesFromTemp = async (src, dest) => {
    try {
      await fs.move(src, dest, { overwrite: true });
    } catch (err) {
      console.error(err)
    }
  }

  const convertPathsForWeb = () => {
    const newPaths = [];
    for (let i = 0; i < filePaths.length; i++) {
      let newPath = filePaths[i].replace('temp', folderName);
      newPath = `./${newPath.slice(newPath.indexOf('images/'))}`;
      newPaths.push(newPath);
    }
    return newPaths;
  }

  const convertFeaturesInArr = (featuresString) => {
    let features =
      featuresString.replace(/^\s*[\r\n]/gm, "")
        .split('\r')
        .map(el => el.trim())
        .filter(el => el);
    return features;
  }

  const prepareObjectWatch = (newPaths) => {
    let price = inputFields.price.trim();
    price = price.split('€')[0];
    price = Number(price);

    const watch = {
      'Marke': inputFields.brand,
      'Modell': inputFields.model,
      'Artikel': inputFields.article,
      'Preis': price,
      'Typ': inputFields.type,
      'Jahr': inputFields.year,
      'Gehaeuse': inputFields.case,
      'Armband': inputFields.bracelet,
      'Uhrwerk': inputFields.clockwork,
      'Ziffernblatt': inputFields.dial,
      'Glas': inputFields.glass,
      'Durchmesser': inputFields.diameter,
      'Besonderheiten': convertFeaturesInArr(inputFields.features),
      'images': newPaths
    }
    return watch;
  }

  form.on('end', async () => {
    await createFolder();
    for (let i = 0; i < filePaths.length; i++) {
      let oldPath = filePaths[i];
      let newPath = filePaths[i].replace('temp', folderName);
      await moveFilesFromTemp(oldPath, newPath);
    }
    const newPaths = convertPathsForWeb();
    const watch = prepareObjectWatch(newPaths);
    dbLayer.addProduct(watch)
      .then(data => res.send(JSON.stringify(data)))
      .catch(console.log);
  });

});

module.exports = router;