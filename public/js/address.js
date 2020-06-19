// Get the button that opens the modal_address_div
var modal_address_div = document.getElementById("modal_address_div");
var address_span_div = document.getElementsByClassName("address_span_div")[0];
var close_address_window = document.getElementById("close_address_window");
var shipping_check = document.getElementById("shipping");
//selector
var cities_slc = document.getElementById('bulgarian_cities');
var default_city = document.getElementById('default_city');


//textfields
var address1_txt = $('#address1');
var address2_txt = $('#address2');
var postcode_txt = $('#postcode');
var phone_number_txt = $('#phone_number');
var cities_array = [];




function updateAddress(fields, customer, address_id) {
  console.log("start update");
  var address_operation = $('#address_operation');
  var address_button = $('#address_button');

  var customer_id = customer.id;
  //populating the dropdownlist with cities
  fetchCities(cities_array, cities_slc);
  //changing header and button
  address_operation.html("Update Adress");
  address_button.html("Update Address");
  modal_address_div.style.display = "block";

  address1_txt.val(fields[0].innerHTML);
  address2_txt.val(fields[1].innerHTML);
  default_city.textContent = fields[2].innerHTML;
  postcode_txt.val(fields[3].innerHTML);
  phone_number_txt.val(fields[4].innerHTML);

  if (fields[5].innerHTML == 0) {
    shipping_check.checked = false;
  } else {
    shipping_check.checked = true;
  }

  address_button.click(() => {
    var address1 = address1_txt.val();
    var address2 = address2_txt.val();
    var city = cities_slc.value;
    var postcode = postcode_txt.val();
    var phone_number = phone_number_txt.val();
    var shipping = shipping_check.checked;

    //setting shipping to one or zero for the DATABASE
    if (shipping_check.checked == true) {
      shipping = 1;
    } else {
      shipping = 0;
    }

    const data = {
      'name': address1,
      'second_name': address2,
      'city': city,
      'postcode': postcode,
      'phone_number': phone_number,
      'shipping': shipping,
      'customer_id': customer_id,
      'address_id': address_id
    };

    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    var raw = JSON.stringify(data);
    var requestOptions = {
      method: 'PUT',
      headers: myHeaders,
      body: raw,
      redirect: 'follow'
    };
    fetch("http://192.168.0.107:3000/addresses/update-address", requestOptions)
      .then(response => response.text())
      .then((result) => {
        console.log(result);
        cleanAddressFields([address1_txt, address2_txt, postcode_txt, phone_number_txt], default_city, shipping_check);
        closeAddressModal();
        location.reload();
      }).catch(error => console.log('error', error));
  });
console.log("finish update");
}


// When the user clicks the button, open the modal_address_div
function writeAddress(customer) {
  console.log("writing");
  var address_operation = $('#address_operation');
  var address_button = $('#address_button');

  var customer_id = customer.id;
  fetchCities(cities_array, cities_slc);
  address_operation.html("Create Adress");
  address_button.html("Create Address");
  modal_address_div.style.display = "block";

  cleanAddressFields([address1_txt, address2_txt, postcode_txt, phone_number_txt], default_city, shipping_check);

  address_button.click(() => {


    var address1 = address1_txt.val();
    var address2 = address2_txt.val();
    var city = cities_slc.value;
    var postcode = postcode_txt.val();
    var phone_number = phone_number_txt.val();
    var shipping = shipping_check.checked;

    if (shipping == true) {
      shipping = 1;
    } else {
      shipping = 0;
    }

    const data = {
      'name': address1,
      'second_name': address2,
      'city': city,
      'postcode': postcode,
      'phone_number': phone_number,
      'shipping': shipping,
      'id': customer_id
    };

    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    var raw = JSON.stringify(data);

    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: raw,
      redirect: 'follow'
    };

    fetch("http://192.168.0.107:3000/addresses/create-address", requestOptions)
      .then(response => response.text())
      .then((result) => {
        cleanAddressFields([address1_txt, address2_txt, postcode_txt, phone_number_txt], default_city, shipping_check);
        closeAddressModal();
        address(customer);
      }).catch(error => console.log('error', error));

  });

console.log("finish write");
}


//cleaning the fields
function cleanAddressFields(fields, default_city, shipping) {
  for (var i = 0; i < fields.length; i++) {
    fields[i].val("");
  }
  default_city.textContent = "";
  shipping.checked = false;
}


function updateShipping(customer_id, address_id) {
  var myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

  const data = {
    'customer_id': customer_id,
    'address_id': address_id
  };

  var raw = JSON.stringify(data);

  var requestOptions = {
    method: 'PUT',
    headers: myHeaders,
    body: raw,
    redirect: 'follow'
  };

fetch("http://192.168.0.107:3000/addresses/update-shipping-address", requestOptions)
  .then(response => response.text())
  .then((result) => {
    console.log(result);
    address(customer);
  }).catch(error => console.log('error', error));
}


function deleteAddress(customer_id, address_id) {
  var myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

  const data = {
    'customer_id': customer_id,
    'address_id': address_id
  };

  var raw = JSON.stringify(data);

  var requestOptions = {
    method: 'DELETE',
    headers: myHeaders,
    body: raw,
    redirect: 'follow'
  };

  fetch("http://192.168.0.107:3000/addresses/delete-address", requestOptions)
    .then(response => response.text())
    .then((result) => {
      console.log(result);
      location.reload();
    }).catch(error => console.log('error', error));
}


//populate the dropdown selectors with cities
function fetchCities(array, selector) {
  fetch('/public/db/bg.json')
    .then(response => response.json())
    .then((data) => {
      for (var i = 0; i < data.length; i++) {
        array.push(data[i].city);
      }
      for (var j = 0; j < array.length; j++) {
        var opt = array[j];
        var el = document.createElement("option");
        el.textContent = opt;
        el.value = opt;
        selector.appendChild(el);
      }
    });
}

// When the user clicks on <span> (x), close the modal_address_div
close_address_window.onclick = function() {
  closeAddressModal();
};

// When the user clicks anywhere outside of the modal_address_div, close it
window.onclick = function(event) {
   if (event.target == modal_address_div) {
     closeAddressModal();
   }
};

function closeAddressModal() {
  modal_address_div.style.display = "none";
}
