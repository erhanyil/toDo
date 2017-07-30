<?php

date_default_timezone_set('Europe/London');

$d1 = new DateTime('2008-08-03 14:52:10');
$d2 = new DateTime('2008-01-03 11:11:10');
echo "d1 > ";print_r($d1);
echo "<br>";
echo"d2 > ";print_r($d2);

$d1 = date_format(new DateTime('2008-08-03 14:52:10'),'Y-m-d');
$d2 =  date_format(new DateTime('2008-01-03 11:11:10'),'Y-m-d');
echo "d1 > ";print_r($d1);
echo "<br>";
echo"d2 > ";print_r($d2);


if($d1 == $d2){
    echo "esitler";
}
echo "<br>";
if($d1 > $d2){
    echo "d1 > d2";
}
echo "<br>";
if($d1 < $d2){
    echo "d1 < d2";
}
echo "<br>";
?>