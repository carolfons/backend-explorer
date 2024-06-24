
exports.up = knex => knex.schema.createTable("links", table =>{
    table.increments("id");
    table.text("url").notNullable;

    table.integer("note_id").references("id").inTable("notes").onDelete("CASCADE"); // FAZ REFERENCIA COM A TABELA NOTES E CASO A NOTA SEJA DELETADA, AS TAGS VINCULADAS TBM SÃO
    table.timestamp("created_at").default(knex.fn.now());
});

exports.down = knex => knex.schema.dropTable("links");
