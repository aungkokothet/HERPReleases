
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
      {data : "id_mod"},
      {data : "name"},
      {data : "gender"},
      {data : "education"},
      {data : "marital_status"},
      {data : "number_of_children"},
      {data : "live_with_parent"},
      {data : "live_with_spouse_parent"},
      {data : "phone_number"},
      {data : "emergency_contact_phone"},
      {data : "date_of_birth"},
      {data : "nrc_number"},
      {data : "bank_account_number"},
      {data : "passport_number"},
      {data : "address"},
      {data : "position"},
      {data : "department"},
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

function showDetailPanel() {
  $("#data_table_panel").addClass("d-none");
  $("#detail_panel").removeClass("d-none");
}

function hideDetailPanel() {
  $("#data_table_panel").removeClass("d-none");
  $("#detail_panel").addClass("d-none");
}


function clearDataEntryPanel() {
    $("input").removeClass("is-valid");
    $("select").removeClass("is-valid")
    $("#data_id").val('');
    $("#employee_id").val('')
    $("#name").val('')
    $("#gender").val('');
    $("#education").val('');
    $("#marital_status").val('').trigger("change");
    $("#num_of_children").val('');
    $("#live_with_parent").val('');
    $("#live_with_spouse").val('');
    $("#phone").val('');
    $("#emergancy_phone").val('');
    $("#DOB").val('');
    $("#nrc").val('');
    $("#bank").val('');
    $("#passport").val('')
    $("#address").val('')
    $("#position").val('')
    $("#depertment").val('')
    $("#status").val('')

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
        $("#name").val(data[0].name)
        $("#gender").val(data[0].gender);
        $("#education").val(data[0].education);
        $("#marital_status").val(data[0].marital_status).trigger("change");
        $("#num_of_children").val(data[0].number_of_children);
        $("#live_with_parent").val(data[0].live_with_parent);
        $("#live_with_spouse_parent").val(data[0].live_with_spouse_parent);
        $("#phone").val(data[0].phone_number);
        $("#emergacy_phone").val(data[0].emergacy_contact_phone);
        $("#DOB").val(data[0].date_of_birth);
        $("#nrc").val(data[0].nrc_number);
        $("#bank").val(data[0].bank_account_number);
        $("#passport").val(data[0].passport_number)
        $("#address").val(data[0].address)
        $("#position").val(data[0].position_id)
        $("#depertment").val(data[0].department_id)
        $("#status").val(data[0].status)

        showDataEntryPanel();
    }
    else {
        return false;
    }
}

function detailButtonClick(){
  if(datatable.rows('.selected').any()) {

    var data = datatable.rows({selected:  true}).data();

    $("#data_id_detail").html(data[0].id);
    $("#name_detail").html(data[0].name)
    $("#gender_detail").html(data[0].gender);
    $("#education_detail").html(data[0].education);
    $("#marital_status_detail").html(data[0].marital_status);
    $("#num_of_children_detail").html(data[0].number_of_children);
    $("#live_with_parent_detail").html(data[0].live_with_parent);
    $("#live_with_spouse_parent_detail").html(data[0].live_with_spouse_parent);
    $("#phone_detail").html(data[0].phone_number);
    $("#emergancy_phone_detail").html(data[0].emergency_contact_phone);
    $("#DOB_detail").html(data[0].date_of_birth);
    $("#nrc_detail").html(data[0].nrc_number);
    $("#bank_detail").html(data[0].bank_account_number);
    $("#passport_detail").html(data[0].passport_number)
    $("#address_detail").html(data[0].address)
    $("#position_detail").html(data[0].position)
    console.log(data[0].department)
    $("#department_detail").html(data[0].department)
    $("#status_detail").html(data[0].status_mod)

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
    var end_point = API_URI + "employees/add";
    var data_send = {};

    if(isnew) { //inserting new
        request_type = "POST";
        data_send.name = $("#name").val()
        data_send.gender = $("#gender").val();
        data_send.education = $("#education").val();
        data_send.marital_status = $("#marital_status").val()
        data_send.number_of_children = $("#num_of_children").val() === '' ? null : $("#num_of_children").val();
        data_send.live_with_parent = $("#live_with_parent").val();
        data_send.live_with_spouse_parent = $("#live_with_spouse_parent").val();
        data_send.phone_number = $("#phone").val();
        data_send.emergency_contact_phone = $("#emergancy_phone").val();
        data_send.date_of_birth = $("#DOB").val();
        data_send.nrc_number = $("#nrc").val();
        data_send.bank_account_number = $("#bank").val();
        data_send.passport_number = $("#passport").val()
        data_send.address = $("#address").val()
        data_send.position_id = $("#position").val()
        data_send.department_id = $("#department").val()
        data_send.status = $("#status").val()
        data_send.tax_id = 12 //remove this
    }
    else { //editing update
        request_type = "POST"
        data_send = datatable.rows({selected:  true}).data()[0];
        end_point = API_URI + "employees/" + data_send.id + '/update';

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
    end_point = API_URI + "employees/" + user_id + '/remove';
    
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
    var end_point = API_URI + "employees";
    $.ajax({
        url : end_point,
        type: 'POST',
        headers: {"Authorization":'Bearer '+pvar.token}
    }).always(function(data_response) {
      console.log(data_response)
    }).done(function(data_response) {
        loadTable(data_response.data.employees);
        loadDepartment(data_response.data.departments)
        loadPositions(data_response.data.positions)        
                   
    }).fail(function(data_response) {
        dataResponseErrorUI(data_response);
    });
}

function getStatus(data){
  var data = data + ''
  switch(data){
    case '1': return 'Full Time';
    case '2': return 'Part Time';
    case '0': return 'Resigned';
    default: return '..'
  }
}

function loadTable(table_data) {
    datatable.clear().draw(); 
    var data = table_data.map(x => ({...x,
          id_mod: padToFour(x.id),
          department : x.department && x.department.name,
          department_id: x.department && x.department.id,
          position : x.position.name,
          status_mod: getStatus(x.status),
          created_time: moment(x.created_time).format('hh:mm/MMM-DD-YYYY'),
          updated_time: moment(x.updated_time).format('hh:mm/MMM-DD-YYYY')
    }))
    datatable.rows.add(data).draw(); 
}

function loadDepartment(deps){
  var extra_html = ''
  deps.forEach(ele => {
    extra_html += `<option value=${ele.id}>${ele.name}</option>`
    $("#department").html(extra_html)
  });
}

function loadPositions(pos){
  var extra_html = ''
  pos.forEach(ele => {
    extra_html += `<option value=${ele.id}>${ele.name}</option>`
  })
  $("#position").html(extra_html)
}

/*----- End Function Section ------*/
/*---------------------------------*/