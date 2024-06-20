const debug = require("debug")("app:auth-middleware");
const { verifyToken } = require("../utils/jwt.tools");
const User = require("../models/user.model");

const ROLES = require("../data/roles.constants.json");

const middleware = {};
const PREFIX = "Bearer";


middleware.authentication = async (req, res, next) => {
    try {
      debug("User authentication");
  
      // 01 Verificar autorizacion
      const { authorization } = req.headers;
      if (!authorization) {
        return res.status(401).json({ error: "User not authenticated" });
      }
  
      // 02 Validez del token
      // Token => Bearer fdafdaasf.fdafdfasf.adfasfas
      const [prefix, token] = authorization.split(" ");
  
      if (prefix !== PREFIX) {
        return res.status(401).json({ error: "User not authenticated" });
      }
  
      if (!token) {
        return res.status(401).json({ error: "User not authenticated" });
      }
  
      const payload = await verifyToken(token);
  
      if (!payload) {
        return res.status(401).json({ error: "User not authenticated" });
      }
  
      const userId = payload["sub"];
  
      // 03 Verificar usuario
      const user = await User.findById(userId);
  
      if (!user) {
        return res.status(401).json({ error: "User not authenticated" });
      }
  
      // debug({ user });
  
      // 04 Comparar token con token registrados
  
      const isTokenValid = user.tokens.includes(token);
  
      if (!isTokenValid) {
        return res.status(401).json({ error: "User not authenticated" });
      }
      // 05 Modificar la req,res,next para anadir la info del usuario
      debug(user);
      req.user = user;
      req.token = token;
  
      next();
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  };
  
  middleware.authorization = (roleRequired = ROLES.SYSADMIN) => {
    return (req, res, next) => {
      // Premisa antes de este middleware debe de haber pasado por la autenticazion
      try {
        const { roles = [] } = req.user;
  
        //Verificar si el rol requrido esta en la coleccion
        const isAuth = roles.includes(roleRequired);
        const isSysadmin = roles.includes(ROLES.SYSADMIN);
  
        //Si no esta => 403
        if (!isAuth && !isSysadmin) {
          return res.status(403).json({ error: "Forbidden" });
        }
        // Si esta => next()
  
        next();
      } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Internal Server Error" });
      }
    };
  };
  
  module.exports = middleware;
  