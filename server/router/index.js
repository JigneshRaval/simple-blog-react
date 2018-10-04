// server/router/index.js

const routes = require('express').Router();
const db = require('../db.config');

// GET /api

routes.get('/', (request, response) => {
    response.status(200).json({ message: 'Connected!' });
});

// GET : All Articles (/api/articles)
routes.get('/articles', (request, response) => {
    // Find all documents in the collection
    db.articles.find({}).sort({ today: -1 }).exec(function (err, docs) {
        if (err) {
            return err;
        }
        console.log(docs);
        response.status(200).send({ message: 'Fetched all the articles successfully', docs });
    });
});

// GET /api/articles/add

routes.post('/articles/add', (request, response) => {

    console.log(request.body);
   /*  var doc = {
        title: req.body.title,
        status: req.body.status,
        isDone: req.body.isDone,
        description: req.body.description,
        dateCreated: req.body.dateCreated,
        dateUpdated: new Date(),
        today: new Date()
    };

    db.insert(doc, function (err, newDoc) {   // Callback is optional
        // newDoc is the newly inserted document, including its _id
        // newDoc has no key called notToBeSaved since its value was undefined
        if (err) {
            return err;
        }
        response.status(200).send({ message: 'New article created successfully.', newDoc});
    }); */
});

// GET /api//articles/edit/:articleId

routes.post('/articles/edit/:articleId', (request, response) => {
    response.status(200).json({ message: 'Connected!' });
});

// DELETE : Delete article by id (/api/articles/delete/:articleId)

routes.delete('/articles/delete/:articleId', (request, response) => {
    console.log(request.params);

    db.articles.remove({ _id: request.params.articleId }, {}, function (err, numRemoved) {
        if (err) {
            return err;
        }
        response.status(200).send({ status: 'OK', message: 'Item removed successfully from database.' });
    });

});

module.exports = routes;
