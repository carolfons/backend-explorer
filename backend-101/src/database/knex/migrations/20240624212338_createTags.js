
exports.up = knex => knex.schema.createTable("tags", table =>{
    table.increments("id");
    table.text("name").notNullable;

    table.integer("note_id").references("id").inTable("notes").onDelete("CASCADE"); // FAZ REFERENCIA COM A TABELA NOTES E CASO A NOTA SEJA DELETADA, AS TAGS VINCULADAS TBM SÃO
    table.integer("user_id").references("id").inTable("users"); // user id faz referencia ao id na tabela de usuários. precisa existir um usuário para ser criada uma nota

});

exports.down = knex => knex.schema.dropTable("tags");
