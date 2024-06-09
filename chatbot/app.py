from flask import Flask,request, render_template
from flask_restx import Api, Resource, reqparse,fields
from kChatBot import kChatBot
from flask_cors import CORS, cross_origin
import ssl
import json


# Loading cert
#ssl_context = ssl.SSLContext(ssl.PROTOCOL_TLS)
#ssl_context.load_cert_chain(certfile='/home/ubuntu/multinational-startup-support-platform/server2/ssl.cert', keyfile='/home/ubuntu/multinational-startup-support-platform/server2/ssl.key')
    

all_path = "./all_data.jsonl"
update_path = "./update_data.jsonl"

chatbot = kChatBot()
OPENAI_API_KEY = "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"
chatbot.initialize_openai(OPENAI_API_KEY)
#chatbot.initialize_finetuning_data("./data/data.json")
#chatbot.set_all_path(all_path)
#chatbot.set_update_path(update_path)
#chatbot.auto_text_to_finetuning_data(all_path)
#create_update_jsonfile(all_path, update_path)
#2번 실행 -> 데이터 양 맞춰야함
#auto_text_to_finetuning_data(update_path)
#auto_text_to_finetuning_data(update_path)
#chatbot.finetune_model()

app = Flask(__name__)
app.config['CORS_HEADERS'] = 'Content-Type'
cors = CORS(app)

@app.route('/service2', methods=['GET'])
@cross_origin()
def test():
    return "good"

@app.route('/service2/api/chat', methods=['POST'])
@cross_origin()
def chat():
    ret = {}
    global chatbot
    try:
        ret['msg'] = chatbot.chat_service(str(request.form['msg']))
    except:
        ret['msg'] = 'shut up and dance'
    return json.dumps(ret, ensure_ascii=False)
    

if __name__ == '__main__':
    #app.run(host='0.0.0.0', port=9000, threaded=True, debug=False, ssl_context='adhoc')
    app.run(host='0.0.0.0', port=9000, threaded=True, debug=False)
