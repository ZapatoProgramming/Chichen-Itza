import Recorrido from '../Recorrido.js';

document.addEventListener('DOMContentLoaded', async () => {
    const guiasContainer = document.getElementById('guias-container');
    const zonasContainer = document.getElementById('zonas-container');
    const participantesContainer = document.getElementById('participantes-container');

    // Función para llenar checkboxes dinámicamente
    async function fillCheckboxes(endpoint, container) {
        try {
            const response = await fetch(`http://localhost:3001/api/${endpoint}`);
            const items = await response.json();

            items.forEach(item => {
                const checkbox = document.createElement('input');
                checkbox.type = 'checkbox';
                checkbox.value = item._id;
                checkbox.id = `${endpoint}-${item._id}`;
                checkbox.name = `${endpoint}`;

                const label = document.createElement('label');
                label.htmlFor = `${endpoint}-${item._id}`;
                label.textContent = item.name || item.nombre;

                const div = document.createElement('div');
                div.appendChild(checkbox);
                div.appendChild(label);

                container.appendChild(div);
            });
        } catch (error) {
            console.error(`Error al cargar ${endpoint}:`, error);
        }
    }

    // Llenar las secciones dinámicamente
    await fillCheckboxes('guias', guiasContainer);
    await fillCheckboxes('zonas', zonasContainer);
    await fillCheckboxes('participantes', participantesContainer);

    // Manejo del formulario
    document.getElementById('registrar-recorrido').addEventListener('submit', async (event) => {
        event.preventDefault();

        try {
            const nombre = document.getElementById('nombre').value;
            const duracion = document.getElementById('duracion').value;
            const fecha = document.getElementById('fecha').value;

            // Obtén los valores seleccionados de cada grupo de checkboxes
            const guias = Array.from(guiasContainer.querySelectorAll('input:checked')).map(input => input.value);
            const zonas = Array.from(zonasContainer.querySelectorAll('input:checked')).map(input => input.value);
            const participantes = Array.from(participantesContainer.querySelectorAll('input:checked')).map(input => input.value);

            const recorrido = new Recorrido(nombre, duracion, fecha, guias, zonas, participantes);
            const recorridoData = recorrido.getRecorridoData();

            // Enviar los datos al servidor
            const response = await fetch('http://localhost:3001/api/recorridos', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(recorridoData)
            });

            const result = await response.json();
            if (response.ok) {
                alert(`Recorrido creado exitosamente con ID: ${result.insertedId}`);
                event.target.reset();
                window.location.href = '/admin/index.html';
            } else {
                alert(`Error: ${result.message}`);
            }
        } catch (error) {
            console.error('Error al registrar el recorrido:', error);
            alert('Ocurrió un error al registrar el recorrido.');
        }
    });
});
