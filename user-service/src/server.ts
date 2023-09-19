import app from "./index";

const port = process.env.PORT || 3219;

app.listen(Number(port), "0.0.0.0", () => {
  console.log(`Server running at http://localhost:${port}`);
});
