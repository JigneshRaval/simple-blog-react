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
        response.status(200).send({ message: 'Fetched all the articles successfully', docs });
    });
});


// GET : Get Single Article by Id (/api/articles/:articleId)
routes.get('/articles/:articleId', (request, response) => {
    // Find all documents in the collection
    db.articles.find({ _id: request.params.articleId }).sort({ today: -1 }).exec(function (err, docs) {
        if (err) {
            return err;
        }
        response.status(200).send({ message: `Article found by ID#${request.params.articleId}`, docs });
    });
});


// CREATE : Create or Add new Article (/api/articles/add)
routes.post('/articles/add', (request, response) => {

    var doc = {
        ...request.body
    };

    db.articles.insert(doc, function (err, newDoc) {
        // Callback is optional
        // newDoc is the newly inserted document, including its _id
        // newDoc has no key called notToBeSaved since its value was undefined
        if (err) {
            console.log('Error : ', err);
            return err
        }
        response.status(200).send({ message: 'New article created successfully.', newDoc });
    });

});


// EDIT : Edit Article by Id (/api/articles/edit/:articleId)
routes.post('/articles/edit/:articleId', (request, response) => {
    let { title, sourceUrl, path, category, tags, excerpt, date, coverImage, type } = request.body;

    console.log(request.params.articleId, title, sourceUrl, path, category, tags, excerpt, date, coverImage, type);
    // Set an existing field's value
    db.update({ _id: request.params.articleId }, { $set: { title: title, sourceUrl: sourceUrl, path: path, category: category, tags: tags, excerpt: excerpt, date: new Date(), coverImage: coverImage, type: type } }, { multi: false }, function (err, numReplaced) {
        if (err) {
            return err;
        } else {
            db.find({ _id: request.params.articleId }).sort({ today: -1 }).exec(function (err, docs) {
                if (err) {
                    return err;
                }
                response.status(200).send({ message: 'Article ID#${request.params.articleId} updated successfully.', newDoc });
            });
        }
    });
});


// DELETE : Delete article by id (/api/articles/delete/:articleId)
routes.delete('/articles/delete/:articleId', (request, response) => {
    db.articles.remove({ _id: request.params.articleId }, {}, function (err, numRemoved) {
        if (err) {
            return err;
        }
        // Find all documents in the collection
        db.articles.find({}).sort({ today: -1 }).exec(function (err, docs) {
            if (err) {
                return err;
            }
            response.status(200).send({ status: 'OK', message: `Item ID#${request.params.articleId} removed successfully from database.`, docs });
        });
    });
});

module.exports = routes;
