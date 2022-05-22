const { response } = require('express');
const bcryptjs = require('bcryptjs');

const Usuario = require('../models/usuario');
const { generarJWT } = require('../helpers/generar-jwt');
const { googleVerify } = require('../helpers/google-verify');
const { json } = require('express/lib/response');
const { body } = require('express-validator');

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

const googleSignIn = async(req, res = response) => {

    const {id_token} = req.body; 
    
    try {
        
        const {email, name, picture} = await googleVerify(id_token);
        

        let usuario = await Usuario.findOne({email});
        console.log(usuario);
            if (!usuario) {
                // Tengo que crearlo
                const data = {
                    name,
                    email,
                    password:':P',
                    picture,
                    google: true,
                    rol: 'USER_ROL'

                };
                usuario = new Usuario(data);
                await usuario.save();
            }

            // Si el usuario esta en la BD
            if (!usuario.estado) {
                return res.status(401).json ({
                    msg: 'Hable con el Administrador, usuario bloqueado'
                });
            }

        // Generar el JWT
        const token = await generarJWT(usuario.id);

        res.json ({
            usuario,
            token
        });

    } catch (error) {
        console.log(error);
        res.status(400).json ({
            msg: 'Token de Google no es valido'
        })
    }
}

module.exports = {
    login,
    googleSignIn
}