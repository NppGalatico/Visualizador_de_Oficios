const { application } = require('express');
var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
const path = require("path");
mongoose.connect("mongodb://localhost:27017/Oficio", { useNewUrlParser: true });

const multer = require("multer");

const storage = multer.diskStorage({

	destination: function(req, file, cb){
		cb(null, "uploads/");
	},
	filename: function(req, file, cb){

		cb(null, file.originalname + Date.now() + path.extname(file.originalname));

	}

});

const upload = multer({storage});



var Schema = mongoose.Schema;

// Define Database Schema
var TaskSchema = new Schema({
	data: {type: Date, default: Date.now},
	oficio: {type: String},
	dataoficio: {type: String},
	description: {type: String},
	destiny: {type: String},
	process: {type: String},
	vereador1: {type: String},
	status: {type: Boolean},
	observation: {type: String},
	arquivo: {type: [String]}

}, {collection: 'tasks'});


var Model = mongoose.Schema;

var IndicaSchema = new Model ( {
	sessao: {type: String},
	description1: {type: String},
	status1: {type: Boolean},
	data1: {type: Date, default: Date.now},
	destiny1: {type: String},
	process1: {type: String},
	observation1: {type: String},
	indication: {type: String},
	vereador: {type: String},
	arquivo1: {type: [String]}

}, {collection: 'model'});



// Define Schema Object
var Task = mongoose.model('Task', TaskSchema);

// Define Schema Object
var Flask = mongoose.model('Flask', IndicaSchema);


/* GET Tasks page. */
router.get('/', function(req, res, next) {
	Task.find().sort({_id: -1})
	.then(function(docs) {
		res.render('tasks/index', {tasks: docs})

	})
});

router.get('/indication', function(req, res, next) {
	Flask.find().sort({_id: -1})
	.then(function(docs1) {
		res.render('tasks/index1', {model: docs1})

	})
});
/* GET Task Single page. */
router.get('/view/id', function(req, res, next) {

	Task.findById(id)
	.then(function(docs) {
		res.render('tasks/show', {task: docs})

	})
});

router.get('/view/ip', function(req, res, next) {

	Flask.findById(id)
	.then(function(docs1) {
		res.render('tasks/show1', {model: docs1})

	})
});




/* GET Task Single page. */
router.get('/add', function(req, res, next) {
	res.render('tasks/create', {title: "Gereciador de Oficios", success: req.session.success, errors: req.session.errors});
});

router.get('/add1', function(req, res, next) {
	res.render('tasks/create1', {title1: "Gereciador de Oficios", success1: req.session.success1, errors1: req.session.errors1});
});


/* Post Task Single page. */
router.post('/store', upload.single('xs'), function(req, res, next) {

	req.check('status', "Please give status for task").notEmpty();

	var errors = req.validationErrors();
	if (errors) {
		req.session.errors = errors;
		req.session.success = false;
		res.redirect('/add');
	}else {
		req.session.success = true;

		var task = 
		{
			'data' : req.body.data,
			'oficio': req.body.oficio1,
			'dataoficio': req.body.dataoficio,
			'description': req.body.description,
			'destiny': req.body.destiny,
			'process': req.body.process,
			'vereador1':req.body.vereador1,
			'status': req.body.status,
			'observation': req.body.observation,
			'arquivo' : original(req.file)


			
		};

		var task = new Task(task);
		task.save();res.redirect('/');
	}

});



router.post('/store1',upload.single('file'), function(req, res, next) {

	

	var errors = req.validationErrors();
	if (errors) {
		req.session.errors = errors;
		req.session.success = false;
		res.redirect('/add1');
	}else {
		req.session.success = true;

		var flask = 
		{
			'data1' : req.body.data1,
			'sessao': req.body.sessao,
			'description1': req.body.description1,
			'destiny1': req.body.destiny1,
			'process1': req.body.process1,
			'observation1': req.body.observation1,
			'vereador' : req.body.vereador,
			'indication': req.body.indication,
			'status1' : req.body.status1,
			'arquivo1' : original(req.file)

			
		};

		var flask = new Flask(flask);
		flask.save();res.redirect('/indication');
	}

});

 function  original (file) {

	originalName = []

	var exemplo = file["originalname"]

	originalName.push(exemplo)


return(originalName)

}

		router.post('/update', function(req, res, next) {

			var id = req.body.id;
		

		//validate first
		req.check('status', "Please give status for task").notEmpty();

		var errors = req.validationErrors();
		if (errors) {
			req.session.errors = errors;
			req.session.success = false;
			res.redirect('/');
		}else {
			req.session.success = true;
			Task.findById(id, function (err, doc) {
				if (err) {
					console.log('Error To find the docs');
				}else {
					doc.dataoficio = req.body.dataoficio;
					doc.description = req.body.description;
					doc.destiny = req.body.destiny;
					doc.status = req.body.status;
					doc.observation = req.body.observation;
					doc.process = req.body.process;
					doc.vereador1 = req.body.vereador1;
					doc.arquivo = req.body.arquivo;
					
					doc.save();
					res.redirect('/');
				} 
			})
		} 
	});


	router.post('/update1', function(req, res, next) {

		var id = req.body.id;
	

	//validate first
	req.check('status1', "Please give status for task").notEmpty();

	var errors = req.validationErrors();
	if (errors) {
		req.session.errors = errors;
		req.session.success = false;
		res.redirect('/indication');
	}else {
		req.session.success = true;
		Flask.findById(id, function (err, doc) {
			if (err) {
				console.log('Error To find the docs');
			}else {
				
			
				doc.vereador = req.body.vereador;
				doc.sessao = req.body.sessao;
				doc.description1 = req.body.description1;
				doc.destiny1 = req.body.destiny1;
				doc.process1 = req.body.process1;
				doc.status1 = req.body.status1;
				doc.observation1 = req.body.observation1;
				doc.arquivo1 = req.body.arquivo1;
				
				doc.save();
				res.redirect('/indication');
			} 
		})
	} 
});


	
			/* Delete Task */
			router.post('/delete', function(req, res, next) {
				var id = req.body.id;
				
				Task.findByIdAndRemove(id).exec();
			

				res.redirect('/');
			});

			router.post('/delete2', function(req, res, next) {
			
				var id = req.body.id;
			
				Flask.findByIdAndRemove(id).exec();

				res.redirect('/indication');
			});





			module.exports = router;
