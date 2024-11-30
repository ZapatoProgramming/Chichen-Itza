document.addEventListener('DOMContentLoaded', async () => {
    const listaRecorridos = document.getElementById('guia-recorridos');

    try {
        // Realiza la solicitud al endpoint
        const response = await fetch('http://localhost:3001/api/guias');
        
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
            `;
            listaRecorridos.appendChild(item);
        });
    } catch (error) {
        console.error('Error al cargar los participantes:', error);
        listaRecorridos.innerHTML = '<li>Error al cargar los participantes</li>';
    }
});