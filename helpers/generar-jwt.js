const jwt = require('jsonwebtoken');

const generarJWT = (uid='') => {

    return new Promise ((resolve, reject) => {

        const payload = {uid};

        jwt.sign(payload,process.env.SECRETOPRIVATEKEY, {
            expiresIn: '10h'
        }, (err,token) => {
            if (err) {
                console.log(err);
                reject('No se puede generar el token')
            } else {
                resolve(token);
            }
        });
    })
}

module.exports = {
    generarJWT
}