describe('>>> Test links', () => {
    
    const express = require('express');
    const app = express();
    const supertest = require('supertest');
    const request = supertest(app);
    const chai = require('chai');
    const expect = chai.expect;

    const path = require('path');

    const hateoas = require('../index');
    const hateoasOptions = {
        linksFile: path.join(__dirname, 'test-links.yml')
    };

    beforeEach(() => {
        app.use('*', (req, res, next) => hateoas(req, res, next, hateoasOptions));
    });

    afterEach(() => {
        app.close;
    });

    it('should return links', done => {
        app.get('/api/v1/customers', (req, res) => {
            res.status(200).json({
                data: [
                    {
                        name: 'Paulo'
                    },
                    {
                        name: 'Valquiria'
                    }
                ]
            });
        });

        request
            .get('/api/v1/customers')
            .expect(200)
            .end((err, res) => {
                if (err) return done(err);
                expect(res.body).to.have.property('data');
                expect(res.body).to.have.property('_links').to.be.an('array').to.have.length(1);
                done();
            });
    });

    it('should recognize when receives an object id', done => {
        app.get('/api/v1/customers/:customer', (req, res) => {
            res.status(200).json({
                data: {
                    _id: '563479cc8a8a4246bd27d784',
                    name: 'Some Body',
                    email: 'somebody@somewhere.com'
                }
            });
        });

        request
            .get('/api/v1/customers/563479cc8a8a4246bd27d784')
            .expect(200)
            .end((err, res) => {
                if (err) return done(err);
                expect(res.body).to.have.property('data');
                expect(res.body).to.have.property('_links').to.be.an('array').to.have.length(3);
                done();
            });
    });

    it('should recognize when receives an email', done => {
        app.get('/api/v1/customers/:customer', (req, res) => {
            res.status(200).json({
                data: {
                    name: 'Some Body',
                    email: 'somebody@somewhere.com'
                }
            });
        });

        request
            .get('/api/v1/customers/somebody@somewhere.com')
            .expect(200)
            .end((err, res) => {
                if (err) return done(err);
                expect(res.body).to.have.property('data');
                expect(res.body).to.have.property('_links').to.be.an('array').to.have.length(3);
                done();
            });
    });

    it('should recognize when receives an UUID v1', done => {
        app.get('/api/v1/customers/:customer', (req, res) => {
            res.status(200).json({
                data: {
                    uuid: '2aba1d12-efe4-11e8-8eb2-f2801f1b9fd1',
                    name: 'Some Body',
                    email: 'somebody@somewhere.com'
                }
            });
        });

        request
            .get('/api/v1/customers/2aba1d12-efe4-11e8-8eb2-f2801f1b9fd1')
            .expect(200)
            .end((err, res) => {
                if (err) return done(err);
                expect(res.body).to.have.property('data');
                expect(res.body).to.have.property('_links').to.be.an('array').to.have.length(3);
                done();
            });
    });

    it('should recognize when receives an UUID v4', done => {
        app.get('/api/v1/customers/:customer', (req, res) => {
            res.status(200).json({
                data: {
                    uuid: '98949bc9-bf0a-4ceb-8f45-fa07ccd39d76',
                    name: 'Some Body',
                    email: 'somebody@somewhere.com'
                }
            });
        });

        request
            .get('/api/v1/customers/98949bc9-bf0a-4ceb-8f45-fa07ccd39d76')
            .expect(200)
            .end((err, res) => {
                if (err) return done(err);
                expect(res.body).to.have.property('data');
                expect(res.body).to.have.property('_links').to.be.an('array').to.have.length(3);
                done();
            });
    });

    it('should replace placeholders', done => {
        const body = {
            name: 'Paulo',
            job: 'TI Analyst'
        };

        const newId = '1a2b3c';

        app.post('/api/v1/customers', (req, res) => {            
            res.status(201).json(body, newId);
        });

        request
            .post('/api/v1/customers')
            .send(body)
            .expect(201)
            .end((err, res) => {
                if (err) return done(err);
                expect(res.body).to.have.property('_links');
                done();
            });
    });
});