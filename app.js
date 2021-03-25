var nodemailer = require('nodemailer');
require('dotenv').config();

var remetente = nodemailer.createTransport({
	service: 'gmail',
	auth: {
		user: process.env.MAILUSER,
		pass: process.env.MAILPASS
	}
});

let data = new Date();
let hoje = data.getDate()+'/'+(data.getMonth()+1).toString().padStart(2,'0')+'/'+data.getFullYear()

var email = {
	from: process.env.FROM,
	to: process.env.DEST,
	subject: 'Backup Sistema',
	text: 'Backup do sistema realizado em '+hoje,
	attachments: [{
  		filename: 'backup-'+(data.getFullYear()+((data.getMonth()+1).toString().padStart(2,'0'))+data.getDate())+'.sql',
		path: '/caminho/arquivo.txt'
	}]
};

remetente.sendMail(email, function(error){
	if (error) {
        	console.log(error);
	} else {
		console.log('Email enviado com sucesso.');
	}
});	
