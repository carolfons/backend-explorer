const {Router} = require("express")
const NotesController = require('../controllers/NotesController');

const notesRoutes = Router();

const notesController = new  NotesController();

//método POST para criar um usuário
notesRoutes.post("/:user_id", notesController.create);

module.exports = notesRoutes;