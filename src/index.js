const express = require('express');
const session = require('express-session');
const cors = require('cors');
const WebSocket = require('ws');
const authRoutes = require('./routes/authRoutes');
require('dotenv').config();

const client_port = process.env.CLIENT_PORT;
const port = process.env.PORT;
const app = express();
const server = http.createServer(app)

const corsOptions = {
    origin: `http://localhost:${client_port}`,
    methods: 'GET,POST',
    allowedHeaders: ['Content-Type', 'Authorization']
}
const sessionOptions = {
    secret: "test",
    resave:false,
    saveUninitialized: true,
    cookie: { secure: false }
}

app.use(cors(corsOptions));
app.use(session(sessionOptions));
app.use('/auth', authRoutes);

createChatServer(server);

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});