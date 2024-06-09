import jwt, { Secret, VerifyOptions } from "jsonwebtoken";

/** token generator that is based on JWT */
class Token {
  private secret: Secret;

  constructor(secret: Secret) {
    this.secret = secret;
  }

  async generateToken(payload: any, expiresIn: string | number): Promise<string> {
    try {
      const token = jwt.sign(payload, this.secret, {
        expiresIn: expiresIn,
      });
      return token;
    } catch (e) {
      throw e;
    }
  }

  async verifyToken(token: string): Promise<any> {
    try {
      const decoded = jwt.verify(token, this.secret) as any;
      return decoded;
    } catch (e) {
      throw e;
    }
  }

  async decodeToken(token: string): Promise<any> {
    try {
      return jwt.decode(token);
    } catch (e) {
      throw e;
    }
  }
}

export default Token;
