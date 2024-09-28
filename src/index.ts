import express from 'express';
import { URLSearchParams } from 'url';
const cors = require('cors');
const querystring = require('querystring');
const axios = require('axios');
require('dotenv').config();

const client_id = process.env.CLIENT_ID;
const client_port = process.env.CLIENT_PORT;
const client_secret = process.env.CLIENT_SECRET;
const port = process.env.PORT;
const redirect_uri = `http://localhost:${port}/listen`;
const app = express();
let refreshToken = '';
let access_token = '';

const corsOptions = {
    origin: `http://localhost:${client_port}`,
    methods: 'GET,POST',
    allowedHeaders: ['Content-Type', 'Authorization']
}

app.use(cors(corsOptions));

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

app.get('/listen', async (req, res) => {

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
            })

            res.redirect('http://localhost:3000/#' +
                querystring.stringify({
                    access_token: response.data.access_token,
                    refreshToken: response.data.refresh_token
                })
            )
        } catch {
            res.redirect('/#' + querystring.stringify({error: 'token_error'}));
        }
        
    }
    return refreshToken;
})

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});