const { Router } = require('express');
const {check} = require('express-validator');

//const {validarCampos} = require('../middlewares/validar-campos');
//const { validarJWT } = require('../middlewares/validar-jwt');
//const { esAdminRole, tieneRol } = require('../middlewares/validar-roles');
const {
    validarCampos,
    validarJWT,
    esAdminRole,
    tieneRol
} = require('../middlewares');

const { EsRolValido, 
        EmailExiste,
        existeUsuarioPorId } = require('../helpers/db-validators');

const { usuariosGet, 
        usuariosPost, 
        usuariosPut, 
        usuariosPatch, 
        usuariosDelete } = require('../Controllers/usuarios');


const router = Router();

router.get('/', usuariosGet);

router.post('/',[
    check('name','El nombre es obligatorio').not().isEmpty(),
    check('password','El password debe tener mas de 6 letras').isLength({ min:6 }),
    check('email','El correo no es valido').isEmail(),
    check('email').custom(EmailExiste),
    //check('rol','No es un rol valido').isIn(['ADMIN_ROLE','USER_ROLE']),
    check('rol').custom(EsRolValido),
    validarCampos
    ], usuariosPost);

router.put('/:id', [
    check('id','No es un ID valido').isMongoId(),
    check('id').custom(existeUsuarioPorId),
    check('rol').custom(EsRolValido),
    validarCampos
],
usuariosPut);
router.patch('/', usuariosPatch);

router.delete('/:id',
    validarJWT, [
    //esAdminRole,
    tieneRol('ADMIN_ROLE', 'VENTAS_ROLE','OTRO_ROLE'),
    check('id','No es un ID valido').isMongoId(),
    check('id').custom(existeUsuarioPorId),
    validarCampos
], usuariosDelete);  

module.exports = router;