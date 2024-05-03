const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');  // Adicione este módulo para manipular caminhos de arquivo

const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));  // Serve os arquivos estáticos da pasta 'public'

let users = [];  // Armazenando os usuários em memória
let sessions = {};  // Guarda as sessões para autenticação

app.post('/register', (req, res) => {
    const { username, password } = req.body;
    if (users.find(user => user.username === username)) {
        return res.status(400).send('Usuário já existe.');
    }
    users.push({ username, password });
    res.send('Usuário registrado com sucesso.');
});

app.post('/login', (req, res) => {
    const { username, password } = req.body;
    const user = users.find(user => user.username === username && user.password === password);
    if (user) {
        const token = Math.random().toString(36).substring(2); // Simples token de autenticação
        sessions[token] = username;
        res.json({ token });
    } else {
        res.status(401).send('Credenciais inválidas.');
    }
});

app.post('/calculate', (req, res) => {
    const { token, a, b, c } = req.body;
    if (!sessions[token]) {
        return res.status(403).send('Não autorizado.');
    }

    // Convertendo os coeficientes para números para evitar erros de cálculo
    const aNum = parseFloat(a);
    const bNum = parseFloat(b);
    const cNum = parseFloat(c);

    // Cálculo de Delta
    const delta = bNum * bNum - 4 * aNum * cNum;

    console.log(`a: ${aNum}, b: ${bNum}, c: ${cNum}, delta: ${delta}`); // Log para depuração

    if (delta < 0) {
        res.send('Não existem raízes reais.');
    } else {
        const x1 = (-bNum + Math.sqrt(delta)) / (2 * aNum);
        const x2 = (-bNum - Math.sqrt(delta)) / (2 * aNum);
        res.json({ x1, x2 });
    }
});

app.listen(port, () => {
    console.log(`API rodando na porta ${port}`);
});
