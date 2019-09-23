# Code Snippets

## How to paginate with Mongoose in Node.js?

https://stackoverflow.com/questions/5539955/how-to-paginate-with-mongoose-in-node-js

```javascript
var perPage = 10
  , page = Math.max(0, req.param('page'))

Event.find()
    .select('name')
    .limit(perPage)
    .skip(perPage * page)
    .sort({
        name: 'asc'
    })
    .exec(function(err, events) {
        Event.count().exec(function(err, count) {
            res.render('events', {
                events: events,
                page: page,
                pages: count / perPage
            })
        })
    })
```

## Working with the React Context API

https://www.toptal.com/react/react-context-api

```javascript
state = {
    cars: {
        car001: { name: 'Honda', price: 100 },
        car002: { name: 'BMW', price: 150 },
        car003: { name: 'Mercedes', price: 200 }
    }
};
incrementCarPrice = this.incrementCarPrice.bind(this);
decrementCarPrice = this.decrementCarPrice.bind(this);

incrementCarPrice(selectedID) {
    // a simple method that manipulates the state
    const cars = Object.assign({}, this.state.cars);
    cars[selectedID].price = cars[selectedID].price + 1;
    this.setState({
        cars
    });
}
```
