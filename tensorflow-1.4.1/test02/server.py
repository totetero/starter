#!/usr/bin/env python

# 超シンプルにTensorFlowでDQN (Deep Q Network) を実装してみる
# http://blog.algolab.jp/post/2016/08/01/tf-dqn-simple-1/
# http://blog.algolab.jp/post/2016/12/17/tf-dqn-simple-2/
# http://blog.algolab.jp/post/2016/12/19/tf-dqn-simple-3/
# https://github.com/algolab-inc/tf-dqn-simple
# https://github.com/algolab-inc/tf-dqn-simple/blob/master/catch_ball.py

import os
import json
import random
import http.server

globalTest02Data = {}

# リクエスト処理クラス
class TestHTTPRequestHandler(http.server.BaseHTTPRequestHandler):
	# 静的ファイル配信関数
	def do_GET(self):
		try:
			requestPath = self.path
			if requestPath == "/": requestPath = "/index.html";
			filePath = os.path.dirname(os.path.abspath(__file__)) + "/static" + requestPath
			fp = open(filePath, "r", encoding = "utf-8")
			responseData = fp.read()
			fp.close()
			if requestPath.endswith('.html'): self.write_response(200, "text/html", responseData.encode("UTF-8"))
			elif requestPath.endswith('.js'): self.write_response(200, "application/javascript", responseData.encode("UTF-8"))
			elif requestPath.endswith('.json'): self.write_response(200, "application/json", responseData.encode("UTF-8"))
			elif requestPath.endswith('.png'): self.write_response(200, "image/png", responseData.encode("UTF-8"))
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
					# コマンド受信によりステップ進行
					if responseJson["terminal"] == False:
						if requestData["command"] == "right": responseJson["player_x"] = min(responseJson["player_x"] + 1, responseJson["screen_w"] - responseJson["player_w"])
						if requestData["command"] == "left":  responseJson["player_x"] = max(responseJson["player_x"] - 1, 0)
						responseJson["ball_y"] += 1
						if responseJson["ball_y"] == responseJson["screen_h"] - 1:
							responseJson["terminal"] = True
							pminx = responseJson["player_x"]
							pmaxx = responseJson["player_x"] + responseJson["player_w"]
							if pminx <= responseJson["ball_x"] < pmaxx:
								responseJson["reward"] += 1
							else:
								responseJson["reward"] -= 1
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
		except: self.write_response(500, "application/json", json.dumps({"error": {"message": "unknown exception",},}).encode("UTF-8"))
	# 送信情報作成関数
	def write_response(self, code, type, data):
		self.send_response(code)
		self.send_header("Content-type", type)
		self.end_headers()
		self.wfile.write(data)

# サーバ起動
server_address = ("", 8080)
simple_server = http.server.HTTPServer(server_address, TestHTTPRequestHandler)
simple_server.serve_forever()
