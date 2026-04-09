import mysql from 'mysql2';

const con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "employeems",
    port: 3307   // ✅ IMPORTANT
});

con.connect(function(err) {
    if(err) {
        console.log("Error:", err);
    } else {
        console.log("Connected to MySQL");
    }
});

export default con;