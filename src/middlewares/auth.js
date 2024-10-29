const jwt = require('jsonwebtoken');
const { getUser } = require('../services/user')

/** generate jwt token */
const generateJwtToken = async (payload) => {
    return await new Promise(async (resolve, reject) => {
        let token = jwt.sign(
            payload,
            process.env.TOKEN_SECRETE_KEY,
            { expiresIn: process.env.TOKEN_EXPIRE_HOURS }
        );
        //generate refresh token
        let refreshToken = jwt.sign(
            payload,
            process.env.REFRESH_TOKEN_SECRETE_KEY,
            { expiresIn: process.env.REFRESH_TOKEN_EXPIRE_HOURS }
        );
        resolve({ token: token, refreshToken: refreshToken });
    })
}

/** verify jwt token */
async function verifyJwtToken(req, res, next) {
    /** Verify Jwt Token */
    const bearerHeader = req.headers["authorization"];
    //check if bearer is undefined
    if (typeof bearerHeader !== "undefined") {
        //split the space at the bearer
        const bearer = bearerHeader.split(" ");
        //Get token from string
        const bearerToken = bearer[1];
        //set the token
        req.token = bearerToken;
        await decodeJwtToken(req.token)
            .then(async (decoded) => {
                //next middleweare
                if ("userId" in decoded && "emailId" in decoded) {
                    let result = await getUser(null, decoded.userId, null, null).catch(err => {
                        console.log(err)
                        return err
                    })
                    res.locals.emailId = decoded.emailId;
                    next();
                } else {
                    res.status(401).send({ "message": "The link has been expired" });
                }
            }).catch((error) => {
                console.log(error)
                res.status(401).send({ "error": error });
            });
    } else {
        //Forbidden
        return res.status(401).send({ "error": "unauthorized" });
    }
}

/** Decode jwt token */
const decodeJwtToken = async (token) => {
    return await new Promise(async (resolve, reject) => {
        jwt.verify(token, process.env.TOKEN_SECRETE_KEY, async function (err, decoded) {
            if (err) {
                reject(err);
            } else {
                //next middleware
                resolve(decoded);
            }
        });
    });
}

module.exports = {
    generateJwtToken,
    verifyJwtToken
}