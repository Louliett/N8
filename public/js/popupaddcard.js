var modal = document.getElementById("myModal");

// Get the button that opens the modal

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

// When the user clicks the button, open the modal
function open() {
  var cities;
  modal.style.display = "block";
  fetch('/projectfolder/db/bg.json')
    .then((response) => {
      return response.json();
    })
    .then((myJson) => {
      cities = myJson;


      var dropdown = $('#cities');
      for (var i = 0; i < cities.length; i++) {
        $('<option value=' + cities[i]['city'].toLowerCase() + '>' + cities[i]['city'] + '</option>').appendTo(dropdown);
      }
    });
}

// When the user clicks on <span> (x), close the modal
span.onclick = function() {
  modal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
}
