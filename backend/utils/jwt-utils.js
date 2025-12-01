const { verify, sign } = require("jsonwebtoken");

const secret = process.env.TOKEN_SECRET;
const expiresIn = "1h";

if (!secret) {
  throw new Error("TOKEN_SECRET is missing in environment variables");
}

const decodeToken = (token) => {
  if (!token) throw new Error("Token missing");

  // Remove Bearer if included
  if (token.startsWith("Bearer ")) token = token.slice(7);

  const decoded = verify(token, secret); // throws if invalid

  if (decoded._id) decoded._id = decoded._id.toString();
  return decoded;
};

const encodeToken = (payload) => {
  const payloadToSign = { ...payload };

  if (payloadToSign._id) {
    payloadToSign._id = payloadToSign._id.toString();
  }

  return sign(payloadToSign, secret, { expiresIn });
};

module.exports = { decodeToken, encodeToken };
