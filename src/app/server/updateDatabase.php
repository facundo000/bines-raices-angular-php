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
    echo "UPDATE: Conexión exitosa a la base de datos";
} else {
    echo "Falló la conexión";
}

if ($_SERVER["REQUEST_METHOD"] === "POST") {
    // VER INFORMACIÓN
    echo '<pre>';
    var_dump($_POST);
    echo '</pre>';

    // echo '<pre>';
    // var_dump($_FILES);
    // echo '</pre>';

    // Validar ID
    $id = $_POST['id'];
    $id = filter_var($id, FILTER_VALIDATE_INT);

    // Obtener datos de propiedad
    $consulta = "SELECT * FROM propiedades WHERE id = ${id}";
    $resultado = mysqli_query($db, $consulta);
    $propiedad = mysqli_fetch_assoc($resultado);

    $titulo = mysqli_real_escape_string( $db, $_POST['titulo']);
    $precio = mysqli_real_escape_string( $db, $_POST['precio']);
    $descripcion = mysqli_real_escape_string( $db, $_POST['descripcion']);
    $habitaciones = mysqli_real_escape_string( $db, $_POST['habitaciones']);
    
    $creado = (date('Y/m/d'));
    
    $wc = mysqli_real_escape_string( $db, $_POST['wc']);
    $estacionamiento = mysqli_real_escape_string( $db, $_POST['estacionamiento']);
    $vendedores_id = mysqli_real_escape_string( $db, $_POST['vendedores']);

    
    $carpetaImagenes = 'template/imagenes/';

    // CREAR CARPETA
    if(!is_dir($carpetaImagenes)) {
        mkdir($carpetaImagenes);
    }

    $nombreImagen = '';

    /**  SUBIDA DE ARCHIVOS   **/
    if($_FILES['imagen']['name']) {
        //  eliminar imagen previa

        unlink($carpetaImagenes . $propiedad['imagen']);

        // GENERAR UN NOMBRE ÚNICO
        $nombreImagen = md5( uniqid( rand(), true ) ) . ".jpg";
        
        // SUBIR IMAGENES
        move_uploaded_file($_FILES['imagen']['tmp_name'], $carpetaImagenes . $nombreImagen );
    } else {
        $nombreImagen = $propiedad['imagen'];
    }
    
    //INSERTAR VALORES EN LA BASE DE DATOS
    $query = " UPDATE propiedades SET titulo = '${titulo}', precio = ${precio}, imagen = '${nombreImagen}', descripcion = '${descripcion}', habitaciones = ${habitaciones}, wc = ${wc}, estacionamiento = ${estacionamiento}, vendedores_id = ${vendedores_id} WHERE id = ${id} ";

    echo $query;

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