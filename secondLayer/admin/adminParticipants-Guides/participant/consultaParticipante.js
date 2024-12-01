document.addEventListener('DOMContentLoaded', async () => {
    const listaRecorridos = document.getElementById('participante-recorridos');

    try {
        // Realiza la solicitud al endpoint
        const response = await fetch('http://localhost:3001/api/participantes');
        
        if (!response.ok) {
            throw new Error('Error al obtener los participantes');
        }

        const participantes = await response.json();

        // Limpia la lista
        listaRecorridos.innerHTML = '';

        // Renderiza los participantes en la lista
        participantes.forEach(participante => {
            const item = document.createElement('li');
            item.innerHTML = `
                <h3>ID: ${participante._id}</h3>
                <p>Nombre: ${participante.name || 'Sin nombre'}</p>
                <p>Avatar: ${participante.avatar || 'Sin avatar'}</p>
                <div style="display: flex; gap: 10px;">
                    <button class="modify-button" data-id="${participante._id}" style="background-color: blue; color: white; border: none; padding: 5px 10px; cursor: pointer;">
                        Modificar
                    </button>
                    <button class="delete-button" data-id="${participante._id}" style="background-color: red; color: white; border: none; padding: 5px 10px; cursor: pointer;">
                        Eliminar
                    </button>
                </div>
            `;
            listaRecorridos.appendChild(item);
        });

        // Añadir event listener a los botones de modificar
        const modifyButtons = document.querySelectorAll('.modify-button');
        modifyButtons.forEach(button => {
            button.addEventListener('click', (event) => {
                const participanteId = event.target.getAttribute('data-id');
                // Abre la página de modificación con el ID del participante como parámetro en la URL
                window.location.href = `/admin/adminParticipants-Guides/participant/modifyParticipant.html?id=${participanteId}`;
            });
        });

        // Añadir event listener a los botones de eliminar
        const deleteButtons = document.querySelectorAll('.delete-button');
        deleteButtons.forEach(button => {
            button.addEventListener('click', async (event) => {
                const participanteId = event.target.getAttribute('data-id');

                if (confirm('¿Estás seguro de que deseas eliminar este participante?')) {
                    try {
                        const deleteResponse = await fetch(`http://localhost:3001/api/participantes/${participanteId}`, {
                            method: 'DELETE'
                        });

                        const result = await deleteResponse.json();

                        if (deleteResponse.ok) {
                            alert(result.message);
                            // Eliminar el elemento del DOM
                            event.target.parentElement.parentElement.remove();
                        } else {
                            alert(`Error: ${result.message}`);
                        }
                    } catch (error) {
                        console.error('Error al eliminar el participante:', error);
                        alert('Ocurrió un error al eliminar el participante');
                    }
                }
            });
        });
    } catch (error) {
        console.error('Error al cargar los participantes:', error);
        listaRecorridos.innerHTML = '<li>Error al cargar los participantes</li>';
    }
});
