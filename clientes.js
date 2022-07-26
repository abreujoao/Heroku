const express = require('express');
var router = express.Router()
const pg = require('pg');
const strconexao = process.env.DATABASE_URL
const pool = new pg.Pool({connectionString: strconexao, ssl:{rejectUnauthorized:false}})

router.get('/',(req, res)=>{
   pool.connect((err,client)=>{
      if(err){
        return res.send({ message: 'Erro ao conectar ao banco de dados', erro: err.message})
      }
      client.query('select * from cliente', (error, result)=>{
        return res.send(result.rows)
      })
        
   })
})

router.get('/:idcliente',(req,res)=>{
    pool.connect((err, client)=>{
        client.query('select * from cliente where id = $1', [req.params.idcliente], (error,result)=>{
            return res.send(result.rows[0])
        })
    })
})

router.post('/',(req,res)=>{
    pool.connect((err, client)=>{
        var sql='insert into cliente(nome,email)values($1,$2)'
        var dados=[req.body.nome,req.body.email]
        client.query(sql, dados, (error,result)=>{
            if(result.rowCount > 0){
                return res.send({message:'cliente cadastrado com sucesso'})
            }
        })
    })
})

router.put(':idcliente',(req,res)=>{
    pool.connect((err,client)=>{
        var sql='update cliente set nome = $1, email = $2 where id= $3'
        var dados = [req.body.nome, req.body.email, req.params.idcliente]
        client.query(sql,dados,(error, result)=>{
            if(result.rowCount>0)
                return res.send({ message: 'cliente alterado'})
        })
    })
})

router.delete('/:idcliente', (req,res)=>{
    pool.connect((err, client)=>{
        client.query('delete from cliente where id =$1' [req.params.idcliente], (error, result)=>{
            return res.send({ message : 'cliente excluido com sucesso'})
        })
    })
})

module.exports= router


