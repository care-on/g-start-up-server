import { connection_pool } from "../configs/db.config";
import {
  User,
  UserAndUserProfile,
  UserIncludedUid,
  UserProfileDefault,
  UserProfileIncludedUid,
} from "../types/user.type."; // Assuming you have types defined for User and Profile

class UserService {
  private users: UserIncludedUid[];

  constructor() {
    this.users = [];
    this.initializeUsers();
  }

  async initializeUsers(): Promise<void> {
    try {
      const [rows, fields] = (await connection_pool.query(
        "SELECT * FROM users where leavedate is NULL"
      )) as [UserIncludedUid[], object];
      this.users = rows;
    } catch (err) {
      throw err;
    }
  }

  async create(newUser: User, newProfile: UserProfileDefault): Promise<User> {
    console.log(this.users);
    let connection;
    try {
      connection = await connection_pool.getConnection();
      await connection.beginTransaction();

      const result = (
        await connection.query("INSERT INTO users SET ?", newUser)
      )[0] as { insertId?: number };
      if (!result.insertId) throw new Error("insert ERr");
      const createdProfile: UserProfileIncludedUid = {
        ...newProfile,
        uid: result.insertId,
      };
      await connection.query("INSERT INTO profiles SET ?", createdProfile);
      const [rows, fields] = (await connection.query(
        "SELECT * FROM users WHERE uid = ?",
        [result.insertId]
      )) as [UserIncludedUid[], object];
      await connection.commit();
      connection.release();
      this.users.push(rows[0]);
      return rows[0];
    } catch (err) {
      if (connection) {
        await connection.rollback();
        connection.release();
      }
      throw err;
    }
  }

  async readProfileByUid(uid: number) {
    let connection;
    try {
      connection = await connection_pool.getConnection();
      const [rows, fields] = (await connection.query(
        "select u.uid, username,email, joindate,birthdate, nationality, region, tel, interests, role  from users u, profiles p where u.uid = p.uid and u.uid=?",
        [uid]
      )) as [UserAndUserProfile[], object];
      const [rowsFirst, fields2] = (await connection.query(
        "select s.sid, title, content, status from sponse s, recruit_board r where s.id = r.id and r.uid = ? and status != ?",
        [uid, "reject"]
      )) as [any[], object];
      const [rowsSecond, fields3] = (await connection.query(
        "select s.rid, title, content, status from recruit s, recruit_board r where s.id = r.id and r.uid =?  and status != ?",
        [uid, "reject"]
      )) as [any[], object];

      connection.release();
      if (rows.length === 0)
        return {
          err_code: -1,
          msg: "cannot found User",
        };
      return {
        info: rows[0],
        sponse_info: rowsFirst,
        recruit_info: rowsSecond,
      };
    } catch (err) {
      throw err;
    }
  }

  async readOneByEmail(email: string): Promise<UserIncludedUid> {
    try {
      const user = this.users.find((user) => user.email === email);
      if (user) {
        return user;
      } else {
        throw new Error("User not found");
      }
    } catch (err) {
      throw err;
    }
  }

  // async update(updatedUser: User): Promise<void> {
  //   let connection;
  //   try {
  //     connection = await connection_pool.getConnection();
  //     await connection.beginTransaction();
  //     const result = await connection.query(
  //       "UPDATE profiles SET ? WHERE uid = ?",
  //       [updatedUser, updatedUser.uid]
  //     );
  //     if (result[0].affectedRows <= 0) throw new Error("User not found");

  //     await connection.commit();
  //     connection.release();
  //   } catch (err) {
  //     if (connection) {
  //       await connection.rollback();
  //       connection.release();
  //     }
  //     throw err;
  //   }
  // }

  // async delete(uid: number): Promise<User> {
  //   try {
  //     const result = await connection_pool.query(
  //       "UPDATE users SET leavedate = CURRENT_TIMESTAMP WHERE uid = ?",
  //       [uid]
  //     );
  //     if (result[0].affectedRows > 0) {
  //       const deletedUser = this.users.find((user) => user.uid === uid)!;
  //       this.users = this.users.filter((user) => user.uid !== uid);
  //       return deletedUser;
  //     } else {
  //       throw new Error("User not found");
  //     }
  //   } catch (err) {
  //     throw err;
  //   }
  // }
}

export default new UserService();
