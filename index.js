'use strict';

const yaml = require('js-yaml');
const fs = require('fs');

const validUtil = require('./libs/validUtil');

module.exports = (req, res, next, options) => {
    const endpoint = prepareOriginalUrl(req.originalUrl);
    const config = yaml.safeLoad(fs.readFileSync(options.linksFile, 'utf8'));
    let links = [];

    if (config[endpoint]) {
        links = getLinks(config, endpoint, req.method);
    }

    const jsonOriginal = res.json;

    res.json = (object, ...params) => {
        let jsonObject = JSON.parse(JSON.stringify(object));
        res.json = jsonOriginal;

        if (links.length > 0 && res.statusCode < 400) {
            for (const link in links) {
                links[link].href = getHostUrl(req) + links[link].href.replace(':1', params[0]);
            }
            const propertyName = getPropertyName(options);
            jsonObject[propertyName] = links;
        }
        res.json(jsonObject);
    };

    next();
};

const getHostUrl = (req) => req.protocol + '://' + req.get('host');

const getLinks = (config, endpoint, method) => {
    const usePath = (config[endpoint].use ? config[endpoint].use : endpoint);

    if (config[usePath][method]) {
        const useMethod = (config[usePath][method].use ? config[usePath][method].use : method);
        return config[usePath][useMethod];
    }
    return [];
};

const getPropertyName = (options) => {
    return (options.propertyName && options.propertyName.length > 0 ? options.propertyName : '_links');
};

const prepareOriginalUrl = (url) => {
    let paths = url.split('/');
    for (const item in paths) {
        if (validUtil.isValidObjectID(paths[item])) paths[item] = ':oid';
        if (validUtil.isValidUUID(paths[item])) paths[item] = ':uuid';
        if (validUtil.isValidEmail(paths[item])) paths[item] = ':email';
        if (validUtil.isGreaterThanZero(paths[item])) paths[item] = ':number';
    }
    return paths.join('/');
};
