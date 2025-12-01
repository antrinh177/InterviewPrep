const { decodeToken } = require("../../utils/jwt-utils");

function authorize(requiredRoles = ["user"]) {
  return (req, res, next) => {
    try {
      // get "Authorization" header
      const authHeader = req.get("Authorization");
      if (!authHeader)
        return res.status(401).json({ message: "Missing token" });
      // remove "Bearer " prefix
      const token = authHeader.startsWith("Bearer ")
        ? authHeader.slice(7)
        : authHeader;
      // decode and verify JWT
      const decoded = decodeToken(token);
      if (!decoded || !decoded.role) {
        return res.status(403).json({ message: "Permission denied" });
      }
      // check if the user's role is allowed
      if (!requiredRoles.includes(decoded.role)) {
        return res.status(403).json({ message: "Permission denied" });
      }
      // attach the decoded payload to req.user for use in route handlers
      req.user = decoded;
      next();
    } catch (err) {
      console.error("Authorization error:", err);
      return res.status(401).json({ message: "Invalid or expired token" });
    }
  };
}

module.exports = authorize;
