#!/usr/bin/env python
# -*- coding: utf-8 -*-

# 超シンプルにTensorFlowでDQN (Deep Q Network) を実装してみる
# http://blog.algolab.jp/post/2016/08/01/tf-dqn-simple-1/
# http://blog.algolab.jp/post/2016/12/17/tf-dqn-simple-2/
# http://blog.algolab.jp/post/2016/12/19/tf-dqn-simple-3/
# https://github.com/algolab-inc/tf-dqn-simple
# https://github.com/algolab-inc/tf-dqn-simple/blob/master/catch_ball.py

import os
import json
import codecs
import random
import traceback
import BaseHTTPServer

import train

globalTest02Data = {}
globalTest02Trainer = {}

# リクエスト処理クラス
class TestHTTPRequestHandler(BaseHTTPServer.BaseHTTPRequestHandler):
	# 静的ファイル配信関数
	def do_GET(self):
		try:
			requestPath = self.path
			if requestPath == "/": requestPath = "/index.html";
			if requestPath == "/debug":
				self.write_response(200, "text/html", "<html><body>debug</body</html>".encode("UTF-8"))
			else:
				filePath = os.path.dirname(os.path.abspath(__file__)) + "/static" + requestPath
				fp = codecs.open(filePath, "r", "utf-8")
				responseData = fp.read()
				fp.close()
				if requestPath.endswith(".html"): self.write_response(200, "text/html", responseData.encode("UTF-8"))
				elif requestPath.endswith(".js"): self.write_response(200, "application/javascript", responseData.encode("UTF-8"))
				elif requestPath.endswith(".json"): self.write_response(200, "application/json", responseData.encode("UTF-8"))
				elif requestPath.endswith(".png"): self.write_response(200, "image/png", responseData.encode("UTF-8"))
				else: self.write_response(200, "application/unknown", responseData.encode("UTF-8"))
		except IOError: self.write_response(404, "html", ("<html><body>404</body><html>").encode("UTF-8"))
	# API関数
	def do_POST(self):
		try:
			requestSize = int(self.headers.get("content-length"))
			requestBody = self.rfile.read(requestSize).decode("UTF-8")
			requestJson = json.loads(requestBody)
			requestPath = self.path
			if requestPath == "/test02":
				global globalTest02Data
				requestData = {};
				requestData["room_id"] = requestJson["room_id"]
				requestData["command"] = requestJson["command"]
				responseJson = {}
				if requestData["command"] == "reset":
					# 初期化コマンド受信
					responseJson["screen_w"] = 8
					responseJson["screen_h"] = 8
					responseJson["ball_x"] = random.randint(0, responseJson["screen_w"] - 1)
					responseJson["ball_y"] = 0
					responseJson["player_w"] = 3
					responseJson["player_x"] = random.randint(0, responseJson["screen_w"] - responseJson["player_w"])
					responseJson["field"] = None
					responseJson["reward"] = 0
					responseJson["terminal"] = False
				else:
					# 記録していたデータを取得
					responseJson = globalTest02Data[requestData["room_id"]]
					if requestData["command"] == "next":
						# 人工知能が次のコマンドを決定
						requestData["command"] = self.trainer_use(requestData["room_id"], responseJson["field"])
					# コマンド受信によりステップ進行
					if responseJson["terminal"] == False:
						if requestData["command"] == "right": responseJson["player_x"] = min(responseJson["player_x"] + 1, responseJson["screen_w"] - responseJson["player_w"])
						if requestData["command"] == "left":  responseJson["player_x"] = max(responseJson["player_x"] - 1, 0)
						responseJson["ball_y"] += 1
						if responseJson["ball_y"] == responseJson["screen_h"] - 1:
							responseJson["terminal"] = True
							# 得点確認
							pminx = responseJson["player_x"]
							pmaxx = responseJson["player_x"] + responseJson["player_w"]
							if pminx <= responseJson["ball_x"] < pmaxx:
								responseJson["reward"] += 1
							else:
								responseJson["reward"] -= 1
							# 人工知能を使っていたら閉じる
							self.trainer_end(requestData["room_id"])
				# フィールド作成
				responseJson["field"] = []
				for i in range(responseJson["screen_h"]):
					responseJson["field"].append([])
					for j in range(responseJson["screen_w"]):
						chip = 0
						pminx = responseJson["player_x"]
						pmaxx = responseJson["player_x"] + responseJson["player_w"]
						if i == responseJson["screen_h"] - 1 and pminx <= j < pmaxx: chip = 1
						if i == responseJson["ball_y"] and j == responseJson["ball_x"]: chip = 1
						responseJson["field"][i].append(chip)
				# データを記録して送信
				globalTest02Data[requestData["room_id"]] = responseJson
				responseData = json.dumps(responseJson)
				self.write_response(200, "application/json", responseData.encode("UTF-8"))
			else: self.write_response(404, "application/json", json.dumps({"error": {"message": "api not found",},}).encode("UTF-8"))
		except Exception as e:
			traceback.print_exc()
			self.write_response(500, "application/json", json.dumps({"error": {"message": "unknown exception",},}).encode("UTF-8"))
	# 人工知能使用関数
	def trainer_use(self, room_id, state):
		global globalTest02Trainer
		if room_id not in globalTest02Trainer:
			train_session = trainer.session_open()
			globalTest02Trainer[room_id] = train_session
		train_session = globalTest02Trainer[room_id]
		command = trainer.select_command(train_session, state, 0.0)
		return command
	# 人工知能完了関数
	def trainer_end(self, room_id):
		global globalTest02Trainer
		if room_id in globalTest02Trainer:
			train_session = globalTest02Trainer[room_id]
			trainer.session_close(train_session)
			del globalTest02Trainer[room_id]
	# 送信情報作成関数
	def write_response(self, code, type, data):
		self.send_response(code)
		self.send_header("Content-type", type)
		self.end_headers()
		self.wfile.write(data)

if __name__ == "__main__":
	# 人工知能起動
	trainer = train.Trainer()
	trainer.setup_model(["left", "keep", "right"])
	# サーバ起動
	server_address = ("", 8080)
	simple_server = BaseHTTPServer.HTTPServer(server_address, TestHTTPRequestHandler)
	simple_server.serve_forever()
