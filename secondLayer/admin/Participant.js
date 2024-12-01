export default class Participant {
    #name;
    #role;
    #avatar;
    #username;
    #password;

    constructor(name, role, avatar) {
        if (!name || !role || !avatar) {
            throw new Error('Todos los campos son obligatorios para crear un participante.');
        }

        this.#name = name.trim();
        this.#role = role.trim();
        this.#avatar = avatar.trim();
        this.#username = this.#generateUsername(name);
        this.#password = 'defaultpassword'; // Contraseña predeterminada
    }

    #generateUsername(name) {
        return name.toLowerCase().replace(/\s+/g, '');
    }

    getParticipantData() {
        return {
            name: this.#name,
            role: this.#role,
            avatar: this.#avatar,
            username: this.#username,
            password: this.#password
        };
    }

    updateParticipantData({ name, avatar }) {
        if (name) this.#name = name.trim();
        if (avatar) this.#avatar = avatar.trim();
    }
}
