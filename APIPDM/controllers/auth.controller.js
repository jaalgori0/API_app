const User = require("../models/user.model");
const ROLES = require("../data/roles.constants.json");
const { createToken, verifyToken } = require("../utils/jwt.tools");
const controller = {};

controller.register = async (req, res, next) => {
  try {
    //Obtener la info
    const { username, name, lastname, email, password,telephoneNumber} = req.body;
    //Verifircar existencia de correo y usuario
    const user =
      await User.findOne({ $or: [{ username: username }, { email: email }] });

    if (user) {
      return res.status(409).json({ error: "User already exists" });
    }

    //Si no existe lo creamos
    const newUser = new User({
      telephoneNumber:telephoneNumber,
      username: username,
      email: email,
      password: password,
      roles: [ROLES.USER],
      name: name,
      lastname: lastname,
    });

    await newUser.save();

    return res.status(201).json({ message: "User registered" });
  } catch (error) {
    next(error);
  }
}

controller.login = async (req, res, next) => {
  try {
    // Primer paso: Obtener info => identificador, password
    const { identifier, password } = req.body;
    //Verificar si el usuario existe
    const user = await User.findOne({
      $or: [{ username: identifier }, { email: identifier }],
    });
    // Si no existe, retornar 404
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    //Si existe, verificar password
    //Si password no coincide, retornar 401
    if (!user.comparePassword(password)) {
      return res.status(401).json({ error: "Incorrect Password" });
    }

    //Si la password coincide,return loggeamos (TODO)
    // Crear un token

    const token = await createToken(user._id);

    // Almacenar token
    // Verificar la integridad de los tokens actuales - max 5 sesiones cuando 5 se borra token mas antiguo
    let _tokens = [...user.tokens];
    const _verifyPromises = _tokens.map(async (_t) => {
      const status = await verifyToken(_t);

      return status ? _t : null;
    });

    _tokens = (await Promise.all(_verifyPromises))
      .filter((_t) => _t)
      .slice(0, 4);

    _tokens = [token, ..._tokens];
    user.tokens = _tokens;

    await user.save();
    // Devolver token

    return res.status(200).json({ token });
  } catch (error) {
    next(error);

  }
}

controller.whoami = async (req, res, next) => {
  try {
    const { _id, username, name, lastname,email,telephoneNumber, roles } = req.user;
    return res.status(200).json({ _id, username, name, lastname, email,telephoneNumber, roles });
  } catch (error) {
    next(error);
  }
};

controller.updateUser = async (req, res, next) => {
  try {
    const { _id } = req.user;  // Aquí obtienes el ID del usuario autenticado
    const { username, email, password } = req.body;

    const updateData = {};

    if (username) updateData.username = username;
    if (email) updateData.email = email;
    if (password) {
      const user = await User.findById(_id);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      const hashedPassword = user.encryptPassword(password);
      updateData.hashedPassword = hashedPassword;
      updateData.salt = user.salt;
    }

    const updatedUser = await User.findByIdAndUpdate(_id, updateData, { new: true });

    if (!updatedUser) {
      return res.status(404).json({ error: "User not found" });
    }

    return res.status(200).json(updatedUser);
  } catch (error) {
    next(error);
  }
}


module.exports = controller;
