document.getElementById('modificar-participante').addEventListener('submit', async function (event) {
    event.preventDefault(); // Evita que el formulario recargue la página

    // Recopila los datos del formulario
    const id = document.getElementById('id').value.trim();
    const name = document.getElementById('name').value.trim();
    const avatar = document.getElementById('avatar').value;

    if (!id) {
        alert('El ID del participante es obligatorio');
        return;
    }

    try {
        // Enviar la solicitud de actualización al servidor
        const response = await fetch('http://localhost:3001/api/participantes', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ id, name, avatar })
        });

        const result = await response.json();

        if (response.ok) {
            alert(result.message);
            this.reset(); // Limpia el formulario después de guardar
        } else {
            alert(`Error: ${result.message}`);
        }
    } catch (error) {
        console.error('Error al enviar el formulario:', error);
        alert('Ocurrió un error al procesar la solicitud');
    }
});