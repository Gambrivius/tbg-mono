require('dotenv').config();

let mysql = require('mysql');



class GameData {
    constructor()
    {
        this.con = mysql.createConnection({
            host: process.env.MYSQL_SERVER,
            user: process.env.MYSQL_USER,
            password: process.env.MYSQL_PASS,
            database: process.env.MYSQL_DB,
            port: process.env.MYSQL_PORT
        });
        
        this.con.connect(function(err) {
            if (err) throw err;
            console.log("Connected!");
          });
    }
    get_user_by_username = (username) => {
        const sql = `SELECT * FROM user_accounts WHERE username='${username}'`;
        this.con.query(sql, (error, results, fields) => {
            if (error) {
              return console.error(error.message);
            }
            console.log(results);
            return results;
          });
    }
    create_user = (username, hashedPassword) => {
        const sql = `INSERT INTO user_accounts (username, password) VALUES ('${username}', '${hashedPassword}')`;
        return this.con.query(sql, (error, results, fields) => {
            if (error) {
              return console.error(error.message);
            }
            console.log(results);
            return results;
          });
    }
}

module.exports = {GameData};