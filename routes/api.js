/*
*
*
*       Complete the API routing below
*       
*       
*/

'use strict';
const mongoose = require('mongoose')
const Database = require('../src/database');
const BookModel = require('../src/models/book');

module.exports = function (app) {

  app.route('/api/books')
    .get(function (req, res){
      //response will be array of book objects
      //json res format: [{"_id": bookid, "title": book_title, "commentcount": num_of_comments },...]

      BookModel.find()
      .then((doc) => {
        let output = doc.map((book) => {
          return {
            _id: book._id,
            title: book.title,
            commentcount: book.comments.length
          }
        })
        res.json(output)
      }).catch((err) => console.error(err));
    })
    
    .post(function (req, res){
      let title = req.body.title;
      //response will contain new book object including atleast _id and title

      if(!req.body.title){
        res.send('missing required field title')
      } else {
        const book = new BookModel({title}).save()
        .then((doc) => {
          res.json(doc);
        }).catch((err) => res.json({ error: 'required field(s) missing' }));
      }
    })
    
    .delete(function(req, res){
      //if successful response will be 'complete delete successful'

      BookModel.deleteMany()
      .then((doc) => {
        res.send('complete delete successful')
      }).catch(err => console.error(err));
    });



  app.route('/api/books/:id')
    .get(function (req, res){
      let bookid = req.params.id;
      //json res format: {"_id": bookid, "title": book_title, "comments": [comment,comment,...]}

      BookModel.findOne({_id: bookid})
      .then((doc) => {
        if(!doc){
          res.send('no book exists')
          return
        }

        res.json(doc)
      }).catch((err) => {
        // console.error(err)
        res.send('no book exists')
      });
    })
    
    .post(function(req, res){
      let bookid = req.params.id;
      let comment = req.body.comment;
      //json res format same as .get

      if(!comment) {
        res.send('missing required field comment')
        return
      }

      BookModel.findOne({_id: bookid})
      .then((doc) => {
        if(!doc){
          res.send('no book exists')
          return
        }
        doc.comments.push(comment)
        doc.save()
        .then((doc) => {
          res.json(doc)
        }).catch(err => console.error(err));
      }).catch(err => res.send('no book exists'));
    })
    
    .delete(function(req, res){
      let bookid = req.params.id;
      //if successful response will be 'delete successful'

      BookModel.findOne({_id: bookid})
      .then((doc) => {
        if(!doc){
          res.send('no book exists')
          return
        }

        doc.deleteOne()
        .then((doc) => {
          res.send('delete successful')
        }).catch(err => console.error(err));
      }).catch(err => res.send('no book exists'));
    });
  
};
