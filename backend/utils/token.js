import crypto from "crypto";

function generateEmailVerificationToken() {
  const token = crypto.randomBytes(32).toString("hex");
  return token;
}

function hashEmailVerificationToken(token) {
  const hash = crypto.createHash("sha256").update(token).digest("hex");
  return hash;
}
function compareHash(token1, token2) {
    return token1 === token2;
}
export { generateEmailVerificationToken,hashEmailVerificationToken,compareHash };
