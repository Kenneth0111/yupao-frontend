import type {UserType} from "../models/user";

let currentUser: UserType | null = null;

const setCurrentUserState = (user: UserType | null) => {
    currentUser = user;
}

const getCurrentUserState = () : UserType | null => {
    return currentUser;
}

export {
    setCurrentUserState,
    getCurrentUserState
}