export class Role {
    id: number;
    name: string;
    static ADMIN: string = "ADMIN";
    static USER: string = "USER";

    constructor(id: number, name: string) {
        this.id = id;
        this.name = name;
    }
}
