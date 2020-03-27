<?php

require_once('Model.php');

if (isset($_GET["id"])) {
	if ($_GET["id"] == "") {
		echo "erreur";
		exit(1);
	}
	$id=$_GET["id"];
}else{
	echo "error";
	exit(1);
}

$tab = Model::readAd($id);


echo json_encode($tab);