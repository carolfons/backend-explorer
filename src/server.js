//utilizando o express
const express = require("express");
const app = express(); // inicializando o express


//Método GET
app.get("/message/:id", function (request, response){
    response.send("Hello World")
});

const PORT = 3333;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});