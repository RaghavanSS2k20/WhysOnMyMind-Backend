const chai = require('chai')
const chaiHttp = require('chai-http')
const app = require('../server')
const User = require('../DB/User/Model')
const Post = require('../DB/Post/Model')
const supertest = require('supertest');
const session = require('supertest-session');
const expect = chai.expect;

chai.use(chaiHttp);

describe('API Tests', () => {
    // Create a session for authentication
    let authenticatedSession;
  
    before(async () => {
      // Set up a test user for authentication
      //const user = await UserModel.create({ /* user data */ });
  
      // Create a new authenticated session
      authenticatedSession = session(app);
      authenticatedSession
        .post('/login') // Replace with your login route
        .send({ username:"alittlefightinyou@darkknight.com", password: 'andyougonnaloveme' }) // Provide login credentials
        .expect(200)
        .end((err) => {
          if (err) throw err;
        });
    });
  
    after(async () => {
      // Clean up test data and session after running the tests
      //await UserModel.findByIdAndRemove(user._id);
      authenticatedSession.destroy();
    });
  
    // Rest of the test cases remain the same, but now you can use the authenticatedSession for requests.
  
    describe('Testing success', () => {
      it('should get all listings', (done) => {
        authenticatedSession
          .get('/login-success')
          .end((err, res) => {
            expect(res).to.have.status(200);
            expect(res.body).to.be.an('object');
            expect(res.body.message).to.equal('login-success');
            expect(res.body.data).to.be.an('object');
            expect(res.body.data.session).to.be.an('object');
            expect(res.body.data.user).to.be.an('object');           
            done();
          });
      });
    });
  
    // Add authentication to other test cases as well.
  });