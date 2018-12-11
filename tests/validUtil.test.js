describe('>>> Validation tests', () => {

    const chai = require('chai');
    const expect = chai.expect;

    const validUtil = require('../libs/validUtil');

    it('should 80 be greater than zero', () => {
        expect(validUtil.isGreaterThanZero(80)).to.equal(true);
    });

    it('should -0.005 not be greater than zero', () => {
        expect(validUtil.isGreaterThanZero(-0.005)).to.equal(false);
    });

    it('should a not be greater than zero', () => {
        expect(validUtil.isGreaterThanZero('a')).to.equal(false);
    });

    it('should null not be valid email', () => {
        expect(validUtil.isValidEmail(null)).to.equal(false);
    });

    it('should paul@stone.com be valid email', () => {
        expect(validUtil.isValidEmail('paul@stone.com')).to.equal(true);
    });

    it('should paulstone.com not be valid email', () => {
        expect(validUtil.isValidEmail('paulstone.com')).to.equal(false);
    });

    it('should @paulstone.com not be valid email', () => {
        expect(validUtil.isValidEmail('@paulstone.com')).to.equal(false);
    });

    it('should paul@stone not be valid email', () => {
        expect(validUtil.isValidEmail('paul@stone')).to.equal(false);
    });

    it('should return null when receives null as email', () => {
        expect(validUtil.isValidEmail(null)).to.equal(false);
    });

    it('should 5bd6f0606bd91319b007ff05 be valid ObjectID', () => {
        expect(validUtil.isValidObjectID('5bd6f0606bd91319b007ff05')).to.equal(true);
    });

    it('should a1b2c3d4e5f6g7h8i9j0k1l2 not be valid ObjectID', () => {
        expect(validUtil.isValidObjectID('a1b2c3d4e5f6g7h8i9j0k1l2')).to.equal(false);
    });

    it('should random 10ba038e-48da-487b-96e8-8d3b99b6d18a be valid UUID', () => {
        expect(validUtil.isValidUUID('10ba038e-48da-487b-96e8-8d3b99b6d18a')).to.equal(true);
    });

    it('should a1b2c3-d4e5f6-g7h8i9-j0k1l2 not be valid UUID', () => {
        expect(validUtil.isValidUUID('a1b2c3d4e5f6g7h8i9j0k1l2')).to.equal(false);
    });
});