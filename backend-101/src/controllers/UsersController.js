const AppError = require('../utils/AppError');
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
    create(request,response){
        const {name,email,password} = request.body;

        if(!name){
            throw new AppError("Nome é Obrigatório")
        }
        response.status(201).json({name,email,password});//receber em formato json

      
    }

}

module.exports = UsersController;