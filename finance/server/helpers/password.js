import bcrypt from "bcryptjs";


export const validateUserPassword = async (user, password) => {
    if (!user) {
        return { phoneNumber: 'user with provided phone number not found' };
    }

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) {
        // bad password
        return { phoneNumber: 'user with credentials doesnt exist' };
    }
};

export const createPasswordHash = password => {
    return bcrypt.hash(password, 12) || false;
};