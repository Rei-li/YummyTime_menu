   'use strict';
   /**
    * Created by NSO on 24.04.2016.
    */
   const express = require('express');
   const request = require('request');

   const pizzaProds = [];

   const router = express.Router();

   router.get('/', (req, res, next) => {
     const promises = [];

     promises.push(getPizzas());
     promises.push(getSnacks());
     promises.push(getDesserts());
     promises.push(getDrinks());
     promises.push(getSauces());

     Promise.all(promises)
       .then(() => {
         res.send(pizzaProds);
       });
   });

   const getPizzas = function() {
     return new Promise((resolve) => {
       const pizzaUrl = 'http://pzz.by/api/v1/pizzas?load=ingredients,filters&order=position:asc';

       request(pizzaUrl, (error, response, body) => {
         const resp = JSON.parse(body);
         const pizzas = resp.response.data;
         pizzas.forEach(product => {
           let amount = '';
           if (product.big_weight !== null && product.big_weight !== undefined) {
             amount = ` (${product.big_weight})`;
           }


           const menuProduct = {
             title: product.title,
             description: product.anonce + amount,
             imageUrl: product.photo_small,
             price: product.big_price,
             category: 'pizza',
             vendorId: `pizza${product.id}`
           };
           pizzaProds.push(menuProduct);
           if (product.medium_price !== null) {
             let amountMedium = '';
             if (product.medium_weight !== null && product.medium_weight !== undefined) {
               amountMedium = ` (${product.medium_weight})`;
             }
             const menuProductMedium = {
               title: `${product.title} (Medium)`,
               description: product.anonce + amountMedium,
               imageUrl: product.photo_small,
               price: product.medium_price,
               category: 'pizza',
               vendorId: `pizza${product.id}Medium`
             };
             pizzaProds.push(menuProductMedium);
           }
         });
         resolve();
       });
     });
   };


   const getSnacks = function() {
     return new Promise((resolve) => {
       const snacksUrl = 'http://pzz.by/api/v1/snacks?order=position:asc';

       request(snacksUrl, (error, response, body) => {
         const resp = JSON.parse(body);
         const pizzas = resp.response.data;

         pizzas.forEach(product => {
           let amount = '';
           if (product.big_amount !== null && product.big_amount !== undefined) {
             amount = ` (${product.big_amount})`;
           }


           const menuProduct = {
             title: product.title,
             description: product.anonce + amount,
             imageUrl: product.photo_small,
             price: product.big_price,
             category: 'snack',
             vendorId: `snack${product.id}`
           };

           pizzaProds.push(menuProduct);
           if (product.medium_price !== null) {
             let amountMedium = '';

             if (product.medium_amount !== null && product.medium_amount !== undefined) {
               amountMedium = ` (${product.medium_amount})`;
             }

             const menuProductMedium = {
               title: `${product.title}  (Medium)`,
               description: product.anonce + amountMedium,
               imageUrl: product.photo_small,
               price: product.medium_price,
               category: 'snack',
               vendorId: `snack${product.id}Medium`
             };
             pizzaProds.push(menuProductMedium);
           }
         });
         resolve();
       });
     });
   };


   const getDesserts = function() {
     return new Promise((resolve) => {
       const dessertsUrl = 'http://pzz.by/api/v1/desserts?order=position:asc';

       request(dessertsUrl, (error, response, body) => {
         const resp = JSON.parse(body);
         const pizzas = resp.response.data;

         pizzas.forEach(product => {
           const menuProduct = {
             title: product.title,
             description: product.anonce,
             imageUrl: product.photo_small,
             price: product.price,
             category: 'dessert',
             vendorId: `dessert${product.id}`
           };

           pizzaProds.push(menuProduct);
         });
         resolve();
       });
     });
   };


   const getDrinks = function() {
     return new Promise((resolve) => {
       const drinksUrl = 'http://pzz.by/api/v1/drinks?order=position:asc';

       request(drinksUrl, (error, response, body) => {
         const resp = JSON.parse(body);
         const pizzas = resp.response.data;

         pizzas.forEach(product => {
           const menuProduct = {
             title: product.title,
             description: product.anonce,
             imageUrl: product.photo_small,
             price: product.price,
             category: 'drink',
             vendorId: `drink${product.id}`
           };
           pizzaProds.push(menuProduct);
         });
         resolve();
       });
     });
   };


   const getSauces = function() {
     return new Promise((resolve) => {
       const saucesUrl = 'http://pzz.by/api/v1/sauces?order=title:asc';

       request(saucesUrl, (error, response, body) => {
         const resp = JSON.parse(body);
         const pizzas = resp.response.data;

         pizzas.forEach(product => {
           const menuProduct = {
             title: product.title,
             description: product.description,
             imageUrl: product.photo_small,
             price: product.price,
             category: 'sauce',
             vendorId: `sauce${product.id}`
           };
           pizzaProds.push(menuProduct);
         });
         resolve();
       });
     });
   };


   module.exports = router;
