import { connection_pool } from "../configs/db.config";

class SponseBoardService {
  async readAll(pageNumber: number, pageSize: number) {
    try {
      const result = await connection_pool.query(
        "SELECT a.id,a.title, b.username as author,a.created_at FROM recruit_board a, users b where a.uid = b.uid order by a.created_at desc"
      );
      return result[0];
    } catch (err) {
      throw err;
    }
  }
  async read(id: number) {
    try {
      const result = await connection_pool.query(
        "SELECT a.id,a.title, a.content, b.username as author,a.number_of_recruits,a.created_at FROM recruit_board a, users b where a.uid = b.uid and a.id = ?",
        [id.toString()]
      );
      return result[0];
    } catch (err) {
      throw err;
    }
  }
  async create(
    title: string,
    content: string,
    uid: number,
    numberOfRecruits: number
  ) {
    try {
      const result = await connection_pool.query(
        "INSERT INTO recruit_board (title, content, uid, number_of_recruits) VALUES (?,?,?,?)",
        [title, content, uid, numberOfRecruits]
      );
      return result[0];
    } catch (err) {
      throw err;
    }
  }
  async apply(where: number, uid: number) {
    try {
      const connection = await connection_pool.getConnection();
      await connection.beginTransaction();

      const [rows, fields] = (await connection.query(
        "select * from recruit_board where uid = ? and id =?",
        [uid, where]
      )) as [any[], object];
      if (rows.length !== 0) throw new Error("already applied");
      await connection.query("insert into recruit(id,uid) values(?,?)", [
        where,
        uid,
      ]);
      await connection.commit();
      connection.release();
    } catch (err) {
      throw err;
    }
  }
  async invest(where: number, uid: number) {
    try {
      const connection = await connection_pool.getConnection();
      await connection.beginTransaction();
      const [rowsFirst, fieldsFirst] = (await connection.query(
        "select * from profiles where uid = ? and role = ?",
        [uid, "Entrepreneur"]
      )) as [any[], object];
      if (rowsFirst.length === 0)
        throw new Error("not an entrepreneur so permit bad");
      const [rowsSecond, fieldsSecond] = (await connection.query(
        "select * from recruit_board where uid = ? and id =?",
        [uid, where]
      )) as [any[], object];
      if (rowsSecond.length === 0) throw new Error("nop");

      await connection.query("insert into sponse(id,uid) values(?,?)", [
        where,
        uid,
      ]);
      await connection.commit();
      connection.release();
    } catch (err) {
      throw err;
    }
  }
  async approveWithInvest(where: number, uid: number, status: string) {
    try {
      console.log("as");
      const connection = await connection_pool.getConnection();
      await connection.beginTransaction();
      const [result, fields] = (await connection.query(
        "select r.uid from sponse s, recruit_board r where s.id = r.id and sid = ?",
        [where]
      )) as any[];
      console.log(result);
      if (result.length === 0) throw new Error("nop");
      console.log(uid);
      console.log(result[0].uid);
      //if (uid !== Number(result[0].uid)) throw new Error("permission denied");

      await connection.query("update sponse set status =? where sid = ?", [
        status,
        where,
      ]);

      await connection.commit();
      connection.release();
    } catch (err) {
      throw err;
    }
  }
  async approveWithRecruit(where: number, uid: number, status: string) {
    try {
      const connection = await connection_pool.getConnection();
      await connection.beginTransaction();
      const [result, fields] = (await connection.query(
        "select r.uid from recruit s, recruit_board r where s.id = r.id and rid = ?",
        [where]
      )) as any[];
      if (result.length === 0) throw new Error("nop");
      //if (uid !== Number(result[0].uid)) throw new Error("permission denied");

      await connection.query("update recruit set status =? where rid = ?", [
        status,
        where,
      ]);

      await connection.commit();
      connection.release();
    } catch (err) {
      throw err;
    }
  }
}

export default new SponseBoardService();
