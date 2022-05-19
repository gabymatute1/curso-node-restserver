const Role = require('../models/role');
const Usuario = require('../models/usuario');

const EsRolValido = async (rol='') => {
    const existeRol = await Role.findOne({rol});
    if (!existeRol) {
        throw new Error(`El rol ${rol} no esta registrado en la BD`);
    }
}

const EmailExiste = async (email='') => {
    const existeEmail = await Usuario.findOne({email});
    if (existeEmail){
        throw new Error (`El correo ${email} ya esta registrado en la BD`);
    }
}

const existeUsuarioPorId = async (id) => {

    // Verificar si el ID existe
    const existeUsuario = await Usuario.findById(id);
    if (!existeUsuario){
        throw new Error (`El ID: ${id} no existe`);
    }
}

module.exports = {
    EsRolValido,
    EmailExiste,
    existeUsuarioPorId
}