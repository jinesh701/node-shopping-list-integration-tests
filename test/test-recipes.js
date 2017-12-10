const chai = require("chai");
const chaiHttp = require("chai-http");

const { app, runServer, closeServer } = require("../server");

const should = chai.should();

chai.use(chaiHttp);

describe("Recipes", function() {
  before(function() {
    return runServer();
  });

  after(function() {
    return closeServer();
  });

  it(`Should list recipes on GET`, function() {
    return chai
      .request(app)
      .get("/recipes")
      .then(function(res) {
        res.should.have.status(200);
        res.should.be.json;
        res.body.should.be.a("array");

        res.body.length.should.be.at.least(1);

        const expectedKeys = ["id", "name", "ingredients"];
        res.body.forEach(function(item) {
          item.should.be.a("object");
          item.should.include.keys(expectedKeys);
        });
      });
  });

  it(`Should add a recipe on POST`, function() {
    const newRecipe = {
      name: "Pancakes",
      ingredients: [
        "1 cup of flour",
        "1 egg",
        "1 cup of milk",
        "2 tbsp of white sugar"
      ]
    };
    return chai
      .request(app)
      .post("/recipes")
      .send(newRecipe)
      .then(function(res) {
        res.should.have.status(201);
        res.should.be.json;
        res.body.should.be.a("object");
        res.body.should.include.keys("id", "name", "ingredients");
        res.body.id.should.not.be.null;
        res.body.should.deep.equal(
          Object.assign(newRecipe, { id: res.body.id })
        );
      });
  });

  it(`Should update items on PUT`, function() {
    updateData = {
      name: "White rice",
      ingredients: [
        "2 cups of long-grain white rice",
        "1 tbsp unsalted butter",
        "1 tsp salt"
      ]
    };
    return chai
      .request(app)
      .get("/recipes")
      .then(function(res) {
        updateData.id = res.body[0].id;
        return chai
          .request(app)
          .put(`/recipes/${updateData.id}`)
          .send(updateData);
      })
      .then(function(res) {
        res.should.have.status(204);
      });
  });

  it(`Should delete recipes on DELETE`, function() {
    return chai
      .request(app)
      .get("/recipes")
      .then(function(res) {
        return chai.request(app).delete(`/recipes/${res.body[0].id}`);
      })
      .then(function(res) {
        res.should.have.status(204);
      });
  });
});
