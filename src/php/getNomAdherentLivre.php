<?php

require_once('Model.php');

if (isset($_GET["idLivre"])) {
	if ($_GET["idLivre"] == "") {
		echo "erreur";
		exit(1);
	}
	$idLivre=$_GET["idLivre"];
}else{
	echo "error";
	exit(1);
}

$tab = Model::getNameAdFromIdLivre($idLivre);


echo json_encode($tab);