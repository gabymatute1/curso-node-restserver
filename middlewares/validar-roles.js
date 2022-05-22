const { request } = require("express")
const { response } = require("express")

const esAdminRole = (req = request, res = response,next) => {

if (!req.usuario) {
    return res.status(500).json ({
        msg: 'Se quiere verificar el rol sin validar el token primero'
    });
}

const {rol, name} = req.usuario;

if (rol !=='ADMIN_ROLE') {
    return res.status(401).json ({
        msg: `${name} no es Administrador - No puede hacer esto`
    });
}

next();
}

const tieneRol = (...roles) => {
    return (req, res, next) => {
        
        
    if (!req.usuario) {
    return res.status(500).json ({
        msg: 'Se quiere verificar el rol sin validar el token primero'
    });
    }

    if (!roles.includes(req.usuario.rol)){
        return res.status(401).json ({
            msg: `El servicio requiere uno de estos roles: ${roles}`
        });
    }
    next();
    }
}

module.exports = {
    esAdminRole,
    tieneRol
}