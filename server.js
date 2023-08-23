const express = require('express');
const path = require('path');
const uuid = require('./helpers/uuid');
const notesArray = require('./db/db.json');
const fs = require('fs');
const PORT = process.env.PORT || 4000;

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static('public'));

app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/notes.html'));
});

app.get('/api/notes', (req, res) => res.json(notesArray));

app.get('/api/notes/:id', (req, res) => {
  console.log("hitting api/notes")
    if (req.params.id) {
      console.info(`${req.method} request received to get a single a note`);
      const noteId = req.params.id;
      for (let i = 0; i < notesArray.length; i++) {
        const currentNote = notesArray[i];
        if (currentNote.id === noteId) {
          res.status(200).json(currentNote);
          return;
        }
      }
      res.status(404).send('Note not found');
    } 
  });

  app.delete('/api/notes/:id', (req, res) => {
    console.log("hitting api/notes")
      if (req.params.id) {
        console.info(`${req.method} request received to delete a single a note`);
        for (let i = 0; i < notesArray.length; i++) {
          const currentNote = notesArray[i];
          console.log(notesArray)
          console.log(currentNote)
          notesArray.splice(i, 1)
      const notesString = JSON.stringify(notesArray);

      fs.writeFile(`./db/db.json`, notesString, (err) =>
      err
        ? console.error(err)
        : console.log(
            `Note: ${currentNote.title} has been deleted from JSON file`
          )
    );
            return;
        }
        res.status(404).send('Note not found');
      } 
    });

app.post('/api/notes', (req, res) => {
    // Log that a POST request was received
    console.info(`${req.method} request received to add a note`);
  
    // Destructuring assignment for the items in req.body
    const { title, text } = req.body;
  
    // If all the required properties are present
    if (title && text) {
      // Variable for the object we will save
      const newNote = {
        title,
        text,
        id: uuid(),
      };
      // Persisting Data
      notesArray.push(newNote);
      const notesString = JSON.stringify(notesArray);

      fs.writeFile(`./db/db.json`, notesString, (err) =>
      err
        ? console.error(err)
        : console.log(
            `Note: ${newNote.title} has been written to JSON file`
          )
    );

      const response = {
        status: 'success',
        body: newNote,
      };
  
      console.log(response);
      res.status(201).json(response);
    } else {
      res.status(500).json('Error in posting note');
    }
  });

app.listen(PORT, () => {
  console.log(`Example app listening at http://localhost:${PORT}`);
});
