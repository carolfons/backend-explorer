//utilizando o express
const express = require("express");
const app = express(); // inicializando o express


//Método GET
app.get("/message/:id/:user", function (request, response){
    //route params
    //params => utilizados para dados simples
    const {id, user} = request.params;
    response.send(`Mensagem ID: ${id}.
        Para o usuário: ${user}`)
});

const PORT = 3333;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});