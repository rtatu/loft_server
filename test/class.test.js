// During the test the env variable is set to test
process.env.NODE_ENV = 'test'

const chai = require('chai')
const chaiHttp = require('chai-http')
const server = require('../bin/www')
const should = chai.should();

// get model for database

const model = require('../models/index')



model.sequelize.sync({force : true})


// test the class route

chai.use(chaiHttp)




// Test the /GET Route
describe('GET class', () => {

    beforeEach(done => {
        model.sequelize.sync().then(res => {
            model.class.destroy({
                where : {},
                truncate : true
            }).then(res => {
                done()
            })
        })
    })

    afterEach(done => {
        server.close()
        done()
    })

    it("it should get all the list of classes", (done) => {
        chai.request(server)
        .get('/archive/class')
        .set('Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjoicm9oaXQudGF0dTg5NkBnbWFpbC5jb20iLCJpYXQiOjE1Nzc2MjU5NzcsImV4cCI6MTU4MDIxNzk3NywiaXNzIjoiaHR0cDovL3hwbGljaXRzb2Z0d2FyZS5jbyJ9.fbYHa9LiZ76KJpMyWOEQRxEM78wCPGNOeHQ3xr0T6m8')
        .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a('array');
            res.body.length.should.be.eql(0);
            done();
        })
    })


})


// Test the /POST Route

describe('POST class', () => {
    it("it should create a class", (done) => {
        chai.request(server)
            .post('/archive/class')
            .send({
                name : "Repeat Order",
                associationWith : "Order Leg",
                status : "ACTIVE",
                colorCode : "#123123"
            })
            .end((err, res) => {
                id = res.body.response.id
                res.should.have.status(201);
                res.body.should.be.a('object');
                res.body.should.have.a.property('code').eql('ADD_SUCC');
                res.body.response.should.have.a.property('id');
                res.body.response.should.have.a.property('name');
                res.body.response.should.have.a.property('associationWith');
                res.body.response.should.have.a.property('status');
                res.body.response.should.have.a.property('colorCode');
                res.body.response.should.have.a.property('createdAt');
                res.body.response.should.have.a.property('updatedAt');
                done()
            })
    })


    it("it should return an error for unique validation", (done) => {
        chai.request(server)
            .post('/archive/class')
            .send({
                name : "Repeat Order",
                associationWith : "Order Leg",
                status : "ACTIVE",
                colorCode : "#123123"
            })
            .end((err, res) => {
                res.should.have.status(400);
                res.body.should.be.a('object');
                res.body.should.have.a.property('code').eql('ER_DUP_ENTRY');
                res.body.should.have.a.property('fields');
                done()
            })
    })


    it("it should return an error for value not in enum", (done) => {
        chai.request(server)
            .post('/archive/class')
            .send({
                name : "Drinking Value",
                associationWith : "CUSTOMES",
                status : "ACTIVE",
                colorCode : "#123123"
            })
            .end((err, res) => {
                res.should.have.status(400);
                res.body.should.be.a('object');
                res.body.should.have.a.property('code').eql('WARN_DATA_TRUNCATED');
                done()
            })
    })

    afterEach((done) => {
        server.close()
        done()
    })
})




// Test the /PUT Route
describe('PUT class', () => {

    it("it should update an existing class", (done) => {
        chai.request(server)
            .put('/archive/class')
            .send({
                id : 1,
                name : "Drunk",
                associationWith : "VENDORS",
                status : 'ACTIVE',
                colorCode : "#123123"
            })
            .end((err, res) => {
                res.should.have.status(200)
                res.body.should.have.a.property('code').eql('UPDATE_SUCC');
                res.body.response.should.have.a.property('name').eql('Drunk');
                res.body.response.should.have.a.property('associationWith').eql('VENDORS');
                done();
            })
    })

    it("it should not update an existing class", (done) => {
        chai.request(server)
            .put('/archive/class')
            .send({
                id : 2,
                name : "Drunk",
                textField : true,
                associationWith : "VENDORS",
                status : 'ACTIVE'
            })
            .end((err, res) => {
                res.should.have.status(200)
                res.body.should.have.a.property('code').eql('UPDATE_FAIL');
                res.body.message.should.be.eql('ID doesn\'t exist');
                done();
            })
    })

    afterEach( done => {
        server.close()
        done()
    })
})



// Test /DELETE Route
describe('DELETE class', () => {
    it('it should delete an existing class', (done) => {
        chai.request(server)
            .delete('/archive/class')
            .send({
                id : 1
            })
            .end((err, res) => {
                res.should.have.status(200)
                res.body.should.have.a.property('code').eql('DELETE_SUCC');
                res.body.response.id.should.be.eql(1);
                done();
            })
    })

    it('it should not delete an existing class', (done) => {
        chai.request(server)
            .delete('/archive/class')
            .send({
                id : 1
            })
            .end((err, res) => {
                res.should.have.status(200)
                res.body.should.have.a.property('code').eql('DELETE_FAIL');
                res.body.message.should.be.eql('ID doesn\'t exist');
                done();
            })
    })

    afterEach( done => {
        server.close()
        done()
    })

})


// Test Last Get Route
describe('GET class', () => {

    it("at the end of class test, it should get all the list of class", (done) => {
        chai.request(server)
        .get('/archive/class')
        .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a('array');
            res.body.length.should.be.eql(0);
            done();
        })
    })

    afterEach(done => {
        server.close()
        done()
    })

})
