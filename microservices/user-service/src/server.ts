import app from "./index";

const port = process.env.PORT || 3219;
const hostname = "::";

app.listen(port);

app.listen(Number(port), hostname, () => {
  console.log(`Server running at http://localhost:${port}`);
});
