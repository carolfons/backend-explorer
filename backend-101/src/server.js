const migrationsRun = require("./database/sqlite/migrations")

//adicionando para tratamento de erros
require("express-async-errors");
const AppError = require("./utils/AppError")

//utilizando o express
const express = require("express");

const routes = require("./routes");

migrationsRun();

const app = express(); // inicializando o express
app.use(express.json()); // avisar que a requisição esta recebendo os dados por um json



app.use(routes)

//tratamento de erro na API
app.use((error, request, response, next) => {
    //AppError -> erro do cliente
    if (error instanceof AppError) {
        return response.status(error.statusCode).json({
            status: "error",
            message: error.message
        });
    }
    console.log(error);
    //erro no servidor
    return response.status(500).json({
        status: "error",
        message: "Internal server error"
    })
});


const PORT = 3333;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});