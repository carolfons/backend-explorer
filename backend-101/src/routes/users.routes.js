const {Router} = require("express")
const UsersController = require('../controllers/UsersController');

const usersRoutes = Router();




const usersController = new UsersController();

//método POST
usersRoutes.post("/",usersController.create);

module.exports = usersRoutes;