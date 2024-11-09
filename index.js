const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');
const { exec } = require('child_process');

const app = express();
const port = 3001;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());
app.use(express.static('public'));

function loadUsers() {
    try {
        const data = fs.readFileSync('users.json');
        return JSON.parse(data);
    } catch (error) {
        console.error('Erro ao carregar usuários:', error);
        return [];
    }
}

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/login.html');
});

app.post('/login', (req, res) => {
    const { username, password } = req.body;
    const users = loadUsers();
    const user = users.find(u => u.username === username && u.password === password);

    if (user) {
        res.json({ success: true });
    } else {
        res.json({ success: false, message: 'Usuário ou senha incorretos' });
    }
});

app.get('/ping/:ip', (req, res) => {
    const ip = req.params.ip;
    exec(`ping -c 1 ${ip}`, (error, stdout, stderr) => {
        if (error) {
            res.json({ status: 'offline' });
        } else {
            res.json({ status: 'online' });
        }
    });
});

app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});

