const nanoid = require('nanoid');

module.exports =function (app, db){
    const urlsDB = db.db('urls')

    app.post('/shorten', (req, res) => {
        const url = req.body.urlToShorten
        console.log('Shortening requested for', url)
        const newEntry = { token: nanoid.nanoid(8), original: url, views: 0}
        const shortenedUrl = 'http://localhost:8000/' + newEntry.token
        urlsDB.collection('urls').insertOne(newEntry, (err, result) => {
            if (err) {
                res.send({
                    'status': 'Error'
                })
            } else {
                console.log('Shortened to ' + shortenedUrl)
                res.send({
                    'status': 'Created',
                    'shortenedUrl': shortenedUrl
                })
            }
        })
    })

    app.get('/:url', (req, res) => {
        const details = {token: req.params.url}
        if (details.token !== 'favicon.ico') {
            console.log('http://localhost:8000/' + details.token + ' accessed')
            urlsDB.collection('urls').findOne(details, (err, item) => {
                if (err || item === null) {
                    res.send('Not found')
                } else if (item) {
                    console.log(item.original)
                    item.views += 1
                    console.log(item.views)
                    urlsDB.collection('urls').update(details, item)
                    res.redirect(item.original)
                }
            })
        }
    })

    app.get('/:url/views', (req, res) => {
        const details = {token: req.params.url}
        console.log('http://localhost:8000/' + details.token + ' views accessed')
        urlsDB.collection('urls').findOne(details, (err, item) => {
            if (err || item === null) {
                res.send('Not found')
            } else if (item) {
                console.log(item.views)
                res.send({
                    'viewCount': item.views.toString()
                })
            }
        })
    })
};