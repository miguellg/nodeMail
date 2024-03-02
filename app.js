var nodemailer = require('nodemailer');
const fs = require('fs');
const fsPromises = require('fs').promises;
const gdrive = require("./gdrive");

require('dotenv').config();

function sendMail(info, file){
	var remetente = nodemailer.createTransport({
		service: 'gmail',
		auth: {
			user: process.env.MAILUSER,
			pass: process.env.MAILPASS
		}
	});
	
	let hoje = file.substring(7,17)
	let link = process.env.SITE+'/'+info.cliente+'/'+file

	var email = {
		from: process.env.FROM,
		to: info.destino,
		subject: 'Backup Sistema',
		html: '<br>Backup do sistema '+info.cliente+' realizado em '+hoje+'<br> <a href="'+link+'">Download Backup</a><br><br>Esse backup fica disponível por 7 dias',
		//attachments: [{
		//	filename: file,
		//	path: info.path+'/'+file
		//}]
	};

	remetente.sendMail(email, function(error){
		if (error) {
	        	console.log(error);
		} else {
			console.log('Email enviado com sucesso.');
		}
	});
	
	var data = new Date();
	if(data.getDay() == 0){
		gdrive.imageUpload(file, info.path+'/'+file, (id) => {
			console.log(id);
		});
	}
}

async function getBkp(info){	
	let files = await fsPromises.readdir(info.path)
	
	sendMail(info, files.pop())
}
console.log(process.env.PATH_CONFIG+"/config.json");
fs.readFile(process.env.PATH_CONFIG+"/config.json" , "utf8", function(err, data){
	let json = JSON.parse(data)
	console.log('teste');
	for(let i in json){
		json[i].cliente = i
		getBkp(json[i])
	}
})
