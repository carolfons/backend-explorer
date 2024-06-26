const knex = require('../database/knex');
class NotesController{
    async create(request,response){
        const {title,description,tags,links} = request.body;
        const {user_id} = request.params;

        const [note_id] = await knex("notes").insert({
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


    async show(request, response) {
        const { id } = request.params
    
        const note = await knex("notes").where({ id }).first()
        const tags = await knex("tags").where({ note_id: id }).orderBy("name")
        const links = await knex("links").where({ note_id: id }).orderBy("created_at")
    
        return response.json({
          ...note,
          tags,
          links
        })
      }
}

module.exports = NotesController;