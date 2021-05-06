'use strict';

const nano = require('nano');
let db;

const tableNames = [
  'user',
  'checkout',
  'product'
]

const tokens = [];

const createToken = () => Math.random().toString(36).substr(2);

class Database {

  constructor(url) {
    this.url = url;
  }

  connect() {
    db = nano(this.url).db;
  }

  createCollections() {
    db.list().then(response => {
      for (let i = 0; i < tableNames.length; i++) {
        if (!response.includes(tableNames[i])) {
          db.create(tableNames[i]);
        }
      }
    }).catch(console.log);
  }

  getProducts() {
    return db.use('product').list({ include_docs: true })
      .then(doclist => doclist.rows.map(docItem => docItem.doc))
      .catch(console.log);
  }

  deleteProduct(product) {
    return db.use('product').destroy(product.id, product.rev).catch(console.log);
  }

  updateProduct(product) {
    return db.use('product').insert(product).catch(console.log);
  }

  addProduct(product) {
    return db.use('product').find({
      selector: {
        Artikel: product.Artikel
      }
    }).then(response => {
      if (response.docs.length) return {
        ok: false,
        info: 'Artikel schon vorhanden'
      }
      return db.use('product').insert(product)
        .then(() => {
          return {
            ok: true,
            info: 'Produkt erfolgreich eingefügt'
          }
        }).catch(console.log);
    }).catch(console.log);
  }

  signup(newUser) {
    return db.use('user').find({
      selector: {
        email: newUser.email
      }
    }).then(user => {
      if (user.docs.length) {
        return {
          userId: null,
          token: null,
          info: 'E-Mail schon vorhanden'
        }
      }
      const token = createToken();
      tokens.push(token);

      return db.use('user').insert({
        token,
        email: newUser.email,
        password: newUser.password,
        role: 'member',
      }).then(doc => {
        return {
          userId: doc.id,
          token,
          info: 'Konto erfolgreich angelegt'
        }
      }).catch(console.log);

    }).catch(console.log);

  }

  signin(credentials) {
    return db.use('user').find({
      selector: {
        email: credentials.email,
        password: credentials.password
      }
    }).then(user => {

      if (!user.docs.length) {
        return {
          token: null,
          info: 'Wrong credentials'
        }
      }

      if (!tokens.includes(user.docs[0].token)) {
        tokens.push(user.docs[0].token);
      }

      return {
        userId: user.docs[0]['_id'],
        token: user.docs[0].token,
        email: user.docs[0].email,
        info: 'Successfully logged in'
      }

    }).catch(console.log);
  }

  signinToBackend(credentials) {
    return db.use('user').find({
      selector: {
        email: credentials.email,
        password: credentials.password,
        role: 'admin'
      }
    }).then(user => {

      if (!user.docs.length) {
        return {
          token: null,
          info: 'Wrong credentials'
        }
      }

      if (!tokens.includes(user.docs[0].token)) {
        tokens.push(user.docs[0].token);
      }

      return {
        userId: user.docs[0]['_id'],
        token: user.docs[0].token,
        email: user.docs[0].email,
        info: 'Successfully logged in'
      }

    }).catch(console.log);
  }

  checkout(checkout) {
    return db.use('checkout').insert(checkout).catch(console.log);
  }

  logout(token) {
    if (tokens.includes(token)) {
      tokens.splice(tokens.indexOf(token), 1);
      return { isLoggedOut: true };
    }
    return { isLoggedOut: false };
  }

  isAuth(token) {
    return { auth: tokens.includes(token) };
  }

  isAdmin(admin) {
    return db.use('user').find({
      selector: {
        _id: admin.userId,
      }
    }).then(user => {
      if (!user.docs.length || user.docs[0].role !== 'admin') {
        return { isAdmin: false }
      }
      return { isAdmin: true }
    }).catch(console.log);
  }

  getCheckout(userId) {
    return db.use('checkout').find({
      selector: {
        userId
      }
    }).then(items => items.docs).catch(console.log)
  }

}

exports.Database = Database;