<?php

// $servername = "localhost";
// $database = "todo_db";
// $username = "root";
// $password = "";

$servername = "94.73.151.138";
$database = "stdiosoft";
$username = "stdiosoft";
$password = "XYkm50O5";

// Create connection
$conn = new mysqli($servername, $username, $password, $database);

// Check connection
if ($conn->connect_error) {
	die("0");
}

?> 