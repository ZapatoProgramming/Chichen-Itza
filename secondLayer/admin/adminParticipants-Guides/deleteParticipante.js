        // Manejar el envío del formulario
        document.getElementById('baja-participante').addEventListener('submit', async function (event) {
            event.preventDefault(); // Evita que el formulario recargue la página

            // Obtén el ID ingresado por el usuario
            const participanteId = document.getElementById('id-participante').value.trim();

            if (!participanteId) {
                alert('Por favor, ingresa un ID válido');
                return;
            }

            try {
                // Realiza la solicitud DELETE al servidor
                const response = await fetch(`http://localhost:3001/api/participantes/${participanteId}`, {
                    method: 'DELETE'
                });

                const result = await response.json();

                if (response.ok) {
                    alert(result.message); // Muestra el mensaje de éxito
                    this.reset(); // Limpia el formulario
                } else {
                    alert(`Error: ${result.message}`); // Muestra el mensaje de error
                }
            } catch (error) {
                console.error('Error al enviar la solicitud:', error);
                alert('Ocurrió un error al eliminar el participante');
            }
        });