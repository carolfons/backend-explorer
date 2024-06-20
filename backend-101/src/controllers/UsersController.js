const { hash } = require("bcryptjs"); // criptografia da senha
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
    const { name, email } = request.body; // pegando nome e email do body
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

    user.name = name; // UPDATE NOVO NOME
    user.email = email; // UPDATE NOVO EMAIL

    //UPDATE no banco de dados
    await database.run(
            `UPDATE users SET
            name = ?,
            email = ?,
            updated_at = ?
            WHERE id = ? `,
      [user.name, user.email, new Date(), id]
    );
    return response.status(200).json();
  }
}

module.exports = UsersController;
