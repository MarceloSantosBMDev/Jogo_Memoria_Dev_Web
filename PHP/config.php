<?php
session_start();

require_once('connection.php'); 

$is_logged_in = isset($_SESSION['loggedin']) && $_SESSION['loggedin'] === true;
?>