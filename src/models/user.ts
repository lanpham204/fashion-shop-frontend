export class User {
    id: number;
    email: string;
    password: string;
    fullname: string;
    is_active: boolean;
    role_id: number;

    constructor(
        id: number,
        email: string,
        password: string,
        fullname: string,
        is_active: boolean,
        role_id: number
    ) {
        this.id = id;
        this.email = email;
        this.password = password;
        this.fullname = fullname;
        this.is_active = is_active;
        this.role_id = role_id;
    }
}
