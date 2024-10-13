const axios = require('axios');
const querystring = require('querystring');
require('dotenv').config();

const client_id = process.env.CLIENT_ID;
const client_secret = process.env.CLIENT_SECRET;
const port = process.env.PORT;
const redirect_uri = `http://localhost:${port}/auth/listen`;

exports.login = (req, res) => {
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
}

exports.listen = async (req, res) => {
    var code = req.query.code;
    var state = req.query.state;

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

            req.session .user = {
                refreshToken: response.data?.refresh_token,
                accessToken: response.data?.access_token,
                expires_in: response.data?.expires_in
            };

            res.redirect('http://localhost:3000/home')
        } catch {
            res.redirect('/#' + querystring.stringify({error: 'token_error'}));
        }     
    }
}

exports.refreshAccessToken = async (req, res) => {
    const refreshToken = req.session.user?.refreshToken;

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

        req.session.user = {
            refreshToken: response.data?.refresh_token,
            accessToken: response.data?.access_token,
            expires_in: response.data?.expires_in
        }

        res.send({ access_token: req.session.user.accessToken });
    } catch (error) {
        res.status(500).send('Could not refresh access token');
    }
}