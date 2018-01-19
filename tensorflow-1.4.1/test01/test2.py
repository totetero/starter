#!/usr/bin/env python
# -*- coding: utf-8 -*-

# Qiita 多分もっともわかりやすいTensorFlow 入門 (Introduction)
# https://qiita.com/junichiro/items/8886f3976fc20f73335f

import tensorflow as tf
import numpy as np

# ----------------------------------------------------------------
# ----------------------------------------------------------------
# ----------------------------------------------------------------
# 初期化フェイズ

# y = x * 0.1 + 0.3
# 入力データとして100個のグラフ上の点を用意する
x_data = np.random.rand(100).astype(np.float32)
y_data = x_data * 0.1 + 0.3

# y = x * W + b
# Wとbを用いてモデル化する まずは初期値を設定する
W = tf.Variable(tf.random_uniform([1], -1.0, 1.0))
b = tf.Variable(tf.zeros([1]))
y = W * x_data + b

# 線形回帰のコスト関数の定義
loss = tf.reduce_mean(tf.square(y - y_data) / 2)
# 学習率0.5で最急降下法
optimizer = tf.train.GradientDescentOptimizer(0.5)
# コストを最小にする計算
train = optimizer.minimize(loss)

# 実行前の初期化
init = tf.global_variables_initializer()

# ----------------------------------------------------------------
# ----------------------------------------------------------------
# ----------------------------------------------------------------
# 実行フェイズ

sess = tf.Session()
sess.run(init)
print(0, sess.run(W), sess.run(b))
for i in range(200):
	step = i + 1
	sess.run(train)
	if step % 20 == 0:
		print(step, sess.run(W), sess.run(b))
sess.close()

# ----------------------------------------------------------------
# ----------------------------------------------------------------
# ----------------------------------------------------------------

