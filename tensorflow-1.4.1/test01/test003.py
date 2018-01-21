#!/usr/bin/env python
# -*- coding: utf-8 -*-

# Qiita 多分もっともわかりやすいTensorFlow 入門 (Introduction)
# https://qiita.com/junichiro/items/8886f3976fc20f73335f
# 線形回帰を計算する

import tensorflow as tf
import numpy as np

# ----------------------------------------------------------------
# ----------------------------------------------------------------
# ----------------------------------------------------------------
# 初期化フェイズ

init_W = tf.random_uniform(shape = [1], minval = -1.0, maxval = 1.0, dtype = tf.float32)
init_b = tf.zeros(shape = [1], dtype = tf.float32)
W = tf.Variable(initial_value = init_W, dtype = tf.float32)
b = tf.Variable(initial_value = init_b, dtype = tf.float32)
x_input = tf.placeholder(dtype = tf.float32)
y_input = tf.placeholder(dtype = tf.float32)

# 誤差関数
y_calc = x_input * W + b
loss = tf.reduce_mean(tf.square(y_calc - y_input) / 2)

# 最急降下法
optimizer = tf.train.GradientDescentOptimizer(0.5)
train = optimizer.minimize(loss)

# ----------------------------------------------------------------
# ----------------------------------------------------------------
# ----------------------------------------------------------------
# 実行フェイズ

# y = x * 0.1 + 0.3
# 入力データとして100個のグラフ上の点を用意する
x_trainer = np.random.rand(100).astype(np.float32)
y_trainer = x_trainer * 0.1 + 0.3

# セッションを作って実行する
with tf.Session() as sess:
	sess.run(tf.global_variables_initializer())
	temp_W, temb_b = sess.run([W, b])
	print(0, temp_W, temb_b)
	for i in range(200):
		step = i + 1
		sess.run(train, {x_input: x_trainer, y_input: y_trainer})
		if step % 20 == 0:
			temp_W, temb_b = sess.run([W, b])
			print(step, temp_W, temb_b)
	#tf.summary.FileWriter('./', sess.graph)

# ----------------------------------------------------------------
# ----------------------------------------------------------------
# ----------------------------------------------------------------

