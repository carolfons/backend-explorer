const {Router} = require("express")
const NotesController = require('../controllers/NotesController');

const notesRoutes = Router();

const notesController = new  NotesController();

//método POST para criar uma nota
notesRoutes.post("/:user_id", notesController.create);
// método get para mostrar as notas
notesRoutes.get("/:id", notesController.show);
//método delete para apagar uma nota
notesRoutes.delete("/:id",notesController.delete)

module.exports = notesRoutes;