var myButton = document.getElementById('button');
var test_button = document.getElementById('test_button');


myButton.addEventListener("click", function(e) {

  e.preventDefault();

  var fileInput = document.getElementById('image');
  var key = fileInput.name;
  var theImage = fileInput.value;
  var formdata = new FormData();

  for(var i = 0; i < fileInput.files.length; i++) {
    formdata.append(key, fileInput.files[i], theImage);
  }


  var requestOptions = {
    method: 'POST',
    body: formdata,
    redirect: 'follow'
  };

  fetch("http://localhost:3000/products/upload", requestOptions)
  .then(response => response.text())
  .then(result => console.log(result))
  .catch(error => console.log('error', error));

});

test_button.addEventListener("click", function(e) {

  var test1 = document.getElementById('test1');
  var test2 = document.getElementById('test2');
  var test1value = test1.value;
  var test2value = test2.value;

  const testdata = {
    name: test1value,
    value: test2value
  }

  const options = {
    method: 'POST',
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(testdata)
  };

  fetch("http://localhost:3000/products/test", options)
  .then(response => response.text())
  .then(result => console.log(result))
  .catch(error => console.log('error', error));

});
