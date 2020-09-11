<?php

class UserException extends Exception {}

class User {

    private $_id;
    private $_username;
    private $_password;
    private $_fullname;
    private $_level;
    private $_status;
    private $_login_attempt;

    public function __construct($id, $username, $fullname, $level, $status, $login_attempt)
    {
        $this->setID($id);
        $this->setUsername($username);
        $this->setFullname($fullname);
        $this->setLevel($level);
        $this->setStatus($status);
        $this->setLoginAttempt($login_attempt);
    }

    public function getID() {
        return $this->_id;
    }
    public function setID($id) {
        if(($id !== null) && (!is_numeric($id) || $id <= 0 || $id > 9223372036854775807 || $this->_id !== null)) {
            throw new UserException("User Login ID error");
        }
        $this->_id = $id;
    }

    public function getUsername() {
        return $this->_username;
    }   
    public function setUsername($username) {
        if(strlen($username) < 0 || strlen($username) > 255) {
            throw new UserException("User name error");
        }
        $this->_username = trim($username);
    }

    public function getPassword() {
        return $this->_password;
    }   
    public function setPassword($password) {
        //plain text password is converted to hash codes and set into this object's $_password
        if(strlen($password) < 0 || strlen($password) > 255) {
            throw new UserException("Password error");
        }
        $this->_password = password_hash($password, PASSWORD_DEFAULT);
    }

    public function getFullname() {
        return $this->_fullname;
    }
    public function setFullname($fullname) {
        if(($fullname !== null) && (strlen($fullname) > 255)){
            throw new UserException("Full name error");
        }
        $this->_fullname = trim($fullname);
    }

    public function getLevel() {
        return $this->_level;
    }
    public function setLevel($level) {
        if(!is_numeric($level) || $level < 0 || $level > 9){
            throw new UserException("Level error");
        }
        $this->_level = $level;
    }

    public function getStatus() {
        return $this->_status;
    }

    public function setStatus($status) {
        if(!is_numeric($status) || $status < 0 || $status > 9 ){
            throw new UserException("User status error");
        }
        $this->_status = $status;
    }

    public function getLoginAttempt() {
        return $this->_login_attempt;
    }

    public function setLoginAttempt($login_attempt) {
        if(!is_numeric($login_attempt) || $login_attempt < 0 || $login_attempt > 9 ){
            throw new UserException("Login attempt error");
        }
        $this->_login_attempt = $login_attempt;
    }

    public function returnUserAsArray() {
        $user_login = array();
        $user_login['id'] = $this->getID();
        $user_login['username'] = $this->getUsername();
        $user_login['fullname'] = $this->getFullname();
        $user_login['level'] = $this->getLevel();
        $user_login['status'] = $this->getStatus();
        $user_login['login_attempt'] = $this->getLoginAttempt();
        return $user_login;
    }

}