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

        fetch("http://192.168.0.107:3000/classifications/" + create_class, requestOptions1)
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

        fetch("http://192.168.0.107:3000/classifications/" + create_class_img, requestOptions2)
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
