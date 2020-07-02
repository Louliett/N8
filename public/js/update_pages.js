"use strict";


var pages_table = document.getElementById('pages_table');

populateTable(pages_table);



function populateTable(table) {

    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    var requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
    };
    fetch('http://192.168.0.108:3000/pages/', requestOptions)
        .then(response => response.json())
        .then(data => {

            if (data.length > 0) {
                console.log("data > 0");
                var tempp = "";
                var page_id;
                var image;

                data.forEach((u) => {
                    tempp += "<tr>";
                    tempp += "<td>" + u.name + "</td>";
                    if (typeof u.image === undefined || u.image === "") {
                        tempp += "<td>" + "<input type='file' class='file_input' data-page-id='" + u.id + "' id='page_image_" + u.id + "'/>" + "</td>";
                    } else {
                        tempp += "<td><img src='" + u.image + "' style='width:100px;height:60px;'></img>" + "</br>" + "<button type='button' class='delete_image' data-image= '" + u.image + "' data-page-id= '" + u.id + "'> Delete </button>" + "</td>";
                    }
                    tempp += "<tr>";
                });
                table.innerHTML = tempp;

                $('.file_input').change((e) => {
                    var page_id = e.target.dataset.pageId;
                    uploadImage(e.target, page_id);
                });

                var del_img_btn = document.getElementsByClassName('delete_image');
                var delete_image = $('.delete_image');

                delete_image.click((event) => {
                    page_id = event.target.dataset.pageId;
                    var cell = event.target.parentNode;
                    image = event.target.dataset.image;
                    console.log(page_id);


                    deleteImage(image, page_id);
                    var file_input = $("<input type='file' data-page-id='" + page_id + "' id='page_image_" + page_id + "'/>");
                    $(cell).html(file_input);

                    $(file_input).change((e) => {
                        var page_id = e.target.dataset.pageId;
                        uploadImage(e.target, page_id);
                    });
                    $(event.target).remove();
                });



            }
        }).catch(error => console.error(error));

}


function deleteImage(image, page_id) {
    console.log(image, "image");
    console.log(page_id, "page_id");

    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    const data = {
        'id': page_id,
        'image': image
    };
    var raw = JSON.stringify(data);
    var requestOptions = {
        method: 'DELETE',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
    };

    fetch("http://192.168.0.108:3000/pages/delete-image", requestOptions)
        .then(response => response.text())
        .then((result) => {
            console.log(result);
            $('#pages_table').load(document.URL + ' #pages_table', () => {
                populateTable(pages_table);
            });
        }).catch(error => console.log('error', error));

}

function uploadImage(fileInput, id) {
    console.log(fileInput, "fileinput");

    var key = "pageImage";
    var image_name = fileInput.files[0];
    var image_path = fileInput.value;

    var formdata = new FormData();
    formdata.append("id", id);
    formdata.append(key, image_name, image_path);

    var requestOptions = {
        method: 'PUT',
        body: formdata,
        redirect: 'follow'
    };

    fetch("http://192.168.0.108:3000/pages/update", requestOptions)
        .then(response => response.text())
        .then(result => {
            console.log(result);
            $('#pages_table').load(document.URL + ' #pages_table', () => {
                populateTable(pages_table);
            });
            //location.reload(true);
        }).catch(error => console.log('error', error));
}