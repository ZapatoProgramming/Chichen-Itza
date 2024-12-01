import ZonaGeografica from '../ZonaGeografica.js';

document.getElementById('alta-zona').addEventListener('submit', async function (event) {
    event.preventDefault(); // Evita el comportamiento predeterminado del formulario

    try {
        // Recopila los datos del formulario
        const formData = new FormData(this);
        const nombre = formData.get('nombre');
        const descripcion = formData.get('descripcion');

        // Crea una nueva zona geográfica usando la clase
        const zona = new ZonaGeografica(nombre, descripcion);
        const zonaData = zona.getZonaData();

        // Envía los datos al servidor
        const response = await fetch('http://localhost:3001/api/zonas', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(zonaData)
        });

        const result = await response.json();

        if (response.ok) {
            alert(`Zona geográfica creada exitosamente con ID: ${result.insertedId}`);
            this.reset(); // Limpia el formulario
            window.location.href = '/admin/index.html';
        } else {
            alert(`Error: ${result.message}`);
        }
    } catch (error) {
        console.error('Error al enviar el formulario:', error);
        alert('Ocurrió un error al guardar la zona geográfica.');
    }
});
