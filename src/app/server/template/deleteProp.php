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

if ($_SERVER["REQUEST_METHOD"] === "DELETE") {
    // Obtener el id de la propiedad a eliminar
    $id = $_GET['id'];
  
    // Validar el id
    $id = filter_var($id, FILTER_VALIDATE_INT);
  
    // Eliminar el archivo
    $query = "SELECT imagen FROM propiedades WHERE id = ${id}";

    $resultado = mysqli_query($db, $query);
    $propiedad = mysqli_fetch_assoc($resultado);

    $rutaImg = 'C:/apache/htdocs/bienesraices_angular/src/app/server/template/imagenes/';

    unlink($rutaImg . $propiedad['imagen']);

    // Eliminar la propiedad de la base de datos
    $query = "DELETE FROM propiedades WHERE id = ${id}";
    $resultado = mysqli_query($db, $query);
  
    if($resultado) {
        echo json_encode(["message" => "Propiedad eliminada con éxito"]);
    } else {
        echo json_encode(["message" => "Error al eliminar la propiedad"]);
    }
 }
 
 
 
?>
