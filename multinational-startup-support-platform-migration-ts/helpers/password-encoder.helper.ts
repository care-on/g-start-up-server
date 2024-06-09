import bcrypt from "bcrypt";

class PasswordEncoder {
  private saltRound: number;
  private salt: string = "";

  constructor(saltRounds: number) {
    this.saltRound = saltRounds;
    this.initialize();
  }

  private async initialize(): Promise<void> {
    try {
      this.salt = await bcrypt.genSalt(this.saltRound);
    } catch (err) {
      throw err;
    }
  }

  async encode(plainText: string): Promise<string> {
    try {
      const encodedPw = await bcrypt.hash(plainText, this.salt);
      return encodedPw;
    } catch (err) {
      console.log(err);
      throw err;
    }
  }

  async compare(plainText: string, encodedText: string): Promise<boolean> {
    try {
      return await bcrypt.compare(plainText, encodedText);
    } catch (err) {
      throw err;
    }
  }
}

export default PasswordEncoder;
