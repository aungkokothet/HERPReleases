
  var accessLevel = 5

  var isnew = true;  

  var datatable = $("#datatable").DataTable({

    "scrollX" : true,

    columnDefs: [
      {
        orderable: true,
        targets: 0
      }
    ],
    columns : [
      {data : "id"},
      {data : "name"},
      {data : "pharmacy_category_id"},
      {data : "universal_product_code"},
      {data : "sale_price"},
      {data : "purchase_price"},
      {data : "supplier_id"},
      {data : "created_user_id"},
      {data : "created_time"},
      {data : "updated_user_id"},
      {data : "updated_time"}
    ],
    dom:
      '<"top"<"actions action-btns"B><"action-filters"lf>><"clear">rt<"bottom"<"actions">p>',
    oLanguage: {
      sLengthMenu: "_MENU_",
      sSearch: ""
    },
    aLengthMenu: [[10, 50, 100, 200], [10, 50, 100, 200]],
    select: {
      style: "single"
    },
    order: [[0, "asc"]],
    bInfo: false,
    pageLength: 10,
    buttons: [
        {extend : 'csv', text : '<i class="material-icons md-18">text_snippet</i>', titleAttr : 'CSV'},
        {extend : 'excel', text : '<i class="material-icons md-18">file_copy</i>', titleAttr : 'Excel'}, 
        {extend : 'print', text : '<i class="material-icons md-18">print</i>', titleAttr : 'Print'},
        {
          text: "<i class='material-icons md-18'>web_asset_off</i>",
          action: function() {

            datatable.rows({selected: true}).deselect();

          },
          titleAttr : 'Unselect',
          className: "btn btn-secondary border"
        }
    ],
    initComplete: function(settings, json) {
      $(".dt-buttons .btn").removeClass("btn-secondary");
      $(".dt-buttons .btn").addClass("btn-light mb-2")
    }
  });

//disable unselecting when double click
datatable.on('user-select', function ( e, dt, type, cell, originalEvent ) {
    var row = dt.row( cell.index().row ).node();
    if ($(row).hasClass('selected') ) {
        // deselect
        return false;
    }
    else {
      //select
    }
});

$(document).ready(function() {
  "use strict"
  checkVasibality(accessLevel)
  // init list view datatable
  load();

  //restrict typing space on username textbox
  $('#username').on('keypress', function(e) {
    if (e.which == 32) {
      return false;
    }
  });

});

/*----- Start Event Section ------*/

/* 
This section organizes user interactions and events on UI that call functions
*/

//password field reveal event function when button click in entry form
$("#btn-see-password").mousedown(function() {
  $("#password").attr("type", "text");
}).mouseup(function() {
  $("#password").attr("type", "password");
});

$("#btn_reset_login_attempt").click(function() {
  $("#login_attempt").val("0");
  $("#login_attempt").addClass("is-valid");
});

//editing user data detect
$("input").on("input", function() {
  if(!isnew) {
    $(this).addClass("is-valid");
  }  
});

$("select").on("input", function() {
  if(!isnew) {
    $(this).addClass("is-valid");
  }
});

$(".btn-close, #btn_cancel").click(function() {
    hideDataEntryPanel();
});

$("#btn_new").click(function() {
    newButtonClick();    
});
$("#btn_edit").click(function() {
    editButtonClick();
});
$("#btn_save").click(function() {
    saveObj();
  });
$("#btn_delete").click(function() {
    deleteButtonClick();
});

/*----- End Event Section ------*/
/*------------------------------*/

/*----- Start Function Section ------*/
function showDataEntryPanel() {
    $("#data_entry_panel").removeClass("d-none");
    $("#data_table_panel").addClass("d-none");
}

function hideDataEntryPanel() {
    $("#data_table_panel").removeClass("d-none");
    $("#data_entry_panel").addClass("d-none");
}

function clearDataEntryPanel() {
    $("input").removeClass("is-valid");
    $("select").removeClass("is-valid");
    $("#data_id, #name, #sale_price, #purchase_price, #universal_product_code").val('');
    $("#supplier_id, #pharmacy_category_id").val('')

}

function newButtonClick() {
    isnew = true;
    datatable.rows({selected: true}).deselect();
    $("#data_entry_panel_title").html("New");    
    
    clearDataEntryPanel();
    showDataEntryPanel();
}

function editButtonClick() {
    if(datatable.rows('.selected').any()) {
        isnew = false;
        clearDataEntryPanel();

        var data = datatable.rows({selected:  true}).data();

        $("#data_entry_panel_title").html("Edit");

        $("#data_id").val(data[0].id);
        $("#name").val(data[0].name);
        $("#pharmacy_category_id").val(data[0].pharmacy_category_id);
        $("#universal_product_code").val(data[0].universal_product_code);
        $("#sale_price").val(data[0].sale_price);
        $("#purchase_price").val(data[0].purchase_price);
        $("#supplier_id").val(data[0].supplier_id);

        showDataEntryPanel();
    }
    else {
        return false;
    }
}

function deleteButtonClick() {
    if (datatable.rows('.selected').any()) {
        Swal.fire({
          title: 'Are you sure?',
          text: "You won't be able to revert this!",
          type: 'warning',
          showCancelButton: true,
          confirmButtonText: 'Delete',
          confirmButtonClass: 'btn btn-danger',
          cancelButtonClass: 'btn btn-light ml-1',
          buttonsStyling: false,
        }).then(function (result) {
          if (result.value) { 
            deleteObj();
          }
        });
      }
      else {
        return false;
      }
}

function saveObj() {
    var request_type = "POST";
    var end_point = API_URI + "pharmacy_items/add";
    var data_send = {};

    if(isnew) { //inserting new
        request_type = "POST";
        data_send.name = $("#name").val()
        data_send.pharmacy_category_id = $("#pharmacy_category_id").val();
        data_send.universal_product_code = $("#universal_product_code").val();
        data_send.sale_price = $("#sale_price").val();
        data_send.purchase_price = $("#purchase_price").val();
        data_send.supplier_id = $("#supplier_id").val();

    }
    else { //editing update
        request_type = "POST"
        data_send = datatable.rows({selected:  true}).data()[0];
        end_point = API_URI + "pharmacy_items/" + data_send.id + '/update';

        $.each($(".is-valid"), function(index, obj) {
            var fieldname = obj.attributes.name.value;
            data_send[fieldname] = obj.value;
        });    
    }
    console.log(data_send)
    var pvar = getPvar();
    $.ajax({
        url : end_point,
        type: request_type,
        dataType : "JSON",
        headers: {"Authorization":"Bearer "+pvar.token, "Content-Type" : "application/json"},
        data: JSON.stringify(data_send)
    }).always(function(data_response) {
      console.log(data_response)

    }).done(function(data_response) {
  
            toastr.success(data_response.message, 'Success', { positionClass: 'toastr toast-top-left', containerId: 'toast-top-left', timeOut: 2000 });
            load(); //to reload table after successfully saved
            clearDataEntryPanel();
            hideDataEntryPanel();
               
    }).fail(function(data_response) {
      dataResponseErrorUI(data_response);
    });
}

function deleteObj() {
  console.log(datatable.rows({selected: true}).data()[0])
    var user_id = datatable.rows({selected:  true}).data()[0].id;
    end_point = API_URI + "pharmacy_items/" + user_id + '/remove';
    
    var pvar = getPvar();
    $.ajax({
        url : end_point,
        type: "POST",
        dataType : "JSON",
        headers: {"Authorization" : 'Bearer ' + pvar.token}
    }).always(function(data_response) {
  
    }).done(function(data_response) {
            toastr.warning(data_response.message, 'Warning', { positionClass: 'toastr toast-top-left', containerId: 'toast-top-left', timeOut: 2000 });
            load(); //to reload table after successfully deleted
  
    }).fail(function(data_response) {
        dataResponseErrorUI(data_response);
    });
}

function load() {
    var pvar = getPvar();
    var end_point = API_URI + "pharmacy_items";
    $.ajax({
        url : end_point,
        type: 'POST',
        headers: {"Authorization":'Bearer '+pvar.token}
    }).always(function(data_response) {
      console.log(data_response)
    }).done(function(data_response) {
        loadTable(data_response.data);       
                   
    }).fail(function(data_response) {
        dataResponseErrorUI(data_response);
    });
}

function loadTable(table_data) {
    var data = table_data.map(x => ({
      ...x,
      created_time: moment(x.created_time).format('hh:mm/MMM-DD-YYYY'),
      updated_time: moment(x.updated_time).format('hh:mm/MMM-DD-YYYY')
    }))
    datatable.clear().draw(); 
    datatable.rows.add(data).draw(); 
}

/*----- End Function Section ------*/
/*---------------------------------*/