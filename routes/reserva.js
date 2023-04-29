const express = require('express')
const app = express()
const client = require('../models/connection')
const {compileTrust} = require("express/lib/utils");
const client_envio = require("../models/recepcaonabd");


const getreserva = (request, response)=>{
  const reserv = request.body
  client.query('SELECT reserva.reserva_id,estacionamento.estacionamento_id,estacionamento_nome,estacionamento_morada,estacionamento_preco,reserva.hora_de_entrada, reserva.hora_saida FROM onspot.utilizador ' +
      'inner join onspot.utilizador_reserva on utilizador.utilizador_id = utilizador_reserva.utilizador_id ' +
      'inner join onspot.reserva on  utilizador_reserva.reserva_id = reserva.reserva_id ' +
      'inner join onspot.reserva_estacionamento on reserva.reserva_id = reserva_estacionamento.reservas_id ' +
      'inner join onspot.estacionamento on estacionamento.estacionamento_id = reserva_estacionamento.estacionamento_id ' +
      'where utilizador_email = "' + reserv.email.toString() +'" and utilizador_pass= "'+ reserv.pass.toString() +'" ',(error,results)=>{
    if(error)
    {
      throw error
    }
    response.status(200).json(results)
  })
}

const estacionamento_reserva = (request, response)=>{
  client.query('SELECT * FROM onspot.estacionamento ' +
      'right join onspot.reserva_estacionamento on estacionamento.estacionamento_id = reserva_estacionamento.estacionamento_id ' +
      'inner join onspot.reserva on reserva_estacionamento.reservas_id = reserva.reserva_id ',(error,results)=>{
    if(error)
    {
      throw error
    }
    response.status(200).json(results)
  })
}


//criar reserva
const createreserva = (request, response) => {
  const reserv = request.body

  client.query('SELECT utilizador_id FROM onspot.utilizador where utilizador_email="'+ reserv.email.toString() +'" and utilizador_pass="'+reserv.pass.toString()+'"' , (error, results) => {
    const aa = JSON.stringify(results);
    const bb = JSON.parse(aa)

    if (aa.localeCompare("[]") != 0) {
      const id = parseInt(bb[0].utilizador_id);
      const query1 = 'INSERT INTO reserva (hora_de_entrada,hora_saida) VALUES ("' + reserv.entrada.toString() + '","' + reserv.saida.toString() + '") ';
      console.log(query1)
      client_envio.query(query1, (error, results2) => {
        if (error) {
          throw error
        }

        const cc = JSON.parse(JSON.stringify(results2))

        const query2 = 'INSERT INTO onspot.reserva_estacionamento(estacionamento_id, reservas_id) value(' + reserv.est_id.toString() + ', ' + cc.insertId + ') ';
        client_envio.query(query2, (error, results3) => {
          if (error) {
            throw error
          }
          const query3= 'INSERT INTO onspot.utilizador_reserva(utilizador_id, reserva_id) value('+ id +', ' + cc.insertId + ')';
          client_envio.query(query3, (error, results4) => {
            if (error) {
              throw error
            }
          })
        })
      })

    }
    response.status(201).send("Reserva added with ID: ")
  })
}

//DELETE DA RESERVA
const reservadelete = (request, response) => {
  const reserv = request.body
  client.query('SELECT * FROM onspot.utilizador_reserva ' +
      'inner join onspot.reserva on reserva.reserva_id = utilizador_reserva.reserva_id ' +
      'inner join onspot.utilizador on utilizador_reserva.utilizador_id =utilizador.utilizador_id ' +
      'where utilizador_email="'+ reserv.email.toString() +'" and utilizador_pass="'+ reserv.pass.toString() +'" and reserva.reserva_id='+ reserv.resid.toString() +' ' , (error, results) => {
    const aa = JSON.stringify(results);

    if (aa.localeCompare("[]") != 0) {
      const query1 = 'UPDATE  onspot.reserva SET cancelar = true where reserva_id =' + reserv.resid.toString() + ' ';

      client_envio.query(query1, (error, results) => {
        if (error) {
          throw error
        }
        response.status(201).send("reserva deleted with ID: ")
      })
    }
  })
}




module.exports = {

  getreserva,
  estacionamento_reserva,
  createreserva,
  reservadelete

}
