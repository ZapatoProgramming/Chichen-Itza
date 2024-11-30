document.getElementById('guide-form').addEventListener('submit', async function (event) {
    event.preventDefault(); // Evita que se recargue la página al enviar el formulario

    // Recopila los datos del formulario
    const formData = new FormData(this);
    const data = {
        adminUsername: 'admin', // Reemplaza con el usuario administrador autenticado
        adminPassword: 'admin123', // Reemplaza con la contraseña del administrador
        newUser: {
            name: formData.get('name'),
            role: 'guide',
            avatar: formData.get('avatar'),
            username: formData.get('name').toLowerCase().replace(/\s+/g, ''), // Genera un username
            password: 'defaultpassword' // Contraseña predeterminada (puedes pedirla en el formulario)
        }
    };

    try {
        // Envía la solicitud al servidor Express
        const response = await fetch('http://localhost:3001/api/users', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        const result = await response.json();

        if (response.ok) {
            alert(`Guia creado exitosamente con ID: ${result.insertedId}`);
            this.reset(); // Limpia el formulario
        } else {
            alert(`Error: ${result.message}`);
        }
    } catch (error) {
        console.error('Error al enviar el formulario:', error);
        alert('Ocurrió un error al procesar la solicitud');
    }
});

