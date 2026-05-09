#!/usr/bin/env python
# -*- coding: utf-8 -*-

# 超シンプルにTensorFlowでDQN (Deep Q Network) を実装してみる
# http://blog.algolab.jp/post/2016/08/01/tf-dqn-simple-1/
# http://blog.algolab.jp/post/2016/12/17/tf-dqn-simple-2/
# http://blog.algolab.jp/post/2016/12/19/tf-dqn-simple-3/
# https://github.com/algolab-inc/tf-dqn-simple
# https://github.com/algolab-inc/tf-dqn-simple/blob/master/train.py
# https://github.com/algolab-inc/tf-dqn-simple/blob/master/dqn_agent.py

import os
import json
import urllib2
import collections
import numpy as np
import tensorflow as tf

# ----------------------------------------------------------------
# ----------------------------------------------------------------
# ----------------------------------------------------------------

class Trainer:
	def __init___(self):
		print "init"
	def setup_model(self, command_list):
		# 初期化フェイズ
		x_input = tf.placeholder(dtype = tf.float32, shape = [None, 8, 8])
		y_input = tf.placeholder(dtype = tf.float32, shape = [None, len(command_list)])
		# 
		x_flat = tf.reshape(x_input, [-1, 64])
		W_fc1 = tf.Variable(tf.truncated_normal(shape = [64, 64], stddev = 0.01, dtype = tf.float32))
		b_fc1 = tf.Variable(tf.zeros(shape = [64], dtype = tf.float32))
		h_fc1 = tf.nn.relu(tf.matmul(x_flat, W_fc1) + b_fc1)
		# 
		W_out = tf.Variable(tf.truncated_normal(shape = [64, len(command_list)], stddev = 0.01, dtype = tf.float32))
		b_out = tf.Variable(tf.zeros(shape = [len(command_list)], dtype = tf.float32))
		y_out = tf.matmul(h_fc1, W_out) + b_out
		# 誤差関数
		loss = tf.reduce_mean(tf.square(y_input - y_out))
		# 最適化 RMSProp法
		optimizer = tf.train.RMSPropOptimizer(0.001)
		train = optimizer.minimize(loss)
		# 学習パラメータの保存準備
		saver = tf.train.Saver()
		# フィールド化
		self._command_list = command_list
		self._model_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), "models")
		self._x_input = x_input
		self._y_input = y_input
		self._y_calc = y_out
		self._train = train
		self._loss = loss
		self._saver = saver
	def session_open(self):
		# セッション作成
		train_session = {}
		train_session["sess"] = tf.Session()
		train_session["step"] = collections.deque()
		train_session["loss"] = 0
		path = None
		if path is None:
			checkpoint = tf.train.get_checkpoint_state(self._model_dir)
			if checkpoint and checkpoint.model_checkpoint_path: path = checkpoint.model_checkpoint_path
		if path is not None:
			# セッションを読込
			self._saver.restore(train_session["sess"], path)
		else:
			# セッションを初期化
			train_session["sess"].run(tf.global_variables_initializer())
		return train_session
	def select_command(self, train_session, state, ratio):
		# 人工知能がコマンドを選択
		if np.random.rand() <= ratio: return np.random.choice(self._command_list)
		else: return self._command_list[np.argmax(self.get_q_value(train_session, state))]
	def set_step(self, train_session, command, reward, terminal, state_0, state_1):
		# ゲーム進行を注入
		train_session["step"].append((command, reward, terminal, state_0, state_1))
	def calc_step(self, train_session):
		# 注入したゲーム進行から人工知能の学習
		minibatch_x_input = []
		minibatch_y_input = []
		minibatch_indexes = np.random.randint(0, len(train_session["step"]), min(len(train_session["step"]), 32))
		for i in minibatch_indexes:
			command, reward, terminal, state_0, state_1 = train_session["step"][i]
			command_index = self._command_list.index(command)
			y = self.get_q_value(train_session, state_0)
			if terminal:
				y[command_index] = reward
			else:
				discount_factor = 0.9
				y[command_index] = reward + discount_factor * np.max(self.get_q_value(train_session, state_1))
			minibatch_x_input.append(state_0)
			minibatch_y_input.append(y)
		train_session["sess"].run(self._train, {self._x_input: minibatch_x_input, self._y_input: minibatch_y_input})
		train_session["loss"] = train_session["sess"].run(self._loss, {self._x_input: minibatch_x_input, self._y_input: minibatch_y_input})
	def get_q_value(self, train_session, state):
		# Q値取得
		q_value = train_session["sess"].run(self._y_calc, {self._x_input: [state]})
		return q_value[0]
	def get_last_loss(self, train_session):
		# 最新の損失取得
		return train_session["loss"]
	def session_close(self, train_session):
		# セッションを保存
		path = os.path.join(self._model_dir, "{}.ckpt".format("hoge"))
		self._saver.save(train_session["sess"], path)
		# セッションを閉じる
		train_session["sess"].close()

# ----------------------------------------------------------------
# ----------------------------------------------------------------
# ----------------------------------------------------------------

if __name__ == "__main__":
	def request_server(command):
		# 通信処理
		responseJson = {}
		try:
			requestJson = {}
			requestJson["room_id"] = 9999
			requestJson["command"] = command
			requestData = json.dumps(requestJson).encode("utf-8")
			requestMain = urllib2.Request("http://localhost:8080/test02")
			requestMain.add_header("Content-Type", "application/json")
			responseMain = urllib2.urlopen(requestMain, requestData)
			responseData = responseMain.read().decode("UTF-8")
			responseJson = json.loads(responseData)
		except Exception as e: print(e)
		return responseJson
	game_round_num = 10
	game_win_num = 0
	game_frame = 0
	game_loss = 0
	game_qmax = 0
	trainer = Trainer()
	trainer.setup_model(["left", "keep", "right"])
	train_session = trainer.session_open()
	for i in range(game_round_num):
		# ゲームをリセットする
		responseJson = request_server("reset")
		state_curr = responseJson["field"]
		reward = responseJson["reward"]
		terminal = responseJson["terminal"]
		# ゲームを終わるまで実行する
		while not terminal:
			state_prev = state_curr
			# ゲームのコマンドを選択する
			command = trainer.select_command(train_session, state_prev, 0.5)
			# ゲームのコマンドを入力する
			responseJson = request_server(command)
			state_curr = responseJson["field"]
			reward = responseJson["reward"]
			terminal = responseJson["terminal"]
			# ゲームのコマンド入力結果を記録する
			trainer.set_step(train_session, command, reward, terminal, state_prev, state_curr)
			trainer.calc_step(train_session)
			if reward > 0: game_win_num += 1
			game_frame += 1
			game_loss += trainer.get_last_loss(train_session)
			game_qmax += np.max(trainer.get_q_value(train_session, state_prev))
		print("EPOCH: {:03d}/{:03d} | WIN: {:03d} | LOSS: {:.4f} | Q_MAX: {:.4f} ".format(i + 1, game_round_num, game_win_num, game_loss / game_frame, game_qmax / game_frame))
	trainer.session_close(train_session)

# ----------------------------------------------------------------
# ----------------------------------------------------------------
# ----------------------------------------------------------------

