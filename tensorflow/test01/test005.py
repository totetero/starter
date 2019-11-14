#!/usr/bin/env python
# -*- coding: utf-8 -*-

# Deep MNIST for Experts
# https://www.tensorflow.org/get_started/mnist/pros
# TensorFlowコトハジメ 手書き文字認識(MNIST)による多クラス識別問題
# http://yaju3d.hatenablog.jp/entry/2016/04/22/073249
# テンソルフローのサンプルである機械学習中級者向け手書き文字認識

import tensorflow as tf
from tensorflow.examples.tutorials.mnist import input_data

# ----------------------------------------------------------------
# ----------------------------------------------------------------
# ----------------------------------------------------------------
# 初期化フェイズ

x_input = tf.placeholder(dtype = tf.float32, shape = [None, 28 * 28])
y_input = tf.placeholder(dtype = tf.float32, shape = [None, 10])
keep_prob = tf.placeholder(dtype = tf.float32)

x_image = tf.reshape(x_input, [-1, 28, 28, 1])

# 畳み込み１層目
W_conv1 = tf.Variable(tf.truncated_normal(shape = [5, 5, 1, 32], stddev = 0.1, dtype = tf.float32))
b_conv1 = tf.Variable(tf.constant(0.1, shape = [32], dtype = tf.float32))
h_conv1 = tf.nn.relu(tf.nn.conv2d(x_image, W_conv1, strides = [1, 1, 1, 1], padding = 'SAME') + b_conv1)
h_pool1 = tf.nn.max_pool(h_conv1, ksize = [1, 2, 2, 1], strides = [1, 2, 2, 1], padding = 'SAME')

# 畳み込み２層目
W_conv2 = tf.Variable(tf.truncated_normal(shape = [5, 5, 32, 64], stddev = 0.1, dtype = tf.float32))
b_conv2 = tf.Variable(tf.constant(0.1, shape = [64], dtype = tf.float32))
h_conv2 = tf.nn.relu(tf.nn.conv2d(h_pool1, W_conv2, strides = [1, 1, 1, 1], padding = 'SAME') + b_conv2)
h_pool2 = tf.nn.max_pool(h_conv2, ksize = [1, 2, 2, 1], strides = [1, 2, 2, 1], padding = 'SAME')

# 全結合層
W_fc1 = tf.Variable(tf.truncated_normal(shape = [7 * 7 * 64, 1024], stddev = 0.1, dtype = tf.float32))
b_fc1 = tf.Variable(tf.constant(0.1, shape = [1024], dtype = tf.float32))
h_pool2_flat = tf.reshape(h_pool2, [-1, 7 * 7 * 64])
h_fc1 = tf.nn.relu(tf.matmul(h_pool2_flat, W_fc1) + b_fc1)

# ドロップアウト層
h_fc1_drop = tf.nn.dropout(h_fc1, keep_prob)

# 出力層
W_fc2 = tf.Variable(tf.truncated_normal(shape = [1024, 10], stddev = 0.1, dtype = tf.float32))
b_fc2 = tf.Variable(tf.constant(0.1, shape = [10], dtype = tf.float32))
y_conv = tf.matmul(h_fc1_drop, W_fc2) + b_fc2

# 誤差関数 クロスエントロピ
loss = tf.reduce_mean(tf.nn.softmax_cross_entropy_with_logits(labels = y_input, logits = y_conv))

# 確率的勾配降下法
optimizer = tf.train.AdamOptimizer(1e-4)
train = optimizer.minimize(loss)

# 正答率(学習には用いない)
correct_prediction = tf.equal(tf.argmax(y_conv, 1), tf.argmax(y_input, 1))
accuracy = tf.reduce_mean(tf.cast(correct_prediction, tf.float32))

# ----------------------------------------------------------------
# ----------------------------------------------------------------
# ----------------------------------------------------------------

# 入力データとしてMNISTデータをダウンロードして読み込む
# mnist.train.images [60000, 28 * 28]
# mnist.train.lables [60000, 10]
# mnist.test.images [10000, 28 * 28]
# mnist.test.lables [10000, 10]
mnist = input_data.read_data_sets("MNIST_data/", one_hot=True)

# セッションを作って実行する
with tf.Session() as sess:
	sess.run(tf.global_variables_initializer())
	# 開始前の確認
	#x_test = mnist.test.images
	#y_test = mnist.test.labels
	x_test, y_test = mnist.test.next_batch(100)
	temp_ratio = sess.run(accuracy, {x_input: x_test, y_input: y_test, keep_prob: 1.0})
	print(temp_ratio)
	# 最適化を行う
	for i in range(1000):
		step = i + 1
		x_trainer, y_trainer = mnist.train.next_batch(50)
		sess.run(train, {x_input: x_trainer, y_input: y_trainer, keep_prob: 0.5})
		if step % 100 == 0:
			temp_ratio = sess.run(accuracy, {x_input: x_trainer, y_input: y_trainer, keep_prob: 1.0})
			print(step, temp_ratio)
	# 結果の確認
	#x_test = mnist.test.images
	#y_test = mnist.test.labels
	x_test, y_test = mnist.test.next_batch(100)
	temp_ratio = sess.run(accuracy, {x_input: x_test, y_input: y_test, keep_prob: 1.0})
	print(temp_ratio)

# ----------------------------------------------------------------
# ----------------------------------------------------------------
# ----------------------------------------------------------------

