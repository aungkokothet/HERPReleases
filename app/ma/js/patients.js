
  accessLevel = 5
  var isnew = true;  

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
      {data : "phone"},
      {data : "date_of_birth_mod"},
      {data : 'age'},
      {data : "address_mod"},
      {data : "gender"},
      {data : "blood_group_mod"},
      {data : "status_mod"},
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
$("#btn_detail").click(function() {
  detailButtonClick();
});
$("#btn-detail-cancel, .btn-detail-close").click(function(){
 hideDetailPanel();
});
$("#btn_new_medical_record").click(function(){
  medicalRecordButtonClick();
});
$("#btn-medical_record-close, #btn-medical_record-cancel").click(function(){
  hideMedicalRecordPanel();
});
$("#btn_view_medical_record").click(function(){
  viewMedicalRecordButtonClick();
});
$("#btn-medical_record-save").click(function(){
  createMedicalRecord();
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
    $("#date_of_birth, #doctor_name, #doctor_phone, #patient_address, #blood_group, #age").val("");
    $("#gender").val('Male');
    $("#status").val(0);
}

function showDetailPanel(){
  $("#data_table_panel").addClass("d-none");
  $("#detail_panel").removeClass("d-none");
}

function hideDetailPanel(){
  $("#data_table_panel").removeClass("d-none");
  $("#detail_panel").addClass("d-none");
}

function showMedicalRecordPanel(){
  $("#data_table_panel").addClass("d-none");
  $("#medical_record").removeClass("d-none");
}

function hideMedicalRecordPanel(){
  $("#data_table_panel").removeClass("d-none");
  $("#medical_record").addClass("d-none");
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
        $("#date_of_birth").val(data[0].date_of_birth);
        $("#age").val(data[0].age);
        $("#patient_name").val(data[0].name);
        $("#patient_phone").val(data[0].phone);
        $("#patient_address").val(data[0].address);
        $("#blood_group").val(data[0].blood_group);
        $("#gender").val(data[0].gender);
        $("#status").val(data[0].status);
        showDataEntryPanel();
    }
    else {
        return false;
    }
}

function detailButtonClick(){
  if(datatable.rows('.selected').any()) {
    isnew = false;

    var data = datatable.rows({selected:  true}).data();

    $("#data_entry_panel_title").html("Edit");

    $("#detail-id").html(data[0].id);
    $("#detail-date_of_birth").html(data[0].date_of_birth==''?'-':data[0].date_of_birth);
    $("#detail-age").html(data[0].age);
    $("#detail-patient_name").html(data[0].name);
    $("#detail-patient_phone").html(data[0].phone);
    $("#detail-patient_address").html(data[0].address==''?'-':data[0].address);
    $("#detail-blood_group").html(data[0].blood_group==''?'-':data[0].blood_group);
    $("#detail-gender").html(data[0].gender);
    $("#detail-status").html(data[0].status);
    $("#created").html(data[0].created_time);
    $("#updated").html(data[0].updated_time);
    showDetailPanel();
  }
  else {
      return false;
  }
}

function medicalRecordButtonClick(){
  if(datatable.rows('.selected').any()) {

    var data = datatable.rows({selected:  true}).data();

    $("#patient_id").val(data[0].id);

    showMedicalRecordPanel();
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

function viewMedicalRecordButtonClick(){
  if(datatable.rows('.selected').any()) {

    var data = datatable.rows({selected:  true}).data();

    window.location = 'medical_record.html?patient_id='+data[0].id
  }
  else {
      return false;
  }
}

function saveObj() {
    var request_type = "POST";
    var end_point = API_URI + "patients/add";
    var data_send = {};

    var user_id = $("#data_id").val(); //for edit

    if(isnew) { //inserting new
        request_type = "POST";
        data_send.name = $("#patient_name").val();
        data_send.phone = $("#patient_phone").val();
        data_send.date_of_birth = $("#date_of_birth").val();
        data_send.age = $("#age").val();
        data_send.address = $("#patient_address").val();
        data_send.blood_group = $("#blood_group").val();
        data_send.gender = $("#gender").val();
        data_send.status = $("#status").val()
    }
    else { //editing update
        request_type = "POST"
        end_point = API_URI + "patients/" + user_id + '/update';
        var data_send = datatable.rows({selected:  true}).data()[0];
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
    end_point = API_URI + "patients/" + user_id + "/remove";
    
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
    var end_point = API_URI + "patients";
    $.ajax({
        url : end_point,
        type: 'POST',
        headers: {'Authorization': 'Bearer '+ pvar.token, "Content-Type" : "application/json"}
    }).always(function(data_response) {

    }).done(function(data_response) {
        loadTable(data_response.data);        
                   
    }).fail(function(data_response) {
        dataResponseErrorUI(data_response);
    });
}

function createMedicalRecord(){
  var request_type = "POST";
  var end_point = API_URI + "medical_records/add";
  var data_send = {};

  data_send.record_type = $("#record_type").val();
  data_send.patient_id = $("#patient_id").val();
  data_send.weight = $("#patient_weight").val();
  data_send.height = $("#patient_height").val();
  data_send.temperature = $("#patient_temperature").val();
  data_send.pulse_rate = $("#patient_pulse_rate").val();
  data_send.blood_pressure = $("#patient_blood_pressure").val();
  data_send.respiratory_rate = $("#patient_respiratory_rate").val();
  data_send.doctor_accessment = $("#doctor_assessment").val();
  data_send.diagnosis = $("#diagnosis").val();
  data_send.investigation = $("#investigation").val();
  data_send.treatment_procedures = $("#treatments_and_procedures").val();
 
  var pvar = getPvar();
  console.log(data_send)
  $.ajax({
      url : end_point,
      type: request_type,
      dataType : "JSON",
      headers: {"Authorization":"Bearer"+pvar.token, "Content-Type" : "application/json"},
      data: JSON.stringify(data_send)
  }).always(function(data_response) {

  }).done(function(data_response) {
     
    hideMedicalRecordPanel();
    toastr.success("New medical record created.", 'Success', { positionClass: 'toastr toast-top-left', containerId: 'toast-top-left', timeOut: 2000 });
      // load(); //to reload table after successfully saved
      // clearDataEntryPanel();
      // hideDataEntryPanel();

  }).fail(function(data_response) {
    dataResponseErrorUI(data_response);
  });
}

function loadTable(table_data) {
    var data = table_data.map(x => ({
      ...x,
      id_mod: padToFour(x.id),
      status_mod: x.status ? 'Inpatient': 'Outpatient',
      address_mod: x.address == '' ? '-': x.address,
      blood_group_mod: x.blood_group == '' ? '-':x.blood_group,
      date_of_birth_mod: x.date_of_birth == '' ? '-' : moment(x.date_of_birth).format('MMM DD, YYYY'),
      created_time: moment(x.created_time).format('MMM DD, YYYY HH:MM A'),
      updated_time: moment(x.updated_time).format('MMM DD, YYYY HH:MM A')
    }))
    datatable.clear().draw();  
    datatable.rows.add(data).draw(); 
}

/*----- End Function Section ------*/
/*---------------------------------*/