FROM golang:1.18.3

RUN git clone https://github.com/magefile/mage \
&& cd mage \
&& go run bootstrap.go
