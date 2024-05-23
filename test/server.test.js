const chai = require('chai')
const chaiHttp = require('chai-http')
const app = require('../server')
const User = require('../DB/User/Model')
const Post = require('../DB/Post/Model')
const supertest = require('supertest');
const {testGetAllUsers} = require('./UserTestModule')
//const session = require('supertest-session');
const expect = chai.expect;
const agent  = supertest.agent(app)

chai.use(chaiHttp);

var user = {
  email:"alittlefightinyou@darkknight.com",
  password:"andyougonnaloveme"
}
describe('API Tests',()=>{
 
  let cookie;
  describe('login',()=>{
    it('should signin',(done)=>{
      agent
      .post('/login')
      .send(user)
      .expect(302)
      .expect('Location','/login-success')
      .end((err,res)=>{
        if(err){throw err}
         cookie = res.headers['set-cookie'];
        console.log("cooooooookkkkkkkkiiiiiies ",res)
        expect(res.body).to.be.an('object');
        done()

      })
    })

    
  })

  
  
})

describe('Testing core server routes',()=>{
  it('should get current user',(done)=>{
    agent
    .get('/getuser')
    // .set('Cookie',cookie)
    .expect(200)      
    .end((err,res)=>{
      if(err){throw err}
      console.log(res.body)
      expect(res.body).to.be.an('object')
      expect(res.body.user).to.be.an('object')
      expect(res.body.user.pinnedPost).to.be.an('array')

      done()
    })
  })

  it('should get new content to write',(done)=>{
    agent
    .get('/write')
    .expect(200)
    .end((err,res)=>{
      if(err){throw err}
      expect(res.body).to.be.an("object")
      done()
    })
  })
  
})

describe("Testing user")
module.exports = agent