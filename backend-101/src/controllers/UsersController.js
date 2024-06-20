const { hash,compare } = require("bcryptjs"); // criptografia da senha
const AppError = require("../utils/AppError");

const sqliteConnection = require("../database/sqlite");

class UsersController {
  //a classe permite que se tenha várias funções e acesse várias funções tbm

  /**
   * index -> método GET para listar vários registros
   * show -> GET para exibir um registro específico
   * create -> POST criar um registro
   * update -> PUT atualizar um registro
   * delete -> DELETE para remover um registro
   */

  //criando um usuário - POST users
  async create(request, response) {
    const { name, email, password } = request.body;
    //criando a conexão com o banco de dados
    const database = await sqliteConnection();

    //verificar se o email do usuário ja existe
    const checkUserExists = await database.get(
      "SELECT * FROM users WHERE email = (?)",
      [email]
    ); // retorna todos os usuários do bd que possuem o email enviado
    //validação
    if (checkUserExists) {
      throw new AppError("Email already registered");
    }
    //criptografando a senha do usuário
    const hashedPassword = await hash(password, 8);
    //inserindo os dados do usuário (criando um usuário)
    await database.run(
      "INSERT INTO users  (name, email, password) VALUES (?,?,?)",
      [name, email, hashedPassword] //enviando a senha criptografada
    );

    return response.status(201).json();
  }

  async update(request, response) {
    const { name, email, password, old_password } = request.body; // pegando nome e email do body
    const { id } = request.params; // selecionando o id do usuario

    const database = await sqliteConnection(); // conectando com o banco de dados
    // pesquisa o usuário com o id fornecido
    const user = await database.get("SELECT * FROM users WHERE id = (?)", [id]);
    //validação se o usuário existe
    if (!user) {
      throw new AppError("User not found");
    }
    // pesquisa o usuário com o email fornecido
    const userWithUpdatedEmail = await database.get(
      "SELECT * FROM users WHERE email = (?)",
      [email]
    );
    //verifica se o novo email cadastrado ja esta em uso e se o email ja é meu
    if (userWithUpdatedEmail && userWithUpdatedEmail.id !== user.id) {
      throw new AppError("Email already in use!");
    }

    user.name = name ?? user.name; // UPDATE NOVO NOME caso não seja enviado novo nome ou email ele mantém o antigo
    user.email = email?? user.email; // UPDATE NOVO EMAIL

    //verificação se a pessoa digitou a senha antiga e a atual
    if(password && !old_password){
      throw new AppError("You need to inform the older password")
    }

    if(password && old_password){
      const checkOldPassword = await compare (old_password, user.password) // comapara as senhas antigas com o metodo compare do bcryptjs
      //se a senha não bater
      if(!checkOldPassword){
        throw new AppError ("Wrong old password")
      }

      user.password = await hash(password,8)
    }

    //UPDATE no banco de dados
    await database.run(
            `UPDATE users SET
            name = ?,
            email = ?,
            password = ?,
            updated_at = DATETIME('now')
            WHERE id = ? `,
      [user.name, user.email, user.password, id]
    );
    return response.status(200).json();
  }
}

module.exports = UsersController;
