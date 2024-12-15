const express = require('express');
const router = express.Router();
const userModel = require('../db/user/user.model');
const jwtHelpers = require('../helpers/jwt')

router.post('/login', async function(request, response) {

    const username = request.body.username;
    const password = request.body.password;

    try {
        const user = await userModel.findUserByUsername(username);
        if (user[0].password === password) {
            response.cookie('statusToken', jwtHelpers.generateToken(username));
            
            return response.send('Log in successful');
        }

        response.status(400);
        return response.send('Username or password is not valid');

    } catch (error) {

        response.status(500);
        return response.send('An internal server error occurred');

    }


})

router.post('/signup', async function(request, response) {

    try {
        const user = await userModel.createUser(request.body);

        response.cookie('statusToken', jwtHelpers.generateToken(user.username));
        return response.send('Log in successful');

    } catch (error) {
        response.status(400);
        console.log(error);
        return response.send('Error creating new user');
    }


})

router.post('/logout', function(request, response) {
    response.clearCookie('statusToken'); // this doesn't delete the cookie, but expires it immediately
    response.send();
})

router.get('/userprofile', async function(request, response) {
    const username = jwtHelpers.decrypt(request.cookies.statusToken);
    const user = await userModel.findUserByUsername(username);
    response.send(user[0]);
})

router.get('/isLoggedIn', function(request, response) {
    const username = jwtHelpers.decrypt(request.cookies.statusToken);
    if (!username) {
        response.status(400);
    }
    response.send(username);
})

router.put('/edit', async function(request, response) {
    const { intro } = request.body;
    const username = jwtHelpers.decrypt(request.cookies.statusToken);
    console.log(username);
    const user = await userModel.findUserByUsername(username);
    user[0].intro = intro;
    await user[0].save();

    return response.send('Intro updated successfully');
})

module.exports = router;