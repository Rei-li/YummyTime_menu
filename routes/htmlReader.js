    /**
     * Created by NSO on 24.04.2016.
     */
    var express = require('express');
    var request = require("request");
    var cheerio = require("cheerio");

    var rp = require('request-promise');
    var jschardet = require("jschardet");
    var charset = require('charset');
    var iconv = require('iconv-lite');



    var url = "http://www.eda.by/";

    // var temperatureReader = require('../public/javascripts/htmlReader');
    var router = express.Router();








    /* GET html */
    router.get('/', function(req, res, next) {

      request(url, function(error, response, body) {
        if (!error) {
          console.log("menu: " + body);
          var $ = cheerio.load(body),
            // temperature = $("[data-variable='temperature'] .wx-value").html();
            links = $("#menu a");


          var products = {
            data: []
          };

          var menuLinks = [];

          links.each(function(i, link) {

            var url = $(link).attr("href");

            if (url != undefined) {
              url = url.replace("/url?q=", "").split("&")[0];
              menuLinks.push(url);
            }
          });
          console.log("menu: " + menuLinks);





          var myRequests = [];


          menuLinks.forEach(function(ref, i) {

            console.log("menu: " + ref);
            myRequests.push(rp(ref));

            // request(ref, function (error, response, body) {
            //     if (!error) {
            //         var $ = cheerio.load(body),
            //         // temperature = $("[data-variable='temperature'] .wx-value").html();
            //             productsHtml =  $(".catalog table tbody tr");
            //
            //
            //         productsHtml.each(function (i, product) {
            //
            //             var dishPicture = $('.dishphoto a', product).attr("href");
            //
            //                 if(dishPicture != undefined) {
            //                     var prod = {};
            //                     prod.type = 'product';
            //                     prod.id = i;
            //                     prod.attributes = {};
            //                     prod.attributes.image = dishPicture;
            //
            //                     products.push(prod);
            //                 }
            //             });
            //         res.send(products);
            //
            //     } else {
            //         console.log("Произошла ошибка: " + error);
            //     }
            // });

          });





          Promise.all(myRequests)
            .then((arrayOfHtml) => {
              // arrayOfHtml[0] is the results from google,
              // arrayOfHtml[1] is the results from someOtherUrl
              // ...etc
              var id = 1;
              arrayOfHtml.forEach(function(page, i) {
                console.log("page: " + page);

                enc = charset(res.headers, page);
                enc = enc || jchardet.detect(page).encoding.toLowerCase();
                if (enc != 'utf-8') {
                  html = iconv.decode(new Buffer(page, 'binary'), enc);
                  //html = iconv.convert(new Buffer(page, 'binary')).toString('utf-8');
                }
                console.log("html: " + html);


                var $ = cheerio.load(page),
                  // temperature = $("[data-variable='temperature'] .wx-value").html();
                  productsHtml = $(".catalog table tr");
                console.log("productsHtml: " + productsHtml);


                productsHtml.each(function(i, product) {

                  console.log("product: " + product);


                  product.children.forEach(function(field, i) {
                    console.log("field: " + field);
                    // console.log("attribs: " + field.attribs['class'] );
                    if (field.attribs != undefined && field.attribs['class'] === 'dishphoto') {
                      var img;
                      if (field.children[0].children.length > 0) {
                        img = field.children[0].children[0].attribs['src'];
                        console.log("img: " + img);
                      } else {
                        img = field.children[0].attribs['src'];
                        console.log("img: " + img);

                      }


                    } else if (field.attribs != undefined && field.attribs['class'] === 'summary') {

                      var desc = field.children[0].data;
                      console.log("desc: " + desc);
                    }

                    if (img != undefined || desc != undefined) {
                      var prod = {};
                      prod.type = 'product';
                      prod.id = id;
                      prod.attributes = {};
                      prod.attributes.image = img;
                      prod.attributes.desc = desc;

                      console.log("prod.attributes.desc : " + prod.attributes.desc);
                      console.log("prod: " + prod);

                      products.data.push(prod);
                      console.log("products: " + products);
                      console.log("id: " + id);
                      id++;
                      console.log("id: " + id);
                    }
                  });


                });




              });



              res.send(products);

            }).catch( /* handle error */ );




        } else {
          console.log("Произошла ошибка: " + error);
        }
      });
    });


   

    module.exports = router;
