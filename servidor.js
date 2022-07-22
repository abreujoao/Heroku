const express = require('express');
const pg = require('pg');
const app = express();
const cors = require('cors')
app.use(express.urlencoded({extended: false}))
app.use(express.json())  
app.use(cors())

//const strconexao = 'postgres://postgres:admin@localhost/postgres'
const strconexao = process.env.DATABASE_URL
const port= process.env.PORT
const pool = new pg.Pool({connectionString: strconexao, ssl:{rejectUnauthorized:false}})

app.get('/clientes',(req, res)=>{
   pool.connect((err,client)=>{
      if(err){
        return res.send({ message: 'Erro ao conectar ao banco de dados', erro: err.message})
      }
      client.query('select * from cliente', (error, result)=>{
        return res.send(result.rows)
      })
        
   })
})

app.get('/clientes/:idcliente',(req,res)=>{
    pool.connect((err, client)=>{
        client.query('select * from cliente where id = $1', [req.params.idcliente], (error,result)=>{
            return res.send(result.rows[0])
        })
    })
})

app.post('/clientes',(req,res)=>{
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

app.put('/cliente/;idcliente',(req,res)=>{
    pool.connect((err,client)=>{
        var sql='update cliente set nome = $1, email = $2 where id= $3'
        var dados = [req.body.nome, req.body.email, req.params.idcliente]
        client.query(sql,dados,(error, result)=>{
            if(result.rowCount>0)
                return res.send({ message: 'cliente alterado'})
        })
    })
})

app.delete('/cliente/:idcliente', (req,res)=>{
    pool.connect((err, client)=>{
        client.query('delete from cliente where id =$1' [req.params.idcliente], (error, result)=>{
            return res.send({ message : 'cliente excluido com sucesso'})
        })
    })
})

app.listen(port,()=>{console.log(`executando em http://localhost:5500`)})

