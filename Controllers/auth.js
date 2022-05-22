const { response } = require('express');
const bcryptjs = require('bcryptjs');

const Usuario = require('../models/usuario');
const { generarJWT } = require('../helpers/generar-jwt');

const login = async(req, res=response) => {

    const {email, password} = req.body;

    try {

        // Verificar si el email existe
        const usuario = await Usuario.findOne({email});
        if (!usuario)
        {
            return res.status(400).json({
                msg: 'Usuario / Password no son correctos - Email'
            });
        }

        // Si el usuario esta activo 
        if (!usuario.estado)
        {
            return res.status(400).json({
                msg: 'Usuario / Password no son correctos - Estado: false'
            });
        }
        // Verificar al contrasena
        const validPassword = bcryptjs.compareSync(password,usuario.password);
        if (!validPassword)
        {
            return res.status(400).json({
                msg: 'Usuario / Password no son correctos - Password'
            });
        }

        // Generar el JWT
        const token = await generarJWT(usuario.id);

        res.json({
            usuario,
            token
        })
        
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            msg: 'Hable con el administrador'
        })
    }


}

module.exports = {
    login
}