const mysql2 = require('mysql2')
const dbpassword =require('../authentication/dbpassword')

const conexao = mysql2.createConnection({
    host: 'localhost',
    port: '3306',
    user: dbpassword.user,
    password: dbpassword.password,
    database: 'agenda-petshop'
})

module.exports = conexao