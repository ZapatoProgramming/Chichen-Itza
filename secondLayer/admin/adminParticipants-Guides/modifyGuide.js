document.addEventListener('DOMContentLoaded', async () => {
    const params = new URLSearchParams(window.location.search);
    const participanteId = params.get('id');

    if (!participanteId) {
        alert('No se proporcionó un ID de participante válido.');
        return;
    }

    // Muestra el ID en el elemento <p>
    document.getElementById('id-display').textContent = participanteId;

    try {
        const response = await fetch(`http://localhost:3001/api/participantes/${participanteId}`);
        if (!response.ok) {
            throw new Error('Error al obtener los datos del participante.');
        }

        const participante = await response.json();

        // Llena el formulario con los datos del participante
        document.getElementById('name').value = participante.name || '';
        document.getElementById('avatar').value = participante.avatar || '';
    } catch (error) {
        console.error('Error al cargar los datos del participante:', error);
        alert('Ocurrió un error al cargar los datos del participante.');
    }

    document.getElementById('modificar-guia').addEventListener('submit', async (event) => {
        event.preventDefault();

        const updatedFields = {
            id: participanteId,
            name: document.getElementById('name').value.trim(),
            avatar: document.getElementById('avatar').value
        };

        try {
            const response = await fetch(`http://localhost:3001/api/participantes`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(updatedFields)
            });

            const result = await response.json();

            if (response.ok) {
                alert('Participante modificado exitosamente.');
                window.location.href = '/admin/adminParticipants-Guides/consultaGuia.html';
            } else {
                alert(`Error: ${result.message}`);
            }
        } catch (error) {
            console.error('Error al actualizar el guia:', error);
            alert('Ocurrió un error al actualizar el guia.');
        }
    });
});
