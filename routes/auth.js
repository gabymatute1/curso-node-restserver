const { Router } = require('express');
const {check} = require('express-validator');

const { validarCampos } = require('../middlewares/validar-campos');

const { login, googleSignIn } = require('../Controllers/auth');

const router = Router();

router.post('/login',[
    check('email', 'El correo es obligatorio').isEmail(),
    check('password', 'La contrasena es obligatoria').not().isEmpty(),
    validarCampos
],
login);

router.post('/google',[
    check('id_token', 'Token de Google es necesario').not().isEmpty(),
    validarCampos,
  ], googleSignIn);

module.exports = router;