
var bvar1 = "herp_info"; //localStorage key name for storing login information in encoded string when user logged in successfully
var bvar2 = "herp_username"; //localStorage key name for storing username in plain text
var bvar3 = "herp_login_expiry";

(function(window, undefined) {
  'use strict';
  $(function() {
   
    if(localStorage.getItem(bvar1) !== null) {    
      var d = new Date();
      var current_time = d.getTime();
      var expiry_time = Number(localStorage.getItem(bvar3));
      if(current_time < expiry_time) {
        loginSuccess();
      }
      else {
        refreshAccessToken();
      }
    }

});
  
$("#user-login").click(function() {
    loggingInBegin();    
    var user_name = $("#user-name").val();
    var user_password = $("#user-password").val();
	if(user_name == "" || user_password == "") {
		loggingInEnd();
		return false;
	}
	var auth_data = {"username": user_name, "password": user_password};
    $.ajax(
    {
      url : API_URI + 'session_login.php',      
      type: 'POST',
      dataType : "JSON",
      headers: {"Content-Type":"application/json"},
      data: JSON.stringify(auth_data)
    }).always(function(data){

    }).done(function(data){
      if(data.success === true) {
        /*  
        1 day expiry access token
        */
        var bec = window.btoa(JSON.stringify(data.data));

        localStorage.setItem(bvar1, bec);
        localStorage.setItem(bvar2, user_name);
        
        //access token expiry time
        var d = new Date();
        var expiry_time = d.getTime() + (data.data.access_token_expiry*1000);
        localStorage.setItem(bvar3, expiry_time);        
        
        loginSuccess();
      
      }
    }).fail(function(data){

      Swal.fire({
          type: 'error',
          title: 'Warning',
          text: data.responseJSON.messages[0]
      });

      loggingInEnd();	  
    });

});
  
function loggingInBegin() {
  $(".preloader").fadeIn();
}
function loggingInEnd() {
  $(".preloader").fadeOut();
}

function refreshAccessToken() {
  var pvar = getPvar();
  var end_point = API_URI + "session_login.php?sessionid=" + pvar.session_id;
  $.ajax({
      url : end_point,      
      type: 'PATCH',
      headers: {"Authorization":pvar.access_token, "Content-Type" : "application/json"},
      data: JSON.stringify({ "refresh_token": pvar.refresh_token }),
  }).always(function(data) {
      
  }).done(function(data) {
      if(data.success === true) {
          pvar.access_token = data.data.access_token;
          pvar.refresh_token = data.data.refresh_token;
          var bec = window.btoa(JSON.stringify(pvar));
          localStorage.setItem(bvar1, bec);

           //reset new access token expiry time
          var d = new Date();
          var expiry_time = d.getTime() + (data.data.access_token_expiry*1000);
          localStorage.setItem(bvar3, expiry_time);
          location.reload();
      }
  }).fail(function(data){
      if(data.success === false) {          
          localStorage.removeItem(bvar1);
          localStorage.removeItem(bvar2);
          localStorage.removeItem(bvar3);
          loginPage();
      }
  }); 
}

function loginSuccess() {
	var ma_access = [6, 5];	
	if(ma_access.includes(getPvar().level)) {
		location.replace("./ma/user.html");
	}
	else {
		location.replace("home.html");
	}
}

function getPvar() {
	var item = window.atob(localStorage.getItem(bvar1));
	var pvar = JSON.parse(item);
	return pvar;
}

})(window);