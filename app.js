//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
// to use ejs instead of html
const ejs = require("ejs");
// to lower text
const _ = require('lodash');
// DATABASE
const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost:27017/blogsDB", {
  useNewUrlParser: true
});
// to store the blog array

const blogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Please check your data entry, no title specified!"]
  },
  text: {
    type: String,
    required: [true, "Please check your data entry, no text specified!"]
  }
});

// old storage method
// const post = [];

const Blog = mongoose.model("Blog", blogSchema);

// sample page text
const homeStartingContent = "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

const app = express();

app.set('view engine', 'ejs');

// to use html input
app.use(bodyParser.urlencoded({
  extended: true
}));

// to set app file path to local folder
app.use(express.static("public"));




// home page get request
app.get("/", function(req, res) {

  // reading DATABASE
  Blog.find(function(err, blogs) {
    if (err) {
      console.log(err);
    } else {
      //     // using forEach loop to print fruits name from database
      res.render("home", {
        homeContent: homeStartingContent,
        blogItems: blogs
      });
    }
  });
})

// specific blog post page by using url
app.get("/posts/:postName", function(req, res) {
  // .lowercase is lodash element to lower text in it
  // url created
  const requestedTitle = _.lowerCase(req.params.postName);

  // for forEach

  Blog.find(function(err, blogs) {
    if (err) {
      console.log(err);
    } else {
      // using forEach loop to print fruits name from database
      blogs.forEach(function(blog) {
        const storedTitle = _.lowerCase(blog.title);

        if (storedTitle === requestedTitle) {
          // if url matches with specific blog them open post page and show it on that page
          res.render("post", {
            blogTitle: blog.title,
            blogText: blog.text
          });
        }
      })
    }
  });

  // checking url maching with blog titles
//   blogs.forEach(function(blog) {
//     const storedTitle = _.lowerCase(blog.title);
//
//     if (storedTitle === requestedTitle) {
//       // if url matches with specific blog them open post page and show it on that page
//       res.render("post", {
//         blogTitle: blog.title,
//         blogText: blog.text
//       });
//     }
//   })
});

// about page get request
app.get("/about", function(req, res) {
  res.render("about", {

    aboutContent: aboutContent
  });
})

// contact page get request
app.get("/contact", function(req, res) {
  res.render("contact", {
    contactContent: contactContent
  });
})

// compose page get request
app.get("/compose", function(req, res) {
  res.render("compose");
})

// getting html input from compose page
app.post("/compose", function(req, res) {

  // storing user input in variable
  const blogTitle = req.body.postTitle;
  const body = req.body.postBody;

  // storing object values in db
  const blog = new Blog({
    title: blogTitle,
    text: body
  });
  blog.save().then(() => console.log("Blog saved"));

  // redirecting to home page
  res.redirect("/")

})

// staring server at 3000
app.listen(3000, function() {
  console.log("Server started on port 3000");
});
