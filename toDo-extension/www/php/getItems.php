<?php

include "config.php";
//include "chekInsertUpdate.php";

$data = json_decode(file_get_contents("php://input"));

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");


$USER_ID = $data ->userID;

if(isset($USER_ID)){
	if( !empty($USER_ID)){
		$sql="SELECT * FROM tbl_items WHERE ITEM_USER_ID = ".$USER_ID;
		$result = $conn->query($sql);
		$outp = "";

		if ($result->num_rows > 0) {
    	while($rs = $result->fetch_assoc()) {
				if ($outp != "") {$outp .= ",";}
				$outp .= '{"itemID":"'.$rs["ITEM_ID"].'",';
				$outp .= '"title":"'.$rs["ITEM_TITLE"].'",';
				$outp .= '"detail":"'.$rs["ITEM_DETAIL"].'",';
				$outp .= '"type":"'.$rs["ITEM_TYPE"].'",';
				$outp .= '"notification":"'.$rs["ITEM_NOTIF"].'",';
				$outp .= '"date":"'.$rs["ITEM_FINISH_DATE"].'",';
				$outp .= '"insertDate":"'.$rs["ITEM_INSERT_DATE"].'"}';
			}
			$outp ='{"userItemData":['.$outp.']}';
			echo($outp);
		}else{
			echo "1";
		}
		$conn->close();
	}else{
        echo "1";
    }
}else {
    echo "1";
}

?>
