const { Dto } = require('./dto');

class CreateUserDto extends Dto {
    constructor({ username, email, password, role }) {
        super();

        this.username = username;
        this.email = email;
        this.password = password;
        this.role = role;
    }

    validate() {
        if (!this.username || typeof this.username !== 'string') {
            throw new Error("Brak, bądź niepoprawny username");
        }

        if (!this.email || !this.email.includes("@")) {
            throw new Error("Niepoprawny email");
        }

        if (!this.password || this.password.length < 6) {
            throw new Error("Hasło musi zawierać co najmniej 6 znaków");
        }
    }
}

class LoginUserDto extends Dto {
    constructor({ email, password }) {
        super();

        this.email = email;
        this.password = password;
    }

    validate() {
        if (!this.email || !this.email.includes("@")) {
            throw new Error("Niepoprawny email");
        }

        if (!this.password) {
            throw new Error("Nie podano hasła");
        }
    }
}

class UserDto extends Dto {
    constructor({ id, username, email, role }) {
        super();

        this.id = id;
        this.username = username;
        this.email = email;
        this.role = role;
    }

    validate() {
        if (!this.id) {
            throw new Error('Brak user id');
        }

        if (!this.username) {
            throw new Error('Brak username');
        }

        if (!this.email) {
            throw new Error('Brak user email');
        }

        if (!this.role) {
            throw new Error('Brak user role');
        }
    }
}

class LoggedInUserResponseDto extends Dto {
    constructor({ token, user }) {
        super();

        this.token = token;
        this.user = new UserDto(user);
    }

    validate() {
        if (!this.token) {
            throw new Error('Brak tokenu');
        }

        try {
            this.user.validate();
        } catch (err) {
            throw err;
        }
    }
}

module.exports = { CreateUserDto, LoginUserDto, LoggedInUserResponseDto, UserDto };