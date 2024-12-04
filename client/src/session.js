let session = {
    user: null,
    token: null
};

export const setSession = (user, token) => session = { user, token };

export const deleteSession = () => session = { user: null, token: null };

export const isLoggedIn = () => session.user && session.token;