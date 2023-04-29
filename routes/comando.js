const express = require('express')
const app = express()
const client = require("../models/connection");
const client_envio = require("../models/recepcaonabd");
const {compileTrust} = require("express/lib/utils");

const updateluz = (request, response) => {
    try {

        const cmd = request.body
        const query = 'SELECT dispositivos.dispositivo_id FROM onspot.dispositivos ' +
            'inner join onspot.estacionamento_dispositivos on dispositivos.dispositivo_id =  estacionamento_dispositivos.dispositivo_id ' +
            'inner join onspot.estacionamento on estacionamento_dispositivos.estacionamento_id =  estacionamento.estacionamento_id ' +
            'inner join onspot.reserva_estacionamento on estacionamento.estacionamento_id = reserva_estacionamento.estacionamento_id ' +
            'inner join onspot.reserva on reserva_estacionamento.reservas_id = reserva.reserva_id ' +
            'inner join onspot.utilizador_reserva on  reserva.reserva_id = utilizador_reserva.reserva_id ' +
            'inner join onspot.utilizador on utilizador_reserva.utilizador_id = utilizador.utilizador_id ' +
            'where utilizador_email = "' + cmd.email.toString() + '" and utilizador_pass="' + cmd.pass.toString() + '"and estacionamento.estacionamento_id=' + cmd.estid.toString() + ' ';

        client.query(query, (error, results) => {
            const aa = JSON.stringify(results);
            const bb = JSON.parse(aa)


            if(aa.localeCompare("[]") != 0) {
                if (error) {
                    throw error
                }
                const id = parseInt(bb[0].dispositivo_id);
                console.log(id)
                const up = 'UPDATE onspot.dispositivos SET dispositivos.estado_luz = IF(dispositivos.estado_luz = 0, 1, 0) ' +
                    'WHERE dispositivo_id = ' + id + ' ';

                client_envio.query(up, (error, results3) => {
                    if (error) {
                        throw error
                    }
                    response.status(200).json(results3)
                })
            }
        })
    }
    catch (e) {
        console.log(e);
        response.status(200).json("error")
    }
    finally {
        console.log("success");
    }
}

const updateportao = (request, response) => {
    try {

        const cmd = request.body
        const query = 'SELECT dispositivos.dispositivo_id FROM onspot.dispositivos ' +
        'inner join onspot.estacionamento_dispositivos on dispositivos.dispositivo_id =  estacionamento_dispositivos.dispositivo_id ' +
        'inner join onspot.estacionamento on estacionamento_dispositivos.estacionamento_id =  estacionamento.estacionamento_id ' +
        'inner join onspot.reserva_estacionamento on estacionamento.estacionamento_id = reserva_estacionamento.estacionamento_id ' +
        'inner join onspot.reserva on reserva_estacionamento.reservas_id = reserva.reserva_id ' +
        'inner join onspot.utilizador_reserva on  reserva.reserva_id = utilizador_reserva.reserva_id ' +
        'inner join onspot.utilizador on utilizador_reserva.utilizador_id = utilizador.utilizador_id ' +
        'where utilizador_email = "' + cmd.email.toString() + '" and utilizador_pass="' + cmd.pass.toString() + '"and estacionamento.estacionamento_id=' + cmd.estid.toString() + ' ';

        client.query(query, (error, results) => {
            const aa = JSON.stringify(results);
            const bb = JSON.parse(aa)


            if(aa.localeCompare("[]") != 0) {
                if (error) {
                    throw error
                }
                const id = parseInt(bb[0].dispositivo_id);
                console.log(id)
                const up = 'UPDATE onspot.dispositivos SET dispositivos.estado_entrada = IF(dispositivos.estado_entrada = 0, 1, 0) ' +
                    'WHERE dispositivo_id = ' + id + ' ';

                    client_envio.query(up, (error, results3) => {
                        if (error) {
                            throw error
                        }
                        response.status(200).json(results3)
                    })
                }
            })
    }
    catch (e) {
        console.log(e);
        response.status(200).json("error")
    }
    finally {
        console.log("success");
    }
}

module.exports = {
    updateluz,
    updateportao

}