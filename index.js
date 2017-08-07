const http = require('http')
const path = require('path')
const body = require('body-parser')
const express = require('express')
const useragent = require('express-useragent')
const morgan = require('morgan')
const favicon = require('serve-favicon')

/** app */
const app = new express()
const server = http.createServer(app)

/** setup */
app.disable('x-powered-by')
app.use(morgan('dev'))
app.use(useragent.express())
app.use(body.urlencoded({ extended: true }))
app.use(body.json())
app.use(express.static(path.resolve(__dirname, 'dist')))
app.use(favicon(path.join(__dirname, 'dist', 'favicon.ico')))

/** handle requests */
app.use('/*', function(req, res) {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'))
})

/** start */
server.listen(process.env.PORT || 5000)
