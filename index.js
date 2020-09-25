const express = require("express")
const app = express()
require("dotenv").config()
const mongoose = require('mongoose')
const hbs = require('hbs')
hbs.handlebars === require('handlebars')
hbs.registerPartials(__dirname + '/views/partials', function (err) { });
hbs.localsAsTemplateData(app)
const port = process.env.PORT || 3000
const fetch = require('node-fetch');
const movieItem = require('./models/movieItem')
app.locals.trending = []
app.locals.item = {}
app.locals.favourites = []

app.set('view engine', 'hbs')
app.use(express.static('public'))
app.use(express.urlencoded({ extended: false }))
app.use(express.json())

mongoose.connect(process.env.DB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then((result) => {
        console.log("I am connect")
        app.listen(port, () => {
            console.log("listen here you little...")
        })
    })
    .catch(err => console.log(err))

app.get('/', (req, res) => {
    fetch(`https://api.themoviedb.org/3/trending/all/day?api_key=${process.env.API_KEY}`)
        .then(response => response.json())
        .then((json) => {
            app.locals.trending = json.results
            res.status(200).render('index')
        })
})

app.get('/item/:type/:id', (req, res) => {
    if (req.params.type === 'movie') {
        fetch(`https://api.themoviedb.org/3/movie/${req.params.id}?api_key=${process.env.API_KEY}`)
            .then(response => response.json())
            .then((json) => {
                app.locals.item = json
                res.status(200).render('item')
            })
    } else {
        fetch(`https://api.themoviedb.org/3/tv/${req.params.id}?api_key=${process.env.API_KEY}`)
            .then(response => response.json())
            .then((json) => {
                app.locals.item = json
                res.status(200).render('item')
            })
    }
})

app.get('/favourites', (req, res) => {
    movieItem.find()
        .then((result) => {
            app.locals.favourites = result
            res.status(200).render('favourites')
        })
})

app.get('/addFavourite', (req, res) => {
    let newMovieItem
    if (typeof app.locals.item.name === "string") {
        newMovieItem = new movieItem({
            name: app.locals.item.name,
            backdrop_path: app.locals.item.backdrop_path,
            poster_path: app.locals.item.poster_path,
            vote_average: app.locals.item.vote_average,
            vote_count: app.locals.item.vote_count,
            release_date: app.locals.item.first_air_date,
            genres: app.locals.item.genres,
            overview: app.locals.item.overview
        })
    } else {
        newMovieItem = new movieItem({
            name: app.locals.item.title,
            backdrop_path: app.locals.item.backdrop_path,
            poster_path: app.locals.item.poster_path,
            vote_average: app.locals.item.vote_average,
            vote_count: app.locals.item.vote_count,
            release_date: app.locals.item.release_date,
            genres: app.locals.item.genres,
            overview: app.locals.item.overview
        })
    }
    newMovieItem.save()
        .then((result) => {
            console.log('I am save')
            res.status(200).redirect('/favourites')
        })
        .catch(err=>console.log(err))
}) 

app.get('/favouriteItem/:id', (req, res) => {
    movieItem.findById(req.params.id)
        .then((result) => {
            app.locals.item = result
            res.status(201).render('favouriteItem')
        })
        .catch(err=>console.log(err))
})

app.get('/removeFavourite/:id', (req, res) => {
    movieItem.findByIdAndDelete(req.params.id)
        .then((result) => {
            console.log("I am delete")
            res.status(201).redirect('/favourites')
        })
        .catch(err => console.log(err))
})

app.post('/search', (req, res) => {
    fetch(`https://api.themoviedb.org/3/search/multi?api_key=${process.env.API_KEY}&language=en-US&query=${req.body.search}&page=1&include_adult=false`)
            .then(response => response.json())
            .then((json) => {
                app.locals.trending = json.results
                res.status(200).render('index')
            })
})