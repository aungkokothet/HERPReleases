/* Developer Scripts */
var bvar1 = "herp_info"; /* stored key for login details in local storage after successful loging */
var bvar2 = "herp_username"; /* stored key for login details in local storage after successful loging */
var bvar3 = "herp_login_expiry";

checkAuth();
showTopMenu();
showMenu();
//loadActiveMenuItem();

$("#user-logout").click(function() {
	logOut();
});

$("#account-setting").click(function() {
	editProfile();
});


function editProfile() {

	var extra_html_div = '';

	extra_html_div += '<div class="modal fade" id="modal_password_change" tabindex="-1" role="dialog" aria-labelledby="myLargeModalLabel" style="display: none;" aria-hidden="true">';
	extra_html_div += '<div class="modal-dialog ">';
	extra_html_div += '<div class="modal-content">';
	extra_html_div += '<div class="modal-header d-flex">';
	extra_html_div += '<h4 class="modal-title" id="preview-title">Change Password</h4>';
	extra_html_div += '<button type="button" class="close ml-auto" data-dismiss="modal" aria-hidden="true">×</button>';
	extra_html_div += '</div>';
	extra_html_div += '<div class="modal-body">';
	extra_html_div += '<div class="form-group">';
	extra_html_div += '<input id="current-password" class="form-control" type="password" placeholder="Current Password">';
	extra_html_div += '</div>';
	extra_html_div += '<div class="input-group">';
	extra_html_div += '<input id="new_password" class="form-control" type="password" placeholder="New Password">';
	extra_html_div += '<div class="input-group-append">';
	extra_html_div += '<button class="btn btn-light" id="see_password" type="button"><i class="mdi mdi-eye"></i></button>';
	extra_html_div += '</div>';
	extra_html_div += '</div>';
	extra_html_div += '<div class="form-group text-center mt-4">';
	extra_html_div += '<button class="btn btn-rounded btn-info " id="btn_password_save" type="button">Save</button>';
	extra_html_div += '</div>';
	extra_html_div += '</div>';
	extra_html_div += '</div>';
	extra_html_div += '</div>';
	extra_html_div += '</div>';

	$("#js_html").html(extra_html_div);

	$("#modal_password_change").modal("show");


	$("#btn_password_save").click(function() {
	
		var c_p = $("#current-password").val();
		var n_p = $("#new_password").val();
		if(c_p != "" && n_p !="" && localStorage.emanresumami != undefined) {
			var pvar = getPvar();
			var end_point = API_URI + "password.php";
			var pdata = {};
			pdata.username = localStorage.emanresumami;
			pdata.c_p = c_p;
			pdata.n_p = n_p;
			
			$.ajax({
				url : end_point,
				type: "PATCH",
				headers: {"Authorization" : pvar.access_token, "Content-Type" : "application/json"},
				data: JSON.stringify(pdata)
			}).always(function(data) {
	
			}).done(function(data) {
				if(data.success === true) {
					Swal.fire({
					  type: "success",
					  title: "Success!",
					  text: data.messages[0],
					  confirmButtonClass: 'btn btn-success',
					});
				}
				$("#modal_password_change").modal('hide');
			}).fail(function(data){
				Swal.fire({
					type: "danger",
					title: "Failed!",
					text: data.responseJSON.messages[0],
					confirmButtonClass: 'btn btn-light',
				});
			});
		}
		else {
			Swal.fire({
				type: "warning",
				title: "Caution!",
				text: "Password not changed, Try Again!",
				confirmButtonClass: 'btn btn-light',
			});
			return false;
			
		}
	  
	});

	$("#see_password").mousedown(function() {
		$("#new_password").attr("type", "text");
	});
	$("#see_password").mouseup(function() {
		$("#new_password").attr("type", "password");
	});
}

function logOut() {       
	var pvar = getPvar();
    var end_point = API_URI + 'logout';
    $.ajax({
        url : end_point,      
        type: 'POST',
		headers: {"Authorization":'Bearer'+pvar.token},
    }).always(function(data) {
        
    }).done(function(data) {
            cleanStorage();
			loginPage();            
    }).fail(function(data){
			Swal.fire({
				type: "error",
				title: 'Error!',
				text: data.statusText
			});
    }); 
}

function cleanStorage() {
    localStorage.removeItem(bvar1);
    localStorage.removeItem(bvar2);
    localStorage.removeItem(bvar3);
}

function showMenu() {
	lev = getPvar().user_level
	var html_menu = "";
	
	html_menu += '<li class="nav-small-cap"><span class="hide-menu">Menu</span></li>';
	
	html_menu += lev < 6 ? '':'<li class="sidebar-item "><a class="sidebar-link sidebar-link" href="user.html" ><i class="mdi mdi-account"></i><span class="hide-menu">Users</span></a></li>';
	html_menu += lev < 5 ? '':'<li class="sidebar-item "><a class="sidebar-link sidebar-link" href="employee.html" ><i class="mdi mdi-account-multiple"></i><span class="hide-menu">Employees</span></a></li>';
	html_menu += lev < 5 ? '':'<li class="sidebar-item "><a class="sidebar-link sidebar-link" href="department.html" ><i class="mdi  mdi-hospital-building"></i><span class="hide-menu">Departments</span></a></li>';
	html_menu += lev < 5 ? '':'<li class="sidebar-item "><a class="sidebar-link sidebar-link" href="position.html" ><i class="mdi  mdi-clipboard-account"></i><span class="hide-menu">Positions</span></a></li>';
	html_menu += lev < 5 ? '':'<li class="sidebar-item "><a class="sidebar-link sidebar-link" href="doctors.html" ><i class="mdi  mdi-medical-bag"></i><span class="hide-menu">Doctors</span></a></li>';
	html_menu += lev < 5 ? '':'<li class="sidebar-item "><a class="sidebar-link sidebar-link" href="patients.html" ><i class="mdi  mdi-needle"></i><span class="hide-menu">Patients</span></a></li>';
	html_menu += lev < 0 ? '':'<li class="sidebar-item "><a class="sidebar-link sidebar-link" href="appointments.html" ><i class="mdi  mdi-calendar"></i><span class="hide-menu">Appointments</span></a></li>';
	html_menu += lev < 5 ? '':'<li class="sidebar-item "><a class="sidebar-link sidebar-link" href="diagnosis_report.html" ><i class="mdi  mdi-file-chart"></i><span class="hide-menu">Diagnosis Report</span></a></li>';
	html_menu += lev < 5 ? '':'<li class="sidebar-item "><a class="sidebar-link sidebar-link" href="medical_record.html" ><i class="mdi  mdi-book-plus"></i><span class="hide-menu">Medical Record</span></a></li>';
	html_menu += lev < 5 ? '':'<li class="sidebar-item "><a class="sidebar-link sidebar-link" href="opdroom.html" ><i class="mdi  mdi-home"></i><span class="hide-menu">OPD Rooms</span></a></li>';

	$("#sidebarnav").html(html_menu);

	/* Set active menu automatically based on menu link uri and address bar link uri */
	var current = location.pathname;
	$('#sidebarnav li').each(function() {
		var $this = $(this.firstChild);
		   
		// if the current path is like this link, make it active
		var a_href_path = $this.attr('href');
		var url_path_file = window.location.pathname.split('/').pop();
		if(a_href_path == url_path_file) {   
			/* set page title by grabbing from menu text */        
			$("#page_title").html(this.firstChild.innerText);
			document.title = this.firstChild.innerText;
		}
	});
}

function showTopMenu() {
	var pvar = getPvar();
	var userName = localStorage.getItem(bvar2)

    var html_top_menu = '';
    html_top_menu += '<li>';
    html_top_menu += '<div class="dw-user-box p-3 d-flex">';
       
    html_top_menu += '<div class="u-text ml-2">';
    html_top_menu += '<h4 class="mb-0" id="user_name">' + userName + '</h4>';
    html_top_menu += '<p class="text-success mb-0 font-14">Level-' + pvar.user_level + '</p>';
    html_top_menu += '</div>';
    html_top_menu += '</div>';
    html_top_menu += '</li>';
    html_top_menu += '<li role="separator" class="dropdown-divider"></li>';
    html_top_menu += '<li class="user-list"><a class="px-3 py-2" href="javascript:void(0);" id="account-setting"><i class="mdi mdi-account"></i> Account Setting</a></li>';
    html_top_menu += '<li role="separator" class="dropdown-divider"></li>';
    html_top_menu += '<li class="user-list"><a class="px-3 py-2" href="javascript:void(0);" id="user-logout"><i class="mdi mdi-power"></i> Logout</a></li>';

    $("#top_menu").html(html_top_menu)
}

function checkAuth() {
	if(localStorage.getItem(bvar1) === null) {
		loginPage();
	}
	else {            
		var pvar = getPvar();
		if(pvar !== null) {
			if(pvar.username === localStorage.getItem(bvar2)) {
				showPage(pvar);
			}
		}
		else {
			loginPage();
		}
	}
}

function getPvar() {
	var item = window.atob(localStorage.getItem(bvar1));
	var pvar = JSON.parse(item);
	return pvar;
}

function showPage(pvar) {
	$("body").removeClass("d-none");
	$("#user-full-name").html(pvar.fullname);
	$("#user-level").html(pvar.level);
}

function loginPage() {
	location.replace("../index.html");
}

function dataResponseErrorUI(data_response) {
    if(data_response.status === 401) {
        //if unauthorize, 
        cleanStorage();
        loginPage();
    }
	if(data_response.responseText) {
		Swal.fire({
		  type: "error",
		  title: 'Error!',
		  text: data_response.responseText
		});
	}
	else {
		Swal.fire({
		  type: "error",
		  title: 'Error!',
		  text: data_response.statusText
		});
	}
}

function checkVasibality(accessLevel){
	console.log(getPvar().user_level, accessLevel)
	if (getPvar().user_level < accessLevel){
		Swal.fire({
			type: "error",
			title: "Unauthorize",
			text: "You are not authorize to view this page"
		}).then(
		function(){
			cleanStorage();
			loginPage()
	})
	}
}

$("#footer_text").html("Oner - Software for Hospitals © " + (new Date()).getFullYear());