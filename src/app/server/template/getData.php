<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, X-Requested-With");

// IMPORTAR CONEXIÓN
$db = mysqli_connect('localhost', 'root', 'keysudo', 'bienesraices_crud');

// Verificar si se proporcionó un id
if (isset($_GET['id'])) {
    $id = $_GET['id'];

    // ESCRIBIR EL Query
    $query = "SELECT * FROM propiedades WHERE id = $id";

    // CONSULTAR LA BD
    $resultado = mysqli_query($db, $query);

    // Verificar si la propiedad existe
    if (mysqli_num_rows($resultado) > 0) {
        // Se agrega esos datos en el array
        $data = mysqli_fetch_assoc($resultado);

        // Acceder los campos de cada registro en formato JSON
        echo  json_encode($data);
    } else {
        // Si la propiedad no existe, devolver un error
        http_response_code(404);
        echo json_encode(['error' => 'Property not found']);
    }
} else {
// Si no se proporcionó un id, devolver todas las propiedades

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
}

mysqli_close($db);

?>