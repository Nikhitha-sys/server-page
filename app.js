const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3000;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
  secret: 'secret-key',
  resave: false,
  saveUninitialized: true
}));
app.set('view engine', 'ejs');

// Dummy user
const USER = {
  username: 'user',
  password: 'pass',
  name: 'John Doe',
  email: 'john@example.com'
};

// Routes
app.get('/', (req, res) => {
  res.render('login', { error: null });
});

app.post('/login', (req, res) => {
  const { username, password } = req.body;
  if (username === USER.username && password === USER.password) {
    req.session.user = USER;
    res.redirect('/home');
  } else {
    res.render('login', { error: 'Invalid credentials' });
  }
});

app.get('/home', (req, res) => {
  if (!req.session.user) return res.redirect('/');
  res.render('home', { user: req.session.user });
});

app.get('/profile', (req, res) => {
  if (!req.session.user) return res.redirect('/');
  res.render('profile', { user: req.session.user });
});

app.get('/logout', (req, res) => {
  req.session.destroy(() => res.redirect('/'));
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});