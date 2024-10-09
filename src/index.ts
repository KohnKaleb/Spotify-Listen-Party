import express from 'express';
import { access } from 'fs';
import { URLSearchParams } from 'url';

const cors = require('cors');
const session = require('express-session')
const querystring = require('querystring');
const axios = require('axios');
require('dotenv').config();

const client_id = process.env.CLIENT_ID;
const client_port = process.env.CLIENT_PORT;
const client_secret = process.env.CLIENT_SECRET;
const port = process.env.PORT;
const redirect_uri = `http://localhost:${port}/listen`;
const app = express();

const corsOptions = {
    origin: `http://localhost:${client_port}`,
    methods: 'GET,POST',
    allowedHeaders: ['Content-Type', 'Authorization']
}

app.use(cors(corsOptions), session({
    resave:false,
    saveUninitialized: true,
    cookie: { secure: false }
}));

app.get('/refresh/token', (req: express.Request, res) => {
    const refreshToken  = ""
    if (refreshToken) {
        res.send({ refreshToken });
    } else {
        res.status(401).send('No refresh token found');
    }
});

app.get('/refresh_access_token', async (req: express.Request, res) => {
    const refreshToken = ""

    if (!refreshToken) {
        return res.status(401).send('No refresh token found');
    }

    try {
        const response = await axios.post('https://accounts.spotify.com/api/token', querystring.stringify({
            grant_type: 'refresh_token',
            refresh_token: refreshToken
        }), {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': 'Basic ' + (Buffer.from(`${client_id}:${client_secret}`).toString('base64'))
            }
        });

        const { access_token } = response.data;
        //TODO save access token to session

        res.send({ access_token });
    } catch (error) {
        res.status(500).send('Could not refresh access token');
    }
});

app.get('/login', (req, res) => {
    const state = '12345';
    const scope = 'user-read-private user-read-email';

    res.redirect('https://accounts.spotify.com/authorize?' +
        querystring.stringify({
            response_type: 'code',
            client_id: client_id,
            scope: scope,
            redirect_uri: redirect_uri,
            state: state,
            show_dialog: true
        }));
});

app.get('/listen', async (req: express.Request, res) => {

    var code = req.query.code || null;
    var state = req.query.state || null;

    if (state === null) {
        res.redirect('/#' +
            querystring.stringify({
                error:'state_mismatch'
            })
        );
    } else {
        try { 
            let response = await axios.post('https://accounts.spotify.com/api/token', querystring.stringify({
                    code: code,
                    redirect_uri: redirect_uri,
                    grant_type: 'authorization_code'
                }), {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Authorization': 'Basic ' + (Buffer.from(`${client_id}:${client_secret}`).toString('base64'))
                },
            });

            const { access_token, refresh_token } = response.data;
            
            // TODO save access and fresh token to session

            res.redirect('http://localhost:3000/')
        } catch {
            res.redirect('/#' + querystring.stringify({error: 'token_error'}));
        }     
    }
})

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});