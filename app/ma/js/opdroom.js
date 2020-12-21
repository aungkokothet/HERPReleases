
  var accessLevel = 5

  var isnew = true;  
  var doctors = [];

  var datatable = $("#datatable").DataTable({


    columnDefs: [
      {
        orderable: true,
        targets: 0
      }
    ],
    columns : [
      {data : "id_mod"},
      {data : "name"},
      {data : "location"},
      {data : "current_doctor_name"},
      {data : "current_queue_token"}
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
$("#btn_appointment").click(function(){
  showAppointmentTable();
});
$("#btn_appointment_close, #btn_appointment_cancel").click(function(){
  hideAppointmentTable();
});
$("#btn_view_medical_record").click(function(){
  viewMedicalRecordButtonClick();
});
$("#current_doctor_id").on('change',fillDoctor);
$("#btn_detail").click(function(){
  detailButtonClick();
});
$("#btn-detail-close, #btn_detail_cancel").click(function(){
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

function showAppointmentTable(){
  $("#data_table_panel").addClass('d-none');
  $("#appointment_edit_panel").removeClass('d-none');
}

function hideAppointmentTable(){
  $("#data_table_panel").removeClass("d-none");
  $("#appointment_edit_panel").addClass("d-none");
}
function showDetailPanel(){
  $("#data_table_panel").addClass('d-none');
  $("#detail_panel").removeClass('d-none');
}

function hideDetailPanel(){
  $("#data_table_panel").removeClass("d-none");
  $("#detail_panel").addClass("d-none");
}

function clearDataEntryPanel() {
    $("input").removeClass("is-valid");
    $("select").removeClass("is-valid")
    $("#data_id").val('');
    $("#name, #location, #current_queue_token").val('');
    $("#current_doctor_id").val('');

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
        $("#location").val(data[0].location);
        $("#current_doctor_id").val(data[0].current_doctor_id);
        document.getElementById("current_doctor_id").fstdropdown.rebind();
        $("#doctor_name").val(data[0].doctor.employee.name);
        $("#doctor_phone").val(data[0].doctor.employee.phone_number);
        $("#doctor_department").val(data[0].doctor.employee.department.name);
        $("#doctor_position").val(data[0].doctor.employee.position.name);
        $("#doctor_schedule").val(data[0].doctor.schedule);
        $("#current_queue_token").val(data[0].current_queue_token);

        showDataEntryPanel();
    }
    else {
        return false;
    }
}

function detailButtonClick(){
  if(datatable.rows('.selected').any()) {

    var data = datatable.rows({selected:  true}).data();
    console.log(data)
    $("#name_detail").html(data[0].name);
    $("#location_detail").html(data[0].location);
    $("#current_doctor_id_detail").html(data[0].current_doctor_id);
    $("#current_queue_token_detail").html(data[0].current_queue_token);
    $("#doctor_name_detail").html(data[0].doctor.employee.name)
    $("#doctor_phone_detail").html(data[0].doctor.employee.phone_number)
    $("#doctor_department_detail").html(data[0].doctor.employee.department.name)
    $("#doctor_position_detail").html(data[0].doctor.employee.position.name)
    $("#doctor_schedule_detail").html(data[0].doctor.schedule)

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

function appointmentButtonClick() {
  if(datatable.rows('.selected').any()) {
      isnew = false;

      var data = datatable.rows({selected:  true}).data();

      $("#appointment_edit_title").html("Appointment Edit");

      $("#patient_id").val(data[0].patient_id)
      $("#doctor_id").val(data[0].doctor_id);
      $("#opd_room_id").val(data[0].opd_room_id);
      $("#appointment_time").val(moment(data[0].appointment_time).format('YYYY-MM-DDTHH:MM'));
      doctor = doctors.filter(x => x.id==data[0].doctor_id)
      $("#doctor-schedule").html(`<p>${doctor[0].schedule}</p>`)
      $("#status").val(data[0].status);
      $("#source").val(data[0].source);
      showAppointmentTable();
  }
  else {
      return false;
  }
}

function viewMedicalRecordButtonClick(){
  if(datatable.rows('.selected').any()) {

    var data = datatable.rows({selected:  true}).data();

    window.location = 'medical_record.html?patient_id='+data[0].patient_id
  }
  else {
      return false;
  }
}

function saveObj() {
    var request_type = "POST";
    var end_point = API_URI + "opd_rooms/add";
    var data_send = {};

    if(isnew) { //inserting new
        request_type = "POST";
        data_send.name = $("#name").val();
        data_send.location = $("#location").val();
        data_send.current_doctor_id = $("#current_doctor_id").val();
        data_send.current_queue_token = $("#current_queue_token").val();
    }
    else { //editing update
        request_type = "POST"
        data_send = datatable.rows({selected:  true}).data()[0];
        end_point = API_URI + "opd_rooms/" + data_send.id + '/update';
        data_send.current_doctor_id = $("#current_doctor_id").val();
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
    end_point = API_URI + "opd_rooms/" + user_id + '/remove';
    
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
    var end_point = API_URI + "opd_rooms";
    $.ajax({
        url : end_point,
        type: 'POST',
        headers: {"Authorization":'Bearer '+pvar.token}
    }).always(function(data_response) {
      console.log('hello', data_response)
    }).done(function(data_response) {
        loadTable(data_response.data.opd_rooms);
        loadDoctor(data_response.data.doctors);       
                   
    }).fail(function(data_response) {
        dataResponseErrorUI(data_response);
    });
}

function loadTable(table_data) {
    data = table_data.map(x => ({
        ...x,
        id_mod: padToFour(x.id),
        current_doctor_name: x.doctor && x.doctor.employee.name
    }))
    datatable.clear().draw(); 
    datatable.rows.add(data).draw(); 
}

function loadDoctor(data){
  var options = '<option value="" disabled selected>Choose doctor</option>';
  data.forEach(ele => 
    options += `<option value=${ele.id} name="${ele.employee.name}">${ele.employee.name}</option>`)
  $("#current_doctor_id").html(options);
  document.getElementById("current_doctor_id").fstdropdown.rebind();
  doctors = data
}

function fillDoctor(e){
  doctorId = e.target.value;
  doctor = doctors.filter(x => x.id==doctorId)
  console.log(doctor)
  if(doctor[0]){
    $("#doctor_name").val(doctor[0].employee.name);
    $("#doctor_phone").val(doctor[0].employee.phone_number);
    $("#doctor_department").val(doctor[0].employee.department.name);
    $("#doctor_position").val(doctor[0].employee.position.name);
    $("#doctor_schedule").val(doctor[0].schedule);
}
  else{
    $("#doctor_name").val("no doctor choosen");
    $("#doctor_phone").val("no doctor choosen");
    $("#doctor_department").val("no doctor choosen");
    $("#doctor_position").val("no doctor choosen");
    $("#doctor_schedule").val("no doctor choosen");
  }
    
}

/*----- End Function Section ------*/
/*---------------------------------*/