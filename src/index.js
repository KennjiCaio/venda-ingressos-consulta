const express = require("express");
const app = express();
app.use(express.json());

const axios = require("axios");
const baseConsulta = [];

const funcoes = {
    ClienteClassificado: (cliente) => {
        baseConsulta[cliente.id] = cliente;
    },
    IngressoCriado: (ingresso) => {
        const ingressos = baseConsulta[ingresso.clienteId]["ingressos"] || [];
        ingressos.push(ingresso);
        baseConsulta[ingresso.clienteId]["ingressos"] = ingressos;
    },
    ClienteDeletado: (cliente) => {
        console.log(cliente.id);
        baseConsulta.splice(cliente.id, 1);
    }
}

app.get("/clientes", (req, res) => {
    res.status(200).send(baseConsulta);
});

app.post("/eventos", (req, res) => {
    try {
        console.log(req.body);
        funcoes[req.body.tipo](req.body.dados);
    } catch (err) { }
    res.status(200).send(baseConsulta);
});

app.listen(6000, async () => {
    console.log("Consultas. Porta 6000");
    const resp = await axios.get("http://localhost:10000/eventos");

    resp.data.forEach((valor) => {
        try {
            funcoes[valor.tipo](valor.dados);
        }
        catch (err) { console.log(err) }
    })
});