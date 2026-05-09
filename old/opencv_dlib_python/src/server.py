#!/usr/bin/env python
# -*- coding: utf-8 -*-

import os
import json
import codecs
import traceback
from http.server import HTTPServer, SimpleHTTPRequestHandler
import ssl

import cv2
import dlib
import base64
import numpy as np

# 顔検出準備
predictor = dlib.shape_predictor("dat/shape_predictor_68_face_landmarks.dat")
detector = dlib.get_frontal_face_detector()

# リクエスト処理クラス
class TestHTTPRequestHandler(SimpleHTTPRequestHandler):
	# 静的ファイル配信関数
	def do_GET(self):
		try:
			requestPath = self.path
			if requestPath == "/": requestPath = "/index.html";
			filePath = os.path.dirname(os.path.abspath(__file__)) + "/../static" + requestPath
			print(filePath)
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
			print(traceback.format_exc())
			errorData = "<html><body>500</body><html>"
			self._writeResponse(500, "text/html", errorData.encode("UTF-8"))
	# API関数
	def do_POST(self):
		try:
			requestSize = int(self.headers.get("content-length"))
			requestBody = self.rfile.read(requestSize).decode("UTF-8")
			requestJson = json.loads(requestBody)
			requestPath = self.path
			if requestPath == "/face":
				# 顔検出処理
				img_base64 = requestJson["base64"]
				img_data = base64.b64decode(img_base64)
				img_np = np.frombuffer(img_data, np.uint8)
				img_cv = cv2.imdecode(img_np, cv2.IMREAD_ANYCOLOR)
				img_gray = cv2.cvtColor(img_cv, cv2.COLOR_BGR2GRAY)
				dets, scores, idx = detector.run(img_gray, 0)
				list = [[], [], [], [], [], [], []]
				if len(dets) > 0:
					for i, rect in enumerate(dets):
						shape = predictor(img_gray, rect)
						for index in range(shape.num_parts):
							point = shape.part(index)
							if  0 <= index and index < 17: list[0].append([point.x, point.y]) # 輪郭
							if 17 <= index and index < 22: list[1].append([point.x, point.y]) # 右眉
							if 22 <= index and index < 27: list[2].append([point.x, point.y]) # 左眉
							if 27 <= index and index < 36: list[3].append([point.x, point.y]) # 鼻
							if 36 <= index and index < 42: list[4].append([point.x, point.y]) # 右目
							if 42 <= index and index < 48: list[5].append([point.x, point.y]) # 左目
							if 48 <= index and index < 68: list[6].append([point.x, point.y]) # 口
				responseJson = { "list": list, }
				responseData = json.dumps(responseJson)
				self._writeResponse(200, "application/json", responseData.encode("UTF-8"))
			else:
				errorJson = { "error": { "message": "api not found", }, }
				errorData = json.dumps(errorJson)
				self._writeResponse(404, "application/json", errorData.encode("UTF-8"))
		except:
			print(traceback.format_exc())
			errorJson = { "error": { "message": "unknown exception", }, }
			errorData = json.dumps(errorJson)
			self._writeResponse(500, "application/json", errorData.encode("UTF-8"))
	# 送信情報作成関数
	def _writeResponse(self, code, type, data):
		self.send_response(code)
		self.send_header("Content-type", type)
		self.end_headers()
		self.wfile.write(data)

if __name__ == "__main__":
	host = ""
	port = 8080
	httpd = HTTPServer((host, port), TestHTTPRequestHandler)
	#httpd.socket = ssl.wrap_socket(httpd.socket, certfile='cert.pem', server_side=True)
	print("serving at port", port)
	httpd.serve_forever()
