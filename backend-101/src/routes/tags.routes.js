const {Router} = require("express")
const TagsController = require('../controllers/TagsController');

const tagsRoutes = Router();

const tagsController = new  TagsController();
//método GET para listar tags
tagsRoutes.get("/:user_id",tagsController.index)


module.exports = tagsRoutes;