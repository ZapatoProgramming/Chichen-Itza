export default class ZonaGeografica {
    constructor(nombre, descripcion) {
        if (!nombre || !descripcion) {
            throw new Error('Todos los campos son obligatorios para crear una zona geográfica.');
        }

        this.nombre = nombre.trim();
        this.descripcion = descripcion.trim();
    }

    getZonaData() {
        return {
            nombre: this.nombre,
            descripcion: this.descripcion
        };
    }
}
