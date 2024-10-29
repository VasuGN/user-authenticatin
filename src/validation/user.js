const { uncaughtException, badRequestException } = require('../middlewares/response')
const Validator = require("jsonschema").Validator;
const schemaHelper = require('./schemaError');
const { getUserForValidate } = require('../services/user');
const bcrypt = require('bcryptjs')

/**
 * Create a new user validation 
 */
const createUserValidation = async (req, res, next) => {
    try {
        const bodyObj = req.body;
        // Create a json schema
        let schema = {
            "id": "/schema",
            "type": "object",
            "properties": {
                "userName": {
                    "type": "string",
                    "minLength": 1,
                    "maxLength": 150,
                    "required": true
                },
                "email": {
                    "type": "string",
                    "required": true,
                    "format": "email",
                    "minLength": 6,
                    "maxLength": 127
                },
                "password": {
                    "type": "string",
                    "minLength": 8,
                    "pattern": "^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[!@#$&*~])(?=.*?[^ws]).{8,}$",
                    "required": true
                },
                "confirmPassword": {
                    "type": "string",
                    "minLength": 8,
                    "pattern": "^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[!@#$&*~])(?=.*?[^ws]).{8,}$",
                    "required": true
                }
            },
        };
        const v = new Validator();
        const validationResult = v.validate(bodyObj, schema).valid;
        if (validationResult) {
            if (bodyObj.password !== bodyObj.confirmPassword) {
                return res.status(400).send(await badRequestException({ "message": "Passwords do not match. Please try again." }))
            }
            const email = bodyObj.email;
            const user = await getUserForValidate(email)
            if (Object.keys(user).length == 0) {
                next()
            } else {
                return res.status(400).send(await badRequestException({ "message": "User already exists" }))
            }
        } else {
            const error = await schemaHelper.getErrorMessage(v.validate(bodyObj, schema).errors);
            return res.status(400).send(await badRequestException({ "message": error }))
        }
    } catch (err) {
        console.log(err)
        return res.status(500).send(await uncaughtException(err));
    }
}

/**
 * validate login details
 */
async function loginValidation(req, res, next) {
    try {
        const bodyObj = req.body;
        // Create a json schema
        const schema = {
            id: "/schema",
            type: "object",
            properties: {
                email: {
                    "type": "string",
                    "required": true,
                    "format": "email",
                    "minLength": 6,
                    "maxLength": 127,
                },
                password: {
                    "type": "string",
                    "required": true
                },
            },
        };

        const v = new Validator();
        const validationResult = v.validate(bodyObj, schema).valid;
        if (validationResult) {
            const email = bodyObj.email;
            const password = bodyObj.password;
            const user = await getUserForValidate(email)
            if (Object.keys(user).length > 0) {
                const isMatch = await bcrypt.compare(password, user.password);
                if (isMatch) {
                    res.locals.userId = user.userId;
                    next()
                } else {
                    return res.status(400).send(await badRequestException({ "message": "Invalid password" }))
                }
            } else {
                return res.status(400).send(await badRequestException({ "message": "Invalid email" }))
            }
        } else {
            const error = await schemaHelper.getErrorMessage(v.validate(bodyObj, schema).errors);
            return res.status(400).send(await badRequestException({ "message": error }))
        }
    } catch (err) {
        console.log(err)
        return res.status(500).send(await uncaughtException(err));
    }
}

module.exports = {
    createUserValidation,
    loginValidation
}