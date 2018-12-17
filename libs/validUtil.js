exports.isGreaterThanZero = (number) => {
    if (isNaN(number) || number === null) return false;
    return number > 0;
};

exports.isValidEmail = (email) => {
    if (email === null) return false;
    const re = /[^\s@]+@[^\s@]+\.[^\s@]+/u;
    return re.test(email);
};

exports.isValidObjectID = (id) => {
    const re = /^[0-9a-fA-F]{24}$/u;
    return re.test(id);
};

exports.isValidUUID = (uuid) => {
    const re = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/iu;
    return re.test(uuid);
};
