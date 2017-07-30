<?php

include "config.php";

$data = json_decode(file_get_contents("php://input"));

$ITEM_ID = $data ->itemID;
$ITEM_USER_ID = $data ->userID;
$ITEM_TITLE = $data->title;
$ITEM_DETAIL = $data->detail;
$ITEM_TYPE = $data->type;
$ITEM_NOTIF = $data->notification;
$ITEM_FINISH_DATE = $data->date;
$ITEM_INSERT_DATE = date('Y-m-d H:i:s');

$sql = "UPDATE tbl_items SET 
 ITEM_USER_ID = $ITEM_USER_ID,
 ITEM_TITLE = '$ITEM_TITLE',
 ITEM_DETAIL = '$ITEM_DETAIL',
 ITEM_TYPE = '$ITEM_TYPE',
 ITEM_NOTIF = $ITEM_NOTIF,
 ITEM_FINISH_DATE = '$ITEM_FINISH_DATE',
 ITEM_INSERT_DATE = '$ITEM_INSERT_DATE'
 WHERE 
 ITEM_ID = ".$ITEM_ID;

if($conn->query($sql) == TRUE) {
	echo "0";
}else{
	echo "1";
}

$conn->close();

?>
