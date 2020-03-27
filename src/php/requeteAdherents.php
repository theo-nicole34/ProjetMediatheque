<?php

require_once('Model.php');

$tab = Model::readAllAd();


echo json_encode($tab);
