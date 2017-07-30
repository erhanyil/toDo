<?php

include "config.php";

$data = json_decode(file_get_contents("php://input"));

$ITEM_ID = $data ->itemID;

$sql = "DELETE FROM tbl_items WHERE ITEM_ID=".$ITEM_ID;

if($conn->query($sql) == TRUE) {
	echo "0";
}else{
	echo "1";
}

$conn->close();

?>
