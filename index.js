import express from "express";
import bodyParser from "body-parser";
//Step 1 import PG
import pg from "pg";

const app = express();
const port = 3000;

//Step 2 connect Database and make connection
const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "Permalist", //created new database
  password: "189477",
  port: 5432,
});
db.connect();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

//this could be empty
let items = [
  { id: 1, title: "Buy milk" },
  { id: 2, title: "Finish homework" },
];

app.get("/", async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM items ORDER BY id ASC");
    items = result.rows; //setting items array to what we get from results

    res.render("index.ejs", {
      listTitle: "Today",
      listItems: items, 
    });
  } catch (err) {
    console.log(err);
  }
});

app.post("/add", async (req, res) => {
  const item = req.body.newItem; //what user typed in
  // items.push({title: item});
  try {
    await db.query("INSERT INTO items (title) VALUES ($1)", [item]);
    res.redirect("/"); //once we redirect it acts as server received home route command
  } catch (err) {
    console.log(err);
  }
});

app.post("/edit", async (req, res) => {
  const item = req.body.updatedItemTitle;
  const id = req.body.updatedItemId;

  try {
    await db.query("UPDATE items SET title = ($1) WHERE id = $2", [item, id]);
    res.redirect("/");
  } catch (err) {
    console.log(err);
  }
});

app.post("/delete", async (req, res) => {
  const id = req.body.deleteItemId;
  try {
    await db.query("DELETE FROM items WHERE id = $1", [id]);
    res.redirect("/");
  } catch (err) {
    console.log(err);
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
