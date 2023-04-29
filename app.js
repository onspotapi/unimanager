const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');


const app = express();


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

const indexRouter = require('./routes/index');



//utilizador
const utilizador = require('./routes/utilizador');
app.get('/utilizador',utilizador.getutilizador)//done
app.post('/login',utilizador.login)//done
app.post('/registar',utilizador.createutilizador)//done
app.post('/delete',utilizador.userdelete)//done
app.post('/updateuser',utilizador.updateuser)//done
app.post('/createfav',utilizador.createfav)//done
app.post('/deletefav',utilizador.deletefav)
app.post('/estfav',utilizador.estfav)//done
app.post('/seegaragem',utilizador.seegaragem)//done
app.post('/perfil',utilizador.perfilutilizador)
app.post('/ativas',utilizador.reservasativas)
app.post('/expirada',utilizador.reservasexpiradas)
app.post('/createest',utilizador.createestacionamento)//done
app.post('/estdelete',utilizador.estdelete)//done
app.post('/updateest',utilizador.updateestacionamento)//done
app.post('/updaterate',utilizador.updaterate)//done

//Estacionamento
const estacionamento = require("./routes/estacionamento");
app.get('/estacionamento',estacionamento.getestacionamento)
app.get('/dispgaragens',estacionamento.dispgaragens)
app.post('/detalhes',estacionamento.detalhesgaragem)//done
app.post('/rateest',estacionamento.rategaragem)
app.post('/carest',estacionamento.caracteristicas_estacionamento)
app.post('/updatecar',estacionamento.updatecaracteristicas)



//Reserva
const reserva = require("./routes/reserva");
app.post('/reserva',reserva.getreserva)//done
app.get('/estres',reserva.estacionamento_reserva)
app.post('/createreserva',reserva.createreserva)//done
app.post('/reservadelete',reserva.reservadelete)//done

//comando
const comando = require("./routes/comando");
app.post('/updateluz',comando.updateluz)//done
app.post('/updateportao',comando.updateportao)




module.exports = app;
