<?php
require_once('db.php');
require_once('../model/Response.php');

/*
/session = POST request - create a session/login
DELETE request - logout user
PATCH request - refresh session
*/

if(array_key_exists("sessionid", $_GET)) {

    $sessionid = $_GET['sessionid'];

    if($sessionid === '' || !is_numeric($sessionid)) {
        $response = new Response();
        $response->setHttpStatusCode(400);
        $response->setSuccess(false);
        ($sessionid === '' ? $response->addMessage("Session ID cannot be blank") : false);
        (!is_numeric($sessionid) ? $response->addMessage("Session ID must be numeric") : false);
        $response->send();
        exit();
    }

    if(!isset($_SERVER['HTTP_AUTHORIZATION']) || strlen($_SERVER['HTTP_AUTHORIZATION']) < 1) {
        $response = new Response();
        $response->setHttpStatusCode(401);
        $response->setSuccess(false);
        (!isset($_SERVER['HTTP_AUTHORIZATION']) ? $response->addMessage("Access token is missing from the header") : false);
        (strlen($_SERVER['HTTP_AUTHORIZATION']) < 1 ? $response->addMessage("Access token cannot be blank") : false);
        $response->send();
        exit();
    }

    $access_token = $_SERVER['HTTP_AUTHORIZATION'];

    /*
        User logout and destroy session
        When user access api with http DELETE method
    */
    if($_SERVER['REQUEST_METHOD'] === 'DELETE') {

        try{
            $query = $writeDB->prepare("delete from session where id = :sessionid and access_token = :access_token");
            $query->bindParam(':sessionid', $sessionid, PDO::PARAM_INT);
            $query->bindParam(':access_token', $access_token, PDO::PARAM_STR);
            $query->execute();

            $rowCount = $query->rowCount();

            if($rowCount === 0) {
                $response = new Response();
                $response->setHttpStatusCode(400);
                $response->setSuccess(false);       
                $response->addMessage("Failed to log out of this session using token provided");
                $response->send();
                exit();
            }

            $returnData = array();
            $returnData['session_id'] = intval($sessionid);
            
            $response = new Response();
            $response->setHttpStatusCode(200);
            $response->setSuccess(true);
            $response->addMessage("Logged out");
            $response->setData($returnData);
            $response->send();
            exit();

        }
        catch(PDOException $ex) {
            $response = new Response();
            $response->setHttpStatusCode(500);
            $response->setSuccess(false);       
            $response->addMessage("There was an issue logging out - try again");
            $response->send();
            exit();
        }

    }

    /*
        When user access token expired and request access token again with refresh token
        When user access api with http PATCH method
    */
    elseif($_SERVER['REQUEST_METHOD'] === 'PATCH') {

        if($_SERVER['CONTENT_TYPE'] !== 'application/json') {
            $response = new Response();
            $response->setHttpStatusCode(400);
            $response->setSuccess(false);       
            $response->addMessage("Content type header not set to json");
            $response->send();
            exit();
        }

        $rawPatchData = file_get_contents('php://input');
        if(!$jsonData = json_decode($rawPatchData)) {
            $response = new Response();
            $response->setHttpStatusCode(400);
            $response->setSuccess(false);       
            $response->addMessage("Request body is not valid JSON");
            $response->send();
            exit();
        }

        if(!isset($jsonData->refresh_token) || strlen($jsonData->refresh_token) < 1) {
            $response = new Response();
            $response->setHttpStatusCode(400);
            $response->setSuccess(false);       
            (!isset($jsonData->refresh_token) ? $response->addMessage("Refresh token not supplied") : false);
            (strlen($jsonData->refresh_token) < 1 ? $response->addMessage("Refresh token cannot be blank") : false);
            $response->send();
            exit();
        }

        try{

            $refresh_token = $jsonData->refresh_token;

            $query = $writeDB->prepare("select session.id as sessionid, session.user_id, access_token, refresh_token, status, login_attempt, access_token_expiry, refresh_token_expiry from session, user where user.id=session.user_id and session.id = :sessionid and session.access_token = :access_token and session.refresh_token = :refresh_token");
            $query->bindParam(':sessionid', $sessionid, PDO::PARAM_INT); // get from url
            $query->bindParam(':access_token', $access_token, PDO::PARAM_STR); //get from authorization header
            $query->bindParam(':refresh_token', $refresh_token, PDO::PARAM_STR); //get from json request body
            $query->execute();

            $rowCount = $query->rowCount();

            if($rowCount === 0) {
                $response = new Response();
                $response->setHttpStatusCode(401);
                $response->setSuccess(false);       
                $response->addMessage("Access token or refresh token is incorrect for session id");
                $response->send();
                exit();
            }

            $row = $query->fetch(PDO::FETCH_ASSOC);

            $returned_sessionid = $row['sessionid'];
            $returned_user_id = $row['user_id'];
            $returned_accesstoken = $row['access_token'];
            $returned_refreshtoken = $row['refresh_token'];
            $returned_status = $row['status'];
            $returned_login_attempt = $row['login_attempt'];
            $returned_accesstokenexpiry = $row['access_token_expiry'];
            $returned_refreshtokenexpiry = $row['refresh_token_expiry'];

            if($returned_status !== 'Y') {
                $response = new Response();
                $response->setHttpStatusCode(401);
                $response->setSuccess(false);       
                $response->addMessage("User account is not active");
                $response->send();
                exit();
            }

            if($returned_login_attempt >= 3) {
                $response = new Response();
                $response->setHttpStatusCode(401);
                $response->setSuccess(false);
                $response->addMessage("User account is currently locked out");
                $response->send();
                exit();
            }

            if(strtotime($returned_refreshtokenexpiry) < time()) {
                $response = new Response();
                $response->setHttpStatusCode(401);
                $response->setSuccess(false);
                $response->addMessage("Refresh token has expired - please log in again");
                $response->addMessage("refresh_token_expired");
                $response->send();
                exit();
            }

            $access_token = base64_encode(bin2hex(openssl_random_pseudo_bytes(24)).time());
            $refresh_token = base64_encode(bin2hex(openssl_random_pseudo_bytes(24)).time());

            $access_token_expiry_seconds = 10800; //3 hours
            $refresh_token_expiry_seconds = 86400; //1 days

            $query = $writeDB->prepare("update session set access_token = :access_token, access_token_expiry = date_add(NOW(), INTERVAL :accesstokenexpiryseconds SECOND), refresh_token = :refresh_token, refresh_token_expiry = date_add(NOW(), INTERVAL :refreshtokenexpiryseconds SECOND) where id = :sessionid and user_id = :user_id and access_token = :returnedaccesstoken and refresh_token = :returnedrefreshtoken");

            $query->bindParam(':access_token', $access_token, PDO::PARAM_STR);
            $query->bindParam(':accesstokenexpiryseconds', $access_token_expiry_seconds, PDO::PARAM_INT);
            $query->bindParam(':refresh_token', $refresh_token, PDO::PARAM_STR);
            $query->bindParam(':refreshtokenexpiryseconds', $refresh_token_expiry_seconds, PDO::PARAM_INT);

            $query->bindParam(':sessionid', $returned_sessionid, PDO::PARAM_INT);
            $query->bindParam(':user_id', $returned_user_id, PDO::PARAM_INT);
            $query->bindParam(':returnedaccesstoken', $returned_accesstoken, PDO::PARAM_STR);
            $query->bindParam(':returnedrefreshtoken', $returned_refreshtoken, PDO::PARAM_STR);
            $query->execute();

            $rowCount = $query->rowCount();
            if($rowCount === 0) {
                $response = new Response();
                $response->setHttpStatusCode(401);
                $response->setSuccess(false);       
                $response->addMessage("Access token could not be refresh - please log in again");
                $response->send();
                exit();
            }

            $returnData = array();
            $returnData['session_id'] = $returned_sessionid;
            $returnData['access_token'] = $access_token;
            $returnData['access_token_expiry'] = $access_token_expiry_seconds;
            $returnData['refresh_token'] = $refresh_token;
            $returnData['refresh_token_expiry'] = $refresh_token_expiry_seconds;

            $response = new Response();
            $response->setHttpStatusCode(200);
            $response->setSuccess(true);
            $response->addMessage("Token refreshed");
            $response->setData($returnData);
            $response->send();
        }
        catch(PDOException $ex) {
            $response = new Response();
            $response->setHttpStatusCode(500);
            $response->setSuccess(false);       
            $response->addMessage("There was an issue refreshing access token - please log in again");
            $response->send();
            exit();
        }
    }

    else {
        $response = new Response();
        $response->setHttpStatusCode(405);
        $response->setSuccess(false);       
        $response->addMessage("Request method not allowed");
        $response->send();
        exit();
    }

}

/*
    User login and creating session
    this is for POST request session.php?sessionid=1 - /session = POST request - create a session/login
    6 = System Admin Level
*/
elseif(isset($_GET)) {
  
    if($_SERVER['REQUEST_METHOD'] !== 'POST') {
        $response = new Response();
        $response->setHttpStatusCode(405);
        $response->setSuccess(false);
        $response->addMessage("Request method not allowed");
        $response->send();
        exit();
    }

    sleep(1); /* for preventing brute force login attack */
    
    if(empty($_SERVER['CONTENT_TYPE']) || $_SERVER['CONTENT_TYPE'] !== 'application/json') {
        $response = new Response();
        $response->setHttpStatusCode(400);
        $response->setSuccess(false);
        $response->addMessage("Content type header not set to JSON");
        $response->send();
        exit();
    }

    $rawPostData = file_get_contents('php://input');
    if(!$jsonData = json_decode($rawPostData)) {
        $response = new Response();
        $response->setHttpStatusCode(400);
        $response->setSuccess(false);
        $response->addMessage("Request body is not valid JSON");
        $response->send();
        exit();
    }

    /* checking both username and password is set */
    if(!isset($jsonData->username) || !isset($jsonData->password)) {
        $response = new Response();
        $response->setHttpStatusCode(400);
        $response->setSuccess(false);
        (!isset($jsonData->username) ? $response->addMessage("Username not supplied") : false);
        (!isset($jsonData->password) ? $response->addMessage("Password not supplied") : false);
        $response->send();
        exit();
    }

    /* checking username and password's character length is correct 0 to 255 */
    if(strlen($jsonData->username) < 1 || strlen($jsonData->username) > 255 || strlen($jsonData->password) < 1 || strlen($jsonData->password) > 255) {
        $response = new Response();
        $response->setHttpStatusCode(400);
        $response->setSuccess(false);
        (strlen($jsonData->username) < 1 ? $response->addMessage("Username cannot be blank") : false);
        (strlen($jsonData->username) > 255 ? $response->addMessage("Username must be less than 255 characters") : false);

        (strlen($jsonData->password) < 1 ? $response->addMessage("Password cannot be blank") : false);
        (strlen($jsonData->password) > 255 ? $response->addMessage("Password must be less than 255 characters") : false);

        $response->send();
        exit();
    }

    try {

        $username = $jsonData->username;
        $password = $jsonData->password;

        $query = $writeDB->prepare('select id, username, password, fullname, status, level, login_attempt from user where username = :username');
        $query->bindParam(':username', $username, PDO::PARAM_STR);
        $query->execute();

        $rowCount = $query->rowCount();

        if($rowCount === 0) {
            $response = new Response();
            $response->setHttpStatusCode(401);
            $response->setSuccess(false);
            $response->addMessage("Username or Password is incorrect"); 
            //actually this is username incorrect but return both is incorrect for security reason
            $response->send();
            exit();
        }

        $row = $query->fetch(PDO::FETCH_ASSOC);

        $returned_id = $row['id'];
        $returned_fullname = $row['fullname'];
        $returned_username = $row['username'];
        $returned_password = $row['password'];
        $returned_status = $row['status'];
        $returned_level = $row['level'];
        $returned_login_attempt = $row['login_attempt'];

        if($returned_status === 0) {
            /*
                if status is 0 [inactive], reject login
            */
            $response = new Response();
            $response->setHttpStatusCode(401);
            $response->setSuccess(false);
            $response->addMessage("User account not active");
            $response->send();
            exit();
        }

        if($returned_login_attempt >= 3) {
            /*
                if user login attempt is more than 3 with wrong username or password, reject login
            */
            $response = new Response();
            $response->setHttpStatusCode(401);
            $response->setSuccess(false);
            $response->addMessage("User account is currently locked out");
            $response->send();
            exit();
        }

        if(!password_verify($password, $returned_password)) {
            /*
                if user login is wrong, reject login and increase login_attempt
            */
            $query = $writeDB->prepare('update user set login_attempt = login_attempt + 1 where id = :id');
            $query->bindParam(':id', $returned_id, PDO::PARAM_INT);
            $query->execute();

            $response = new Response();
            $response->setHttpStatusCode(401);
            $response->setSuccess(false);
            $response->addMessage("Username or password is incorrect");
            //actually this is password incorrect but return both is incorrect for security reason
            $response->send();
            exit();
        }

        $access_token = base64_encode(bin2hex(openssl_random_pseudo_bytes(24)).time());
        $refresh_token = base64_encode(bin2hex(openssl_random_pseudo_bytes(24)).time());

		$access_token_expiry_seconds = 86400; //1 day
		$refresh_token_expiry_seconds = 259200; //3 days

        $login_ip_address = $_SERVER['REMOTE_ADDR'];

    }
    catch(PDOException $ex) {
        $response = new Response();
        $response->setHttpStatusCode(500);
        $response->setSuccess(false);
        $response->addMessage("There was an issue logging in");
        $response->send();
        exit();
    }

    try {
        $writeDB->beginTransaction();
        
        $query = $writeDB->prepare('update user set login_attempt=0 where id=:id');
        $query->bindParam(':id', $returned_id, PDO::PARAM_INT);
        $query->execute();

        $query = $writeDB->prepare('insert into session (user_id, access_token, access_token_expiry, refresh_token, refresh_token_expiry, login_ip_address) values (:user_id, :access_token, date_add(NOW(), INTERVAL :accesstokenexpiryseconds SECOND), :refresh_token, date_add(NOW(), INTERVAL :refreshtokenexpiryseconds SECOND), :login_ip_address)');
        $query->bindParam(':user_id', $returned_id, PDO::PARAM_INT);
        $query->bindParam(':access_token', $access_token, PDO::PARAM_STR);
        $query->bindParam(':accesstokenexpiryseconds', $access_token_expiry_seconds, PDO::PARAM_INT);
        $query->bindParam(':refresh_token', $refresh_token, PDO::PARAM_STR);
        $query->bindParam(':refreshtokenexpiryseconds', $refresh_token_expiry_seconds, PDO::PARAM_INT);
        $query->bindParam(':login_ip_address', $login_ip_address, PDO::PARAM_STR);
        $query->execute();

        $lastSessionID = $writeDB->lastInsertId();

        $writeDB->commit();

        $returnData = array();
        $returnData['session_id'] = intval($lastSessionID);
        $returnData['access_token'] = $access_token;
        $returnData['access_token_expiry'] = $access_token_expiry_seconds;
        $returnData['refresh_token'] = $refresh_token;
        $returnData['refresh_token_expiry'] = $refresh_token_expiry_seconds;
        $returnData['username'] = $returned_username;
        $returnData['fullname'] = $returned_fullname;
        $returnData['level'] = $returned_level;

        $response = new Response();
        $response->setHttpStatusCode(201);
        $response->setSuccess(true);
        $response->setData($returnData);
        $response->send();
        exit();
    }
    catch(PDOException $ex) {
        $writeDB->rollBack();
        $response = new Response();
        $response->setHttpStatusCode(500);
        $response->setSuccess(false);
        $response->addMessage("There was an issue logging in - please try again");
        $response->send();
        exit();
    }
}
else {
    $response = new Response();
    $response->setHttpStatusCode(404);
    $response->setSuccess(false);
    $response->addMessage("Endpoint not found");
    $response->send();
    exit();
}