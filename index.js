const express = require('express'),
    { check, validationResult } = require('express-validator'),
    bodyParser = require('body-parser'),
    morgan = require('morgan')
    mongoose = require('mongoose'),
    Models = require('./models.js'),
    passport = require('passport'),
    cors = require('cors');
require('./passport');

const app = express();
// import Models
const Movies = Models.Movie;
const Users = Models.User;

// connect to local mongoDB
mongoose.connect('mongodb://localhost:27017/myFlixDB', {
    useNewUrlParser: true, useUnifiedTopology: true 
});

app.use(morgan('common'));

app.use(express.static('public'));

app.use(bodyParser.json());

app.use(cors());

let auth = require('./auth')(app);


// error handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
    next();
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
// define API endpoints
app.get('/', (req, res) => {
    console.log('Hello!');
    res.status(200).send('Welcome to MyFlix, Your source for all things movies!');
});

// Get list of all movies
app.get('/movies', passport.authenticate('jwt', { session: false }), (req, res) => {
    Movies.find()
    .then((movies) => {
        res.status(201).json(movies);
    })
    .catch ((err) => {
        console.error(err);
        res.status(500).send('Error: ' + err);
    });
});

// Get data about a movie by title
app.get('/movies/:Title', passport.authenticate('jwt', {session: false}), (req, res) => {
    Movies.findOne({Title: req.params.Title})
    .then((movie) => {
        res.status(200).json(movie);
    })
    .catch((err) => {
        console.error(err);
        res.status(500).send('Error: ' + err);
    });
});

// Get data about a genre of a movie by its title
app.get('/movies/genres/:Title', passport.authenticate('jwt', {session: false}), (req, res) => {
    Movies.findOne({'Genre.Title': req.params.Title}, 'Genre')
    .then((genre) => {
        res.status(200).json(genre);
    })
    .catch((err) => {
        console.error(err);
        res.status(500).send('Error: ' + err);
    });
});

// Get data about a director by name
app.get('/movies/directors/:Name', passport.authenticate('jwt', {session: false}), (req, res) => {
    Movies.findOne( {'Director.Name': req.params.Name}, 'Director')
    .then((director) => {
        res.status(200).json(director);
    })
    .catch((err) => {
        console.error(err);
        res.status(500).send('Error: ' + err);
    });
});

// Get all users
app.get('/users', passport.authenticate('jwt', {session: false}), (req, res) => {
    Users.find()
    .then((users) => {
        res.status(201).json(users);
    })
    .catch((err) => {
        console.error(err);
        res.status(500).send('Error: ' + err);
    });
});

// Get a user by username
app.get('/users/:Username', passport.authenticate('jwt', {session: false}), (req, res) => {
    Users.findOne({Username: req.params.Username})
    .then((user) => {
        res.status(200).json(user);
    })
    .catch((err) => {
        console.error(err);
        res.status(500).send('Error: ' + err);
    });
});

// Post new user registration
app.post('/users', [
        check('Username', 'Username is required.').not().isEmpty(),
        check('Username', 'Username must contain only alphanumeric characters.').isAlphanumeric(),
        check('Password', 'Password is required.').not().isEmpty(),
        check('Password', 'Password must be a minimum of 8 characters long').isLength({ min: 8 }),
        check('Email', 'Email is not valid.').isEmail().normalizeEmail()
    ], (req, res) => {
        // Check validation object for errors
        let errors = validationResult(req);

        if (!error.isEmpty()) {
            return res.status(422).json({ errors: errors.array() });
        }

        let hashedPassword = Users.hashPassword(req.body.Password);

        Users.findOne({Username: req.body.Username})
        .then((user) => {
            if (user) {
                return res.status(400).send(req.body.Username + 'already exists');    
            } else {
                Users
                    .create({
                        Username: req.body.Username,
                        Password: hashedPassword,
                        Email: req.body.Email,
                        Birthday: req.body.Birthday
                    })
                    .then((user) =>{res.status(201).json(user)})
                .catch((error) => {
                    console.error(error);
                    res.status(500).send('Error: ' + error);
            })
        }
    })
    .catch((error) => {
        console.error(error);
        res.status(500).send('Error: ' + error);
    });
});

// Update a user's information, by username 
app.put('/users/:Username', 
    passport.authenticate('jwt', {session: false}),
    [
        check('Username', 'Username is required.').not().isEmpty(),
        check('Username', 'Username must contain only alphanumeric characters.').isAlphanumeric(),
        check('Password', 'Password is required.').not().isEmpty(),
        check('Password', 'Password must be a minimum of 8 characters long').isLength({ min: 8 }),
        check('Email', 'Email is not valid.').isEmail().normalizeEmail()
    ], 
    (req, res) => {
        let errors = validationResult(req); 
        // checks the validation object for errors
        if (!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.array() });
        }

        let hashedPassword = Users.hashPassword(req.body.Password);

        Users.findOneAndUpdate({ Username: req.params.Username }, {
            $set:
            {
                Username: req.body.Username,
                Password: req.body.Password,
                Email: req.body.Email,
                Birthday: req.body.Birthday
            }
        },
        { new: true }, // This line makes sure that the updated document is returned
        (err, updatedUser) => {
            if(err) {
                console.error(err);
                res.status(500).send('Error: ' + err);
            } else {
                res.json(updatedUser);
            }
        });
});

// Add a  movie to user's list of favorite movies
app.post('/users/:Username/Movies/:MovieID', passport.authenticate('jwt', {session: false}), (req, res) => {
    Users.findOneAndUpdate({ Username: req.params.Username }, {
        $push: { FavoriteMovies: req.params.MovieID }
    },
    { new: true }, // This line makes sure that the updated document is returned
    (err, updatedUser) => {
        if (err) {
            console.error(err);
            res.status(500).send('Error: ' + err);
        } else {
            res.json(updatedUser);
        }
    });
});

// Delete a movie from list of user's favorite movies
app.delete('/users/:Username/movies/:MovieID', passport.authenticate('jwt', {session: false}), (req, res) => {
    Users.findOneAndRemove({ Username: req.params.MovieID },
        {
            $pull: { FavoriteMovies: req.params.MovieID }
        })
        .then(() => {
            res.status(200).send(req.params.MovieID + ' was successfully removed from ' + req.params.Username + '\'s list of favorites.');
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send('Error: ' + err);
        });
});

// Delete a user by username
app.delete('/users/:Username', passport.authenticate('jwt', {session: false}), (req, res) => {
    Users.findOneAndRemove({ Username: req.params.Username }).then((user) => {
        if (!user) {
            res.status(400).send(req.params.Username + ' was not found');
        } else {
            res.status(200).send(req.params.Username + ' was deleted.');
        }
    })
    .catch((err) => {
        console.error(err);
        res.status(500).send('Error: ' + err);
    });
});

// listen for requests
const port = process.env.PORT || 8080;
app.listen(port, '0.0.0.0',() => {
    console.log('Listening on Port ' + port);
});