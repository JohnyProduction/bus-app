const basicEncode = (userId, userRole) => {
    const userString = `${userId}:${userRole}`;
    const encodedUser = Buffer.from(userString).toString('base64');

    return encodedUser;
};

const basicDecode = (encodedUser) => {
    const decodedUser = Buffer.from(encodedUser, 'base64').toString('utf-8');
    const [id, role] = decodedUser.split(':');

    return { id, role };
};

module.exports = { basicEncode, basicDecode };