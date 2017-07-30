<?php

include "config.php";

$data = json_decode(file_get_contents("php://input"));

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");


$USER_NAME = $data ->username;
$USER_PASSWORD = $data->password;

if(isset($USER_NAME) && isset($USER_PASSWORD) ){
	if( !empty($USER_NAME)  && !empty($USER_PASSWORD)  ){


		$sql="SELECT * FROM tbl_users WHERE USER_NAME = '".$USER_NAME."' and USER_PASSWORD = '".$USER_PASSWORD."'";
		$result = $conn->query($sql);
		$outp = "";

		if ($result->num_rows > 0) {
    	while($rs = $result->fetch_assoc()) {
				if ($outp != "") {$outp .= ",";}
				$outp .= '{"userID":"'.$rs["USER_ID"].'",';
				$outp .= '"username":"'.$rs["USER_NAME"].'",';
				$outp .= '"password":"'.$rs["USER_PASSWORD"].'",';
				$outp .= '"email":"'.$rs["USER_EMAIL"].'",';
				$outp .= '"userType":"'.$rs["USER_TYPE"].'"}';
			}
			$outp ='{"userLoginData":['.$outp.']}';
			echo($outp);
		}else{
			echo "1";
		}
		$conn->close();



	}
}

?>
