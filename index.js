const express = require('express'),
    bodyParser = require('body-parser'),
    morgan = require('morgan');

const app = express();

app.use(morgan('common'));

app.use(express.static('public'));

app.use(bodyParser.json());

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
  });

let movies = [
    {
        title: 'The Greatest Showman',
        description: 'P T Barnum becomes a worldwide sensation in the show business. His imagination and innovative ideas take him to the top of his game.',
        genre: 'Drama',
        director: 'Michael Gracey',
        image: 'greatestShowman.png'
    },
    {
        title: 'Crazy Rich Asians',
        description: 'Rachel, a professor, dates a man named Nick and looks forward to meeting his family. However, she is shaken up when she learns that Nick belongs to one of the richest families in the country.',
        genre: 'Romance',
        director: 'Jon M. Chu',
        image: 'crazyRichAsians.png'
    },
    {
        title: 'Joker',
        description: 'Arthur Fleck, a party clown, leads an impoverished life with his ailing mother. However, when society shuns him and brands him as a freak, he decides to embrace the life of crime and chaos.',
        genre: 'Thriller',
        director: 'Todd Phillips',
        image: 'joker.png'
    },
    {
        title: 'Knives Out',
        description: 'The circumstances surrounding the death of crime novelist Harlan Thrombey are mysterious, but there is one thing that renowned Detective Benoit Blanc knows for sure - everyone in the wildly dysfunctional Thrombey family is a suspect.',
        genre: 'Mystery',
        director: 'Rian Johnson',
        image: 'knivesOut.png'
    },
    {
        title: 'The Great Gatsby',
        description: 'Nick Carraway, a World War I veteran who moves to New York with the hope of making it big, finds himself attracted to Jay Gatsby and his flamboyant lifestyle.',
        genre: 'Drama',
        director: 'Baz Luhrmann',
        image: 'greatGatsby.png'
    }
];

// GET requests
app.get('/', (req, res) => {
    res.send('Welcome to MyFlix, Your source for all things movies!')
});

// Get list of data of all movies
app.get('/movies', (req, res) => {
    res.json(movies);
});

// Get data about a movie by title
app.get('/movies/:title', (req, res) => {
    res.json(movies.find((movie) => 
    {return movie.title === req.params.title
    }));
});

// Get data about a genre of a movie by its title
app.get('/movies/genres/:title', (req, res) => {
    res.send('Successful GET request returning data of the genre of movie Joker: thriller');
});

// Get data about a director by name
app.get('/movies/directors/:name', (req, res) => {
    res.send('Successful GET request returning data on director Quentin Tarantino: Born March 27, 1963 in Knoxville, Tennessee. Married to Daniella Pick.');
});

// Post new user registration
app.post('/users', (req, res) => {
    res.send('Successful POST request registering new user');
});

// Put updates to user information
app.put('/users/:username', (req, res) => {
    res.send('Successful PUT request updating user information for user: anhibanani');
});

// Post new movie to user list of favorite movies
app.post('/users/:username/movies/:title', (req, res) => {
    res.send('Successful POST request adding movie title: Joker to favorite movie list of user: anhibanani');
});

// Delete a movie from list of user's favorite movies
app.delete('/users/:username/movies/:title', (req, res) => {
    res.send('Successful DELETE request removing movie title: Godzilla from favorite movie list of user: anhibanani');
});

// Delete data of exsiting user
app.delete('/users/:username', (req, res) => {
    res.send('Successful DELETE request removing user: anhibanani from database');
});

// listen for requests
app.listen(8080, () =>
    console.log('Your app is listening on port 8080.')
);