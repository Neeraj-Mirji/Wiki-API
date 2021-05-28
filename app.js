const mongoose = require('mongoose');
const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');


const app = express();
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));


mongoose.connect("mongodb://localhost:27017/wikiDb" , {useNewUrlParser: true, useUnifiedTopology: true});

const articleSchema  = new mongoose.Schema({

  title : String,
  content : String
});


const Article = mongoose.model('article' , articleSchema);


//Requests targeting all articles

app.route('/articles')

.get(function(req , res){
 Article.find({} , function(err , foundArticles)
{
  if(!err) res.send(foundArticles);
  else res.send(err);
});
})



.post(function(req , res){
   const newArticle = new Article({
    title : req.body.title,
    content : req.body.content
    });

  newArticle.save(function(err)
{
  if(!err) res.send("Successfully Added the new article");
  else res.send(err);
});
})



.delete(function(req , res){
Article.deleteMany({} , function(err)
{
  if(!err) res.send("Successfully deleted all the articles");
  else res.send(err);
});
})



//Requests targeting Particular topic

app.route('/articles/:topic')

.get(function(req , res)
{
  const topic = req.params.topic;
  Article.findOne({title : topic} , function(err , foundArticle)
{
  if(!err)
  {
    if(foundArticle) res.send(foundArticle);
    else res.send("Requested Article didn't found!!");
  }
  else res.send(err);
});
})


.put(function(req , res)
{
  const topic = req.params.topic;
  const newTitle = req.body.title;
  const newContent = req.body.content;
  Article.update({title : topic} , {title : newTitle , content : newContent} , {overwrite : true} , function(err)
{
  if(!err) res.send("Successfully Updated the document");
  else res.send(err);
});
})

.patch(function(req , res)
{
  const topic  = req.params.topic;
  Article.update({title : topic} , {$set : req.body} , function(err)
{
  if(!err) res.send("Successfully Updated the document");
  else res.send(err);
});
})

.delete(function(req , res)
{
  const topic = req.params.topic;
  Article.deleteOne({title : topic} , function(err)
{
  if(!err) res.send("Successfully deleted the article!");
  else res.send(err);
});
});







app.listen(3000 , function()
{
  console.log("Connection started at port 3000")
});
