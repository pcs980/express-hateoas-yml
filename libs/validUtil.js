exports.isGreaterThanZero = (number) => {
    if (isNaN(number) || null == number) return false;
    return number > 0;
};

exports.isValidEmail = (email) => {
    if (null == email) return false;
    const re = /[^\s@]+@[^\s@]+\.[^\s@]+/;
    return re.test(email);
};

exports.isValidObjectID = (id) => {
    const re = /^[0-9a-fA-F]{24}$/;
    return re.test(id);
};

exports.isValidUUID = (uuid) => {
    const re = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return re.test(uuid);
};
