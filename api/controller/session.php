<?php
require_once('db.php'); //connect to database and create common use database object
require_once('../model/Session.php'); //related model file that includes Class
require_once('../model/Response.php'); //import Response class for handling http responses
require_once('./authentication.php'); //authentication on


/* GET, POST, PATCH, DELETE methods will allow with authentication */

if(array_key_exists("sessionid", $_GET)) {
    
    $sessionid = $_GET['sessionid'];
    
    if($sessionid == '' || !is_numeric($sessionid)) {
        $response = new Response();
        $response->setHttpStatusCode(400);
        $response->setSuccess(false);
        $response->addMessage("Session ID cannot be blank or must be numeric");
        $response->send();
        exit();
    }
    
    if($_SERVER['REQUEST_METHOD'] === 'DELETE') {
        //only admin can delete session
        if($returned_level !== 6) {
            $response = new Response();
            $response->setHttpStatusCode(401);
            $response->setSuccess(false);
            $response->addMessage("Access restricted");
            $response->send();
            exit();
        }
        try {

            $writeDB->beginTransaction();

            $query = $writeDB->prepare("delete from session where id = :sessionid");
            $query->bindParam(":sessionid", $sessionid, PDO::PARAM_INT);
            $query->execute();
            $rowCount = $query->rowCount();
            if($rowCount === 0) {
                $response = new Response();
                $response->setHttpStatusCode(404);
                $response->setSuccess(false);
                $response->addMessage("Session not found");
                $response->send();
                exit();
            }
            
            $writeDB->commit();

            $response = new Response();
            $response->setHttpStatusCode(200);
            $response->setSuccess(true);
            $response->addMessage("Session deleted");
            $response->send();
            exit();
        }
        catch(PDOException $ex) {
            $response = new Response();
            $response->setHttpStatusCode(500);
            $response->setSuccess(false);
            $response->addMessage("Failed to delete Session");
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

if(array_key_exists("clean", $_GET)) {

    $clean = $_GET['clean'];

    if($clean !== 'Y') {
        $response = new Response();
        $response->setHttpStatusCode(400);
        $response->setSuccess(false);
        $response->addMessage("Wrong parameters");
        $response->send();
        exit();
    }
    /*
        Admin destroy expired all user sessions
        When user access api with http DELETE method
    */
    if($_SERVER['REQUEST_METHOD'] === 'DELETE') {

        try{
            $query = $writeDB->prepare("delete from session where refresh_token_expiry < CURRENT_TIME");
            $query->execute();

            $rowCount = $query->rowCount();

            if($rowCount === 0) {
                $response = new Response();
                $response->setHttpStatusCode(400);
                $response->setSuccess(false);       
                $response->addMessage("There are no expired sessions to clean");
                $response->send();
                exit();
            }

            $response = new Response();
            $response->setHttpStatusCode(200);
            $response->setSuccess(true);
            $response->addMessage("All expired sessions cleaned");
            $response->send();
            exit();

        }
        catch(PDOException $ex) {
            $response = new Response();
            $response->setHttpStatusCode(500);
            $response->setSuccess(false);       
            $response->addMessage("There was an issue cleaning session - try again");
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

elseif(empty($_GET)) {
    if($_SERVER['REQUEST_METHOD'] === 'GET') {
        try {
            
            $query = $readDB->prepare("select id, user_id, username, fullname, level, DATE_FORMAT(refresh_token_expiry, '%d/%m/%Y %H:%i') refresh_token_expiry, login_ip_address from view_session");
            $query->execute();
    
            $rowCount = $query->rowCount();
            $objects = array();
            while($row = $query->fetch(PDO::FETCH_ASSOC)) {
                $session = new Session($row['id'], $row['user_id'], $row['username'], $row['fullname'], $row['level'], $row['refresh_token_expiry'], $row['login_ip_address']);
                $objects[] = $session->returnSessionAsArray();
            }

            $returnData = array();
            $returnData['rows_returned'] = $rowCount;
            $returnData['objects'] = $objects;
    
            $response = new Response();
            $response->setHttpStatusCode(200);
            $response->setSuccess(true);
            $response->setData($returnData);
            $response->send();
            exit();
        }
        catch(SessionException $ex) {
            $response = new Response();
            $response->setHttpStatusCode(500);
            $response->setSuccess(false);
            $response->addMessage($ex->getMessage());
            $response->send();
            exit();
        }
        catch(PDOException $ex) {
            error_log("Database query error - ". $ex, 0);
            $response = new Response();
            $response->setHttpStatusCode(500);
            $response->setSuccess(false);
            $response->addMessage("Failed to get data");
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

