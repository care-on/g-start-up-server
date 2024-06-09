import { Answer } from "./answer.type";

interface Question {
  uid: number;
  author: string;
  title: string;
  content: string;
}

interface QuestionExceptAuthor {
  uid: number;
  title: string;
  content: string;
}

interface QuestionDefault {
  qid: number;
  uid: number;
  author: string;
  title: string;
  content: string;
  created_date: string;
  updated_date: string;
  hit_count: number;
  like_count: number;
}

interface HierarchicalQuestion {
  qid: number;
  uid: number;
  author: string;
  title: string;
  content: string;
  created_date: string;
  updated_date: string;
  hit_count: number;
  like_count: number;
  child: Answer[];
}

export {
  Question,
  QuestionExceptAuthor,
  QuestionDefault,
  HierarchicalQuestion,
};
