export interface User {
    id:          string;
    email:       string;
    nombre:      string;
    apellido:    string;
    esActivo:    boolean;
    roles:       string[];
    telefono:    string;
    contrasenia?: string; // Opcional ya que no viene en check-status
}