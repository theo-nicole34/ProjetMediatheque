<?php

require_once('Model.php');

if (isset($_GET["name"])) {
	if ($_GET["name"] == "") {
		echo "erreur, veuillez remplir le champ";
		exit(1);
	}
	$name=$_GET["name"];
}else{
	echo "error";
	exit(1);
}

Model::ajouter($name,"adherent","nomAdherent");


