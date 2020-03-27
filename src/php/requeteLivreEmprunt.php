<?php

require_once('Model.php');

$tab = Model::readLivreEmprunt();


echo json_encode($tab);
