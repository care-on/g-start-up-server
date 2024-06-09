interface Answer {
  qid: number;
  uid: number;
  author: string;
  title: string;
  content: string;
  created_date: string;
  updated_date: string;
  like_count: number;
}
interface AnswerExceptCount {
  qid: number;
  uid: number;
  author: string;
  title: string;
  content: string;
  created_date: string;
  updated_date: string;
}
interface AnswerDefault {
  uid: number;
  qid: number;
  content: string;
}

export { Answer, AnswerExceptCount, AnswerDefault };
