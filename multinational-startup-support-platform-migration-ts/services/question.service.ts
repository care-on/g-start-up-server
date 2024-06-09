import { connection_pool } from "../configs/db.config";
import { Answer, AnswerDefault, AnswerExceptCount } from "../types/answer.type";
import {
  HierarchicalQuestion,
  QuestionDefault,
  QuestionExceptAuthor,
} from "../types/question.type";
class QuestionService {
  private questions: HierarchicalQuestion[];
  constructor() {
    this.questions = [];
    this.initializeQuestionsAndAnswers();
  }
  async initializeQuestionsAndAnswers() {
    try {
      const connection = await connection_pool.getConnection();
      await connection.beginTransaction();
      const [rows, fields] = (await connection.query(
        "call GetQuestionDetails()"
      )) as [any[], object];
      rows[0].forEach(async (row: any) => {
        const [childRows, childFields] = (await connection.query(
          "call GetAnswersByQuestionId(?)",
          [row.qid]
        )) as [Answer[], object];
        const hierarchicalQuestion: HierarchicalQuestion = {
          ...row,
          child: childRows[0],
        };

        this.questions.push(hierarchicalQuestion);
      });

      await connection.commit();
      connection.release();
    } catch (err) {
      throw err;
    }
  }

  async create(newQuestion: QuestionExceptAuthor) {
    try {
      const connection = await connection_pool.getConnection();
      await connection.beginTransaction();

      const result = (await connection.query(
        "INSERT INTO questions SET ?",
        newQuestion
      )) as [any, object];
      const [rows, fields] = (await connection.query(
        "call GetQuestionDetailsById(?)",
        [result[0].insertId]
      )) as [any, object];

      await connection.commit();
      connection.release();
      const hierarchicalQuestion: HierarchicalQuestion = {
        ...rows[0][0],
        child: [],
      };
      this.questions.unshift(hierarchicalQuestion);
      return rows[0][0];
    } catch (err) {
      throw err;
    }
  }

  async createAnswer(newAnswer: AnswerDefault) {
    try {
      const [result, fields] = (await connection_pool.query(
        "call InsertAnswerAndRelation(?,?,?)",
        [newAnswer.uid, newAnswer.qid, newAnswer.content]
      )) as [any, object];
      const { deleted_date, ...filteredData } = result[0][0];
      await this.updateQuestionsWithNewAnswer(newAnswer.qid, filteredData);

      //this.questions.push(new question.hierarchy({ ...rows[0][0], child: [] }));
      //   return rows[0][0];
      return filteredData;
    } catch (err) {
      throw err;
    }
  }

  async updateQuestionsWithNewAnswer(
    qid: number,
    newAnswer: AnswerExceptCount
  ) {
    // this.questions에서 해당 질문을 찾아서 업데이트
    this.questions.forEach((question) => {
      if (question.qid === qid) {
        question.child.push({ ...newAnswer, like_count: 0 });
      }
    });
  }

  async read(pageNumber: number, pageSize: number) {
    try {
      const questionsWithoutChild = this.questions.map((question) => {
        const { child, ...questionWithoutChild } = question;
        return questionWithoutChild;
      });
      const itemOfQuestion = await this.getItemsForPage(
        questionsWithoutChild,
        pageNumber,
        pageSize
      );
      return {
        page_count: Math.ceil(this.questions.length / Number(pageSize)),
        data: itemOfQuestion,
      };
    } catch (err) {
      throw err;
    }
  }

  async getItemsForPage(
    questionDefault: QuestionDefault[],
    pageNumber: number,
    pageSize: number
  ) {
    const startIndex = (pageNumber - 1) * pageSize;
    const endIndex = pageNumber * pageSize;
    // 배열 슬라이싱을 사용하여 해당 페이지의 아이템을 추출합니다.
    const paginatedItems = questionDefault.slice(startIndex, endIndex);
    return paginatedItems;
  }

  async readOneByQidAndUpdateHit(qid: number, uid: number) {
    try {
      const foundIndex = this.questions.findIndex(
        (question) => question.qid === Number(qid)
      );
      if (!this.questions[foundIndex])
        throw new Error("cannot find question post");

      await this.updateHit(foundIndex, qid, uid);
      return this.questions[foundIndex];
    } catch (err) {
      throw err;
    }
  }

  async updateHit(idx: number, qid: number, uid: number) {
    try {
      const connection = await connection_pool.getConnection();
      await connection.beginTransaction();

      const [rows, fields] = (await connection.query(
        "select * from question_hit_log where qid = ? and uid = ?",
        [qid, uid]
      )) as [any[], object];

      if (rows.length === 0) {
        await connection.query(
          "insert into question_hit_log(qid, uid, hit) values(?,?,?)",
          [qid, uid, 1]
        );
        this.questions[idx].hit_count = 1;
      }

      await connection.commit();
      connection.release();
    } catch (err) {
      throw err;
    }
  }
  async findAuthor(qid: number) {
    try {
      const question = this.questions.find((question) => question.qid === qid);
      if (!question) throw new Error("cannot find question post");
      return question.uid;
    } catch (err) {
      throw err;
    }
  }
  async findAnswerAuthor(qid: number, aid: number) {
    try {
      const question: HierarchicalQuestion | null =
        this.questions.find((question) => question.qid === qid) || null;
      if (!question) throw new Error("cannot find question post");
      const answer = question.child.find((answer: any) => answer.aid === aid);
      if (!answer) throw new Error("cannot find question post");
      return answer.uid;
    } catch (err) {
      throw err;
    }
  }
  /** transaction done */
  async update(qid: number, updatedQuestion: QuestionExceptAuthor) {
    try {
      const connection = await connection_pool.getConnection();
      await connection.beginTransaction();

      await connection.query(
        "UPDATE questions SET ? WHERE qid = ? and uid = ?",
        [updatedQuestion, qid, updatedQuestion.uid]
      );

      // 업데이트된 질문을 다시 가져와서 업데이트
      const [rows, fields] = (await connection.query(
        "call GetQuestionDetailsById(?)",
        [qid]
      )) as [any, object];
      await connection.commit();
      connection.release();

      const updatedIndex = this.questions.findIndex((q) => q.qid === qid);
      if (updatedIndex !== -1) {
        this.questions[updatedIndex] = rows[0][0];
      }

      return rows[0][0];
    } catch (err) {
      throw err;
    }
  }

  async updateAnswer(aid: number, updatedAnswer: AnswerDefault) {
    try {
      const connection = await connection_pool.getConnection();
      await connection.beginTransaction();
      await connection.query("UPDATE answers SET ? WHERE aid = ? and uid = ?", [
        updatedAnswer,
        aid,
        updatedAnswer.uid,
      ]);

      // 업데이트된 질문을 다시 가져와서 업데이트
      const [rows, fields] = (await connection.query(
        "call GetAnswerDetailsById(?)",
        [aid]
      )) as [Answer[], object];

      await connection.commit();
      connection.release();

      const updatedIndex = this.questions.findIndex(
        (q) => q.qid === updatedAnswer.qid
      );
      if (updatedIndex === -1) throw new Error("cannot found post");
      const childIndex = this.questions[updatedIndex].child.findIndex(
        (answer: any) => answer.aid === aid
      );

      if (childIndex === -1) throw new Error("cannot found answer");
      this.questions[updatedIndex].child[childIndex] = rows[0];
      return rows[0];
    } catch (err) {
      throw err;
    }
  }

  async delete(qid: number) {
    try {
      const connection = await connection_pool.getConnection();
      await connection.beginTransaction();

      const result = (await connection.query(
        "UPDATE questions SET deleted_date = CURRENT_TIMESTAMP WHERE qid = ?",
        [qid]
      )) as any;

      await connection.commit();
      connection.release();

      if (result[0].affectedRows > 0) {
        // 메모리에 있는 배열에서 질문을 제거합니다.
        this.questions = this.questions.filter(
          (question) => question.qid !== qid
        );

        const deletedQuestion = result[0];
        return deletedQuestion;
      } else {
        throw new Error("not found question.");
      }
    } catch (err) {
      throw err;
    }
  }
  async deleteAnswer(qid: number, aid: number) {
    try {
      const result = (await connection_pool.query(
        "UPDATE answers SET deleted_date = CURRENT_TIMESTAMP WHERE aid = ?",
        [aid]
      )) as any;

      if (result[0].affectedRows > 0) {
        const questionIndex = this.questions.findIndex(
          (question) => question.qid === qid
        );
        if (questionIndex !== -1) {
          this.questions[questionIndex].child = this.questions[
            questionIndex
          ].child.filter((answer: any) => answer.aid !== aid);
        }

        return result[0];
      } else {
        throw new Error("not found answer.");
      }
    } catch (err) {
      throw err;
    }
  }
  async likeWithQuestion(uid: number, qid: number) {
    try {
      const connection = await connection_pool.getConnection();
      await connection.beginTransaction();

      const [rows, fields] = (await connection.query(
        "select * from question_like_log where uid = ? and qid =?",
        [uid, qid]
      )) as [any, object];

      if (rows.length != 0) throw new Error("already like this post");
      await connection.query(
        "insert into question_like_log(qid,uid,likes) values(?,?,?)",
        [qid, uid, 1]
      );
      const foundIndex = this.questions.findIndex(
        (question) => question.qid === Number(qid)
      );
      this.questions[foundIndex].like_count++;
      await connection.commit();
      connection.release();
    } catch (err) {
      throw err;
    }
  }
  async likeWithAnswer(uid: number, qid: number, aid: number) {
    try {
      const connection = await connection_pool.getConnection();
      await connection.beginTransaction();

      const [rows, fields] = (await connection.query(
        "select * from answer_like_log where uid = ? and aid =?",
        [uid, aid]
      )) as [any, object];

      if (rows.length != 0) throw new Error("already like this answer");
      await connection.query(
        "insert into answer_like_log(aid,uid,likes) values(?,?,?)",
        [aid, uid, 1]
      );
      const foundIndex = this.questions.findIndex(
        (question) => question.qid === Number(qid)
      );
      const foundChildIndex = this.questions[foundIndex].child.findIndex(
        (answer: any) => answer.aid === Number(aid)
      );
      this.questions[foundIndex].child[foundChildIndex].like_count++;
      await connection.commit();
      connection.release();
    } catch (err) {
      throw err;
    }
  }
  async unLikeWithQuestion(uid: number, qid: number) {
    try {
      const connection = await connection_pool.getConnection();
      await connection.beginTransaction();

      const [rows, fields] = (await connection.query(
        "select * from question_like_log where uid = ? and qid =?",
        [uid, qid]
      )) as [any, object];

      if (rows.length == 0) throw new Error("already unLike this post");
      await connection.query(
        "delete from question_like_log where qid = ? and uid = ?",
        [qid, uid]
      );
      const foundIndex = this.questions.findIndex(
        (question) => question.qid === Number(qid)
      );
      this.questions[foundIndex].like_count--;
      await connection.commit();
      connection.release();
    } catch (err) {
      throw err;
    }
  }
  async unLikeWithAnswer(uid: number, qid: number, aid: number) {
    try {
      const connection = await connection_pool.getConnection();
      await connection.beginTransaction();

      const [rows, fields] = (await connection.query(
        "select * from answer_like_log where uid = ? and aid =?",
        [uid, aid]
      )) as [any, object];

      if (rows.length == 0) throw new Error("already unLike this answer");
      await connection.query(
        "delete from answer_like_log where aid = ? and uid = ?",
        [aid, uid]
      );
      const foundIndex = this.questions.findIndex(
        (question) => question.qid === Number(qid)
      );
      const foundChildIndex = this.questions[foundIndex].child.findIndex(
        (answer: any) => answer.aid === Number(aid)
      );

      this.questions[foundIndex].child[foundChildIndex].like_count--;
      await connection.commit();
      connection.release();
    } catch (err) {
      throw err;
    }
  }
}

export default new QuestionService();
