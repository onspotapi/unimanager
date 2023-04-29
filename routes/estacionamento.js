const express = require('express')
const app = express()
const client = require('../models/connection')
const {compileTrust} = require("express/lib/utils");
const client_envio = require("../models/recepcaonabd");
const {query} = require("mssql/lib/global-connection");

//Fazer get all estacionamento
const getestacionamento = (req,res)=>{
  client.query('select * from estacionamento ',(error,results)=>{
    if(error)
    {
      throw error
    }
    res.status(200).json(results)
  })
}

//garagens disponiveis
const dispgaragens = (req,res)=>{
  client.query('SELECT * FROM onspot.estacionamento ' +
      'JOIN (SELECT DISTINCT estacionamento_id FROM onspot.reserva_estacionamento ' +
      'WHERE estacionamento_id NOT IN (SELECT estacionamento_id FROM onspot.reserva_estacionamento ' +
      'INNER JOIN onspot.reserva on reserva_estacionamento.reservas_id = reserva.reserva_id ' +
      'WHERE NOW() BETWEEN hora_de_entrada AND hora_saida)) as estacionamentos_disponiveis ' +
      'ON estacionamentos_disponiveis.estacionamento_id = estacionamento.estacionamento_id ' +
      'JOIN onspot.reserva_estacionamento on estacionamento.estacionamento_id = reserva_estacionamento.estacionamento_id ' +
      'JOIN onspot.reserva ON reserva_estacionamento.reservas_id = reserva.reserva_id ' +
      'group by estacionamento.estacionamento_id; ',(error,results)=>{
    if(error)
    {
      throw error
    }
    res.status(200).json(results)
  })
}


//fazer detalhes da garagem
const detalhesgaragem = (request, response) => {
  const est = request.body
  console.log(est)
  const query = 'SELECT estacionamento_nome,estacionamento_morada,estacionamento_preco,coordenadas,caracteristicas_estac_id,caracteristicas,caracteristicas.caracteristicas_id,estacionamento.numero_de_lugares,utilizador.utilizador_nome,utilizador.utilizador_email,utilizador.utilizador_telefone FROM onspot.estacionamento ' +
      'inner join onspot.caracteristicas_estac on estacionamento.estacionamento_id = caracteristicas_estac.estacionamento_id ' +
      'inner join onspot.caracteristicas on caracteristicas_estac.caracteristicas_id = caracteristicas.caracteristicas_id ' +
      'inner join onspot.utilizador on estacionamento.utilizador_id = utilizador.utilizador_id ' +
      'where estacionamento.estacionamento_id = ' + est.estid.toString() + ' '
  console.log(query)
  client.query(query, (error, results) => {
    if (error) {throw error}
    response.status(201).send(results)
  })
}

const rategaragem = (request, response) => {
  const est = request.body
  console.log(est)
  const query = 'SELECT avg(rate) FROM onspot.reserva ' +
      'inner join onspot.reserva_estacionamento on reserva.reserva_id = reserva_estacionamento.reservas_id ' +
      'inner join onspot.rate on reserva.classificacao_id = rate.classificacao_id ' +
      'where reserva_estacionamento.estacionamento_id = ' + est.estid.toString() + ' '
  console.log(query)
  client.query(query, (error, results) => {
    if (error) {throw error}
    response.status(201).send(results)
  })
}

//Insert de caracteristicas numa garagem

const caracteristicas_estacionamento = (request, response) => {
  const reserv = request.body
  client.query('SELECT estacionamento_id FROM onspot.estacionamento inner join onspot.utilizador on estacionamento.utilizador_id = utilizador.utilizador_id ' +
  'where estacionamento_nome = "'+ reserv.nomeest.toString() +'" and utilizador_email="'+ reserv.email.toString() +'" and utilizador_pass="'+ reserv.pass.toString() +'" ' , (error, results) => {
    const aa = JSON.stringify(results);
    const bb = JSON.parse(aa)

    if (aa.localeCompare("[]") != 0) {

      if (error) {
        throw error
      }

      const id = parseInt(bb[0].estacionamento_id);
      console.log(id)
      const query1 = ' INSERT INTO caracteristicas_estac (caracteristicas_id, estacionamento_id) VALUES (' + reserv.carid.toString() + ', ' + id + ') ';

      client_envio.query(query1, (error, results) => {
        if (error) {
          throw error
        }
        response.status(201).send("lala: ")
      })
    }
  })
}

//update caracteristicas
const updatecaracteristicas = (request, response) => {
  const est = request.body
  client.query('SELECT estacionamento_id FROM onspot.estacionamento inner join onspot.utilizador on estacionamento.utilizador_id = utilizador.utilizador_id ' +
      'where estacionamento_nome = "' + est.nomeest.toString() + '" and utilizador_email = "' + est.email.toString() + '" and utilizador_pass= "' + est.pass.toString() + '" ' , (error, results) => {

    const aa = JSON.stringify(results);
    const bb = JSON.parse(aa)
    if (aa.localeCompare("[]") != 0) {

      if (error) {
        throw error
      }

      const id = parseInt(bb[0].estacionamento_id);
      console.log(id)
      const query1 = ' INSERT INTO caracteristicas_estac ( caracteristicas_id, estacionamento_id) VALUES (' + est.carid.toString() + ',' + id + ') ';

      client_envio.query(query1, (error, results) => {
        if (error) {
          throw error
        }
        response.status(201).send("lala: ")
      })
    }
  })
}




module.exports = {

  getestacionamento,
  dispgaragens,
  detalhesgaragem,
  rategaragem,
  caracteristicas_estacionamento,
  updatecaracteristicas

}