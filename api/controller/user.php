<?php
require_once('db.php'); //connect to database and create common use database object
require_once('../model/User.php'); //related model file that includes Class
require_once('../model/Response.php'); //import Response class for handling http responses
require_once('./authentication.php'); //authentication on

/* GET, POST, PATCH, DELETE methods will allow with authentication */

if(array_key_exists("user_id", $_GET)) {
    
    $user_id = $_GET['user_id'];
    
    if($user_id == '' || !is_numeric($user_id)) {
        $response = new Response();
        $response->setHttpStatusCode(400);
        $response->setSuccess(false);
        $response->addMessage("User ID cannot be blank or must be numeric");
        $response->send();
        exit();
    }
    
    if($_SERVER['REQUEST_METHOD'] === 'DELETE') {
        //only admin can delete user
        if($returned_level !== 6) {
            $response = new Response();
            $response->setHttpStatusCode(401);
            $response->setSuccess(false);
            $response->addMessage("Access restricted");
            $response->send();
            exit();
        }
        /* restrict deleting system admin  */
        if($user_id == 1) {
            $response = new Response();
            $response->setHttpStatusCode(405);
            $response->setSuccess(false);
            $response->addMessage("Primary admin user cannot be deleted");
            $response->send();
            exit();
        }
        try {

            $writeDB->beginTransaction();

            $query = $writeDB->prepare("delete from user where id = :user_id");
            $query->bindParam(":user_id", $user_id, PDO::PARAM_INT);
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
            
            //also delete all logged in sessions in session table
            $query = $writeDB->prepare("delete from session where user_id = :user_id");
            $query->bindParam(":user_id", $user_id, PDO::PARAM_INT);
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
            
            $writeDB->commit();

            $response = new Response();
            $response->setHttpStatusCode(200);
            $response->setSuccess(true);
            $response->addMessage("User deleted");
            $response->send();
            exit();
        }
        catch(PDOException $ex) {
            $response = new Response();
            $response->setHttpStatusCode(500);
            $response->setSuccess(false);
            $response->addMessage("Failed to delete User");
            $response->send();
            exit();

        }
    }
    elseif($_SERVER['REQUEST_METHOD'] == 'PATCH') {
        //only admin can edit and update user
        if($returned_level !== 6) {
            $response = new Response();
            $response->setHttpStatusCode(401);
            $response->setSuccess(false);
            $response->addMessage("Access restricted");
            $response->send();
            exit();
        }

        try{

            if($_SERVER['CONTENT_TYPE'] !== 'application/json') {
                $response = new Response();
                $response->setHttpStatusCode(400);
                $response->setSuccess(false);
                $response->addMessage("Content type header not set to JSON");
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

            $password_updated = false;
            $fullname_updated = false;
            $level_updated = false;
            $status_updated = false;
            $login_attempt_updated = false;

            $queryFields = "";
            if(isset($jsonData->password)) {
                $password_updated = true;
                $queryFields .= "password = :password, ";
            }
            if(isset($jsonData->fullname)) {
                $fullname_updated = true;
                $queryFields .= "fullname = :fullname, ";
            }           
            if(isset($jsonData->level)) {
                $level_updated = true;
                $queryFields .= "level = :level, ";
            }
            if(isset($jsonData->status)) {
                $status_updated = true;
                $queryFields .= "status = :status, ";
            }
            if(isset($jsonData->login_attempt)) {
                $login_attempt_updated = true;
                $queryFields .= "login_attempt = :login_attempt, ";
            }

            //remove last , for preparing correct sql statement
            $queryFields = rtrim($queryFields, ", "); 

            if($password_updated === false && $fullname_updated === false && $level_updated === false && $status_updated === false &&  $login_attempt_updated === false) {
                $response = new Response();
                $response->setHttpStatusCode(400);
                $response->setSuccess(false);
                $response->addMessage("No user field provided");
                $response->send();
                exit();
            }

            $query = $writeDB->prepare("select id, username, password, fullname, level, status, login_attempt from user where id = :user_id");
            $query->bindParam(":user_id", $user_id, PDO::PARAM_INT);
            $query->execute();

            $rowCount = $query->rowCount();
            if($rowCount === 0) {
                $response = new Response();
                $response->setHttpStatusCode(404);
                $response->setSuccess(false);
                $response->addMessage("No user found to update");
                $response->send();
                exit();
            }

            //create $user object filled with existing data
            while($row = $query->fetch(PDO::FETCH_ASSOC)) {
                $user = new User($row['id'], $row['username'], $row['fullname'], $row['level'], $row['status'], $row['login_attempt']);
            }

            $writeDB->beginTransaction();

            $queryString = "update user set ".$queryFields.", updated_user_id=:updated_user_id where id = :user_id";
            $query = $writeDB->prepare($queryString);

            //reset only user submitted data in $user object
            //and bind param with $user object's new data for query
            if($password_updated === true) {
                //first set new data into $user object's related field
                $user->setPassword($jsonData->password);

                //password is already hashed in User class's setPassword method
                //get new data from $user object and set it as parameter in query
                $hashed_password = $user->getPassword();
                $query->bindParam(":password", $hashed_password, PDO::PARAM_STR);
            }
            if($fullname_updated === true) {
                $user->setFullname($jsonData->fullname);

                $up_fullname = $user->getFullname();
                $query->bindParam(":fullname", $up_fullname, PDO::PARAM_STR);
            }
            if($level_updated === true) {
                $user->setLevel($jsonData->level);

                $up_level = $user->getLevel();
                $query->bindParam(":level", $up_level, PDO::PARAM_INT);
            }
            if($status_updated === true) {
                $user->setStatus($jsonData->status);

                $up_status = $user->getStatus();
                $query->bindParam(":status", $up_status, PDO::PARAM_INT);
            }
            if($login_attempt_updated === true) {
                $user->setLoginAttempt($jsonData->login_attempt);

                $up_login_attempt = $user->getLoginAttempt();
                $query->bindParam(":login_attempt", $up_login_attempt, PDO::PARAM_INT);
            }

            $query->bindParam(":updated_user_id", $returned_user_id, PDO::PARAM_INT);
            $query->bindParam(":user_id", $user_id, PDO::PARAM_INT);
            $query->execute();

            $rowCount = $query->rowCount();
            if($rowCount === 0) {
                $response = new Response();
                $response->setHttpStatusCode(400);
                $response->setSuccess(false);
                $response->addMessage("User not updated");
                $response->send();
                exit();
            }

            $query = $writeDB->prepare("select id, username, fullname, level, status, login_attempt from user where id=:user_id");
            $query->bindParam(':user_id', $user_id, PDO::PARAM_INT);
            $query->execute();

            $rowCount = $query->rowCount();
            if($rowCount == 0) {
                $response = new Response();
                $response->setHttpStatusCode(404);
                $response->setSuccess(false);
                $response->addMessage("No user found after updated");
                $response->send();
                exit();
            }

            $writeDB->commit();
            
            $objects = array();
            while($row = $query->fetch(PDO::FETCH_ASSOC)) {
                $user = new User($row['id'], $row['username'], $row['fullname'], $row['level'], $row['status'], $row['login_attempt']);
                $objects[] = $user->returnUserAsArray();
            }

            $returnData = array();
            $returnData['rows_returned'] = $rowCount;
            $returnData['objects'] = $objects;

            $response = new Response();
            $response->setHttpStatusCode(200);
            $response->setSuccess(true);
            $response->addMessage("User updated");
            $response->setData($returnData);
            $response->send();
            exit();

        }
        catch(UserException $ex) {
            $response = new Response();
            $response->setHttpStatusCode(400);
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
            $response->addMessage("Failed to update user, check your data for error");
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

/* get all users or creating a user */
elseif(empty($_GET)) {
    if($_SERVER['REQUEST_METHOD'] === 'GET') {
        try {
            
            $query = $readDB->prepare('select id, username, fullname, level, status, login_attempt from user');
            $query->execute();
    
            $rowCount = $query->rowCount();
            $objects = array();
            while($row = $query->fetch(PDO::FETCH_ASSOC)) {
                $user = new User($row['id'], $row['username'], $row['fullname'], $row['level'], $row['status'], $row['login_attempt']);
                $objects[] = $user->returnUserAsArray();
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
        catch(UserException $ex) {
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
    elseif($_SERVER['REQUEST_METHOD'] === 'POST') {
        //only level 6 admins can create user
        if($returned_level !== 6) {
            $response = new Response();
            $response->setHttpStatusCode(401);
            $response->setSuccess(false);
            $response->addMessage("Access restricted");
            $response->send();
            exit();
        }
        
        //check submitted content only json 
        if($_SERVER['CONTENT_TYPE'] !== 'application/json') {
            $response = new Response();
            $response->setHttpStatusCode(400); //http status 400 - Bad Request 
            $response->setSuccess(false);
            $response->addMessage("Content type header not set to JSON");
            $response->send();
            exit();
        }
        //start getting json post data and decode
        $rawPostData = file_get_contents('php://input');
        if(!$jsonData = json_decode($rawPostData)) {
            $response = new Response();
            $response->setHttpStatusCode(400); //http status 400 - Bad Request 
            $response->setSuccess(false);
            $response->addMessage("Request body is not valid JSON");
            $response->send();
            exit();
        }

        if(!isset($jsonData->fullname) || !isset($jsonData->username) || !isset($jsonData->password) || !isset($jsonData->level) || !isset($jsonData->status)) {
            $response = new Response();
            $response->setHttpStatusCode(400); //http status 400 - Bad Request 
            $response->setSuccess(false);
            (!isset($jsonData->fullname) ? $response->addMessage("Full name not supplied") : false);
            (!isset($jsonData->username) ? $response->addMessage("User name not supplied") : false);
            (!isset($jsonData->password) ? $response->addMessage("Password not supplied") : false);
            (!isset($jsonData->level) ? $response->addMessage("Level not supplied") : false);
            (!isset($jsonData->status) ? $response->addMessage("Status not supplied") : false);
            $response->send();
            exit();
        }

        try {
            
            //password hasing will automatically happens in User object initialization with data
            $user = new User(null, $jsonData->username, $jsonData->fullname, $jsonData->level, $jsonData->status, $jsonData->login_attempt);
            $user->setPassword($jsonData->password);
            
            $username = $user->getUsername();
            $password = $user->getPassword();
            $fullname = $user->getFullname();
            $level = $user->getLevel();
            $status = $user->getStatus();
            $login_attempt = $user->getLoginAttempt();

            $query = $writeDB->prepare("select id from user where username=:username");
            $query->bindParam(':username', $username, PDO::PARAM_STR);
            $query->execute();

            $rowCount = $query->rowCount();
            if($rowCount !== 0) {
                $response = new Response();
                $response->setHttpStatusCode(409); //http status 409 - Conflict 
                $response->setSuccess(false);
                $response->addMessage("Username already exists");
                $response->send();
                exit();
            }
            
            /* Begin User Add : Insert user into table by transaction control */
            $writeDB->beginTransaction();

            $query = $writeDB->prepare("insert into user (username, password, fullname, level, status, login_attempt, created_user_id) values (:username, :password, :fullname, :level, :status, 0, :created_user_id)");
            $query->bindParam(':username', $username, PDO::PARAM_STR);
            $query->bindParam(':password', $password, PDO::PARAM_STR);
            $query->bindParam(':fullname', $fullname, PDO::PARAM_STR);
            $query->bindParam(':level', $level, PDO::PARAM_INT);
            $query->bindParam(':status', $status, PDO::PARAM_INT);
            $query->bindParam(':created_user_id', $returned_user_id, PDO::PARAM_INT);

            $query->execute();           
            $lastUserID = $writeDB->lastInsertId();
            
            $writeDB->commit();
            /* End User Add */

            $rowCount = $query->rowCount();
            if($rowCount === 0) {
                $response = new Response();
                $response->setHttpStatusCode(500); //http status 500 - Internal Server Error 
                $response->setSuccess(false);
                $response->addMessage("There was an issue creating a user account - please try again");
                $response->send();
                exit();
            }

            $returnData = array();
            
            $returnData['id'] = $lastUserID;
            $returnData['fullname'] = $fullname;
            $returnData['username'] = $username;

            $response = new Response();
            $response->setHttpStatusCode(201);
            $response->setSuccess(true);
            $response->addMessage("User created");
            $response->setData($returnData);
            $response->send();
            exit();

        }
        catch(UserException $ex) {
            $response = new Response();
            $response->setHttpStatusCode(500); //http status 500 - Internal Server Error 
            $response->setSuccess(false);
            $response->addMessage($ex->getMessage());
            $response->send();
        }
        catch(PDOException $ex) {
            error_log("Database query error - ".$ex, 0);
            $response = new Response();
            $response->setHttpStatusCode(500); //http status 500 - Internal Server Error 
            $response->setSuccess(false);
            $response->addMessage("There was an issue creating a user account - please try again");
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

