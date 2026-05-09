#!/usr/bin/env python
# -*- coding: utf-8 -*-

# Qiita 機械学習ライブラリTensorFlowで学習しない〜フィボナッチ数列
# https://qiita.com/n_kats_/items/252a4cea0dc8eca8f980
# 普通のフィボナッチ

import tensorflow as tf

# ----------------------------------------------------------------
# ----------------------------------------------------------------
# ----------------------------------------------------------------
# 初期化フェイズ

u = tf.Variable(initial_value = 1, dtype = tf.int32)
v = tf.Variable(initial_value = 0, dtype = tf.int32)

update_u = tf.assign(u, tf.add(u, v))
update_v = tf.assign(v, tf.subtract(u, v))

# 実行前の初期化
init = tf.global_variables_initializer()

# ----------------------------------------------------------------
# ----------------------------------------------------------------
# ----------------------------------------------------------------
# 実行フェイズ

# セッションを作って実行する
with tf.Session() as sess:
	sess.run(init)
	step = 1
	test_u = 1
	test_v = 0
	temp_u = sess.run(u)
	print(1, temp_u)
	for i in range(99):
		sess.run(update_u)
		sess.run(update_v)
		step = step + 1
		test_u = test_u + test_v
		test_v = test_u - test_v
		temp_u = sess.run(u)
		print(step, test_u, temp_u)

# ----------------------------------------------------------------
# ----------------------------------------------------------------
# ----------------------------------------------------------------

