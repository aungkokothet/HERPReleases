<?php
/* begin authorization script */

if(empty($_SERVER['HTTP_AUTHORIZATION'])) {
    $response = new Response();
    $response->setHttpStatusCode(401);
    $response->setSuccess(false);
    (empty($_SERVER['HTTP_AUTHORIZATION']) ? $response->addMessage("Access token is mission from header") : false);
    $response->send();
    exit();
}

if(strlen($_SERVER['HTTP_AUTHORIZATION']) < 1) {
    $response = new Response();
    $response->setHttpStatusCode(401);
    $response->setSuccess(false);
    (strlen($_SERVER['HTTP_AUTHORIZATION']) < 1 ? $response->addMessage("Access token cannot be blank") : false);   
    $response->send();
    exit();
}

$accesstoken = $_SERVER['HTTP_AUTHORIZATION'];

try {
    
    $query = $writeDB->prepare("select user.id, access_token_expiry, status, login_attempt, level, fullname from user join session on user.id=session.user_id where access_token = :accesstoken");
    $query->bindParam(':accesstoken', $accesstoken, PDO::PARAM_STR);
    $query->execute();

    /* check token is valid or not. */
    $rowCount = $query->rowCount();
    if($rowCount === 0) {
        $response = new Response();
        $response->setHttpStatusCode(401);
        $response->setSuccess(false);
        $response->addMessage("Invalid Access Token");
        $response->send();
        exit();
    }

    /* token is valid, so retrieve data */
    $row = $query->fetch(PDO::FETCH_ASSOC);

    $returned_user_id = $row['id'];
    $returned_accesstokenexpiry = $row['access_token_expiry'];
    $returned_status = $row['status'];
    $returned_loginattempts = $row['login_attempt'];
    $returned_level = $row['level'];
    $returned_fullname = $row['fullname'];

    /* check user is active, if not exit */
    if($returned_status == 0) {
        $response = new Response();
        $response->setHttpStatusCode(401);
        $response->setSuccess(false);
        $response->addMessage("User account not active");
        $response->send();
        exit();
    }

    /* check loginattempts for preventing bruteforce attack for login max 3 */
    if($returned_loginattempts >= 3) {
        $response = new Response();
        $response->setHttpStatusCode(401);
        $response->setSuccess(false);
        $response->addMessage("User account is currently locked out");
        $response->send();
        exit();
    }

    /* check token is expired, if it is exit */
    $time_now = time();
    $time_expiry = strtotime($returned_accesstokenexpiry);
    if(strtotime($returned_accesstokenexpiry) < time()) {
        $response = new Response();
        $response->setHttpStatusCode(401);
        $response->setSuccess(false);
        $response->addMessage("Access Token Expired");
        $response->send();
        exit();
    }
}
catch(PDOException $ex) {
    $response = new Response();
    $response->setHttpStatusCode(500);
    $response->setSuccess(false);
    $response->addMessage("There was an issue authenticating - please try again");
    $response->send();
    exit();
}
/* End of authorization script  */
