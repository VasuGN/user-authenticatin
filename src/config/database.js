const mysql = require('mysql2/promise');

let mainPool = null;
/** Create pool */
const createPool = async () => {
  const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD
  });
  return pool;
}

/**Connect pool */
const getPool = async () => {
  if (!mainPool) {
    mainPool = await createPool();
    console.log('Connection successful');
  } else {
    console.log('Already exists');
  }
}

// get connection from pool & execute query & release connections
const execute_query_params_return_query_result = async (query, params) => {
  // Get a connection from the pool
  const connection = await mainPool.getConnection();
  try {
    // Begin a transaction
    await connection.beginTransaction();

    // Execute the query with the provided parameters
    const [results] = await connection.query(query, params);

    // Commit the transactions
    await connection.commit();
    return results;
  } catch (error) {
    // Rollback the transaction if an error occurs
    await connection.rollback();
    throw error;
  } finally {
    // Release the connection back to the pool
    connection.release();
  }
}

// get connection from pool & execute query & release connections
const execute_query_return_query_result = async (query) => {
  // Get a connection from the pool
  const connection = await mainPool.getConnection();

  try {
    // Execute the query
    const [results] = await connection.query(query);
    return results;
  } catch (error) {
    // Rollback the transaction if an error occurs
    await connection.rollback();
    throw error;
  } finally {
    // Release the connection back to the pool
    connection.release();
  }
}

module.exports = {
    execute_query_params_return_query_result,
    execute_query_return_query_result,
    getPool
  };