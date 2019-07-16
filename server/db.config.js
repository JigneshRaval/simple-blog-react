let Datastore = require('nedb')
    , db = {},
    path = require('path');

// ARTICLES
// ===========================
db.articles = new Datastore({ filename: path.resolve(__dirname, '../src/assets/data/articles.db'), autoload: true });

// Load Articles database
db.articles.loadDatabase(function (err) {
    if (err) {
        console.log("Articles database error :", err);
    } else {
        console.log("Articles database loaded successfuly.");
    }
});

db.articles.ensureIndex({ fieldName: 'name' }, function (err) {
    // If there was an error, err is not null
    if (err) {
        console.log("Articles Database indexing error :", err);
    }
});


// BOOKMARKS
// ===========================
db.bookmarks = new Datastore({ filename: path.resolve(__dirname, '../src/assets/data/bookmarks.db'), autoload: true });

// Load Bookmarks database
db.bookmarks.loadDatabase(function (err) {
    if (err) {
        console.log("Bookmarks database error :", err);
    } else {
        console.log("Bookmarks database loaded successfuly.");
    }
});

db.bookmarks.ensureIndex({ fieldName: 'name' }, function (err) {
    // If there was an error, err is not null
    if (err) {
        console.log("Bookmarks Database indexing error :", err);
    }
});

module.exports = db;
