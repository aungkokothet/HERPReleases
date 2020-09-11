<?php
class DB {
    private static $writeDBConnection;
    private static $readDBConnection;

    public static function connectWriteDB() {
        if(self::$writeDBConnection === null) {
            self::$writeDBConnection = new PDO('mysql:host=localhost;dbname=herp;charset=utf8', 'root', 'root');
            self::$writeDBConnection->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            self::$writeDBConnection->setAttribute(PDO::ATTR_EMULATE_PREPARES, false);
        }
        return self::$writeDBConnection;
    }

    public static function connectReadDB() {
        if(self::$readDBConnection === null) {
            self::$readDBConnection = new PDO('mysql:host=localhost;dbname=herp;charset=utf8', 'root', 'root');
            self::$readDBConnection->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            self::$readDBConnection->setAttribute(PDO::ATTR_EMULATE_PREPARES, false);
        }
        return self::$readDBConnection;
    }
}

try {
    $readDB = DB::connectReadDB();
    $writeDB = DB::connectWriteDB();
}
catch(PDOException $ex) {
    error_log("Connection error - ".$ex, 0);
    $response = new Response();
    $response->setHttpStatusCode(500);
    $response->setSuccess(false);
    $response->addMessage("Database connection error");
    $response->send();
    exit();
}