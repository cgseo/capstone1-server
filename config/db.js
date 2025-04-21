// db 연결
const mysql = require('mysql2/promise');

// connect mysql db
const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    database: 'decibel',
    port: 3306,
    password: '0007',
});

module.exports = pool;
/*
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    database: 'sound',
    port: 3306,
    password: '0007',
  });
  
  connection.addListener('error', (err) => {
    console.log(err);
  });

  module.exports = connection;*/