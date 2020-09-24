
  var isnew = true;  

  var datatable = $("#datatable").DataTable({

    columnDefs: [
      {
        orderable: true,
        targets: 0
      }
    ],
    columns : [
      {data : "id"},
      {data : "username"},
      {data : "fullname"},
      {data : "level"},
      {data : "status"},
      {data : "login_attempt"}
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
        {extend : 'csv', text : '<i class="mdi mdi-file-document"></i>', titleAttr : 'CSV'},
        {extend : 'excel', text : '<i class="mdi mdi-file-excel"></i>', titleAttr : 'Excel'}, 
        {extend : 'print', text : '<i class="mdi mdi-printer"></i>', titleAttr : 'Print'},
        {
          text: "<i class='mdi mdi-select-off'></i>",
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
    $("#username").prop("disabled", false)
    $("input").removeClass("is-valid");
    $("#username, #password, #fullname").val("");
    $("#level, #status").prop("selectedIndex", 0).trigger('change');
    $("#login_attempt").val("0");
    $("#btn_reset_login_attempt").prop("disabled", true);
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
        $("#btn_reset_login_attempt").prop("disabled", false);

        $("#data_id").val(data[0].id);
        $("#username").val(data[0].username).prop("disabled", true);
        $("#password").val("");
        $("#fullname").val(data[0].fullname);
        $("#level").val(data[0].level).trigger("change");
        $("#status").val(data[0].status).trigger("change");
        $("#login_attempt").val(data[0].login_attempt);
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
    var end_point = API_URI + "users/add";
    var data_send = {};

    var user_id = $("#data_id").val(); //for edit
    var username = $("#username").val();
    var password = $("#password").val();
    var fullname = $("#fullname").val();
    var level = $("#level").val();
    var status = $("#status").val();
    var login_attempt = $("#login_attempt").val();

    if(isnew) { //inserting new
        request_type = "POST";
        data_send.username = username;
        data_send.password = password;
        data_send.fullname = fullname;
        data_send.level = level;
        data_send.status = status;
        data_send.login_attempt = login_attempt;
    }
    else { //editing update
        request_type = "PATCH"
        end_point = API_URI + "users/" + user_id + '/update';
        $.each($(".is-valid"), function(index, obj) {
            var fieldname = obj.attributes.name.value;
            data_send[fieldname] = obj.value;
        });    
    }
    
    var pvar = getPvar();
    $.ajax({
        url : end_point,
        type: request_type,
        dataType : "JSON",
        headers: {"Authorization":"Bearer"+pvar.token, "Content-Type" : "application/json"},
        data: JSON.stringify(data_send)
    }).always(function(data_response) {
  
    }).done(function(data_response) {
      console.log('succ',data_response)
        if(data_response.success === true) {
            toastr.success(data_response.messages[0], 'Success', { positionClass: 'toastr toast-top-left', containerId: 'toast-top-left', timeOut: 2000 });
            load(); //to reload table after successfully saved
            clearDataEntryPanel();
            hideDataEntryPanel();
        }              
    }).fail(function(data_response) {
      console.log('fail',data_response)  
      //dataResponseErrorUI(data_response);// TODO: enable this 
    });
}

function deleteObj() {
    var user_id = datatable.rows({selected:  true}).data()[0].id;
    end_point = API_URI + "user.php?user_id=" + user_id;
    
    var pvar = getPvar();
    $.ajax({
        url : end_point,
        type: "DELETE",
        dataType : "JSON",
        headers: {"Authorization" : pvar.access_token}
    }).always(function(data_response) {
  
    }).done(function(data_response) {
        if(data_response.success === true) {
            toastr.warning(data_response.messages[0], 'Warning', { positionClass: 'toastr toast-top-left', containerId: 'toast-top-left', timeOut: 2000 });
            load(); //to reload table after successfully deleted
        }
    }).fail(function(data_response) {
        dataResponseErrorUI(data_response);
    });
}

function load() {
    var pvar = getPvar();
    var end_point = API_URI + "users";
    $.ajax({
        url : end_point,
        type: 'POST',
        headers: {"Authorization":'Bearer'+pvar.token}
    }).always(function(data_response) {

    }).done(function(data_response) {
        loadTable(data_response.data);        
                   
    }).fail(function(data_response) {
        dataResponseErrorUI(data_response);
    });
}

function loadTable(table_data) {
    datatable.clear().draw();  
    datatable.rows.add(table_data).draw(); 
}

/*----- End Function Section ------*/
/*---------------------------------*/