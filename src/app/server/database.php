<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, X-Requested-With");

function conectarDB() : mysqli {
    $db = mysqli_connect('localhost', 'root', 'keysudo', 'bienesraices_crud');

    if(!$db) {
        echo "Error no se pudo conectar";
        exit;
    }

    return $db;
}

// Llama a la función
$db = conectarDB();

// Verifica si la conexión fue exitosa
if ($db) {
    echo "Conexión exitosa a la base de datos";
} else {
    echo "Falló la conexión";
}

if ($_SERVER["REQUEST_METHOD"] === "POST") {
    echo '<pre>';
    var_dump($_POST);
    echo '</pre>';

    $titulo = mysqli_real_escape_string( $db, $_POST['titulo']);
    $precio = mysqli_real_escape_string( $db, $_POST['precio']);
    $descripcion = mysqli_real_escape_string( $db, $_POST['descripcion']);
    $habitaciones = mysqli_real_escape_string( $db, $_POST['habitaciones']);
    
    $creado = (date('Y/m/d'));
    
    $wc = mysqli_real_escape_string( $db, $_POST['wc']);
    $estacionamiento = mysqli_real_escape_string( $db, $_POST['estacionamiento']);
    $vendedores_id = mysqli_real_escape_string( $db, $_POST['vendedores']);

    //INSERTAR VALORES EN LA BASE DE DATOS
    $query = " INSERT INTO propiedades (titulo, precio, descripcion, habitaciones, wc, estacionamiento, creado, vendedores_id ) VALUES ('$titulo', '$precio', '$descripcion', '$habitaciones', '$wc',' $estacionamiento', '$creado', '$vendedores_id')";

    // echo $query;

    $resultado = mysqli_query($db, $query);
    // $resultado = true;

    if($resultado) {
        // echo "Insertado Correctamente";
        echo json_encode(["message" => "Insertado Correctamente"]);
    } else {
        echo json_encode(["message" => "No se inserto a la base de datos"]);

    }
}

?>