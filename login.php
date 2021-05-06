<?php 

$jsonString = file_get_contents("./users.json");
$userDataString = file_get_contents('php://input');

$users = json_decode($jsonString, TRUE);
$userData = json_decode($userDataString, TRUE);

$usersArr = $users["users"];

$userFound = false;

for($i = 0; $i < count($usersArr); $i++) {
  if($usersArr[$i]["email"] == $userData["email"] && $usersArr[$i]["password"] == $userData["password"]) {
    $userFound = true;
    break;
  }
}

if($userFound) {
  print_r('{"auth":true}');
} else {
  print_r('{"auth":false}');
}

?>