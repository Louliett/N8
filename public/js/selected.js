var query;
var found = [];
var loaded_products = [];
var x = $("#main").width();
var xx = window.innerWidth;
var y = screen.height;
var ratio = window.devicePixelRatio || 1;
var w = screen.width * ratio;
var h = screen.height * ratio;
var numberDivs;


var divided;


query = decodeURIComponent(window.location.search);
query = query.replace('?', '').toLowerCase();
query = query.split("&");
var typeclassification = query[0];
var sectionclassification = query[1];
var categoryclassification = query[2].replace('null', '');
var subcategoryclassification = query[3].replace('null', '');



$("#includedContent").load("/public/html/header.html", () => {


  $.getScript("/public/js/header.js", function() {

    var dfd = $.Deferred();

    dfd.done(function() {

      setTitle(typeclassification);
      complextitle = sectionclassification + " " + categoryclassification + " " + subcategoryclassification;
      typeclassificationheader = typeclassification;
      sectionclassificationheader = sectionclassification;
      categoryclassificationheader = categoryclassification;
      subcategoryclassificationheader = subcategoryclassification;



      $('.navbar').attr('class', 'navbarnew');
      $('.categorySpace').attr('class', 'categorySpacenew');
      $('.navbar2').attr('class', 'navbar2new');
      $('.logoImg').attr('class', 'logoImgnew');


      var bigimage = $('.bigimage');
      $('.gradient').width(bigimage.width());
      $('.gradient').height(bigimage.height());

      console.log('shitshti')
    });


    dfd.resolve(start());



  });
});


$("#includedFooter").load("/public/html/footer.html", () => {


  $.getScript("/public/js/footer.js", function() {
    console.log('loaded');
    startFooter();

  });
});



$(document).ready(function() {
  $(".query").text('"' + query + '"');
});


var product_list;
var jsonFile;
var maxItemsDisplay = 0;
var startValue = 0;


$('.categorytitle').text(query);




var myHeaders = new Headers();
myHeaders.append("Content-Type", "application/json");

const data = {
  'name': name
}

var raw = JSON.stringify(data);

var requestOptions = {
  method: 'POST',
  headers: myHeaders,
  body: raw,
  redirect: 'follow'
};


/*fetch('http://192.168.0.107:3000/products/' + table, requestOptions)
    .then(response => response.json())
    .then(data => {
      product_list = data
      divided=product_list.length%4;
      for (var i = 0; i < product_list.length; i++) {
        fetchImages(product_list[i].ean, i);
      }
      getClassifications();

    }).catch(error => console.error(error));

*/

function fetchImages(ean, index) {
  const data = {
    ean: ean
  };

  var raw = JSON.stringify(data);
  var myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

  var requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: raw,
    redirect: 'follow'
  };

  fetch('http://192.168.0.107:3000/products/ean-img', requestOptions)
    .then(response => response.json())
    .then(data => {
      var images = [];
      data.forEach((element, index, array) => {
        var path = element.path;
        path = path.replace('.', '');
        images.push(path + element.name);
      });
      //fetchClassification(images, index);
      if (window.matchMedia("(max-width: 767px)").matches) {
        for (var i = 0; i < loaded_products.length; i++) {
          var height = $('#itemrow').innerHeight();
          var width = $('#itemrow').innerWidth();
          loaded_products[i].setAttribute("style", "width: " + (Math.floor(width / (1 + 1))) + "px; height: " + Math.floor(y * 0.4) + "px;");
        }
      } else {
        for (var i = 0; i < loaded_products.length; i++) {
          var height = $('#itemrow').innerHeight();
          var width = $('#itemrow').innerWidth();
          if (i !== loaded_products.length - 1) {
            loaded_products[i].setAttribute("style", "width: " + (Math.floor(width / (1 + 1))) + "px; height: " + Math.floor(y * 0.4) + "px;");
          } else {
            loaded_products[i].setAttribute("style", "width: " + (Math.floor(width / (1))) + "px; height: " + Math.floor(y * 0.4) + "px;");
          }
        }
      }
    }).catch(error => console.error(error));


}


function fetchClassification(images, index) {









  var cardDiv = document.createElement("div");
  var containerName = product_list[index].id;

  if (w > 740) {
    cardDiv.setAttribute("class", "productcontainer");
    cardDiv.setAttribute("id", containerName);
    cardDiv.setAttribute("style", "width: " + (Math.floor(x / 4)) + "px; height: " + Math.floor(y * 0.8) + "px;");
    document.getElementById("itemrow").appendChild(cardDiv);
  } else {

    cardDiv.setAttribute("class", "productcontainer");
    cardDiv.setAttribute("id", containerName);
    cardDiv.setAttribute("style", "width: " + Math.floor(x / 2) + "px; height: " + Math.floor(h * 1.1) + "px; padding:4px;");
    document.getElementById("itemrow").appendChild(cardDiv);

  }
  $(cardDiv).click(function() {
    var now = new Date();
    now.setFullYear(now.getFullYear() + 2);
    document.cookie = "id=" + $(this).attr('id') + "; expires=" + now.toUTCString() + "; " + "path=path/search.html";
    document.location.href = "/public/path/item.html?" + $(this).attr('id');
  });

  loaded_products.push(cardDiv);



  var cardImg = document.createElement("img");
  cardImg.setAttribute("class", "productimg");
  if (images[0] !== undefined) {
    cardImg.setAttribute("src", 'http://192.168.0.107:3000' + images[0]);
    console.log('http://192.168.0.107:3000' + images[0]);
  } else {
    cardImg.setAttribute("src", undefined);

  }

  //cardImg.setAttribute("src", "public/img/loading.gif");
  document.getElementById(containerName).appendChild(cardImg);
  var ratio = cardImg.naturalWidth / cardImg.naturalHeight;
  var x = $(document).width();
  $(".productimg").on("error", function() {
    console.log('shit');
    $(this).attr('src', 'http://192.168.0.107:3000/public/product_images/default.png');
  }); //cardImg.setAttribute("src", "img/loading.gif");
  document.getElementById(containerName).appendChild(cardImg);
  var ratio = cardImg.naturalWidth / cardImg.naturalHeight;
  var x = $(document).width();


  var cardDivInner = document.createElement("div");
  cardDivInner.setAttribute("class", "productdescription");
  cardDivInner.setAttribute("id", "productdescription" + containerName);

  document.getElementById(containerName).appendChild(cardDivInner);
  var x = $(document).width();
  // TODO: fix classification below line 205
  var cardTag = document.createElement("strong");
  cardTag.innerHTML = product_list[index].brand;
  document.getElementById("productdescription" + containerName).appendChild(cardTag);
  var x = $(document).width();

  var cardTitle = document.createElement("p");
  cardTitle.setAttribute("class", "producttitle");
  cardTitle.innerHTML = product_list[index].name;
  document.getElementById("productdescription" + containerName).appendChild(cardTitle);
  var x = $("#main").width();

  var ratio = window.devicePixelRatio || 1;
  var w = screen.width * ratio;
  var h = screen.height * ratio;


  var x = window.devicePixelRatio;




  var priceDiv = document.createElement("div");
  priceDiv.setAttribute("class", "price");
  priceDiv.setAttribute("id", "price" + index);
  priceDiv.innerHTML = product_list[index].price;
  document.getElementById(containerName).appendChild(priceDiv);








}

function displayCategories(images, finalFinal) {
  var categories;
  for (var o = 0; o < finalFinal.length; o++) {

    if (finalFinal[o].name === query[1]) {
      numberDivs = finalFinal[o].uniqueCategories.length;
      categories = finalFinal[o].uniqueCategories;
    }
  }

  for (var q = 0; q < numberDivs; q++) {
    var cardDiv = document.createElement("div");
    var containerName = categories[q].name + q;
    loaded_products.push(cardDiv);

    cardDiv.setAttribute("class", "categorycontainer");
    cardDiv.setAttribute("id", containerName);
    document.getElementById("itemrow").appendChild(cardDiv);


    //loaded_products.push(cardDiv);



    var cardImg = document.createElement("img");
    cardImg.setAttribute("class", "categoryimg");
    if (images[0] !== undefined) {
      cardImg.setAttribute("src", 'http://192.168.0.107:3000' + images[0]);
      console.log('http://192.168.0.107:3000' + images[0]);
    } else {
      cardImg.setAttribute("src", undefined);

    }

    document.getElementById(containerName).appendChild(cardImg);
    $(".categoryimg").on("error", function() {
      console.log('shit');
      $(this).attr('src', 'http://192.168.0.107:3000/public/product_images/default.png');
    }); //cardImg.setAttribute("src", "img/loading.gif");
    document.getElementById(containerName).appendChild(cardImg);

    var cardTitle = document.createElement("p");
    cardTitle.setAttribute("class", "categorytitle");
    cardTitle.innerHTML = categories[q].name.toUpperCase();
    document.getElementById(containerName).appendChild(cardTitle);
  }
}


window.addEventListener('load', function() {

})



showInsides();

function showInsides() {

  if (typeclassification === 'section') {


    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    const data = {
      'name': sectionclassification
    }
    //  const data = {
    //  'category': nameclassification
    //  'section': nameclassification
    //subcategory-category
    //category-section
    // }

    var raw = JSON.stringify(data);

    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: raw,
      redirect: 'follow'
    };


    fetch('http://192.168.0.107:3000/classifications/category-section', requestOptions)
      .then(response => response.json())
      .then(data => {
        createTable(data);
      }).catch(error => console.error(error));

  } else if (typeclassification === 'category') {


    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    const data = {
      'category': categoryclassification,
      'section': sectionclassification
    }
    //  const data = {
    //  'category': nameclassification
    //  'section': nameclassification
    //subcategory-category
    //category-section
    // }

    var raw = JSON.stringify(data);

    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: raw,
      redirect: 'follow'
    };


    fetch('http://192.168.0.107:3000/classifications/subcategory-category', requestOptions)
      .then(response => response.json())
      .then(data => {
        createTable(data);
      }).catch(error => console.error(error));

  } else if (typeclassification === 'subcategory') {

    $.getScript("/public/js/loadProducts.js", function() {
      loadProducts('subcategory', subcategoryclassification);
    });


  }

}

function createTable(data) {
  var table = document.getElementById('imagetablebody');
  var rowone = table.insertRow(0);


  for (var i = 0; i < data.length; i++) {
    var row = table.rows[table.rows.length - 1];
    var cellsLength = row.cells.length;
    if (cellsLength >= 3) {
      row = table.insertRow(table.rows.length)
      var cellsLength = row.cells.length;
      var cell = row.insertCell(row.cells.length - 1);
      cell.setAttribute('colspan', '1');
      cell.setAttribute('rowspan', '1');
      cell.innerHTML = "<div class='classificationdisplay1' data-type='" + typeclassification + "' data-name='" + data[i]['name'] + "' data-section-name='" + sectionclassification + "' data-category-name='" + categoryclassification + "'> <img class='fuckingimage' src='http://192.168.0.107:3000" + data[i]['image'] + "'> <p>" + data[i]['name'] + "</p></div>";

    } else {
      var cellsLength = row.cells.length;

      var cell = row.insertCell(row.cells.length - 1);
      cell.setAttribute('colspan', '1');
      cell.setAttribute('rowspan', '1');
      cell.innerHTML = "<div class='classificationdisplay1' data-type='" + typeclassification + "' data-name='" + data[i]['name'] + "' data-section-name='" + sectionclassification + "' data-category-name='" + categoryclassification + "'> <img class='fuckingimage' src='http://192.168.0.107:3000" + data[i]['image'] + "'> <p>" + data[i]['name'] + "</p></div>";
    }



  }


  var images = $('.classificationdisplay1');

  for (var i = 0; i < images.length; i++) {
    $(images[i]).css('height', $(images[i]).parent().css('height'));
    $(images[i]).css('width', $(images[i]).parent().css('width'));

  }


  var addListeners = document.getElementsByClassName('classificationdisplay1');
  for (var i = 0; i < addListeners.length; i++) {
    addListeners[i].addEventListener('click', function() {
      var type = event.target.dataset.type;
      if (type === 'section') {
        document.location.href = '/public/path/selected.html?category&' + event.target.dataset.sectionName + '&' + event.target.dataset.name + '&null'
      } else if (type === 'category') {
        document.location.href = '/public/path/selected.html?subcategory&' + event.target.dataset.sectionName + '&' + event.target.dataset.categoryName + '&' + event.target.dataset.name
      }
    })
  }




}



/*   <tr>
        <td rowspan='2'><div class='classificationdisplay1'> <img class='fuckingimage' src='/public/img/img23.jpg'> <p>Lifestyle</p></div></td>



            <td colspan='2'><div class='classificationdisplay1'> <img class='fuckingimage' src='/public/img/img23.jpg'> <p>Lifestyle</p></div></td>
            <td colspan='1'><div class='classificationdisplay1'> <img class='fuckingimage' src='/public/img/img23.jpg'> <p>Lifestyle</p></div></td>

        </tr>
         <tr>
        <td><div class='classificationdisplay1'></div></td>
             <td><div class='classificationdisplay1'> <img class='fuckingimage' src='/public/img/img23.jpg'> <p>Lifestyle</p></div></td>
             <td  rowspan='2'><div class='classificationdisplay1'> <img class='fuckingimage' src='/public/img/img23.jpg'> <p>Lifestyle</p></div></td>

        </tr>
          <tr>
        <td colspan='2'><div class='classificationdisplay1'> <img  class='fuckingimage' src='/public/img/img23.jpg'> <p>Lifestyle</p></div></td>


        </tr>
           <tr>
        <td><div class='classificationdisplay1'></div></td>
             <td><div class='classificationdisplay1'> </div></td>
            <td><div class='classificationdisplay1'> <img  class='fuckingimage' src='/public/img/img23.jpg'> <p>Lifestyle</p></div></td>

        </tr>
    */
