import bcrypt from "bcryptjs"

export function saltAndHashPassword(password: any) {
    const saltRounds = 10; // cost factor
    const salt = bcrypt.genSaltSync(saltRounds); // Synchronously generate a salt
    const hash = bcrypt.hashSync(password, salt); // Synchronously hash the password

    return hash; // Return the hash directly as a string
}