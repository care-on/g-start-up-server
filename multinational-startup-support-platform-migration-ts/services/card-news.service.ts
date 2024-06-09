import { connection_pool } from "../configs/db.config";

class CardNewsService {
  async read(pageNumber: number, pageSize: number) {
    try {
      const connection = await connection_pool.getConnection();
      await connection.beginTransaction();

      const [rows, fields] = (await connection.query("call GetCardNews(?,?)", [
        pageNumber,
        pageSize,
      ])) as [any, object];
      const [childRows, childFields] = (await connection.query(
        "call GetCardNewPageCount(?)",
        [pageSize]
      )) as [any, object];
      await connection.commit();
      connection.release();
      const rtnJson: any = [];
      rows[0].forEach((e: any) => {
        const { content, ...articleWithoutContent } = e;
        const { images, notice } = JSON.parse(
          content.replace(/[\u0000-\u0019]+/g, "")
        );

        rtnJson.push({
          ...articleWithoutContent,
          content: images,
        });
      });

      return {
        page_count: childRows[0][0].pageCount,
        data: rtnJson,
      };
    } catch (err) {
      throw err;
    }
  }
  async readOneByCid(cid: number, uid: number) {
    try {
      const [rows, fields] = (await connection_pool.query(
        "select * from cardnews where idcardnews = ?",
        [cid]
      )) as [any, object];
      if (rows.length === 0) throw new Error("nop");
      const { content, ...articleWithoutContent } =
        await this.readOneByCidAndUpdateHit(cid, uid);
      const { images, notice } = JSON.parse(
        content.replace(/[\u0000-\u0019]+/g, "")
      );
      const parsedNotice = notice.replace("\\", "");
      const article = {
        ...articleWithoutContent,
        content: {
          images: images,
          notice: parsedNotice,
        },
      };
      return article;
    } catch (err) {
      throw err;
    }
  }
  async readOneByCidAndUpdateHit(cid: number, uid: number) {
    try {
      const connection = await connection_pool.getConnection();
      await connection.beginTransaction();

      const [rows, fields] = (await connection.query(
        "select * from cardnews_hit_log where idcardnews = ? and uid = ?",
        [cid, uid]
      )) as [any, object];

      if (rows.length === 0) {
        await connection.query(
          "insert into cardnews_hit_log(idcardnews, uid, hit) values(?,?,?)",
          [cid, uid, 1]
        );
      }
      const [childRows, childFields] = (await connection.query(
        "call GetCardNewsDetail (?,?)",
        [cid, uid]
      )) as [any, object];
      await connection.commit();
      connection.release();
      return childRows[0][0];
    } catch (err) {
      throw err;
    }
  }
  async likeWithArticle(uid: number, cid: number) {
    try {
      const connection = await connection_pool.getConnection();
      await connection.beginTransaction();

      const [rows, fields] = (await connection.query(
        "select * from cardnews_like_log where uid = ? and idcardnews =?",
        [uid, cid]
      )) as [any, object];

      if (rows.length != 0) throw new Error("already like this post");
      (await connection.query(
        "insert into cardnews_like_log(idcardnews,uid,likes) values(?,?,?)",
        [cid, uid, 1]
      )) as [any, object];
      await connection.commit();
      connection.release();
    } catch (err) {
      throw err;
    }
  }
  async unLikeWithArticle(uid: number, cid: number) {
    try {
      const connection = await connection_pool.getConnection();
      await connection.beginTransaction();

      const [rows, fields] = (await connection.query(
        "select * from cardnews_like_log where uid = ? and idcardnews =?",
        [uid, cid]
      )) as [any, object];

      if (rows.length == 0) throw new Error("already unLike this post");
      (await connection.query(
        "delete from cardnews_like_log where idcardnews = ? and uid = ?",
        [cid, uid]
      )) as [any, object];
      await connection.commit();
      connection.release();
    } catch (err) {
      throw err;
    }
  }
}

export default new CardNewsService();
