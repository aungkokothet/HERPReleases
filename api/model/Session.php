<?php

class SessionException extends Exception {}

class Session {

    private $_id;
    private $_user_id;
    private $_username;
    private $_fullname;
    private $_level;
    private $_refresh_token_expiry;
    private $_login_ip_address;


    public function __construct($id, $user_id, $username, $fullname, $level, $refresh_token_expiry, $login_ip_address)
    {
        $this->setID($id);
        $this->setUserID($user_id);
        $this->setUsername($username);
        $this->setFullname($fullname);
        $this->setRefreshTokenExpiry($refresh_token_expiry);
        $this->setLoginIPAddress($login_ip_address);
        $this->setLevel($level);
    }

    public function getID() {
        return $this->_id;
    }
    public function setID($id) {
        if(($id !== null) && (!is_numeric($id) || $id <= 0 || $id > 9223372036854775807 || $this->_id !== null)) {
            throw new SessionException("Session ID error");
        }
        $this->_id = $id;
    }

    public function getUserID() {
        return $this->_user_id;
    }
    public function setUserID($user_id) {
        if(($user_id !== null) && (!is_numeric($user_id) || $user_id <= 0 || $user_id > 9223372036854775807)) {
            throw new SessionException("User ID error");
        }
        $this->_user_id = $user_id;
    }

    public function getFullname() {
        return $this->_fullname;
    }
    public function setFullname($fullname) {
        if(($fullname !== null) && (strlen($fullname) > 255)){
            throw new SessionException("Full name error");
        }
        $this->_fullname = $fullname;
    }

    public function getUsername() {
        return $this->_username;
    }
    public function setUsername($username) {
        if(($username !== null) && (strlen($username) > 255)){
            throw new SessionException("Username error");
        }
        $this->_username = $username;
    }

    public function getRefreshTokenExpiry() {
        return $this->_refresh_token_expiry;
    }
    public function setRefreshTokenExpiry($refresh_token_expiry) {
        if(($refresh_token_expiry !== null) && date_format(date_create_from_format('d/m/Y H:i', $refresh_token_expiry), 'd/m/Y H:i') != $refresh_token_expiry) {
            throw new SessionException("Refresh token expiry error");
        }
        $this->_refresh_token_expiry = $refresh_token_expiry;
    }

    public function getLoginIPAddress() {
        return $this->_login_ip_address;
    }

    public function setLoginIPAddress($login_ip_address) {
        if(($login_ip_address !== null) && (strlen($login_ip_address) > 255)){
            throw new SessionException("Login IP Address error");
        }
        $this->_login_ip_address = $login_ip_address;
    }
   
    public function getLevel() {
        return $this->_level;
    }

    public function setLevel($level) {
        if(($level !== null) && (strlen($level) > 10)){
            throw new SessionException("Level error");
        }
        $this->_level = $level;
    }    

    public function returnSessionAsArray() {
        $session = array();
        $session['id'] = $this->getID();
        $session['user_id'] = $this->getUserID();
        $session['username'] = $this->getUsername();
        $session['fullname'] = $this->getFullname();
        $session['level'] = $this->getLevel();
        $session['refresh_token_expiry'] = $this->getRefreshTokenExpiry();
        $session['login_ip_address'] = $this->getLoginIPAddress();
        return $session;
    }

}