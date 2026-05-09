URL = http://yann.lecun.com/exdb/mnist
TARGET01 = train-images-idx3-ubyte.gz
TARGET02 = train-labels-idx1-ubyte.gz
TARGET03 = t10k-images-idx3-ubyte.gz
TARGET04 = t10k-labels-idx1-ubyte.gz

get: $(TARGET01) $(TARGET02) $(TARGET03) $(TARGET04)

$(TARGET01):
	curl -L $(URL)/$(TARGET01) -o $@

$(TARGET02):
	curl -L $(URL)/$(TARGET02) -o $@

$(TARGET03):
	curl -L $(URL)/$(TARGET03) -o $@

$(TARGET04):
	curl -L $(URL)/$(TARGET04) -o $@
