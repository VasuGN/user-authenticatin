/**
 * get errors message
 */
const getErrorMessage = async (errors) => {
    let errorMessage = {};
    let promise_list = [];

    promise_list.push(
        new Promise((resolve) => {
            errors.forEach(element => {
                errorMessage[element.path] = element.message;
            })
            resolve(errorMessage);
        })
    );
    await Promise.all(promise_list);
    return errorMessage;
}

module.exports = {
    getErrorMessage
}