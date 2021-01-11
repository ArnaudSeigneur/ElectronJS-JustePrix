const express = require('express'),
    session = require('cookie-session'),
    bodyParser = require('body-parser'),
    urlencodedParser = bodyParser.urlencoded({extended: false});

const app = express();

// Use session storage
app.use(session({secret: 'secretpass'}))

    // Show the form when the user visit the website
    .get('/game/form', function (req, res) {
        res.render('form.ejs');
    })

    // Retrieve all the data and send it to the game template
    .post('/game/settings/add', urlencodedParser, function (req, res) {
        // Set the object value in the session
        req.session.objectValue = parseInt(req.body.objectValue);
        req.session.objectName = req.body.objectName;
        req.session.playerOneName = req.body.playerOne;
        req.session.playerTwoName = req.body.playerTwo;
        req.session.nbAttempts = 0;
        req.session.messages = [];

        res.redirect('/game');
    })

    // Route used only in ajax for check if the user has win or not
    .post('/game/check/', urlencodedParser, function (req, res) {
        // Increment the nb of attempts
        req.session.nbAttempts++;

        const valueGiven = parseInt(req.body.newTry) || 0,
            valueToFind = req.session.objectValue;

        let msgToShow = '';

        if (valueToFind > valueGiven) {
            msgToShow += "C'est plus haut !";
        } else if (valueToFind < valueGiven) {
            msgToShow += "C'est moins haut !";
        } else if (valueToFind === valueGiven) {
            msgToShow += "C'est GAGNER en " + req.session.nbAttempts + " tentatives !\n";
        }
        // Push the messages to show for the user
        req.session.messages.push(msgToShow);

        // Redirect to the game page
        res.redirect('/game');
    })

    // Show the page of the game
    .get('/game', function (req, res) {
        res.render('game.ejs', {
            objectName: req.session.objectName,
            playerOneName: req.session.playerOneName,
            playerTwoName: req.session.playerTwoName,
            nbAttempts: req.session.nbAttempts,
            messages: req.session.messages
        });
    })

    // In all case redirect the user to the form if it try to visit an other page
    .use(function (req, res, next) {
        res.redirect('/game/form');
    })

    .listen(8080);