const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

const fs = require('fs');

// Routes
app.get('/notes', function(req, res) {
  res.sendFile(path.join(__dirname, 'public/notes.html'));
});

app.get('/api/notes', function(req, res) {
	res.sendFile(path.join(__dirname, 'db/db.json'));
});

app.get('/api/notes/:id', function(req, res) {
	let db = JSON.parse(fs.readFileSync('db/db.json', 'utf8'));
	res.json(db[Number(req.params.id)]);
});

app.get('*', function(req, res) {
  res.sendFile(path.join(__dirname, 'public/index.html'));
});

app.post('/api/notes', function(req, res) {
	let db = JSON.parse(fs.readFileSync('db/db.json', 'utf8'));
	let note = req.body;
	let noteId = (db.length).toString();
	
	note.id = noteId;
	db.push(note);
	
	fs.writeFileSync('db/db.json', JSON.stringify(db));
	res.json(db);
});

app.delete('/api/notes/:id', function(req, res) {
	let db = JSON.parse(fs.readFileSync('db/db.json', 'utf8'));
	let noteId = req.params.id;
	let newId = 0;
	
	db = db.filter(note => {
		return note.id != noteId;
	});
	
	for (note of db) {
		note.id = newId.toString();
		newId++;
	}
	
	fs.writeFileSync('db/db.json', JSON.stringify(db));
	res.json(db);
});

app.listen(PORT, function() {
  console.log('App listening on PORT ' + PORT);
});
