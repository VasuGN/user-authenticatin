const userService = require('../services/user');
const { uncaughtException, successResponse } = require('../middlewares/response')
const { generateJwtToken } = require('../middlewares/auth')

/**
 * Create a new user
 * @param {body} 
 */
const createUser = async (req, res, next) => {
    const {userName, email, password } = req.body;
    await userService.createUser(
        userName,email, password
    ).then(async (result) => {
        return res.status(201).send(await successResponse(null, 'User created successfully'));
    }).catch(async (error) => {
        return res.status(500).send(await uncaughtException(error));
    })
}

/**
 * generate JWT token by email and userId
 */
const generateJwt = async (req, res, next) => {
    const { email } = req.body;
    const userId = res.locals.userId;
    await generateJwtToken(
        { "emailId": email, "userId": userId }
    ).then(async (result) => {
        return res.status(201).send(await successResponse(result));
    }).catch(async (error) => {
        return res.status(500).send(await uncaughtException(error));
    })
};

/**
 * Create a new user
 * @param {body} 
 */
const getUser = async (req, res, next) => {
    const email = res.locals.emailId;
    await userService.getUser(
        email
    ).then(async (result) => {
        return res.status(200).send(await successResponse(result));
    }).catch(async (error) => {
        return res.status(500).send(await uncaughtException(error));
    })
}

module.exports = {
    createUser,
    generateJwt,
    getUser
}