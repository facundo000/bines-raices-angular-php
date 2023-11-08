<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, X-Requested-With");

// IMPORTAR CONEXIÓN
$db = mysqli_connect('localhost', 'root', 'keysudo', 'bienesraices_crud');

// ESCRIBIR EL Query
$query = "SELECT * FROM propiedades";

// CONSULTAR LA BD
$resultado = mysqli_query($db, $query);
 //SE CREA UN ARRAY
$data = array();

while($row = mysqli_fetch_assoc($resultado)) {
    // Se agrega esos datos en el array
   $data[] = $row;
}

// Acceder los campos de cada registro en formato JSON
echo  json_encode($data);

mysqli_close($db);

?>