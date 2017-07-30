<?php

include "config.php";

$data = json_decode(file_get_contents("php://input"));

$USER_NAME = $data ->username;
$USER_EMAIL = $data->email;
$USER_PASSWORD = $data->password;
$USER_TYPE = 'USR';

$sql = "INSERT INTO tbl_users(USER_NAME, USER_EMAIL, USER_PASSWORD, USER_TYPE) VALUES ('$USER_NAME', '$USER_EMAIL', '$USER_PASSWORD', '$USER_TYPE')";

if($conn->query($sql) == TRUE) {
	echo "0";
}else{
	echo "1";
}

$conn->close();

?>
