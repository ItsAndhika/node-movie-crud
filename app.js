import express from 'express'
import expressEjsLayouts from 'express-ejs-layouts'
import "./utils/database.js"
import Movie from "./models/movies.js"
const app = express()
const PORT = 3000

app.set('view engine', 'ejs')
app.use(express.static('public'))
app.use(express.urlencoded({extended: true}))
app.use(expressEjsLayouts)

app.get('/', async (req, res) => {
    const movies = await Movie.find()
    res.render('index', {
        title: "Home",
        cssLink: "css/bootstrap.css",
        layout: "layouts/main",
        movies
    })
})

app.listen(PORT, () => {
    console.log(`Listening to http://localhost:${PORT}`)
})