const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const app = express();
const BooksSchema = require('./models/books');
const UsersSchema = require('./models/users');
const search_books = mongoose.createConnection('mongodb://127.0.0.1:27017/search_books', {
  useNewUrlParser: true
});

const books = search_books.model('books', BooksSchema);
const users = search_books.model('users', UsersSchema);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.post('/books', (req, res) => {
  books.create({
    title: req.body.title,
    author: req.body.author,
    pages: req.body.pages
  }, function(err, data) {
    if(err){
      return res.send('something went wrong please try again')
    }
    return res.send('success');
  });
});

app.post('/users', (req, res) => {
  users.create({
    username: req.body.username,
    password: req.body.password,
    age: req.body.age
  }, function(err, data) {
    if(err){
      return res.send('something went wrong please try again')
    }
    return res.send('success');
  });
});

app.post('/users/:id/books', (req, res) => {
  books.findOne({_id: req.body.book_id}, (err, book) => {
    if(err) {
      return res.send('Server error');
    } else {
      users.findOne({_id: req.params.id}, (err, user) => {
        if(err) {
          return res.send('Server error');
        }
        user.updateOne({$set: {book_id: req.body.book_id}}).exec();
        return res.send('success');
      });
    }
  });
});

app.get('/books', (req, res) => {
  if(req.query.q) {
    books.findOne({$or: [{title: req.query.q}, {author: req.query.q}]}, (err, book) => {
      if(err || !book) {
        return res.send('book not found');
      }
      return res.send(book);
    });
  } else {
      books.find((err, books) =>{
        if(err || !books) {
          return res.send('books not found');
        }
        return res.send(books);
      });
    }
});

app.get('/users', (req, res) => {
  users.find((err, data) => {
    if(err) {
      return res.send('Server error');
    }
    return res.send(data);
  });
});

app.get('/books/:id', (req, res) => {
  books.findOne({_id: req.params.id}, (err, book) => {
    if(err || !book) {
      return res.send('book not found');
    }
    return res.send(book);
  });
});

app.put('/books/:id', (req, res) => {
  books.findOne({_id: req.params.id}, (err, book) => {
    if(err || !book) {
      return res.send('book not found');
    }
    else{
      books.updateOne({_id: req.params.id}, {
        $set: {
          title: req.body.title,
          author: req.body.author,
          pages: req.body.pages
        }
      }).exec();
      return res.send(book);
    }
  });
});

app.delete('/books/:id', (req, res) => {
  books.deleteOne({_id: req.params.id}, (err, book) => {
    if(err) {
      return res.send('Server error');
    }
    return res.send('succes');
  })
});

app.delete('/users/:id/books/:bid', (req, res) => {
  users.findOne({_id: req.params.id}, (err, user) => {
    if(err) {
      return res.send('Server error');
    }
    users.updateOne({_id: req.params.id}, {$set: {book_id: ''}}).exec();
    return res.send('success');
  });
});

app.listen(8000);
