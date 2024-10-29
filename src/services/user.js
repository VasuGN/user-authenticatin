const dbUtils = require('../config/database');
const bcrypt = require('bcryptjs')
const { sendMail } = require('../utils/mail');

/**
 * Create a new user
 * @returns {Promise<Object>} A promise that resolves to the result of the user creation operation
 */
const createUser = async (userName, email, password) => {
    return await new Promise(async (resolve, reject) => {
        try {
            const hashedPassword = await bcrypt.hash(password, 10);
            const query = `INSERT 
                                INTO user.users (
                                user_name,
                                email, 
                                password
                                ) VALUES (
                                 ?, ?, ?
                                )`;
            const values = [userName, email, hashedPassword];
            const result = await dbUtils.execute_query_params_return_query_result(query, values)
                .catch(err => {
                    console.log(err)
                    reject(err)
                })
            // Prepare the email details
            const subject = 'Welcome to Our Service!';
            const html = `<p>Hello ${userName},</p><p>Thank you for registering!.</p>`;
            // Send the verification email
            const emailResult = await sendMail(email, subject, html);

            if (!emailResult.success) {
                // Log the error if email sending fails
                console.error('Failed to send verification email:', emailResult.error);
            }
            resolve(result);
        } catch (error) {
            console.log(error)
            reject(error)
        }
    })
}

/**
 * Retrieve user details by email for validation
 * @returns {Promise<Object>} A promise that resolves to the user details, including password and role
 */
const getUserForValidate = async (email) => {
    return await new Promise(async (resolve, reject) => {
        try {
            const query = `select 
                               id "userId",
                               user_name "userName",
                               email,
                               password
                            from  user.users
                            where email=? `;
            const values = [email];
            const result = await dbUtils.execute_query_params_return_query_result(query, values)
                .catch(err => {
                    console.log(err)
                    reject(err)
                })
            if (result.length > 0) {
                resolve(result[0]);
            } else {
                resolve({});
            }
        } catch (error) {
            console.log(error)
            reject(error)
        }
    })
}

/**
 * Retrieve user details by email for validation
 * @returns {Promise<Object>} A promise that resolves to the user details, including password and role
 */
const getUser = async (email) => {
    return await new Promise(async (resolve, reject) => {
        try {
            const query = `select 
                               id "userId",
                               user_name "userName",
                               email
                            from  user.users
                            where email=? `;
            const values = [email];
            const result = await dbUtils.execute_query_params_return_query_result(query, values)
                .catch(err => {
                    console.log(err)
                    reject(err)
                })
            if (result.length > 0) {
                resolve(result[0]);
            } else {
                resolve({});
            }
        } catch (error) {
            console.log(error)
            reject(error)
        }
    })
}


module.exports = {
    createUser, getUserForValidate, getUser
}