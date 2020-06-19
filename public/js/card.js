
var card_modal_div = document.getElementById("card_modal_div");
var card_span_div = document.getElementsByClassName("card_span_div")[0];
var close_card_window = document.getElementById("close_card_window");
//selectors
var month_slc = document.getElementById('expiration_month');
var year_slc = document.getElementById('expiration_year');
var type_slc = document.getElementById('card_type');
var currency_slc = document.getElementById('currency_code');
var add_card_button = document.getElementById('add_card');
//textfields
var card_number_txt = document.getElementById("number");
var card_holder_txt = document.getElementById("holder");
var card_cvv_txt = document.getElementById("cvv");


function createCard(customer) {
  fillTypes();
  fillCurrencies();
  fillMonths();
  fillYears();
  card_modal_div.style.display = "block";

  add_card_button.addEventListener("click", () => {
    var cus_id = customer.id;
    var type = type_slc.value;
    var currency = currency_slc.value;
    var number = card_number_txt.value;
    var holder = card_holder_txt.value;
    var month = month_slc.value;
    var year = year_slc.value;
    var cvv = card_cvv_txt.value;

    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const data = {
      'cus_id': cus_id,
      'type': type,
      'currency': currency,
      'number': number,
      'holder': holder,
      'month': month,
      'year': year,
      'cvv': cvv
    };

    var raw = JSON.stringify(data);

    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: raw,
      redirect: 'follow'
    };

    fetch("http://192.168.0.107:3000/cards/create-card", requestOptions)
      .then(response => response.text())
      .then((result) => {
        //resets the fields
        type_slc.textContent = "";
        currency_slc.textContent = "";
        card_number_txt.value = "";
        card_holder_txt.value = "";
        month_slc.textContent = "";
        year_slc.textContent = "";
        card_cvv_txt.value = "";

        closeCardModal();
        cards(customer);
      }).catch(error => console.log('error', error));
  });

}


function deleteCard(card_id, customer) {
  var myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

  const data = {
    'card_id': card_id
  };

  var raw = JSON.stringify(data);

  var requestOptions = {
    method: 'DELETE',
    headers: myHeaders,
    body: raw,
    redirect: 'follow'
  };

  fetch("http://192.168.0.107:3000/cards/delete-card", requestOptions)
    .then(response => response.text())
    .then((result) => {
      cards(customer);
    }).catch(error => console.log('error', error));
}



function fillTypes() {
  var types = ["credit", "debit"];
  for (var i = 0; i < types.length; i++) {
    var opt = types[i];
    var el = document.createElement("option");
    el.textContent = opt;
    el.value = opt;
    type_slc.appendChild(el);
  }
}

function fillCurrencies() {
  var currencies = ["BGN", "EUR", "USD"];
  for (var i = 0; i < currencies.length; i++) {
    var opt = currencies[i];
    var el = document.createElement("option");
    el.textContent = opt;
    el.value = opt;
    currency_slc.appendChild(el);
  }
}

function fillMonths() {
  var months = ["00", "01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"];
  for (var i = 0; i < months.length; i++) {
    var opt = months[i];
    var el = document.createElement("option");
    el.textContent = opt;
    el.value = opt;
    month_slc.appendChild(el);
  }
}

function fillYears() {
  for (var i = 20; i < 51; i++) {
    var opt = i;
    var el = document.createElement("option");
    el.textContent = opt;
    el.value = opt;
    year_slc.appendChild(el);
  }
}



// When the user clicks on <card_span_div> (x), close the card_modal_div
close_card_window.onclick = function() {
  closeCardModal();
};

// When the user clicks anywhere outside of the card_modal_div, close it
window.onclick = function(event) {
  if (event.target == card_modal_div) {
    closeCardModal();
  }
};



function closeCardModal() {
  card_modal_div.style.display = "none";
}
