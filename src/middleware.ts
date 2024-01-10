const jwt = require('jsonwebtoken');

export const auth = (req, res, next) => {
    try {
        const token = req.headers.authorization ? req.headers.authorization.split(" ")[1] : null;
        const decoded = jwt.verify(token, 'secret', (err, decoded) => {
            if (err) {
                return res.status(401).json({
                    msg: 'Authentication failed',
                    status_code: 401
                });
            }
			(req.userData) = decoded;
            next();
        });
    } catch (error) {
        next(error);
    }
};

export const adminauth = (req, res, next) => {
    try {
       const token = req.headers.authorization ? req.headers.authorization.split(" ")[1] : null;
        console.log("🚀 ~ file: middleware.ts:24 ~ adminauth ~ token:", token)
        jwt.verify(token, 'secret', (err, decoded) => {
            console.log("🚀 ~ file: middleware.ts:26 ~ jwt.verify ~ decoded:", decoded)
            if (err) {
                return res.status(401).json({
                    msg: 'Authentication failed',
                    status_code: 401
                });
            }
            if(decoded.type!=="admin"){
                return res.status(404).json({
                    msg: 'Unauthorized User Found',
                    status_code: 404
                });
            }
			(req.userData) = decoded;
            next();
        });
    } catch (error) {
        next(error);
    }
};