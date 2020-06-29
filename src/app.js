const express = require("express");
const cors = require("cors");
const { uuid, isUuid} = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

function validateProjectID(request, response, next){
  const { id } = request.params.app;
  if(!isUuid(id)) {
      return response.status(400).json({ error: 'invalid project ID.' });
  }
  return next();
}

app.get("/repositories", (request, response) => {
  const query = request.query;

  return response.json( repositories );

});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body;

  const repositorie = {id: uuid(), title: title, url: url,  techs: techs, likes: 0};

  repositories.push(repositorie);

  return response.json(repositorie);


});

app.put("/repositories/:id", (request, response) => {
  const { id } = request.params;

  const repositorieIndex = repositories.findIndex(repositorie => repositorie.id == id);

  if(repositorieIndex < 0){
    return response.status(400).json({ error: 'Repositorie not found.' });
  }
  else{
    const { title, url, techs } = request.body;
    repositories[repositorieIndex].title = title;
    repositories[repositorieIndex].url = url;
    repositories[repositorieIndex].techs = techs;
    return response.json( repositories[repositorieIndex] );
  }

});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params;
  const repositorieIndex = repositories.findIndex(repositorie => repositorie.id == id);
  if(repositorieIndex < 0){
    return response.status(400).json({ error: 'Repositorie not found.' });
  }
  else{
    repositories.splice(repositorieIndex, 1)
    return response.status(204).send();
  }
});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;

  const repositorieIndex = repositories.findIndex(repositorie => repositorie.id == id);

  if(repositorieIndex < 0){
    return response.status(400).json({ error: 'Repositorie not found.' });
  }
  else{
    repositories[repositorieIndex].likes += 1;
    return response.json( repositories[repositorieIndex] );
  }
});

module.exports = app;
