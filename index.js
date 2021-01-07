const express = require('express'),
    morgan = require('morgan');

const app = express();

let topMovies = [
    {
        title: 'The Greatest Showman',
        director: 'Michael Gracey'
    },
    {
        title: 'Crazy Rich Asians',
        director: 'Jon M. Chu'
    },
    {
        title: 'I, Tonya',
        director: 'Craig Gillespie'
    },
    {
        title: 'Joker',
        director: 'Todd Phillips'
    },
    {
        title: 'The Great Gatsby',
        director: 'Baz Luhrmann'
    },
    {
        title: 'The Wolf of Wall Street',
        director: 'Martin Scorsese'
    },
    {
        title: 'Knives Out',
        director: 'Rian Johnson'
    },
    {
        title: 'Forrest Gump',
        director: 'Robert Zemeckis'
    },
    {
        title: 'Django Unchained',
        director: 'Quentin Tarantino'
    },
    {
        title: 'Avengers: Endgame',
        director: 'Anthony Russo'
    }
];

app.use(morgan('common'));

app.use(express.static('public'));

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
  });

// GET requests
app.get('/movies', (req, res) => {
    res.json(topMovies);
});

app.get('/', (req, res) => {
    res.send('Welcome to MyFlix, Your source for all things movies!')
});

// listen for requests
app.listen(8080, () =>
    console.log('Your app is listening on port 8080.')
);