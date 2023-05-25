const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');

const app = express();
app.use(express.static('/Certificate generator/'));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());


app.get('/', (req, res) => {
    res.sendFile(__dirname + '/views/index.html');
});

app.get('/find', (req, res) => {
    res.sendFile(__dirname + '/views/findCertificate.html');
});

app.get('/findCertificate', (req, res) => {
    const number = req.query.numberOfCertificate;
    findCertificateByNumber(number, function (element) {
        res.render('findCertificate2.ejs', { item: element })
    });

});

app.post('/save', (req, res) => {
    const data = req.body;
    const number = data.number;
    const fullname = data.fullname;
    const course = data.course;
    const date = data.date;
    const teacher = data.teacher;
    const hours = data.hours;
    saveInfoToDB(number, fullname, course, teacher, date, hours);
});

app.get('/save', (req, res) => {
    res.sendFile(__dirname + '/views/findCertificate.html')
});

app.listen(3000, () => {
    console.log('Server started on port 3000');
});



//Функція для збереження інформації про сертифікат у бд
function saveInfoToDB(number, fullname, course, teacher, date, hours) {
    const connection = mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: '12345',
        database: 'certificatedb'
    });

    connection.query(
        'INSERT INTO certificates (number, name, course, teacher, get_date, hours) VALUES (?, ?, ?, ?, ?, ?)',
        [number, fullname, course, teacher, date, hours],
        (error, results) => {
            if (error) {
                console.error(error);
            } else {
                console.log('Info has been saved to the database.');
            }
        }
    );
    connection.end();
}

async function findCertificateByNumber(number, callback) {
    const connection = mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: '12345',
        database: 'certificatedb'
    });

    const query = 'SELECT * FROM certificates WHERE number = ?';
    connection.execute(query, ['№' + number], function (err, results, fields) {
        if (err) throw err;
        if (results.length > 0) {
            callback(results[0])
        } else {
            callback(null)
        }

        connection.end();
    });
}