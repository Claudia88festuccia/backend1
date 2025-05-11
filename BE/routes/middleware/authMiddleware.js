import jwt from "jsonwebtoken";
import createHttpError from "http-errors";
import dotenv from "dotenv";

dotenv.config();

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith("Bearer ")) {
    return next(createHttpError(401, "Token mancante o malformato"));
  }

  const token = authHeader.replace("Bearer ", "");

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // { id, email, ... }
    next();
  } catch (err) {
    console.error("Errore verifica token:", err);
    return next(createHttpError(403, "Token non valido o scaduto"));
  }
};

export default authenticateToken;

