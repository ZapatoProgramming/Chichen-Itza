import Participant from '../../Participant.js';

document.getElementById('participant-form').addEventListener('submit', async function (event) {
    event.preventDefault();

    try {
        const formData = new FormData(this);
        const name = formData.get('name');
        const avatar = formData.get('avatar');
        const role = 'participant';

        // Usa la clase Participant para crear un objeto
        const participant = new Participant(name, role, avatar);
        const participantData = participant.getParticipantData();
        console.log(participantData);

        // Envía los datos al servidor
        const response = await fetch('http://localhost:3001/api/users', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                adminUsername: 'admin',
                adminPassword: 'admin123',
                newUser: participantData
            })
        });

        const result = await response.json();

        if (response.ok) {
            alert(`Usuario creado exitosamente con ID: ${result.insertedId}`);
            this.reset();
            window.location.href = '/admin/index.html';
        } else {
            alert(`Error: ${result.message}`);
        }
    } catch (error) {
        console.error('Error al enviar el formulario:', error);
        alert('Ocurrió un error al procesar la solicitud.');
    }
});
