export const setSession = (user, token) => localStorage.setItem('session', JSON.stringify({ user, token }));

export const deleteSession = () => localStorage.removeItem('session');

export const isLoggedIn = () => localStorage.getItem('session')?.length > 0;

export const getUser = () => JSON.parse(localStorage.getItem('session')).user;

export const getToken = () => JSON.parse(localStorage.getItem('session')).token;