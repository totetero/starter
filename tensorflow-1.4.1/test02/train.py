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
	def setup(self, command_list):
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
		# セッション作成
		sess = tf.Session()
		sess.run(tf.global_variables_initializer())
		# フィールド化
		self._command_list = command_list
		self._x_input = x_input
		self._y_input = y_input
		self._y_calc = y_out
		self._train = train
		self._loss = loss
		self._model_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), "models")
		self._sess = sess
		self._saver = saver
		self._steps = collections.deque()
		self._last_loss = 01
	def select_command(self, state, ratio):
		if np.random.rand() <= ratio: return np.random.choice(self._command_list)
		else: return self._command_list[np.argmax(self.get_q_value(state))]
	def set_step(self, command, reward, terminal, state_0, state_1):
		self._steps.append((command, reward, terminal, state_0, state_1))
	def calc_step(self):
		minibatch_x_input = []
		minibatch_y_input = []
		minibatch_indexes = np.random.randint(0, len(self._steps), min(len(self._steps), 32))
		for i in minibatch_indexes:
			command, reward, terminal, state_0, state_1 = self._steps[i]
			command_index = self._command_list.index(command)
			y = self.get_q_value(state_0)
			if terminal:
				y[command_index] = reward
			else:
				discount_factor = 0.9
				y[command_index] = reward + discount_factor * np.max(self.get_q_value(state_1))
			minibatch_x_input.append(state_0)
			minibatch_y_input.append(y)
		self._sess.run(self._train, {self._x_input: minibatch_x_input, self._y_input: minibatch_y_input})
		self._last_loss = self._sess.run(self._loss, {self._x_input: minibatch_x_input, self._y_input: minibatch_y_input})
	def get_q_value(self, state):
		q_value = self._sess.run(self._y_calc, {self._x_input: [state]})
		return q_value[0]
	def get_last_loss(self):
		return self._last_loss
	def load(self):
		path = None
		if path is None:
			checkpoint = tf.train.get_checkpoint_state(self._model_dir)
			if checkpoint and checkpoint.model_checkpoint_path: path = checkpoint.model_checkpoint_path
		if path is not None:
			self._saver.restore(self._sess, path)
	def save(self):
		path = os.path.join(self._model_dir, "{}.ckpt".format("hoge"))
		self._saver.save(self._sess, path)
	def dispose(self):
		self._sess.close()

# ----------------------------------------------------------------
# ----------------------------------------------------------------
# ----------------------------------------------------------------

def request_server(command):
	responseJson = {}
	try:
		requestJson = {}
		requestJson["room_id"] = 9999
		requestJson["command"] = command
		requestData = json.dumps(requestJson).encode("utf-8")
		requestMain = urllib2.Request("http://localhost:8080/test02")
		requestMain.add_header("Content-Type", "application/json")
		responseMain = urllib2.urlopen("http://localhost:8080/test02", requestData)
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
trainer.setup(["left", "keep", "right"])
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
		command = trainer.select_command(state_prev, 0.5)
		# ゲームのコマンドを入力する
		responseJson = request_server(command)
		state_curr = responseJson["field"]
		reward = responseJson["reward"]
		terminal = responseJson["terminal"]
		# ゲームのコマンド入力結果を記録する
		trainer.set_step(command, reward, terminal, state_prev, state_curr)
		trainer.calc_step()
		if reward > 0: game_win_num += 1
		game_frame += 1
		game_loss += trainer.get_last_loss()
		game_qmax += np.max(trainer.get_q_value(state_prev))
	print("EPOCH: {:03d}/{:03d} | WIN: {:03d} | LOSS: {:.4f} | Q_MAX: {:.4f} ".format(i + 1, game_round_num, game_win_num, game_loss / game_frame, game_qmax / game_frame))
trainer.save()
trainer.dispose()

# ----------------------------------------------------------------
# ----------------------------------------------------------------
# ----------------------------------------------------------------

