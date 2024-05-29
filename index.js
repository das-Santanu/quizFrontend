const express = require('express');
const req = require('express/lib/request');
const path = require('path')
const dotenv = require('dotenv')
const app = express();
dotenv.config()
const port = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, 'public')))
  .set('views', path.join(__dirname, 'views'))
  .set('view engine', 'ejs');

// Middleware to store visited routes in session
  const storeVisitedRoutes = (req, res, next) => {
    if (!req.session.visitedRoutes) {
      req.session.visitedRoutes = [];
    }
    req.session.visitedRoutes.push(req.path);
    next();
  };
  
const checkRoutesSequence = (req, res, next) => {
  if (req.session.visitedRoutes) {
    const previousRoute = req.session.visitedRoutes[req.session.visitedRoutes.length - 1];
    const currentRoute = req.path;

    if (
      (previousRoute === '/' && currentRoute === '/category') ||
      (previousRoute === '/category' && currentRoute === '/quiz')
    ) {
      next();
    } else {
      res.redirect(previousRoute);
    }
  } else {
    res.redirect('/');
  }
};






app.get('/', (req, res) => {
  res.render('Home', {
    title: 'Home'
  });
});
app.get('/login', (req, res) => {
  res.render('Login', {
    title: 'Login'
  })
})
app.get('/category', (req, res) => {
  res.render('Category', {
    title: 'Category'
  })
})
app.get('/quiz', (req, res) => {
  res.render('Question', {
    title: 'Question'
  })
})

app.listen(port, () => {
  console.log(`Listening on http://localhost:${port}`);
})