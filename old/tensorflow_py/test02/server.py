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

# 部屋情報
globalRoomData = {}
globalRoomTrainer = {}
# 人工知能
globalTrainer = train.Trainer()
globalTrainer.setup_model(["left", "keep", "right"])

# リクエスト処理クラス
class TestHTTPRequestHandler(BaseHTTPServer.BaseHTTPRequestHandler):
	# 静的ファイル配信関数
	def do_GET(self):
		try:
			requestPath = self.path
			if requestPath == "/": requestPath = "/index.html";
			if requestPath == "/debug":
				self._writeResponse(200, "text/html", "<html><body>debug</body</html>".encode("UTF-8"))
			else:
				filePath = os.path.dirname(os.path.abspath(__file__)) + "/static" + requestPath
				fp = codecs.open(filePath, "r", "utf-8")
				responseData = fp.read()
				fp.close()
				if requestPath.endswith(".html"): self._writeResponse(200, "text/html", responseData.encode("UTF-8"))
				elif requestPath.endswith(".js"): self._writeResponse(200, "application/javascript", responseData.encode("UTF-8"))
				elif requestPath.endswith(".json"): self._writeResponse(200, "application/json", responseData.encode("UTF-8"))
				elif requestPath.endswith(".png"): self._writeResponse(200, "image/png", responseData.encode("UTF-8"))
				else: self._writeResponse(200, "application/unknown", responseData.encode("UTF-8"))
		except IOError:
			errorData = "<html><body>404</body><html>"
			self._writeResponse(404, "text/html", errorData.encode("UTF-8"))
		except:
			print traceback.format_exc()
			errorData = "<html><body>500</body><html>"
			self._writeResponse(500, "text/html", errorData.encode("UTF-8"))
	# API関数
	def do_POST(self):
		try:
			requestSize = int(self.headers.get("content-length"))
			requestBody = self.rfile.read(requestSize).decode("UTF-8")
			requestJson = json.loads(requestBody)
			requestPath = self.path
			if requestPath == "/test02":
				roomId = requestJson["room_id"]
				command = requestJson["command"]
				responseJson = self._gameCalc(roomId, command)
				responseData = json.dumps(responseJson)
				self._writeResponse(200, "application/json", responseData.encode("UTF-8"))
			else:
				errorJson = {"error": {"message": "api not found",},}
				errorData = json.dumps(errorJson)
				self._writeResponse(404, "application/json", errorData.encode("UTF-8"))
		except:
			print traceback.format_exc()
			errorJson = {"error": {"message": "unknown exception",},}
			errorData = json.dumps(errorJson)
			self._writeResponse(500, "application/json", errorData.encode("UTF-8"))
	# ゲーム進行
	def _gameCalc(self, roomId, command):
		responseJson = {}
		if command == "reset":
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
			responseJson = globalRoomData[roomId]
			if command == "next":
				# 人工知能が次のコマンドを決定
				command = self._trainerUse(roomId, responseJson["field"])
			# コマンド受信によりステップ進行
			if responseJson["terminal"] == False:
				if command == "right": responseJson["player_x"] = min(responseJson["player_x"] + 1, responseJson["screen_w"] - responseJson["player_w"])
				if command == "left":  responseJson["player_x"] = max(responseJson["player_x"] - 1, 0)
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
					self._trainerEnd(roomId)
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
		globalRoomData[roomId] = responseJson
		return responseJson
	# 人工知能使用関数
	def _trainerUse(self, roomId, state):
		if roomId not in globalRoomTrainer:
			trainSession = globalTrainer.session_open()
			globalRoomTrainer[roomId] = trainSession
		trainSession = globalRoomTrainer[roomId]
		command = globalTrainer.select_command(trainSession, state, 0.0)
		return command
	# 人工知能完了関数
	def _trainerEnd(self, roomId):
		if roomId in globalRoomTrainer:
			trainSession = globalRoomTrainer[roomId]
			globalTrainer.session_close(trainSession)
			del globalRoomTrainer[roomId]
	# 送信情報作成関数
	def _writeResponse(self, code, type, data):
		self.send_response(code)
		self.send_header("Content-type", type)
		self.end_headers()
		self.wfile.write(data)

if __name__ == "__main__":
	server_address = ("", 8080)
	simple_server = BaseHTTPServer.HTTPServer(server_address, TestHTTPRequestHandler)
	simple_server.serve_forever()
