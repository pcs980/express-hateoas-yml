# Express HATEOAS with YML

This package will generate HATEOAS links automatically based on a configuration file and is based on [express-hateoas-links](https://www.npmjs.com/package/express-hateoas-links) by John Doherty.

&nbsp;
## Install

Install the package with NPM:

```bash
npm install --save express-hateoas-yml
```

Or with Yarn:

```bash
yarn add express-hateoas-yml
```

&nbsp;
## Use

Declare and specity the path for a YML/YAML file:

```js
const hateoas = require('express-hateoas-yml');
const hateoasOptions = {
    linksFile: path.join(__dirname, 'libs/links.yml')
};
```

Add the middleware to Express:

```js
const express = require('express');
const app = express();

app.use('*', (req, res, next) => hateoas(req, res, next, hateoasOptions));
```

&nbsp;
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

Then the response body should includes the original data and the links:

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
            "href": "http://localhost:3000/api/v1/birthtoday"
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

You also can reuse an entire endpoint:

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

### Bugs

Please use the [Project Issues](https://github.com/pcs980/express-hateoas-yml/issues) page to report bugs or send suggestions.

### License

Licended under [ISC License](LICENSE) © Paulo César da Silva