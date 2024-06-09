
import json
import os
import time
import re
from dataclasses import dataclass 
from openai import OpenAI
from pathlib import Path

@dataclass 
class kChatBot:
    all_path = "./all_data.jsonl"
    update_path = "./update_data.jsonl"
    raw_data: json = None
    client: OpenAI = None
    def set_save_path(self, path) -> None:
        self.save_path = path

    def set_all_path(self, path) -> None:
        self.all_path = path

    def set_update_path(self, path) -> None:
        self.update_path = path
 
    def initialize_openai(self, key) -> None:
        self.client = OpenAI(api_key= key)
    def initialize_finetuning_data(self, filename = "./data/data.json") -> None: #
        with open(filename, 'r', encoding='utf-8') as f:
            self.raw_data = json.load(f)
    def finetune_model(self):
        train_file = self.client.files.create(
            file=Path(self.update_path),
            purpose="fine-tune",
        )
        self.client.fine_tuning.jobs.create(
            training_file=train_file.id,
            model="gpt-3.5-turbo",
            hyperparameters={"n_epochs":13}
        )
    def createJson_chat(self, conversation, file_path):
        data = {"messages": []}
        for question, answer in conversation:
            data["messages"].append({"role": "system", "content": "You are a chatbot called G-Bot of a friendly foreigner startup support platform"})
            data["messages"].append({"role": "user", "content": question})
            data["messages"].append({"role": "assistant", "content": answer})

        with open(file_path, "a", encoding="utf-8") as jsonl_file:
            jsonl_file.write(json.dumps(data, ensure_ascii=False) + "\n")
    def chat_service(self, content) -> str:
        completion = self.client.chat.completions.create(
            model = "ft:gpt-3.5-turbo-0125:personal::96a1ucCP",
            messages = [
                {"role": "system", "content": "You are a chatbot called G-Bot of a friendly foreigner startup support platform"},
                {"role": "user", "content": content}
            ]
        )
        return completion.choices[0].message.content
    def auto_text_to_finetuning_data(self, path):

        keywords = []
        contents = []
        for i in range(len(self.raw_data)):
            for j in range(len(self.raw_data[i]["contents"])):
                
                text = self.raw_data[i]["contents"][j]

                match = re.search(r'<(.*?)>', text)

                if match:
                    keyword = re.findall(r'<(.*?)>', text)[0]

                    first_index = text.find(keyword)
                    second_index = text.find("\n", first_index + 1)

                    content = text[second_index+1:]

                    if keyword not in keywords:
                        keywords.append(keyword)
                        contents.append(content)


        if len(keywords) != len(contents):
            print("data extractoin failed")
            
        for i in range(len(keywords)):

            keyword, content = keywords[i], contents[i]

            last_char = keyword[-1]  
            jongsung = (ord(last_char) - 0xAC00) % 28  

            if jongsung == 0: 
                keyword_aug_list = [
                    keyword,
                    keyword + "가 뭐야?",
                    keyword + "에 대해 설명해줘",
                    keyword + "란?"
                ]
            else:  
                keyword_aug_list = [
                    keyword,
                    keyword + "이 뭐야?",
                    keyword + "에 대해 설명해줘",
                    keyword + "이란?"
                ]

            for keyword_aug in keyword_aug_list:
                self.createJson_chat([(keyword_aug, content)], path)


    def create_update_jsonfile(self, all_path, update_path):
        with jsonlines.open(all_path, 'r') as all_file:
            with jsonlines.open(update_path, 'w') as update_file:
                for item in all_file:
                    update_file.write(item)



            
            


chatbot = kChatBot()
OPENAI_API_KEY = "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"
chatbot.initialize_openai(OPENAI_API_KEY)


print(chatbot.chat_service(''))
