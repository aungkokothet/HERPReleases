  accessLevel = 5
  var isnew = true;  

  var datatable = $("#datatable").DataTable({

    'scrollX': true,
 
    columnDefs: [
      {
        orderable: true,
        targets: 0
      }
    ],
    columns : [
      {data : "id"},
      {data : "patient_name"},
      {data : "record_type"},
      {data : "created_time"},
      {data : "weight"},
      {data : "height"},
      {data : "temperature"},
      {data : "blood_pressure"},
      {data : "pulse_rate"},
      {data : "respiratory_rate"}
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
const params = new URLSearchParams(window.location.search);

$(document).ready(function() {
  "use strict"
  checkVasibality(accessLevel)
  if(!params.has('patient_id')){
    load();
  }
  else{
    loadByPatientId()
  }
  // init list view datatable
 

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
$("input, textarea").on("input", function() {
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
$("#btn_detail").click(function(){
  detailButtonClick();
});
$("#btn-detail-cancel, #btn-detail-close").click(function(){
  hideDetailPanel();
});
$("#btn_add_prescription").click(function(){
  PrescriptionButtonClick();
});
$("#btn-prescription-close, #btn-prescription-cancel").click(function(){
  hidePrescriptionPanel();
});
$("#btn_request_investigation").click(function(){
  InvestigationButtonClick();
});
$("#btn-investigation-close, #btn-investigation-cancel").click(function(){
  hideInvestigationPanel();
});
$("#btn_view_prescription").click(function(){
  viewPrescriptionButtonClick();
});
$("#btn_view_investigation").click(function(){
  viewInvestigationButtonClick();
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

function showDetailPanel() {
  $("#detail_panel").removeClass("d-none");
  $("#data_table_panel").addClass("d-none");
}

function hideDetailPanel() {
  $("#data_table_panel").removeClass("d-none");
  $("#detail_panel").addClass("d-none");
}

function showPrescriptionPanel() {
  $("#add_prescription_panel").removeClass("d-none");
  $("#data_table_panel").addClass("d-none");
}

function hidePrescriptionPanel() {
  $("#data_table_panel").removeClass("d-none");
  $("#add_prescription_panel").addClass("d-none");
}

function clearPrescriptionPanel(){
  $("#medical_record_id, #pharmacy_item_id, #pharmacy_quantity").val('');
}

function showInvestigationPanel() {
  $("#add_investigation_panel").removeClass("d-none");
  $("#data_table_panel").addClass("d-none");
}

function hideInvestigationPanel() {
  $("#data_table_panel").removeClass("d-none");
  $("#add_investigation_panel").addClass("d-none");
}

function clearInvestigationPanel(){
  $("#medical_record_id, #lab_item_id").val('');
}

function clearDataEntryPanel() {
    $("input, textarea").removeClass("is-valid");
    $("select").removeClass("is-valid");
    $("#record_type, #record_type, #patient_id, #patient_weight, #patient_height, #patient_temperature").val("");
    $("#patient_pulse_rate, #patient_blood_pressure, #patient_respiratory_rate, #doctor_assessment, #diagnosis").val("");
    $("#investigation, #treatments_and_procedures").val("");
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
        $("#record_type").val(data[0].record_type);
        $("#patient_id").val(data[0].patient_id);
        $("#patient_weight").val(data[0].weight);
        $("#patient_height").val(data[0].height);
        $("#patient_temperature").val(data[0].temperature);
        $("#patient_pulse_rate").val(data[0].pulse_rate);
        $("#patient_blood_pressure").val(data[0].blood_pressure);
        $("#patient_respiratory_rate").val(data[0].respiratory_rate);
        $("#doctor_assessment").val(data[0].doctor_accessment);
        $("#diagnosis").val(data[0].diagnosis);
        $("#investigation").val(data[0].investigation);
        $("#treatments_and_procedures").val(data[0].treatment_procedures);
        showDataEntryPanel();
    }
    else {
        return false;
    }
}

function detailButtonClick() {
  if(datatable.rows('.selected').any()) {

      var data = datatable.rows({selected:  true}).data();


      $("#detail_data_id").html(data[0].id);
      $("#record_type_detail").html(data[0].record_type);
      $("#patient_id_detail").html(data[0].patient_id);
      $("#patient_weight_detail").html(data[0].weight);
      $("#patient_height_detail").html(data[0].height);
      $("#patient_temperature_detail").html(data[0].temperature);
      $("#patient_pulse_rate_detail").html(data[0].pulse_rate);
      $("#patient_blood_pressure_detail").html(data[0].blood_pressure);
      $("#patient_respiratory_rate_detail").html(data[0].respiratory_rate);
      $("#doctor_assessment_detail").html(data[0].doctor_accessment);
      $("#diagnosis_detail").html(data[0].diagnosis);
      $("#investigation_detail").html(data[0].investigation);
      $("#treatments_and_procedures_detail").html(data[0].treatment_procedures);
      showDetailPanel();
  }
  else {
      return false;
  }
}

function PrescriptionButtonClick(){
  if(datatable.rows('.selected').any()) {
    clearPrescriptionPanel()
    var data = datatable.rows({selected:  true}).data();

    $("#medical_record_id").val(data[0].id);

    showPrescriptionPanel();
}
else {
    return false;
}
}

function InvestigationButtonClick(){
  if(datatable.rows('.selected').any()) {
    clearInvestigationPanel()
    var data = datatable.rows({selected:  true}).data();

    $("#medical_record_id").val(data[0].id);

    showInvestigationPanel();
}
else {
    return false;
}
}

function viewInvestigationButtonClick(){
  const id = $("#detail_data_id").val();
  window.location = 'investigation_request.html?medical_record_id='+ id
}

function viewPrescriptionButtonClick(){
  const id = $("#detail_data_id").val();
  window.location = 'medical_record_prescription.html?medical_record_id='+ id
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
    var end_point = API_URI + "medical_records/add";
    var data_send = {};

    var user_id = $("#data_id").val(); //for edit

    if(isnew) { //inserting new
        request_type = "POST";
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
    }
    else { //editing update
        request_type = "POST"
        end_point = API_URI + "medical_records/" + user_id + '/update';
        var data_send = datatable.rows({selected:  true}).data()[0];
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
            if(params.has("patient_id")){
              loadByPatientId()
            }
            else{

              load(); //to reload table after successfully saved
            }
            clearDataEntryPanel();
            hideDataEntryPanel();

    }).fail(function(data_response) {
      console.log(data_response)
      dataResponseErrorUI(data_response);
    });
}

function deleteObj() {
    var user_id = datatable.rows({selected:  true}).data()[0].id;
    end_point = API_URI + "medical_records/" + user_id + "/remove";
    
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
    var end_point = API_URI + "medical_records";
    $.ajax({
        url : end_point,
        type: 'POST',
        headers: {'Authorization': 'Bearer '+ pvar.token, "Content-Type" : "application/json"}
    }).always(function(data_response) {
      console.log(data_response)
    }).done(function(data_response) {
        loadTable(data_response.data);     
                   
    }).fail(function(data_response) {
        dataResponseErrorUI(data_response);
    });
}

function loadByPatientId() {
    var pvar = getPvar();
    var end_point = API_URI + "medical_records/patient/"+params.get("patient_id");
    $.ajax({
        url : end_point,
        type: 'POST',
        headers: {'Authorization': 'Bearer '+ pvar.token, "Content-Type" : "application/json"}
    }).always(function(data_response) {
      console.log(data_response)
    }).done(function(data_response) {
        loadTableByPatient(data_response.data.medical_record, data_response.data.name);     
                   
    }).fail(function(data_response) {
        dataResponseErrorUI(data_response);
    });
}

function loadTable(table_data) {
    var data = table_data.map(x => ({
      ...x,
      patient_name: x.patient ? x.patient.name : "-",
      created_time: moment(x.created_time).format('MMM DD, YYYY HH:MM A'),
      updated_time: moment(x.updated_time).format('MMM DD, YYYY HH:MM A')
    }))
    datatable.clear().draw(); 
    datatable.rows.add(data).draw(); 
}

function loadTableByPatient(table_data, name) {
  var data = table_data.map(x => ({
    ...x,
    patient_name: name,
    created_time: moment(x.created_time).format('MMM DD, YYYY HH:MM A'),
    updated_time: moment(x.updated_time).format('MMM DD, YYYY HH:MM A')
  }))
  datatable.clear().draw(); 
  datatable.rows.add(data).draw(); 
}

/*----- End Function Section ------*/
/*---------------------------------*/