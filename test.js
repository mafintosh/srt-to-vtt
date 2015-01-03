var tape = require('tape')
var srt2vtt = require('./')
var concat = require('concat-stream')

tape('empty', function(t) {
  var convert = srt2vtt()
  convert.end()
  convert.pipe(concat(function(data) {
    t.same(data.toString(), 'WEBVTT FILE\r\n\r\n')
    t.end()
  }))
})

tape('one entry', function(t) {
  var convert = srt2vtt()
  convert.write('1\r\n00:00:10,500 --> 00:00:13,000\r\nthis is a test\r\n\r\n')
  convert.end()
  convert.pipe(concat(function(data) {
    t.same(data.toString(), 'WEBVTT FILE\r\n\r\n1\r\n00:00:10.500 --> 00:00:13.000\r\nthis is a test\r\n\r\n')
    t.end()
  }))
})

tape('two entries', function(t) {
  var convert = srt2vtt()
  convert.write('1\r\n00:00:10,500 --> 00:00:13,000\r\nthis is a test\r\n\r\n2\r\n00:00:14,500 --> 00:00:15,000\r\nthis is a test\r\n\r\n')
  convert.end()
  convert.pipe(concat(function(data) {
    t.same(data.toString(), 'WEBVTT FILE\r\n\r\n1\r\n00:00:10.500 --> 00:00:13.000\r\nthis is a test\r\n\r\n2\r\n00:00:14.500 --> 00:00:15.000\r\nthis is a test\r\n\r\n')
    t.end()
  }))
})