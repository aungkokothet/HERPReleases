<?php
require_once('db.php');
require_once('../model/Response.php');
try{
    $writeDB = DB::connectWriteDB();
}
catch(PDOException $ex) {
    error_log("Connection error: ". $ex, 0);
    $response = new Response();
    $response->setHttpStatusCode(500);
    $response->setSuccess(false);
    $response->addMessage("Database connection error");
    $response->send();
    exit();
}

//this controller is only for password change function
if($_SERVER['REQUEST_METHOD'] !== 'PATCH') {
    $response = new Response();
    $response->setHttpStatusCode(405);
    $response->setSuccess(false);
    $response->addMessage("Request method not allowed");
    $response->send();
    exit();
}

if($_SERVER['CONTENT_TYPE'] !== 'application/json') {
    $response = new Response();
    $response->setHttpStatusCode(400);
    $response->setSuccess(false);
    $response->addMessage("Content type header not set to JSON");
    $response->send();
    exit();
}

//start getting json post data and decode
$rawPostData = file_get_contents('php://input');
if(!$jsonData = json_decode($rawPostData)) {
    $response = new Response();
    $response->setHttpStatusCode(400);
    $response->setSuccess(false);
    $response->addMessage("Request body is not valid JSON");
    $response->send();
    exit();
}

if(!isset($jsonData->username) || !isset($jsonData->c_p) || !isset($jsonData->n_p)) {
    $response = new Response();
    $response->setHttpStatusCode(400);
    $response->setSuccess(false);
    (!isset($jsonData->username) ? $response->addMessage("User name not supplied") : false);
    (!isset($jsonData->c_p) ? $response->addMessage("Current password not supplied") : false);
    (!isset($jsonData->n_p) ? $response->addMessage("New password not supplied") : false);
    $response->send();
    exit();
}

if(strlen($jsonData->username) < 1 || strlen($jsonData->username) > 255 || strlen($jsonData->c_p) < 1 || strlen($jsonData->c_p) > 255 || strlen($jsonData->n_p) < 1 || strlen($jsonData->n_p) > 255) {
    $response = new Response();
    $response->setHttpStatusCode(400);
    $response->setSuccess(false);

    (strlen($jsonData->username) < 1 ? $response->addMessage("User name cannot be blank") : false);
    (strlen($jsonData->username) > 255 ? $response->addMessage("User name cannot be greater than 255 characters") : false);
    (strlen($jsonData->c_p) < 1 ? $response->addMessage("Current password cannot be blank") : false);
    (strlen($jsonData->c_p) > 255 ? $response->addMessage("Current password cannot be greater than 255 characters") : false);   
    (strlen($jsonData->n_p) < 1 ? $response->addMessage("New password cannot be blank") : false);
    (strlen($jsonData->n_p) > 255 ? $response->addMessage("New password cannot be greater than 255 characters") : false);   
    $response->send();
    exit();
}

$username = trim($jsonData->username);
$current_password = $jsonData->c_p;
$new_password = $jsonData->n_p;

try {
    $hashed_current_password = password_hash($current_password, PASSWORD_DEFAULT);
    $query = $writeDB->prepare("select password from user_login where username=:username");
    $query->bindParam(':username', $username, PDO::PARAM_STR);
    $query->execute();

    $rowCount = $query->rowCount();
    if($rowCount === 0) {
        $response = new Response();
        $response->setHttpStatusCode(404);
        $response->setSuccess(false);
        $response->addMessage("User not found");
        $response->send();
        exit();
    }

    $row = $query->fetch(PDO::FETCH_ASSOC);
    $returned_password = $row['password'];
    if(!password_verify($current_password, $returned_password)) {
        $response = new Response();
        $response->setHttpStatusCode(401);
        $response->setSuccess(false);
        $response->addMessage("Invalid current password");
        $response->send();
        exit();
    }

    $hashed_new_password = password_hash($new_password, PASSWORD_DEFAULT);
    
    $query = $writeDB->prepare("update user_login set password=:password where username=:username");
    $query->bindParam(':password', $hashed_new_password, PDO::PARAM_STR);
    $query->bindParam(':username', $username, PDO::PARAM_STR);
    $query->execute();

    $rowCount = $query->rowCount();

    if($rowCount === 0) {
        $response = new Response();
        $response->setHttpStatusCode(500);
        $response->setSuccess(false);
        $response->addMessage("There was an issue change password - please try again");
        $response->send();
        exit();
    }

    $returnData = array();
    $returnData['username'] = $username;

    $response = new Response();
    $response->setHttpStatusCode(200);
    $response->setSuccess(true);
    $response->addMessage("Password changed");
    $response->setData($returnData);
    $response->send();
    exit();

}
catch(PDOException $ex) {
    error_log("Database query error - ".$ex, 0);
    $response = new Response();
    $response->setHttpStatusCode(500);
    $response->setSuccess(false);
    $response->addMessage("There was an issue changing password - please try again");
    $response->send();
    exit();
}
