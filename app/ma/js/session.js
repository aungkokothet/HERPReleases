
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
      {data : "refresh_token_expiry"},
      {data : "login_ip_address"}
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

$("#btn_clean").click(function() {
    cleanButtonClick();
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

function cleanButtonClick() {
    Swal.fire({
        title: 'Are you sure?',
        text: "Cleaning expired user sessions? This will delete all expired sessions.",
        type: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Clean'
    }).then(function (result) {
        if (result.value) { 
            cleanObj();
        }
    });
}

function deleteButtonClick() {
    if (datatable.rows('.selected').any()) {
        Swal.fire({
          title: 'Are you sure?',
          text: "Deleting selected user session?",
          type: 'warning',
          showCancelButton: true,
          confirmButtonText: 'Delete'
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

function cleanObj() {
    end_point = API_URI + "session.php?clean=Y";
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

function deleteObj() {
    var session_id = datatable.rows({selected:  true}).data()[0].id;
    end_point = API_URI + "session.php?sessionid=" + session_id;
    
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
    var end_point = API_URI + "session.php";
    $.ajax({
        url : end_point,
        type: 'GET',
        headers: {"Authorization":pvar.access_token}
    }).always(function(data_response) {

    }).done(function(data_response) {
        if(data_response.success === true) {
            loadTable(data_response.data.objects);        
        }              
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