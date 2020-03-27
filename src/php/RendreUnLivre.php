<?php

require_once('Model.php');

if (isset($_GET["idLivre"])) {
	$idLivre=$_GET["idLivre"];
}else{
	echo "error";
	exit(1);
}

Model::RendreUnLivre($idLivre);


