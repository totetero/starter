#!/usr/bin/env python
# -*- coding: utf-8 -*-

# MNIST For ML Beginners
# https://www.tensorflow.org/get_started/mnist/beginners
# TensorFlow MNIST For ML Beginners チュートリアルの実施
# https://qiita.com/uramonk/items/c207c948ccb6cd0a1346
# テンソルフローのサンプルである機械学習初心者向け手書き文字認識

import tensorflow as tf
from tensorflow.examples.tutorials.mnist import input_data

# ----------------------------------------------------------------
# ----------------------------------------------------------------
# ----------------------------------------------------------------
# 初期化フェイズ

init_W = tf.zeros(shape = [28 * 28, 10], dtype = tf.float32)
init_b = tf.zeros(shape = [10], dtype = tf.float32)
W = tf.Variable(initial_value = init_W, dtype = tf.float32)
b = tf.Variable(initial_value = init_b, dtype = tf.float32)
x_input = tf.placeholder(dtype = tf.float32, shape = [None, 28 * 28])
y_input = tf.placeholder(dtype = tf.float32, shape = [None, 10])

# 誤差関数
y_calc = tf.nn.softmax(tf.matmul(x_input, W) + b)
cross_entropy = tf.reduce_mean(-tf.reduce_sum(y_input * tf.log(y_calc), reduction_indices=[1]))

# 最急降下法
optimizer = tf.train.GradientDescentOptimizer(0.5)
train = optimizer.minimize(cross_entropy)

# モデルの評価
correct_prediction = tf.equal(tf.argmax(y_calc, 1), tf.argmax(y_input, 1))
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
	temp = sess.run(accuracy, {x_input: mnist.test.images, y_input: mnist.test.labels})
	print(0, temp)
	for i in range(1000):
		step = i + 1
		x_trainer, y_trainer = mnist.train.next_batch(100)
		sess.run(train, {x_input: x_trainer, y_input: y_trainer})
		if step % 100 == 0:
			temp = sess.run(accuracy, {x_input: mnist.test.images, y_input: mnist.test.labels})
			print(step, temp)
	#tf.summary.FileWriter('./', sess.graph)

# ----------------------------------------------------------------
# ----------------------------------------------------------------
# ----------------------------------------------------------------

