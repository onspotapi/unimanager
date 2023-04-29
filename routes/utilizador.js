const express = require('express')
const app = express()
const client = require('../models/connection')
const client_envio = require('../models/recepcaonabd')
const {compileTrust} = require("express/lib/utils");

const getutilizador = (req,res)=>{
    client.query('select * from utilizador ',(error,results)=>{
        if(error)
        {
            throw error
        }
        res.status(200).json(results)
    })
}



const login= (request, response) => {
    const users = request.body
    try {
    console.log("user:  "+JSON.stringify(users))

    client.query('select utilizador_nome,utilizador_email from utilizador ' +
        'where utilizador_email = "' + users.email.toString() + '" and utilizador_pass = "'+users.pass.toString()+'" ' , (error, results) => {
        if (error) {
            throw error
        }
        response.status(200).json(results)
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


const createutilizador = (request, response) => {
     const users = request.body
    console.log(users)
    const query = 'INSERT INTO utilizador (utilizador_nome,utilizador_genero, utilizador_email,utilizador_pass,utilizador_telefone,utilizador_morada,utilizador_codigo_postal,utilizador_porta,utilizador_datanasc) VALUES ("' + users.nome.toString() + '","' + users.genero.toString() + '","' + users.email.toString() + '","' + users.pass.toString() + '","' + users.telefone.toString() + '","' + users.morada.toString() + '","' + users.codigo_postal.toString() + '","' + users.porta.toString() + '","' + users.datanasc.toString() + '")';
    console.log(query)
     client_envio.query(query, (error, results) => {
        if (error) {
             throw error
         }
         console.log(results)
         response.status(201).send("User added with ID: ")
     })

}

const userdelete = (request, response) => {
    const users = request.body
    const query1 = 'SELECT !ISNULL((SELECT ISNULL(utilizador_id) FROM onspot.utilizador where utilizador_email="' + users.email.toString() + '" and utilizador_pass = "' + users.pass.toString() + '"))as existe';
    const del = 'DELETE FROM onspot.utilizador where utilizador_email= "' + users.email.toString() + '"';
    try {
    client.query(query1, (error, results) => {
        if (error) {throw error}
        if(!(results[0].existe==1))
        {
                    client_envio.query(del, (error, results3) => {
                        if (error) {throw error}
                        response.status(200).json(results3)
                    })
        }
        else
        {
            if((users.email==users.email)) {

                    client_envio.query(del, (error, results3) => {
                        if (error) {throw error }
                        response.status(200).json(results3)
                    })

            }
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

const updateuser = (request, response) => {
    try {
        const users = request.body
        const query1 = 'SELECT !ISNULL((SELECT ISNULL(utilizador_id) FROM onspot.utilizador where utilizador_email="' + users.email.toString() + '" and utilizador_pass="' + users.pass.toString() + '"))as existe';
        const up = 'UPDATE  onspot.utilizador SET utilizador_nome="' + users.novonome.toString() + '",utilizador_email="' + users.novoemail.toString() + '",utilizador_pass="' + users.novopass.toString() + '",utilizador_telefone="' + users.novotelefone.toString() + '" where utilizador_email="' + users.email.toString() + '"';
        client.query(query1, (error, results) => {
            if (error) {throw error}
            if(!(results[0].existe==1))
            {
                client_envio.query(up, (error, results3) => {
                    if (error) {
                        throw error
                    }
                    response.status(200).json(results3)
                })
            }
            else
            {
                client_envio.query(up, (error, results3) => {
                if (error) {throw error
                    throw new Error(error);}
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

//favoritos dos utilizadores
const createfav= (request, response) => {
    const users = request.body
    client.query('SELECT utilizador_id FROM onspot.utilizador where utilizador_email="'+ users.email.toString() +'" and utilizador_pass="'+users.pass.toString()+'"' , (error, results) => {
        console.log(results)
        const aa = JSON.stringify(results);
        const bb = JSON.parse(aa)

        if(aa.localeCompare("[]") != 0) {

            if (error) {
                throw error
            }
            const id = parseInt(bb[0].utilizador_id);
            console.log(id)
            const query = 'INSERT INTO favoritos (estacionamento_id,utilizador_id) VALUES ("' + users.estacionamento_id.toString() + '",' + id + ')';
            client_envio.query(query, (error, results2) => {
                if (error) {
                    throw error
                }
                response.status(201).send("User added with ID: ")
            })

    }else{response.status(200).json("user nao existe")}
    })
}

//DELETE FAVORITOS DE UM UTILIZADOR
const deletefav= (request, response) => {
    const users = request.body
    client.query('SELECT favoritos.favoritos_id FROM onspot.estacionamento ' +
        'inner join favoritos on estacionamento.estacionamento_id = favoritos.estacionamento_id ' +
        'inner join utilizador on favoritos.utilizador_id = utilizador.utilizador_id ' +
        'where estacionamento_nome="'+ users.nomeest.toString() +'" and utilizador_email="'+ users.email.toString() +'" and utilizador_pass="'+ users.pass.toString() +'" ' , (error, results) => {
        console.log(results)
        const aa = JSON.stringify(results);
        const bb = JSON.parse(aa)

        if(aa.localeCompare("[]") != 0) {

            if (error) {
                throw error
            }
            const id = parseInt(bb[0].favoritos_id);
            console.log(id)
            const query = 'DELETE FROM favoritos WHERE favoritos_id= ' + id + ' ';
            client_envio.query(query, (error, results2) => {
                if (error) {
                    throw error
                }
                response.status(201).send("User added with ID: ")
            })

        }else{response.status(200).json("user nao existe")}
    })
}


//VER garagens FAVORITaS DE UM USER
const estfav = (req,res)=>{
    const users = req.body
    client.query('SELECT estacionamento.estacionamento_id,estacionamento_nome,estacionamento_morada,estacionamento_preco FROM onspot.favoritos ' +
        'inner join onspot.utilizador on favoritos.utilizador_id =  utilizador.utilizador_id ' +
        'inner join onspot.estacionamento on favoritos.estacionamento_id =  estacionamento.estacionamento_id ' +
        'where utilizador_email = "' + users.email.toString() + '" and utilizador_pass= "' + users.pass.toString() + '"' ,(error,results)=>{
        if(error)
        {
            throw error
        }
        res.status(200).json(results)
    })
}



//Ver garagens de um user
const seegaragem= (req, res) => {
  const users = req.body
    client.query('SELECT estacionamento.estacionamento_id,estacionamento_nome,estacionamento_morada,estacionamento_preco FROM onspot.estacionamento ' +
    'inner join onspot.utilizador on estacionamento.utilizador_id =  utilizador.utilizador_id ' +
    'where utilizador_email = "' + users.email.toString() + '" and utilizador_pass= "' + users.pass.toString() + '" ' ,(error,results)=>{
        if(error)
        {
            throw error
        }
        res.status(200).json(results)
    })
}

//devolver a quantidade estacionamentos a informacao e o rate medio das garagens
const perfilutilizador= (req, res) => {
    const users = req.body
    client.query(' SELECT utilizador_nome,utilizador_email,utilizador_pass,utilizador_telefone ,COUNT(estacionamento.estacionamento_id) as countest, avg(rate) as rate  FROM onspot.utilizador ' +
    'inner join onspot.estacionamento on estacionamento.utilizador_id =  utilizador.utilizador_id ' +
    'inner join onspot.reserva_estacionamento on estacionamento.estacionamento_id = reserva_estacionamento.estacionamento_id ' +
    'inner join onspot.reserva on reserva_estacionamento.reservas_id = reserva.reserva_id ' +
    'inner join onspot.rate on reserva.classificacao_id = rate.classificacao_id ' +
    'where utilizador_email = "' + users.email.toString() + '" and utilizador_pass= "' + users.pass.toString() + '"' +
    'group by estacionamento.utilizador_id ' ,(error,results)=>{
        if(error)
        {
            throw error
        }
        res.status(200).json(results)
    })
}

//reservas ativas de um certo utilizador

const reservasativas= (req, res) => {
    const users = req.body
    console.log(users)
    client.query('SELECT * FROM onspot.estacionamento ' +
        'JOIN (SELECT estacionamento_id FROM onspot.reserva_estacionamento  ' +
        'WHERE estacionamento_id IN (SELECT estacionamento_id FROM onspot.reserva_estacionamento ' +
        'INNER JOIN onspot.reserva on reserva_estacionamento.reservas_id = reserva.reserva_id ' +
        'WHERE hora_de_entrada > NOW())) as estacionamentos_disponiveis ' +
        'ON estacionamentos_disponiveis.estacionamento_id = estacionamento.estacionamento_id ' +
        'JOIN onspot.reserva_estacionamento on estacionamento.estacionamento_id = reserva_estacionamento.estacionamento_id ' +
        'JOIN onspot.reserva ON reserva_estacionamento.reservas_id = reserva.reserva_id ' +
        'JOIN onspot.utilizador_reserva on reserva.reserva_id = utilizador_reserva.utilizador_reserv_id ' +
        'JOIN onspot.utilizador on utilizador_reserva.utilizador_id = utilizador.utilizador_id ' +
        'where utilizador_email = "' + users.email.toString() + '" and utilizador_pass= "' + users.pass.toString() + '" ',(error,results)=>{

        console.log(results)



        if(error)
        {
            throw error
        }
        res.status(200).json(results)
    })
}

//reservas que ja expiraram
const reservasexpiradas= (req, res) => {
    const users = req.body
    client.query('SELECT * FROM onspot.estacionamento ' +
        'JOIN (SELECT estacionamento_id FROM onspot.reserva_estacionamento  ' +
        'WHERE estacionamento_id IN (SELECT estacionamento_id FROM onspot.reserva_estacionamento ' +
        'INNER JOIN onspot.reserva on reserva_estacionamento.reservas_id = reserva.reserva_id ' +
        'WHERE hora_de_entrada < NOW())) as estacionamentos_disponiveis ' +
        'ON estacionamentos_disponiveis.estacionamento_id = estacionamento.estacionamento_id ' +
        'JOIN onspot.reserva_estacionamento on estacionamento.estacionamento_id = reserva_estacionamento.estacionamento_id ' +
        'JOIN onspot.reserva ON reserva_estacionamento.reservas_id = reserva.reserva_id ' +
        'JOIN onspot.utilizador_reserva on reserva.reserva_id = utilizador_reserva.utilizador_reserv_id ' +
        'JOIN onspot.utilizador on utilizador_reserva.utilizador_id = utilizador.utilizador_id ' +
        'where utilizador_email = "' + users.email.toString() + '" and utilizador_pass= "' + users.pass.toString() + '" ' ,(error,results)=>{

        if(error)
        {
            throw error
        }
        res.status(200).json(results)
    })
}







//criar garagem
const createestacionamento= (request, response) => {
    const users = request.body
    client.query('SELECT utilizador_id FROM onspot.utilizador where utilizador_email="'+ users.email.toString() +'" and utilizador_pass="'+users.pass.toString()+'"' , (error, results) => {
        const aa = JSON.stringify(results);
        const bb = JSON.parse(aa)

        if(aa.localeCompare("[]") != 0) {

            if (error) {
                throw error
            }
            const id = parseInt(bb[0].utilizador_id);
            console.log(id)
            const query = 'INSERT INTO estacionamento (estacionamento_nome, estacionamento_morada, estacionamento_preco,utilizador_id,coordenadas,numero_de_lugares) VALUES ("' + users.nome.toString()+ '", "'+ users.morada.toString()+ '",'+ users.preco.toString()+ ', ' + id + ' , Point('+ users.coordenadas.toString() + '), '+ users.lugares.toString()+ ')';
            client_envio.query(query, (error, results2) => {
                if (error) {
                    throw error
                }
                response.status(201).send("User added with ID: ")
            })

        }else{response.status(200).json("user nao existe")}
    })
}


//delete de garagem
const estdelete= (request, response) => {
    const est = request.body
    const query = 'SELECT estacionamento_id FROM onspot.estacionamento where ' +
    'estacionamento_nome = "'+ est.nome.toString() +'" and estacionamento_morada = "'+ est.morada.toString() +'" ' +
    'and utilizador_id = (SELECT utilizador_id FROM onspot.utilizador where utilizador_email= "'+ est.email.toString() +'" and utilizador_pass= "'+ est.pass.toString() +'") limit 1 ';

        client.query(query, (error, results) => {
            console.log(results)
        const aa = JSON.stringify(results);
        const bb = JSON.parse(aa)

        if(aa.localeCompare("[]") != 0) {

            if (error) {
                throw error
            }
            const id = parseInt(bb[0].estacionamento_id);
            console.log(id)
            const query1 = 'DELETE FROM onspot.caracteristicas_estac where estacionamento_id= ' + id + ' ';
            const query2 = 'DELETE FROM onspot.estacionamento where estacionamento_id= ' + id + ' ';
            client_envio.query(query1, (error, results2) => {
                if (error) {
                    throw error
                }
                client_envio.query(query2, (error, results2) => {
                    if (error) {
                        throw error
                    }
                    response.status(201).send("garagem deleted: ")
                })

            })

        }else{response.status(200).json("garagem nao existe")}
    })
}

//fazer update para as garagens
const updateestacionamento= (request, response) => {
    const est = request.body
    client.query('SELECT estacionamento_id FROM onspot.estacionamento where ' +
        'estacionamento_nome ="' + est.nome.toString()+ '" and ' +
        'estacionamento_morada ="' + est.morada.toString()+ '" and ' +
        'utilizador_id = (SELECT utilizador_id FROM onspot.utilizador where utilizador_email="' + est.email.toString()+ '" and utilizador_pass="' + est.pass.toString()+ '") ' , (error, results) => {

        const aa = JSON.stringify(results);
        const bb = JSON.parse(aa)

        if(aa.localeCompare("[]") != 0) {

            if (error) {
                throw error
            }
            const id = parseInt(bb[0].estacionamento_id);
            console.log(id)
            const query1 = 'UPDATE  onspot.estacionamento SET estacionamento_nome="' + est.novonome.toString() + '",estacionamento_preco="' + est.novopreco.toString() + '",numero_de_lugares="' + est.nlugares.toString() + '" where estacionamento_id= ' + id + ' ';
            client_envio.query(query1, (error, results2) => {
                if (error) {
                    throw error
                }

                response.status(201).send("garagem updated: ")
            })

        }else{response.status(200).json("garagem nao existe")}
    })
}


//fazer update a avaliação (rate)
const updaterate = (request, response) => {

    try {
        const users = request.body
        console.log(JSON.stringify(users))
        const query1 = 'select reserva.reserva_id from rate inner join onspot.reserva on rate.classificacao_id = reserva.classificacao_id inner join onspot.utilizador_reserva on reserva.reserva_id = utilizador_reserva.reserva_id inner join onspot.utilizador on utilizador_reserva.utilizador_id = utilizador.utilizador_id where reserva.reserva_id = "' + users.rsid.toString() + '" and utilizador_email = "' + users.email.toString() + '" and utilizador_pass="' + users.pass.toString() + '"';
        const up = 'UPDATE reserva ' +
            'SET classificacao_id = ' + users.clid.toString() + ' ' +
            ' WHERE reserva_id = ' + users.rsid.toString() + ' ';
        console.log(query1)
        console.log(up)
        client.query(query1, (error, results) => {
            if (error) {throw error}
            const aa = JSON.stringify(results);
            const bb = JSON.parse(aa)
            if(aa.localeCompare("[]") != 0) {

                    client_envio.query(up, (error, results3) => {
                        if (error) {
                            throw error
                        }
                        response.status(200).json(results3)
                    })
                }
            else
                {
                    client_envio.query(up, (error, results3) => {
                        if (error) {
                            throw error
                            throw new Error(error);
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
    getutilizador,
    login,
    createutilizador,
    userdelete,
    updateuser,
    createfav,
    deletefav,
    estfav,
    seegaragem,
    perfilutilizador,
    reservasativas,
    reservasexpiradas,
    createestacionamento,
    estdelete,
    updateestacionamento,
    updaterate

}