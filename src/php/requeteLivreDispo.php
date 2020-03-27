<?php

require_once('Model.php');

$tab = Model::readLivreDispo();


echo json_encode($tab);
