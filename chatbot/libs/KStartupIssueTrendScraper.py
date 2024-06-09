import json
from bs4 import BeautifulSoup
from urllib.request import urlopen

class KStartupIssueTrendScraper:
    def __init__(self):
        self.issue_trend_result = []

    def get_child(self, page_url, child_page_id):
        contents = []
        child_page_url = page_url + "&id=" + str(child_page_id) + "&schBdcode=&schGroupCode=&bdExt9=&bdExt10=&bdExt11=&bdUseyn=&schM=view"
        response = urlopen(child_page_url)
        page = BeautifulSoup(response, 'html.parser')
        thumb_list = page.find(class_="board_contents")
        for img_tag in thumb_list.find_all("img"):
            contents.append(img_tag["alt"])
        return contents

    def get_main(self, page_number, loaded_save_point):
        main_page_url = 'https://www.k-startup.go.kr/web/contents/webKSTARTUP_ISSE_TRD.do?page=' + str(page_number)
        response = urlopen(main_page_url)
        save_point = 0
        page = BeautifulSoup(response, 'html.parser')

        isse_trd = page.find(class_="gallery_list kstartup_isse_trd")
        for li_tag in isse_trd.find_all("li"):
            title_name = li_tag.find("a")["title"]
            child_page_id = li_tag.find("a")["onclick"].split("\'")[1]

            if str(child_page_id) == str(loaded_save_point):
                print('done')
                return False
            if save_point == 0:
                save_point = child_page_id
            title_logo_url = li_tag.find(class_="thumb").find("img")['src']

            root_json = {
                'title': {
                    'name': title_name,
                    'logo_url': title_logo_url
                },
                'contents': self.get_child(main_page_url, child_page_id)
            }
            self.issue_trend_result.append(root_json)

        return save_point

    def load_from_json(self, filename):
        with open(filename, 'r', encoding='utf-8') as f:
            data = json.load(f)
        return data

    def save_to_json(self, data, filename, encoding='utf-8'):
        with open(filename, 'w', encoding=encoding) as f:
            json.dump(data, f, indent=4, ensure_ascii=False)
    def append_to_json(self, data, filename, encoding='utf-8'):
        with open(filename, 'a', encoding=encoding) as f:
            json.dump(data, f, indent=4, ensure_ascii=False)
            f.write('\n')  # 각각의 JSON 객체를 새로운 줄에 저장하기 위해 줄 바꿈 추가

    def scrape_and_save(self, pn):
        loaded_save_point = self.load_from_json("./log/save_point.json")['save-point']
        loaded_data = self.load_from_json("./data/data.json")
        page_number = pn
        save_point = self.get_main(page_number, loaded_save_point)
        if save_point != False:
          self.save_to_json({'save-point': save_point}, './log/save_point.json')
        for e in self.issue_trend_result:
            loaded_data.append(e)
        self.save_to_json(loaded_data, './data/data.json')
        return self.issue_trend_result


