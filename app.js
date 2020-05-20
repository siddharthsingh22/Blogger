var express = require("express"),
  app = express(),
  mongoose = require("mongoose"),
  bodyParser = require("body-parser"),
  methodOverride = require("method-override"),
  expressSanitizer = require("express-sanitizer");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.set("view engine", "ejs");
app.listen(process.env.port || 3000, function () {
  console.log("server has started");
});
app.use(expressSanitizer());
// mongoose.connect("mongodb://localhost/blog_app", {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// });
mongoose.connect(
  "mongodb+srv://Siddharth:<password>@cluster0-thw82.mongodb.net/test?retryWrites=true&w=majority",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);
var blogSchema = new mongoose.Schema({
  title: String,
  desc: String,
  src: String,
  createdOn: { type: Date, default: Date.now },
});

var Blog = mongoose.model("Blog", blogSchema);

app.get("/", function (req, res) {
  res.redirect("/blogs");
});

app.get("/blogs", function (req, res) {
  Blog.find({}, function (err, blogData) {
    if (err) {
      console.log(err);
    } else {
      res.render("index", { blogData: blogData });
    }
  });
});

app.post("/blogs", function (req, res) {
  var title = req.body.newBlogTitle;
  var src = req.body.newBlogThumbnailSrc;
  if (src === "") {
    src = src.replace(
      "",
      "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60"
    );
  }
  var desc = req.sanitize(req.body.newBlogDesc);

  Blog.create(
    {
      title: title,
      src: src,
      desc: desc,
    },
    function (err, newBlogEntry) {
      if (err) {
        console.log(err);
      } else {
        res.redirect("/blogs");
      }
    }
  );
});

app.get("/blogs/new", function (req, res) {
  res.render("new");
});

app.get("/blogs/:id", function (req, res) {
  var id = req.params.id;
  Blog.findById(id, function (err, returnedBlog) {
    if (err) {
      console.log(err);
    } else {
      res.render("show", { returnedBlog: returnedBlog });
    }
  });
});

app.get("/blogs/:id/edit", function (req, res) {
  var id = req.params.id;
  Blog.findById(id, function (err, returnedBlog) {
    if (err) {
      console.log(err);
    } else {
      res.render("edit", { returnedBlog: returnedBlog });
    }
  });
});

app.put("/blogs/:id", function (req, res) {
  var title = req.body.newBlogTitle;
  var src = req.body.newBlogThumbnailSrc;
  var desc = req.sanitize(req.body.newBlogDesc);
  var updatedBlog = {
    title: title,
    src: src,
    desc: desc,
  };

  Blog.findByIdAndUpdate(req.params.id, updatedBlog, function (
    err,
    updatedBlogReturned
  ) {
    if (err) {
      console.log(err);
      res.redirect("/blogs");
    } else {
      res.redirect("/blogs/" + req.params.id);
      console.log(updatedBlogReturned);
    }
  });
});

app.delete("/blogs/:id", function (req, res) {
  Blog.findByIdAndDelete(req.params.id, function (err) {
    if (err) {
      console.log(err);
      res.redirect("/blogs");
    } else {
      res.redirect("/blogs");
    }
  });
});
