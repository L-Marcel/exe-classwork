import jwt from "jsonwebtoken";

class AppAuth {
  static createToken(user: User) {
    const token = jwt.sign(user, process.env.SECRET, {
      expiresIn: "8h"
    });

    return token;
  };

  static verifyToken(token: string) {
    return jwt.verify(token, process.env.SECRET);
  };
};

export { AppAuth };

