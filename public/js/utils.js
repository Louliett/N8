"use strict";


//non-strict empty field checker
export function isItEmpty(myArray) {
  var checker = 0;

  for(var i = 0; i < myArray.length; i++) {
    if(myArray[i] === "") {
      checker++;
    }
  }

  if(checker === myArray.length) {
    return true;
  } else {
    return false;
  }

}

//strict empty field checker
export function isItEmptyStrict(myArray) {
  var checker = 0;

  for (var i = 0; i < myArray.length; i++) {
    if (myArray[i] === "") {
      checker++;
    }
  }

  if (checker > 0) {
    return true;
  } else {
    return false;
  }

}

//displays the contents of a formdata in humanly readable form
export function readFormData(formdata) {
  for (var pair of formdata.entries()) {
    console.log(pair[0] + ', ' + pair[1]);
  }
}

//method used by the update_product script
export function createClassification(txtarea, array, create_class, create_class_img, error_label, fileInput, key, selector_id) {
  //array for checking up on empty fields
  let fields = [];
  var image_name;
  var image_path;
  var flag;
  var headers;
  var formdata;
  const image = "/public/class_images/default.png";

  var class_name = txtarea.value;
  fields.push(class_name);


  if (isItEmpty(fields) == true) {
    error_label.innerHTML = "Field is empty!";
    txtarea.value = "";
  } else if (txtarea.value.includes(',')) {
    error_label.innerHTML = "Classification can not contain commas!";
    txtarea.value = "";
  } else {

    if (array.length > 0) {
      flag = doesItMatch(class_name, array);
    } else {
      flag = false;
    }

    if (flag == true) {
      error_label.innerHTML = "This classification already exists!";
    } else {
      image_name = fileInput.files[0];
      image_path = fileInput.value;

      //in case the user did not attach an image to the classification
      if ((image_name === undefined && image_path.length === 0) || (image_name === undefined || image_path.length === 0)) {

        headers = new Headers();
        headers.append("Content-Type", "application/json");

        const data = {
          "name": class_name,
          "image": image
        };

        var raw = JSON.stringify(data);

        var requestOptions1 = {
          method: 'POST',
          headers: headers,
          body: raw,
          redirect: 'follow'
        };

        fetch("http://192.168.0.108:3000/classifications/" + create_class, requestOptions1)
          .then(response => response.text())
          .then(result => {
            error_label.innerHTML = result;
            location.reload(true);
            // $(selector_id).html = "";
            // //to be changed, the drop down menu!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!11
            // $('#tity').load(document.URL + ' ' + '#tity', () => {
            //   txtarea.value = "";
            // });

          }).catch(error => console.log('error', error));

      } else {
        formdata = new FormData();
        formdata.append("name", class_name);
        formdata.append(key, image_name, image_path);

        var requestOptions2 = {
          method: 'POST',
          body: formdata,
          redirect: 'follow'
        };

        fetch("http://192.168.0.108:3000/classifications/" + create_class_img, requestOptions2)
          .then(response => response.text())
          .then(result => {
            error_label.innerHTML = result;
            location.reload(true);
            // $(selector_id).load(document.URL + ' ' + selector_id, () => {
            //   fetchStuff($('#product_subcategory')[0], $('#product_category')[0], $('#product_section')[0], class_name);
            //   //$(default_option).val(class_name);
            //   txtarea.value = "";
            // });

          }).catch(error => console.log('error', error));
      }

    }
  }


}

function doesItMatch(name, name_arr) {
  for (var i = 0; i < name_arr.length; i++) {
    if (name === name_arr[i]) {
      return true;
    }
  }
  return false;
}

//to be not deleted, might be used later!!
// function createStripesProduct(prod_name, prod_price, prod_brand, prod_descript, prod_image) {

//   stripe.products.create({
//       name: prod_name,
//       attributes: [prod_brand],
//       description: prod_descript,
//       images: [prod_image],
//       type: "good"
//     },
//     function (err, product) {
//       // asynchronously called
//       if (err) {
//         console.log(err);
//       } else {
//         console.log(product, "product");

//         stripe.prices.create({
//             unit_amount: prod_price * 100,
//             currency: 'bgn',
//             product: product.id
//           },
//           function (err, price) {
//             if (err) {
//               console.log(err);
//               //return false;
//             } else {
//               console.log(price, "price");
//               return true;




//             }
//           }
//         );


//       }
//     }
//   );

// }


//create product [v]
// router.post('/create-product', (req, res) => {
//   let product = req.body;
//   var values = [product.name, product.price, product.new_price, product.ean,
//     product.availability, product.quantity, product.brand, product.design,
//     product.description, product.material, product.diameter, product.length,
//     product.width, product.height, product.volume, product.weight,
//     product.size, product.subcategory, product.category, product.section];


//   sql = "INSERT INTO product (name, price, new_price, ean, availability, quantity, brand, design, " +
//         "description, material, diameter, length, width, height, volume, weight, size) " +
//         "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?); " +
//         "SET @productID = LAST_INSERT_ID(); " +
//         "INSERT INTO product_classification (product_id, subcategory_id, category_id, section_id) " +
//         "VALUES (@productID, " +
//         "(SELECT id FROM subcategory WHERE name = ?), " +
//         "(SELECT id FROM category WHERE name = ?), " +
//         "(SELECT id FROM section WHERE name = ?));";

//   connection.query(sql, values, (err, rows, fields) => {
//     if (err) {
//       res.send(err);
//     } else {
//       //---------------------------------------------------------
//       // stripe.products.create({
//       //     object: 'product',
//       //     name: 'Gold Special',
//       //     attributes: [],
//       //   },
//       //   function (err, product) {
//       //     // asynchronously called
//       //     if (err) {
//       //       console.log(err);

//       //     } else {
//       //       console.log(product);

//       //     }
//       //   }
//       // );
//       //-----------------------------------------------------------
//       var id = rows[0]["insertId"];
//       id = id + "";
//       res.send(id);
//     }
//   });
// });


// //upload images [v]
// router.post('/upload-images', upload.array('myImage', 5), (req, res) => {
//   let product = req.body;
//   var colours = [];
//   if(typeof(req.body.colour) === 'string') {
//     colours.push(req.body.colour);
//   } else {
//     colours = req.body.colour;
//   }
//
//   console.log(req.files);
//   console.log("Images uploaded to the server!!");
//   var first = "";
//   var second = "";
//   var imgarray = [];
//   var imgproduct = [];
//   var bigboss = [];
//
//   for (var i = 0; i < req.files.length; i++) {
//     imgarray.push([req.files[i].filename, req.files[i].destination, colours[i]]);
//     imgproduct.push([product.id, req.files[i].filename]);
//
//     if(i !== req.files.length-1) {
//       first = first + "(?, ?, ?),";
//       second = second + "(?, (SELECT id FROM image WHERE name = ?)),";
//     } else {
//         first = first + "(?, ?, ?);";
//         second = second + "(?, (SELECT id FROM image WHERE name = ?));";
//     }
//   }
//
//   sql = "INSERT INTO image (name, path, colour) VALUES " + first + "INSERT INTO product_image (product_id, image_id) VALUES " + second;
//
//   for (var j = 0; j < imgarray.length; j++) {
//     bigboss.push(imgarray[j]);
//   }
//   for (var k = 0; k < imgproduct.length; k++) {
//     bigboss.push(imgproduct[k]);
//   }
//
//   const newboss = bigboss.flat(Infinity);
//
//   connection.query(sql, newboss, (err, rows, fields) => {
//       if(err) {
//         res.send(err);
//         console.log(err);
//         console.log("upload images to db failed!");
//       } else {
//         res.send({'status': 201});
//         console.log("upload images to db success!");
//       }
//     });
// });