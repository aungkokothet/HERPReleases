
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
      {data : "employee_id"},
      {data : "name"},
      {data : "phone"},
      {data : "department"},
      {data : "schedule"},
      {data : "opd_charge"},
      {data : "ipd_charge"},
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
  loadEmployee();
  // getOpdRooms();

  //restrict typing space on username textbox
  $('#username').on('keypress', function(e) {
    if (e.which == 32) {
      return false;
    }
  });

});

$("#employee_id").change(employeeIdOnChange)

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
$("#btn-detail-cancel, #btn-detail-close").click(function(){
  hideDetailPanel();
});
$("#btn_detail").click(function(){
  detailButtonClick();
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

function showDetailPanel(){
  $("#detail_panel").removeClass('d-none');
  $("#data_table_panel").addClass('d-none');
}

function hideDetailPanel(){
  $("#detail_panel").addClass('d-none');
  $("#data_table_panel").removeClass("d-none");
}

function clearDataEntryPanel() {
    $("input").removeClass("is-valid");
    $("select").removeClass("is-valid");
    $("#employee_id, #doctor_name, #doctor_phone, #opd_charge, #ipd_charge, #opd_room_id, #schedule, #doctor_position, #doctor_department").val("");
    $("#employee_id").prop('disabled', false);
    $("#employee_id").removeClass("form-control");
    if (!document.getElementById('employee_id').classList.contains("fstdropdown-select"))
      document.getElementById('employee_id').className = 'fstdropdown-select form-control';
      setFstDropdown();
    document.getElementById("employee_id").fstdropdown.rebind();
    // document.getElementById("opd_room_id").fstdropdown.rebind();
}

function newButtonClick() {
    isnew = true;
    datatable.rows({selected: true}).deselect();
    $("#data_entry_panel_title").html("New");    
    
    clearDataEntryPanel();
    showDataEntryPanel();
}

function detailButtonClick(){
  if(datatable.rows('.selected').any()) {
    isnew = false;

    var data = datatable.rows({selected:  true}).data();

    $("#detail-id").html(data[0].id);
    $("#detail-employee_id").html(data[0].employee_id)
    $("#detail-doctor_name").html(data[0].name);
    $("#detail-doctor_phone").html(data[0].phone);
    $("#detail-doctor-department").html(data[0].department);
    $("#detail-doctor-position").html(data[0].employee.position ? data[0].employee.position.name : '-');
    $("#detail-schedule").html(data[0].schedule);
    $("#detail-opd_charge").html(data[0].opd_charge);
    $("#detail-ipd_charge").html(data[0].ipd_charge);
    $("#created").html(moment(data[0].created_time).format("MMM DD, YYYY HH:MM A"));
    $("#updated").html(moment(data[0].updated_time).format("MMM DD, YYYY HH:MM A"));
    showDetailPanel()
  }
}

function editButtonClick() {
    if(datatable.rows('.selected').any()) {
        isnew = false;
        clearDataEntryPanel();

        var data = datatable.rows({selected:  true}).data();

        $("#data_entry_panel_title").html("Edit");

        $("#data_id").val(data[0].id);
        $("#employee_id").val(data[0].employee_id).prop('disabled', true).addClass("form-control");
        document.getElementById('employee_id').classList.remove('fstdropdown-select');
        document.getElementById("employee_id").fstdropdown.dd.remove();
        $("#doctor_name").val(data[0].name);
        $("#doctor_phone").val(data[0].phone);
        $("#doctor_department").val(data[0].department);
        $("#doctor_position").val(data[0].position);
        $("#schedule").val(data[0].schedule);
        $("#opd_charge").val(data[0].opd_charge);
        $("#ipd_charge").val(data[0].ipd_charge);
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
    var end_point = API_URI + "doctors/add";
    var data_send = {};

    var user_id = $("#data_id").val(); //for edit

    if(isnew) { //inserting new
        request_type = "POST";
        data_send.employee_id = $("#employee_id").val();
        data_send.schedule = $("#schedule").val();
        // data_send.opd_room_id = $("#opd_room_id").val();
        data_send.opd_charge = $("#opd_charge").val();
        data_send.ipd_charge = $("#ipd_charge").val();
    }
    else { //editing update
        request_type = "POST"
        end_point = API_URI + "doctors/" + user_id + '/update';
        var data_send = datatable.rows({selected:  true}).data()[0];
        data_send.opd_room_id = $("#opd_room_id").val();
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
    end_point = API_URI + "doctors/" + user_id + "/remove";
    
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
    var end_point = API_URI + "doctors";
    $.ajax({
        url : end_point,
        type: 'POST',
        headers: {'Authorization': 'Bearer '+ pvar.token, "Content-Type" : "application/json"}
    }).always(function(data_response) {
      console.log(data_response)
    }).done(function(data_response) {
        // loadTable(data_response.data.doctors);
        // loadEmployees(data_response.data.employees);
        loadTable(data_response.data)        
                   
    }).fail(function(data_response) {
        dataResponseErrorUI(data_response);
    });
}

function loadEmployee() {
  var pvar = getPvar();
  var end_point = API_URI + "employees";
  $.ajax({
      url : end_point,
      type: 'POST',
      headers: {"Authorization":'Bearer '+pvar.token}
  }).always(function(data_response) {
    console.log(data_response)
  }).done(function(data_response) {
          loadEmployees(data_response.data.employees)
                 
  }).fail(function(data_response) {
      dataResponseErrorUI(data_response);
  });
}

function loadTable(table_data) {
    datatable.clear().draw(); 
    data = table_data.map(x => ({
      ...x,
      id_mod: padToFour(x.id),
      employee_id: x.employee ? x.employee.id: "-",
      department: x.employee ? x.employee.department.name: '-',
      name: x.employee ? x.employee.name:'-',
      phone: x.employee ? x.employee.phone_number: '-',
      position: x.employee ? x.employee.position.name:'-',
      created: moment(x.created_time).format('hh:mm/MMM-DD-YYYY'),
      updated: moment(x.updated_time).format('hh:mm/MMM-DD-YYY')
    })) 
    datatable.rows.add(data).draw(); 
}

function loadEmployees(data){
  var options = '<option value="" disabled selected>Choose employee Id</option>'
  data.forEach(ele => 
    options += `<option value=${ele.id} name="${ele.name}" phone="${ele.phone_number}" dept="${ele.department ? ele.department.name : '-'}" post="${ele.position ? ele.position.name : '-'}">${ele.name}, ${ele.department.name}, ${ele.position.name}</option>`
  )
  $("#employee_id").html(options);
  document.getElementById("employee_id").fstdropdown.rebind();

}

function employeeIdOnChange(){
  e = document.getElementById('employee_id');
  name = e.options[e.selectedIndex].getAttribute('name');
  post = e.options[e.selectedIndex].getAttribute('post');
  dept = e.options[e.selectedIndex].getAttribute('dept');
  phone = e.options[e.selectedIndex].getAttribute('phone');
  $("#doctor_name").val(name);
  $("#doctor_phone").val(phone);
  $("#doctor_department").val(dept);
  $("#doctor_position").val(post);
}

// function getOpdRooms(){
//   var pvar = getPvar();
//     var end_point = API_URI + "opd_rooms";
//     $.ajax({
//         url : end_point,
//         type: 'POST',
//         headers: {"Authorization":'Bearer '+pvar.token}
//     }).always(function(data_response) {

//     }).done(function(data_response) {
//         loadOpdRooms(data_response.data.opd_rooms)       
                   
//     }).fail(function(data_response) {
//         dataResponseErrorUI(data_response);
//     });
// }

// function loadOpdRooms(data){
//   var options = '<option value="" disabled selected>Choose Opd room</option>'
//   data.forEach(ele => 
//     options += `<option value=${ele.id}>${ele.name},${ele.location}</option>`
//   )
//   $("#opd_room_id").html(options);
//   document.getElementById("opd_room_id").fstdropdown.rebind();
// }

/*----- End Function Section ------*/
/*---------------------------------*/