const express = require('express');
const path = require('path');
const fs = require('fs');

const PORT = process.env.PORT || 3001;

const app = express();

// Middleware for parsing JSON and urlencoded form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static('public'));

// API GET Routes
app.get('/api/notes', (req, res) =>
  fs.readFile(path.join(__dirname, '/db/db.json'), 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      return;
    }
    res.json(JSON.parse(data))
  })
);

// API POST Routes
app.post('/api/notes', (req, res) => {
  const { title, text } = req.body;
  // newNote will be appended to the db.json file as well as returned in the response
  var newNote;

  if (title && text) {
    fs.readFile(path.join(__dirname, '/db/db.json'), 'utf8', (err, data) => {
        if (err) {
          console.error(err);
        } else {
          const parsedData = JSON.parse(data);

          // Determine what ID should be used
          newId = Object.keys(parsedData).length;
          newNote = {
            title,
            text,
            id: newId,
          };
          parsedData.push(newNote);
          fs.writeFile(path.join(__dirname, '/db/db.json'), JSON.stringify(parsedData, null, 4), (err) => {
            if (err) {
                console.error(err);
            }
            }
          );
        }
    });

    const response = {
      status: 'success',
      body: newNote,
    };

    res.json(response);
  } else {
    res.json('Error in adding note');
  }
});

// API DELETE Route
app.delete('/api/notes/:id', (req, res) => {
    fs.readFile(path.join(__dirname, '/db/db.json'), 'utf8', (err, data) => {
        if (err) {
          console.error(err);
        } else {
          // Current db.json file
          const parsedData = JSON.parse(data);
          // Buffer for the new db.json file
          var newData = [];

          // Push every note in parsedData except the deleted one to newData[]
          for(var i=0; i<Object.keys(parsedData).length; i++) {
            if(parsedData[i]["id"] != req.params.id) {
                parsedData[i]["id"] = newData.length;
                newData.push(parsedData[i]);
            }
          }
          
          // Write newData[] to db.json
          fs.writeFile(path.join(__dirname, '/db/db.json'), JSON.stringify(newData, null, 4), (err) => {
            if (err) {
                console.error(err);
            }
            res.send(newData);
            }
          ); 
        }
    });
  });


// HTML GET Routes
app.get('/notes', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/notes.html'))
);
app.get('*', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/index.html'))
);

app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT} 🚀`)
);
