
exports.up = knex => knex.schema.createTable("notes", table =>{
    table.increments("id");
    table.text("title");
    table.text("description");
    table.integer("user_id").references("id").inTable("users"); // user id faz referencia ao id na tabela de usuários. precisa existir um usuário para ser criada uma nota
    table.timestamp("created_at").default(knex.fn.now());
    table.timestamp("updated_at").default(knex.fn.now());
});

exports.down = knex => knex.schema.dropTable("notes");
