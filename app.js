import express from 'express'
import expressEjsLayouts from 'express-ejs-layouts'
import "./utils/database.js"
import Movie from "./models/movies.js"
import {body, check, validationResult} from 'express-validator'
import cookieParser from 'cookie-parser'
import session from 'express-session'
import flash from 'connect-flash'
import methodOverride from 'method-override'
const app = express()
const PORT = 3000

app.set('view engine', 'ejs')
app.use(express.static('public'))
app.use(express.urlencoded({extended: true}))
app.use(expressEjsLayouts)
app.use(methodOverride('_method'))
app.use(cookieParser('secret'))
app.use(session({
    cookie: {maxAge: 6000},
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}))
app.use(flash())

app.get('/', async (req, res) => {
    const movies = await Movie.find()
    res.render('index', {
        title: "Home",
        cssLink: "css/bootstrap.css",
        layout: "layouts/main",
        msg: req.flash('message'),
        movies
    })
})

app.get('/add', (req, res) => {
    res.render('add', {
        title: "Add movie",
        cssLink: "../css/bootstrap.css",
        layout: "layouts/main",
    })
})

app.get('/details/:id', async (req, res) => {
    const movie = await Movie.findOne({_id: req.params.id})

    res.render('details', {
        title: "Movie Details",
        cssLink: "../../css/bootstrap.css",
        layout: "layouts/main",
        movie
    })
})

app.post('/add', [
    body('title').custom( async (value) => {
        const duplicate = await Movie.findOne({title: value})
        if(duplicate) {
            throw new Error('Movie title is already exist!')
        }
        return true
    }),
    check('year', 'year must be number!').isNumeric()
], (req, res) => {
    console.log(req.body)
    const errors = validationResult(req)
    if(!errors.isEmpty()) {
        res.render('add', {
            title: "Add movie",
            cssLink: "../css/bootstrap.css",
            layout: "layouts/main",
            errors: errors.array()
        })
    } else {
        Movie.insertMany(req.body, (err, result) => {
            req.flash('message', 'Movie data is successfuly added!')
            res.redirect('/')
        })
    }
})

app.delete('/delete', (req, res) => {
    Movie.deleteOne({_id: req.body.id}, (error, result) => {
        req.flash('message', 'Movie data is successfuly deleted!')
        res.redirect('/')
    })
})

app.use('/', (req, res) => {
    res.send(`<h1>404 PAGE NOT FOUND!</h1>`)
})

app.listen(PORT, () => {
    console.log(`Listening to http://localhost:${PORT}`)
})