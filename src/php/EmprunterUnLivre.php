<?php

require_once('Model.php');

if (isset($_GET["idLivre"]) && isset($_GET["idAdherent"])) {
	if ($_GET["idAdherent"] == "") {
		echo "erreur, veuillez remplir le champ";
		exit(1);
	}
	$idAdherent=$_GET["idAdherent"];
	$idLivre=$_GET["idLivre"];
}else{
	echo "error";
	exit(1);
}

Model::EmprunterUnLivre($idLivre,$idAdherent);




