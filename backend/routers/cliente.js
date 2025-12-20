//CRUD de clientes

const express = require('express');
const { ObjectId } = require('mongodb');

module.exports = function (clientes) {
    
    const router = express.Router();

    //Todos los clientes
    router.get('/obtenerTodos', async (req, res)=>{

        const lista = await clientes.find().toArray();
        res.json(lista);
    });

    //Por id
    router.get('/obtenerPorId/:id', async (req, res) => {

        const id = new ObjectId(req.params.id);

        const cliente = await clientes.findOne({_id: id});

        if (!cliente) return res.status(404).json({ mensaje: 'Cliente no encontrado'});

        return res.json(cliente);

    })

    //Nuevo cliente
    

    router.post('/crearCliente', async (req, res) =>{
        // TODO: Buscar cliente por Id. Si existe, abortar

        const {nombre, email, telefono, ciudad} = req.body;

        const cliente = {nombre, email, telefono, ciudad};

        await clientes.insertOne(cliente);
        res.json({mensaje: 'Cliente agregado correctamente'});
    });

    router.put('/actualizarCliente/:id', async (req, res)=>{

        const id = new ObjectId(req.params.id);

        //Desestructuración
        const {nombre, email, telefono, ciudad} = req.body;

        await clientes.updateOne(
            {_id: id},
            {$set: {nombre, email, telefono, ciudad}}
        );

        res.json({mensaje: 'Cliente, nombre actualizado'});        

    })

    router.delete('/eliminarCliente/:id', async (req, res)=>{

        const id = new ObjectId(req.params.id);

        await clientes.deleteOne(
            {_id: id}
        );

        res.json({mensaje: 'Cliente eliminado correctamente'})
    })
    
    return router;
}



