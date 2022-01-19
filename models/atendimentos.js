const moment = require('moment')
const { query } = require('../infraestrutura/conexao')
const conexao = require('../infraestrutura/conexao')

class Atendimento {
    adiciona(atendimento, res){
        const sql = 'INSERT INTO Atendimentos SET  ?'
        const dataCriacao = moment().format('YYYY-MM-DD HH:mm:ss')
        const data = moment(atendimento.data, 'DD/MM/YYYY').format('YYYY-MM-DD HH:mm:ss')
        
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
                    res.status(201).json(atendimentoDatado)
                }
            })
        }

       
    }

    lista(res){
       const sql = 'SELECT * FROM Atendimentos' 
       
       conexao.query(sql, (erro, resultados)=> {
            if (erro){
                res.status(400).json(erro)
            } else{
                
                res.status(200).json(resultados)
            }
       })
    }

    buscaPorId(id, res){
        const sql = `SELECT * FROM Atendimentos WHERE id=${id}`

        conexao.query(sql, (erro, resultados)=>{
            if(erro){
                res.status(400).json(erro)
            }else{
                res.status(200).json(resultados[0])
            }

        } )    
    }

    altera(id, valores, res){
        if (valores.data){
            valores.data = moment(valores.data, 'DD/MM/YYYY').format('YYYY-MM-DD HH:mm:ss')
        }
        const sql = `UPDATE Atendimentos SET ? WHERE id=?`

        conexao.query(sql,[valores,id],(erro, resultados) => {
            if(erro){
                res.status(400).json(erro)
            }else{
                res.status(200).json(`Campos atualizados no atendimento de id ${id}`)
                console.log(valores)
            }
        })

    }

    deleta(id,res){ 
        const sql =`DELETE FROM Atendimentos WHERE id=?`

        conexao.query(sql, id, (erro, resultados)=>{
            if(erro){
                res.status(400).json(erro)
            }else{
                res.status(200).json(`Deletado atendimento com id ${id}`)
            }
        } )
    }

    
    
}

module.exports = new Atendimento