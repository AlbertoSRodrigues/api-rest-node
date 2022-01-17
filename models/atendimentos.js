const moment = require('moment')
const conexao = require('../infraestrutura/conexao')

class Atendimento {
    adiciona(atendimento, res){
        const sql = 'INSERT INTO Atendimentos SET  ?'
        const dataCriacao = moment().format('YYYY-MM-DD HH:MM:SS')
        const data = moment(atendimento.data, 'DD/MM/YYYY').format('YYYY-MM-DD HH:MM:SS')
        
        const validaData = moment(data).isSameOrAfter(dataCriacao)
        const validaCliente = atendimento.cliente.length >= 5

        const validacoes = [
            {
                nome: 'data',
                valido: validaData,
                mensagem: 'Data der ser maior ou igual a data atual'
            },
            {
                nome: 'cliente',
                valido: validaCliente,
                mensagem: 'O nome do cliente deve ter pelomenos 5 caracteres'
            }
        ]

        const erros = validacoes.filter(campo => !campo.valido)
        const existemErros = erros.length

        if(existemErros){
            res.status(400).json(erros)
        }else{
            const atendimentoDatado ={...atendimento, dataCriacao, data}

            conexao.query(sql, atendimentoDatado, (erro, resultados) =>{
                if(erro){
                    res.status(400).json(erro)
                }else{
                    res.status(201).json(resultados)
                }
            })
        }

       
    }
}

module.exports = new Atendimento