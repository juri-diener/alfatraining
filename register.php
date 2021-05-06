<?php 

$jsonString = file_get_contents("./users.json");
$userDataString = file_get_contents('php://input');

$users = json_decode($jsonString, TRUE);
$userData = json_decode($userDataString, TRUE);

$usersArr = $users["users"];

$userFound = false;

$newUser = [
  "email"=>$userData["email"],
  "password"=>$userData["password"],
  "id"=>$userData["id"]
];

for($i = 0; $i < count($usersArr); $i++) {
  if($usersArr[$i]["email"] == $userData["email"]) {
    $userFound = true;
    break;
  }
}

if(!$userFound) {
  array_push($usersArr,$newUser);
  $saveUsers = [
    "users"=>$usersArr
  ];
  $addedUser = json_encode($saveUsers);
  $myFile = fopen('users.json', 'w');
  fwrite($myFile,$addedUser);
  fclose($myFile);
  print_r('{"auth":true}');
} else {
  print_r('{"auth":false}');
}


?>