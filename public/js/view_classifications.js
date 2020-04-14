"use strict"

//html tables
var sub_table = "subcategory_table";
var cat_table = "category_table";
var sec_table = "section_table";
//sql tables
var sub = "subcategory";
var cat = "category";
var sec = "section";


populateTable(sub, sub_table);
populateTable(cat, cat_table);
populateTable(sec, sec_table);


function populateTable(name, table) {
  var myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");
  var requestOptions = {
    method: 'GET',
    headers: myHeaders,
    redirect: 'follow'
  };
  fetch('http://192.168.0.105:3000/classifications/' + name, requestOptions)
    .then(response => response.json())
    .then(data => {

        if(data.length > 0) {
          var tempp = "";

          data.forEach((u) => {
              tempp += "<tr class='tableRow'>";
              tempp += "<td data-tname=" + table + ">" + u.id + "</td>";
              tempp += "<td data-tname=" + table + ">" + u.name + "</td>";
              tempp += "<tr>"
            });
          document.getElementById(table).innerHTML = tempp;
          var row = document.getElementsByClassName('tableRow');

          for (var i = 0; i < row.length; i++) {
            row[i].addEventListener("click", () => {
              var key = event.target.parentNode.childNodes[0].innerHTML;
              var tname = event.target.dataset.tname;
              document.location.href = "update_classification.html?" + key + "&" + tname;
            });
          }
        }

    }).catch(error => console.error(error));
}
