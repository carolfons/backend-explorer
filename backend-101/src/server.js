//utilizando o express
const express = require("express");

const routes = require("./routes");

const app = express(); // inicializando o express
app.use(express.json()); // avisar que a requisição esta recebendo os dados por um json

app.use(routes)


const PORT = 3333;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});