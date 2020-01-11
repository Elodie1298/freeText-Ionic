import {isNullOrUndefined} from "util";

export class User {

    /**
     * Id of the user
     */
    id: number;

    /**
     * Name of the user
     */
    name: string;

    /**
     * list of all users
     */
    static users = new Map<number, User>();

    /**
     * Constructor of user
     * @param id user's id
     * @param name user's name
     */
    private constructor(id: number, name: string) {
        this.id = id;
        this.name = name;
        User.users.set(id, this);
    }

    /**
     * Recover a user, create it if not exist
     * @param id user's id
     * @param name user's name
     */
    static getUser(id: number, name: string) {
        if (isNullOrUndefined(User.users.get(id))) {
            new User(id, name);
        }
        return User.users.get(id);
    }
}
