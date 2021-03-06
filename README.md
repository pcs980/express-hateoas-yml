# Express HATEOAS with YML

[![Building](https://travis-ci.org/pcs980/express-hateoas-yml.svg?branch=master)](https://travis-ci.org/pcs980/express-hateoas-yml)
[![Coverage Status](https://coveralls.io/repos/github/pcs980/express-hateoas-yml/badge.svg?branch=master)](https://coveralls.io/github/pcs980/express-hateoas-yml?branch=master)
[![Dependencies](https://img.shields.io/david/pcs980/express-hateoas-yml.svg)](https://www.npmjs.com/package/express-hateoas-yml)
[![Dev Dependencies](https://img.shields.io/david/dev/pcs980/express-hateoas-yml.svg)](https://www.npmjs.com/package/express-hateoas-yml)
[![Last commit](https://img.shields.io/github/last-commit/pcs980/express-hateoas-yml.svg)](https://www.npmjs.com/package/express-hateoas-yml)
[![Downloads](https://img.shields.io/npm/dt/express-hateoas-yml.svg)](https://www.npmjs.com/package/express-hateoas-yml)
[![NPM version](https://img.shields.io/npm/v/express-hateoas-yml.svg)](https://www.npmjs.com/package/express-hateoas-yml)
[![Linked In](https://img.shields.io/badge/Linked-In-blue.svg)](https://www.linkedin.com/in/pcs980)

This package will generate HATEOAS links automatically based on a configuration file and is based on [express-hateoas-links](https://www.npmjs.com/package/express-hateoas-links) by John Doherty.

## Install

Install the package with NPM:

```bash
npm install --save express-hateoas-yml
```

Or with Yarn:

```bash
yarn add express-hateoas-yml
```

## Use

Declare and specity the path for the YML/YAML file with the related links:

```js
const hateoas = require('express-hateoas-yml');
const hateoasOptions = {
    linksFile: path.join(__dirname, 'libs/links.yml')
};
```

In the [Examples](#examples) section you'll find examples of how to configure related links.

Add the middleware to Express:

```js
const express = require('express');
const app = express();

app.use('*', (req, res, next) => hateoas(req, res, next, hateoasOptions));
```

## Examples

### Basics

In the following example we've a basic example where the a GET URL `/api/v1/customers` should return a reference to URL `/api/v1/customers/birthdays` and method GET.

```yml
/api/v1/customers:
  GET:
    - rel: customers
      method: GET
      href: /api/v1/customers/birthtoday
```

Send your response as usual:

```js
result.data = await controller.getAll();

return res.status(200).json(result);
```

Then the response body should includes the original resultdata and the links:

```json
{
    "data": [
        {
            "name": "Paulo",
        },
        {
            "name": "Cesar"
        },
        {
            "name": "Silva"
        }
    ],
    "_link": [
        {
            "rel": "customers",
            "method": "GET",
            "href": "http://localhost:3000/api/v1/customers/birthtoday"
        }
    ]
}
```

### Placeholders

The reference can return a link with dynamic URL, like a record id. Note the `:1` below:

```yml
/api/v1/customers:
  POST:
    - rel: self
      method: GET
      href: /api/v1/customers/:1
```

Then in the route code:

```js
// save the record as usually
const data = await controller.save(req.body);

// and put the record id as an additional parameters
return res.status(201).json(data, data._id);
```

### URL Parameters

This package will recognize the parameters and replace it before look for links in YML file:

* **Object Id** will be replaced by `:oid`
* **UUID** by `:uuid`
* **E-mail** by `:email`
* **Number** by `:number`

Examples:
* `/api/v1/customers/123` will be replaced for `/api/v1/customers/:number`.
* `/api/v1/customers/98949bc9-bf0a-4ceb-8f45-fa07ccd39d76` will be replaced for `/api/v1/customers/:uuid`.

### Reuse

It's possible to reuse other definition within the original URL.

```yml
/api/v1/customers:
  POST:
    - rel: self
      method: GET
      href: /api/v1/customers/:1
  PUT:
    use: POST
```

You also can reuse an entire endpoint as shown below where a PUT request will return all related links of GET requests:

```yml
/api/v1/customers/:oid:
  PUT:
    use: GET
  GET:
    - rel: sales
      method: GET
      href: /api/v1/customers/:1/sales
    - rel: self
      method: DELETE
      href: /api/v1/customers/:1
    - rel: self
      method: PUT
      href: /api/v1/customers/:1
/api/v1/customers/:email:
  use: /api/v1/customers/:oid
/api/v1/customers/:uuid:
  use: /api/v1/customers/:oid
```

### Property name

By default the related links in the response object will be inside the property named `_links` as indicative of a metadata. But you can change it's name by setting a `propertyName` in options object:

```javascript
const hateoasOptions = {
    linksFile: path.join(__dirname, 'libs/links.yml'),
    propertyName: 'links'
};
```

### Additional data

You can add any extra information within the related link item and it will be included in the response as you can see below:

```yml
/api/v1/customers/:oid:
  PUT:
    use: GET
  GET:
    - rel: sales
      method: GET
      description: Get all customer's orders
      href: /api/v1/customers/:1/sales
    - rel: self
      method: DELETE
      warning: Delete this customer permanently
      href: /api/v1/customers/:1
    - rel: self
      method: PUT
      href: /api/v1/customers/:1
```

Below the result with extra information `description` and `warning`

```json
{
    "active": true,
    "_id": "5c1be67e55087519a29065e6",
    "name": "Paulo",
    "_links": [
        {
            "rel": "sales",
            "method": "GET",
            "description": "Get all customer's orders",
            "href": "http://localhost:3000/api/v1/customers/5c1be67e55087519a29065e6/sales"
        },
        {
            "rel": "self",
            "method": "DELETE",
            "warning": "Delete this customer permanently",
            "href": "http://localhost:3000/api/v1/customers/5c1be67e55087519a29065e6"
        },
        {
            "rel": "self",
            "method": "PUT",
            "href": "http://localhost:3000/api/v1/customers/5c1be67e55087519a29065e6"
        }
    ]
}
```

## Bugs

Please use the [Project Issues](https://github.com/pcs980/express-hateoas-yml/issues) page to report bugs or send suggestions.

## License

Licended under [ISC License](LICENSE) © [Paulo César da Silva](https://www.linkedin.com/in/pcs980)