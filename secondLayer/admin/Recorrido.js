export default class Recorrido {
    constructor(nombre, duracion, fecha, guias, zonas, participantes) {
        if (!nombre || !duracion || !fecha || !guias.length || !zonas.length || !participantes.length) {
            throw new Error('Todos los campos son obligatorios.');
        }

        this.nombre = nombre.trim();
        this.duracion = parseInt(duracion, 10);
        this.fecha = new Date(fecha);
        this.guias = guias; // Referencias a los guías
        this.zonas = zonas; // Referencias a las zonas
        this.participantes = participantes; // Referencias a los participantes
    }

    getRecorridoData() {
        return {
            nombre: this.nombre,
            duracion: this.duracion,
            fecha: this.fecha,
            guias: this.guias,
            zonas: this.zonas,
            participantes: this.participantes
        };
    }
}
