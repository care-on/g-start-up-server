import { connection_pool } from "../configs/db.config";

class SearchService {
  private async searchKeywordInQuestions(keyword: string) {
    const [foundQuestion, fields] = (await connection_pool.query(
      "SELECT * from questions WHERE title LIKE ? OR content LIKE ?",
      [`%${keyword}%`, `%${keyword}%`]
    )) as [any[], any];
    return foundQuestion;
  }
  private async searchKeywordInCardNews(keyword: string) {
    const [foundCardNews, fields] = (await connection_pool.query(
      "SELECT * from cardnews WHERE title LIKE ? OR content LIKE ?",
      [`%${keyword}%`, `%${keyword}%`]
    )) as [any[], any];
    return foundCardNews;
  }
  private async searchKeywordInArticles(keyword: string) {
    const [foundArticles, fields] = (await connection_pool.query(
      "SELECT * from articles WHERE a_title LIKE ? ",
      [`%${keyword}%`]
    )) as [any[], any];
    return foundArticles;
  }
  async search(keyword: string | null, searchTarget: string | null) {
    try {
      if (!keyword) throw new Error("keyword is required");
      /** detail 검색을 위해 */
      let foundQuestion = [];
      let foundArticles = [];
      let foundCardNews = [];
      if (!searchTarget) {
        foundQuestion = await this.searchKeywordInQuestions(keyword);
        foundArticles = await this.searchKeywordInArticles(keyword);
        foundCardNews = await this.searchKeywordInCardNews(keyword);
        return {
          questions: {
            count: foundQuestion.length,
            data: foundQuestion,
          },
          articles: {
            count: foundArticles.length,
            data: foundArticles,
          },
          cardnews: {
            count: foundCardNews.length,
            data: foundCardNews,
          },
        };
      } else {
        if (searchTarget === "questions") {
          foundQuestion = await this.searchKeywordInQuestions(keyword);
          return {
            questions: {
              count: foundQuestion.length,
              data: foundQuestion,
            },
          };
        } else if (searchTarget === "articles") {
          console.log("as");
          foundArticles = await this.searchKeywordInArticles(keyword);
          return {
            articles: {
              count: foundArticles.length,
              data: foundArticles,
            },
          };
        } else if (searchTarget === "cardnews") {
          foundCardNews = await this.searchKeywordInCardNews(keyword);
          return {
            cardnews: {
              count: foundCardNews.length,
              data: foundCardNews,
            },
          };
        } else {
          throw new Error("searchTarget is not exist");
        }
      }
    } catch (error) {
      if (error instanceof Error) throw error;
    }
  }
}

export default new SearchService();
