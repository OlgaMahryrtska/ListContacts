<?php



require_once 'db.php';

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
	// get posted data
	$data = json_decode(file_get_contents("php://input", true));
 

	
  $sql = "INSERT INTO osoby (name, surname, phone, email) VALUES('" . mysqli_real_escape_string($dbConn, $data->name) . "', '" . mysqli_real_escape_string($dbConn, $data->surname) . "', '" . mysqli_real_escape_string($dbConn, $data->phone) . "', '" . mysqli_real_escape_string($dbConn, $data->email) . "')";
   
	dbQuery($sql);
}

//End of file