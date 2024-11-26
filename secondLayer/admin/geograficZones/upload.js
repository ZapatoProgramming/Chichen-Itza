document.getElementById('alta-zona').addEventListener('submit', async function (event) {
    event.preventDefault(); // Evita que el formulario recargue la página

    // Obtén los valores del formulario
    const nombre = document.getElementById('nombre').value.trim();
    const descripcion = document.getElementById('descripcion').value.trim();

    // Valida los datos antes de enviarlos
    if (!nombre || !descripcion) {
        alert('Por favor, completa todos los campos.');
        return;
    }

    try {
        // Realiza la solicitud POST al servidor
        const response = await fetch('http://localhost:3001/api/zonas', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ nombre, descripcion }) // Datos enviados al servidor
        });

        const result = await response.json();

        if (response.ok) {
            alert('Zona geográfica creada exitosamente');
            this.reset(); // Limpia el formulario después de guardar
        } else {
            alert(`Error: ${result.message}`);
        }
    } catch (error) {
        console.error('Error al enviar el formulario:', error);
        alert('Ocurrió un error al guardar la zona geográfica');
    }
});