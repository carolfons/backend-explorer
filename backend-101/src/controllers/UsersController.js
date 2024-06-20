const {hash} = require('bcryptjs') // criptografia da senha
const AppError = require('../utils/AppError');

const sqliteConnection = require("../database/sqlite");

class UsersController{
    //a classe permite que se tenha várias funções e acesse várias funções tbm

    /**
     * index -> método GET para listar vários registros
     * show -> GET para exibir um registro específico
     * create -> POST criar um registro
     * update -> PUT atualizar um registro
     * delete -> DELETE para remover um registro
     */

//criando um usuário
    async create(request,response){
        const {name,email,password} = request.body;
        //criando a conexão com o banco de dados
        const database = await sqliteConnection();

        //verificar se o email do usuário ja existe
        const checkUserExists = await database.get("SELECT * FROM users WHERE email = (?)", [email]) // retorna todos os usuários do bd que possuem o email enviado
        //validação 
        if(checkUserExists){
            throw new AppError("Email already registered");
        }
        //criptografando a senha do usuário
        const hashedPassword = await hash(password,8);
        //inserindo os dados do usuário (criando um usuário)
        await database.run("INSERT INTO users  (name, email, password) VALUES (?,?,?)", 
            [name,email,hashedPassword] //enviando a senha criptografada
        );

        return response.status(201).json()

      
    }

}

module.exports = UsersController;