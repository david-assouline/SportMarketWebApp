var express = require("express");
require('dotenv').config();
var router = express.Router();
var app = express();
const { auth } = require('express-openid-connect');
const { requiresAuth } = require('express-openid-connect');


const {engine} = require("express-handlebars");

app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set("views", "./src/views");

app.use(
    auth({
        authRequired: false,
        auth0Logout: true,
        issuerBaseURL: process.env.ISSUER_BASE_URL,
        baseURL: process.env.BASE_URL,
        clientID: process.env.CLIENT_ID,
        secret: process.env.SECRET,
        routes: {
            login: false,
            logout: false
        }
    })
)

app.get('/login', (req, res) =>
    res.oidc.login({
        returnTo: '/portfolio',
        authorizationParams: {
            redirect_uri: 'http://localhost:3000/callback',
        },
    })

);

app.get('/logout', (req, res) =>
    res.oidc.logout({
        returnTo: '/home',
        authorizationParams: {
            redirect_uri: 'http://localhost:3000/home',
        },
    })
);

app.get('/profile', requiresAuth(), (req, res) => {
    console.log(req.oidc.user)
    res.render('profile',
        {layout : 'main', user: req.oidc.user});
});

app.get('/home' || "", (req, res) => {
    res.render('home', {layout : 'main'});
});

app.get('/trade', requiresAuth(), (req, res) => {
    res.render('trade', {layout : 'main', user: req.oidc.user});
});

app.get('/portfolio', requiresAuth(), (req, res) => {
    res.render('portfolio',
        {layout : 'main', user: req.oidc.user});

});

app.use("/",router);

app.use("*",function(req,res){
    res.sendFile(__dirname + "/src/html/404.html");
});

app.listen(process.env.PORT || 3000, function(){
    console.log("Live at Port 3000 http://localhost:3000/home");
});