const knex = require('../database/knex');
class NotesController{
    async create(request,response){
        const {title,description,tags,links} = request.body;
        const {user_id} = request.params;

        const {note_id} = await knex("notes").insert({
            title,
            description,
            user_id
        });

        //cria um objeto com os links mandados
        const linksInsert = links.map(link =>{ // percorre cada item que tem e retorna o id
            return{
                note_id,
                url:link
            }
        });

        //insere os links no bd
        await knex("links").insert(linksInsert); 

        const tagsInsert = tags.map(name =>{ // percorre cada item que tem e retorna o id
            return{
                note_id,
                name,
                user_id
            }
        });

        //insere os links no bd
        await knex("tags").insert(tagsInsert); 

        response.json();

    }
}

module.exports = NotesController;