
  accessLevel = 0
  var isnew = true;  

  var opdRooms = [];
  var doctors = [];

  var datatable = $("#datatable").DataTable({

    scrollX: true,

    columnDefs: [
      {
        orderable: true,
        targets: 0
      }
    ],
    columns : [
      {data : "id"},
      {data : "queue_ticket_number"},
      {data : "patient_id"},
      {data : "patient_name"},
      {data : "doctor_id"},
      {data : "doctor_name"},
      {data : "opd_room_id"},
      {data : "opd_room_name"},
      {data : "appointment_time_mod"},
      {data : "status_mod"},
      {data : "source"},
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

$("#doctor_id").on("change",fillOpd)
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
$("#btn_detail").click(function() {
   detailButtonClick();
})
$("#detail-btn_cancel, .detail-btn-close").click(function(){
  hideDetailPanel();
})

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
    $("#patient_id, #doctor_id, #opd_room_id, #appointment_time").val("");
    $("#doctor-schedule").html('<p></p>')
    $("#source").val('Walk In')
    $("#status").val(0)
    document.getElementById("doctor_id").fstdropdown.rebind();
    document.getElementById("patient_id").fstdropdown.rebind();

}

function showDetailPanel(){
  $("#data_table_panel").addClass("d-none");
  $("#detail_panel").removeClass("d-none");
}

function hideDetailPanel(){
  $("#data_table_panel").removeClass("d-none");
  $("#detail_panel").addClass("d-none");
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
        $("#patient_id").val(data[0].patient_id)
        $("#doctor_id").val(data[0].doctor_id);
        $("#opd_room_id").val(data[0].opd_room_id);
        $("#appointment_time").val(moment(data[0].appointment_time).format('YYYY-MM-DDTHH:MM'));
        doctor = doctors.filter(x => x.id==data[0].doctor_id)
        $("#doctor-schedule").html(`<p>${doctor[0].schedule}</p>`)
        $("#status").val(data[0].status);
        $("#source").val(data[0].source);
        $("#create_user_id").val(data[0].create_user_id)
        showDataEntryPanel();
    }
    else {
        return false;
    }
}

function detailButtonClick() {
  if(datatable.rows('.selected').any()) {
      isnew = false;

      var data = datatable.rows({selected:  true}).data();

      $("#data_entry_panel_title").html("Detail");

      $("#detail-patient-id").val(data[0].patient_id);
      $("#detail-patient-name").val(data[0].patient_name);
      $("#detail-doctor-id").val(data[0].doctor_id);
      $("#detail-doctor-name").val(data[0].doctor_name);
      $("#detail-opdroom-id").val(data[0].opd_room_id);
      $("#detail-opdroom-name").val(data[0].opd_room_name);
      $("#detail-appointmenttime").val(moment(data[0].appointment_time).format('YYYY-MM-DDTHH:MM'));
      $("#detail-status").val(data[0].status_mod);
      $("#detail-source").val(data[0].source);
      doctor = doctors.filter(x => x.id==data[0].doctor_id)
      $("#detail-doctor-schedule").html(`<p>${doctor[0].schedule}</p>`)
      $("#detail-created_time").val(moment(data[0].created_time).format('YYYY-MM-DDTHH:MM'));
      $("#detail-updated_time").val(moment(data[0].updated_time).format('YYYY-MM-DDTHH:MM'));
      showDetailPanel();
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
    var end_point = API_URI + "appointments/add";
    var data_send = {};

    var user_id = $("#data_id").val(); //for edit

    if(isnew) { //inserting new
        request_type = "POST";
        data_send.patient_id = $("#patient_id").val();
        data_send.doctor_id = $("#doctor_id").val();
        data_send.opd_room_id = $("#opd_room_id").val();
        data_send.appointment_time = $("#appointment_time").val();
        data_send.status = $("#status").val();
        data_send.source = $("#source").val();
        data_send.create_user_id = $("#create_user_id").val()
    }
    else { //editing update
        request_type = "POST"
        end_point = API_URI + "appointments/" + user_id + '/update';
        var data_send = datatable.rows({selected:  true}).data()[0];
        data_send.patient_id = $("#patient_id").val();
        data_send.doctor_id = $("#doctor_id").val();
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
        headers: {"Authorization":"Bearer"+pvar.token, "Content-Type" : "application/json"},
        data: JSON.stringify(data_send)
    }).always(function(data_response) {
  
    }).done(function(data_response) {
      console.log('succ',data_response)

            toastr.success(data_response.message, 'Success', { positionClass: 'toastr toast-top-left', containerId: 'toast-top-left', timeOut: 2000 });
            load(); //to reload table after successfully saved
            clearDataEntryPanel();
            hideDataEntryPanel();

    }).fail(function(data_response) {
      console.log(data_response)
      dataResponseErrorUI(data_response);
    });
}

function deleteObj() {
    var user_id = datatable.rows({selected:  true}).data()[0].id;
    end_point = API_URI + "appointments/" + user_id + "/remove";
    
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
    var end_point = API_URI + "appointments";
    $.ajax({
        url : end_point,
        type: 'POST',
        headers: {'Authorization': 'Bearer '+ pvar.token, "Content-Type" : "application/json"}
    }).always(function(data_response) {

    }).done(function(data_response) {
        loadTable(data_response.data); 
        loadPatient(data_response.data.patients)  
        loadDoctor(data_response.data.doctors)   
        loadOpdRooms(data_response.data.opds)  
                   
    }).fail(function(data_response) {
        dataResponseErrorUI(data_response);
    });
}
function getStatus(num){
  switch(num){
    case 0: return 'open';
    case 1: return 'complete';
    case 2: return 'cancel'
  }
}

function loadTable(table_data) {
    var data = table_data.appointments.map(x => ({
      ...x,
      status_mod: getStatus(x.status),
      appointment_time_mod: moment(x.appointment_time).format('MMM DD, YYYY, hh:MM A')
    }))
    datatable.clear().draw();  
    datatable.rows.add(data).draw(); 
}

function loadPatient(data){
  var options = '<option value="" disabled selected>Choose patient</option>';
  data.forEach(ele => 
    options += `<option value=${ele.id} name=${ele.name}>${ele.name}, ${ele.phone}</option>`
  )
  $("#patient_id").html(options);
  document.getElementById("patient_id").fstdropdown.rebind();
}

function loadDoctor(data){
  var options = '<option value="" disabled selected>Choose doctor</option>';
  data.forEach(ele => 
    options += `<option value=${ele.id} name=${ele.name}>${ele.name}</option>`)
  $("#doctor_id").html(options);
  document.getElementById("doctor_id").fstdropdown.rebind();
  doctors = data
}

function loadOpdRooms(data){
  var options = "<option value=''></option>";
  options += "<option value='-1'>No opd room for current doctor</option>"
  data.forEach(ele => 
      options += `<option value=${ele.id}>${ele.name}</option>`)
  $("#opd_room_id").html(options)
  opdRooms = data
}

function fillOpd(e){
  doctorId = e.target.value;
  opd = opdRooms.filter(x => x.current_doctor_id==doctorId)
  doctor = doctors.filter(x => x.id==doctorId)
  console.log(doctor)
  if(opd[0])
    $("#opd_room_id").val(opd[0].id)
  else
    $("#opd_room_id").val(-1)
  $("#doctor-schedule").html(`<p>${doctor[0].schedule}</p>`)
}
  
/*----- End Function Section ------*/
/*---------------------------------*/