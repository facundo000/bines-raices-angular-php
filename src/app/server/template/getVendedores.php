<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, X-Requested-With");

$db = mysqli_connect('localhost', 'root', 'keysudo', 'bienesraices_crud');

// Verificacion de conexión
if($db->connect_error) {
    die("Conexión fallida " . $db->connect_error);
}

// Ejecutar consulta SQL
$sql = "SELECT id, nombre, apellido FROM vendedores";
$resultado = $db->query($sql);

$vendedores = array();

if($resultado->num_rows > 0) {
    while($vendedor = $resultado->fetch_assoc()) {
        $vendedores[] = $vendedor;
    }
} else {
    echo "0 resultados";
}

echo json_encode($vendedores);

 ?>
