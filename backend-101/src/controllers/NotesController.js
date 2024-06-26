const knex = require('../database/knex');
class NotesController{
    //creating notes
    async create(request,response){
        const {title,description,tags,links} = request.body;
        const {user_id} = request.params;

        //inserir uma nova nota na tabela notes e recuperar o ID da nota recém-criada, armazenando esse ID na variável note_id.
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

    //show notes
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

      //deleting notes
    async delete(request,response){
        const {id} = request.params;
        await knex("notes").where({id}).delete()
        return response.json()

    }

    //listing notes
    async index(request,response){
        const {title,user_id,tags} = request.query;

        let notes;

        if(tags){
            // converting text in array 
            const filterTags = tags.split(',').map(tag=>tag.trim()) // "nodejs,express" => ['nodejs','express]
            notes = await knex("tags")
            .select([ // select fields from the table
                "notes.id",
                "notes.title",
                "notes.user_id"
            ])
            .where("notes.user_id", user_id)//filter by user_id
            .whereLike("notes.title", `%${title}%`) // wherelike finds key words
            .whereIn("name",filterTags) // compare tag name with the array
            .innerJoin("notes","notes.id","tags.note_id") // connecting table notes and tags
            .orderBy("notes.title")

        }else{
            notes = await knex("notes")
           .where({user_id})
           .whereLike("title", `%${title}%`) // search the word in notes before or after
           .orderBy("title");
    
        }

        const userTags = await knex("tags").where({user_id}); // tag equals the user_id
        const notesWithTags = notes.map(note=>{
            const noteTags = userTags.filter(tag => tag.note_id === note.id);
            return{
                ...note,
                tags: noteTags
            }
        })
        
        return response.json(notesWithTags)
    }
}

module.exports = NotesController;