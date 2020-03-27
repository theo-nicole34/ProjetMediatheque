<?php

require_once('Conf.php');

class Model {

    public static $pdo;

    public static function init_pdo() {
        $host   = Conf::getHostname();
        $dbname = Conf::getDatabase();
        $login  = Conf::getLogin();
        $pass   = Conf::getPassword();
        try {
            // connexion à la base de données
            // le dernier argument sert à ce que toutes les chaines de charactères
            // en entrée et sortie de MySql soit dans le codage UTF-8
            self::$pdo = new PDO("mysql:host=$host;dbname=$dbname", $login, $pass, array(PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES utf8"));
            // on active le mode d'affichage des erreurs, et le lancement d'exception en cas d'erreur
            self::$pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        } catch (PDOException $ex) {
            echo $ex->getMessage();
            die("Problème lors de la connexion à la base de données.");
        }
    }

    public static function readAllAd() {
        try {
            $req_prep = self::$pdo->query('SELECT a.idAdherent, a.nomAdherent, COUNT(e.idAdherent) AS nbEmprunt
                FROM emprunt e
                RIGHT JOIN adherent a on e.idAdherent=a.idAdherent
                GROUP BY a.idAdherent, a.nomAdherent
                ORDER BY a.idAdherent');
            $req_prep->setFetchMode(PDO::FETCH_OBJ);
            $tabResults = $req_prep->fetchAll();
            return $tabResults;
        } catch (PDOException $e) {
            echo $e->getMessage();
            die("Une erreur apparait lors de la recherche dans la base de données.");
        }
    }
    public static function readAd($id) {
        try {
            $sql = "SELECT l.titreLivre
                    FROM emprunt e
                    JOIN livre l ON e.idLivre=l.idLivre
                    WHERE e.idAdherent=:id";
            $req_prep = Model::$pdo->prepare($sql);
            $values = array("id" => $id);
            $req_prep->execute($values);
            $req_prep->setFetchMode(PDO::FETCH_OBJ);
            $tabResults = $req_prep->fetchAll();
            return $tabResults;
        } catch (PDOException $e) {
            echo $e->getMessage();
            die("Une erreur apparait lors de la recherche dans la base de données.");
        }
    }
    public static function readLivreDispo() {
        try {
            $req_prep = self::$pdo->query('SELECT l.idLivre, l.titreLivre
                from livre l
                where not exists (
                    select e.idLivre
                    from emprunt e
                    where l.idLivre=e.idLivre)');
            $req_prep->setFetchMode(PDO::FETCH_OBJ);
            $tabResults = $req_prep->fetchAll();
            return $tabResults;
        } catch (PDOException $e) {
            echo $e->getMessage();
            die("Une erreur apparait lors de la recherche dans la base de données.");
        }
    }
    public static function readLivreEmprunt() {
        try {
            $req_prep = self::$pdo->query('SELECT l.idLivre, l.titreLivre
                from livre l
                join emprunt e on l.idLivre=e.idLivre');
            $req_prep->setFetchMode(PDO::FETCH_OBJ);
            $tabResults = $req_prep->fetchAll();
            return $tabResults;
        } catch (PDOException $e) {
            echo $e->getMessage();
            die("Une erreur apparait lors de la recherche dans la base de données.");
        }
    }
    public static function ajouter($name,$objet,$attribut) {
        try {
            $sql = "INSERT INTO ".$objet." (".$attribut.") VALUES (:name)";
            $req_prep = Model::$pdo->prepare($sql);
            $values = array("name" => $name);
            $req_prep->execute($values);
        } catch (PDOException $e) {
            echo $e->getMessage();
            die("Une erreur apparait lors de la recherche dans la base de données.");
        }
    }
    public static function getNameAd($id) {
        try {
            $sql = "SELECT a.nomAdherent
                    FROM adherent a
                    WHERE a.idAdherent=:id";
            $req_prep = Model::$pdo->prepare($sql);
            $values = array("id" => $id);
            $req_prep->execute($values);
            $req_prep->setFetchMode(PDO::FETCH_OBJ);
            $tabResults = $req_prep->fetchAll();
            return $tabResults;
        } catch (PDOException $e) {
            echo $e->getMessage();
            die("Une erreur apparait lors de la recherche dans la base de données.");
        }
    }
    public static function EmprunterUnLivre($idLivre,$idAdherent) {
        try {
            $sql = "INSERT INTO emprunt(idAdherent,idLivre) VALUES (:idAdherent,:idLivre)";
            $req_prep = Model::$pdo->prepare($sql);
            $values = array("idAdherent" => $idAdherent,
                            "idLivre" => $idLivre);
            $req_prep->execute($values);
        } catch (PDOException $e) {
            echo $e->getMessage();
            die("Une erreur apparait lors de la recherche dans la base de données.");
        }
    }
    public static function getNameAdFromIdLivre($idLivre) {
        try {
            $sql = "SELECT a.nomAdherent
                    FROM adherent a
                    JOIN emprunt e ON a.idAdherent=e.idAdherent
                    WHERE e.idLivre=:idLivre";
            $req_prep = Model::$pdo->prepare($sql);
            $values = array("idLivre" => $idLivre);
            $req_prep->execute($values);
            $req_prep->setFetchMode(PDO::FETCH_OBJ);
            $tabResults = $req_prep->fetchAll();
            return $tabResults;
        } catch (PDOException $e) {
            echo $e->getMessage();
            die("Une erreur apparait lors de la recherche dans la base de données.");
        }
    }
    public static function RendreUnLivre($idLivre) {
        try {
            $sql = "DELETE FROM emprunt WHERE idLivre=:idLivre";
            $req_prep = Model::$pdo->prepare($sql);
            $values = array("idLivre" => $idLivre);
            $req_prep->execute($values);
        } catch (PDOException $e) {
            echo $e->getMessage();
            die("Une erreur apparait lors de la recherche dans la base de données.");
        }
    }
}

// on initialise la connexion $pdo
Model::init_pdo();

?>
