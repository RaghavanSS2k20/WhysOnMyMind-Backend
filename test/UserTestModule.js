const chai = require('chai')
const chaiHttp = require('chai-http')
const app = require('../server')
const User = require('../DB/User/Model')
const Post = require('../DB/Post/Model')
const supertest = require('supertest');
const agent = require('./server.test')
//const session = require('supertest-session');
const expect = chai.expect;
const testGetAllUsers = (done)=>{
    agent
    .get('/api/user/get/all')
    .expect(200)
    .end((err,res)=>{
        if(err){throw err}
        
    })


}

module.exports = {
    testGetAllUsers
}

