var tape = require('tape')
var srt2vtt = require('../')
var concat = require('concat-stream')
var fs = require('fs')

tape('empty', function (t) {
  var convert = srt2vtt()
  convert.end()
  convert.pipe(concat(function (data) {
    t.same(data.toString(), 'WEBVTT FILE\r\n\r\n')
    t.end()
  }))
})

tape('one entry', function (t) {
  var convert = srt2vtt()
  convert.write('1\r\n00:00:10,500 --> 00:00:13,000\r\nthis is a test\r\n\r\n')
  convert.end()
  convert.pipe(concat(function (data) {
    t.same(data.toString(), 'WEBVTT FILE\r\n\r\n1\r\n00:00:10.500 --> 00:00:13.000\r\nthis is a test\r\n\r\n')
    t.end()
  }))
})

tape('one entry with position an8', function (t) {
  var convert = srt2vtt()
  convert.write('1\r\n00:00:35.490 --> 00:00:38.720\r\n{\\an8}<i><font color="#ffff00">hello\r\n\r\n')
  convert.end()
  convert.pipe(concat(function (data) {
    t.same(data.toString(), 'WEBVTT FILE\r\n\r\n1\r\n00:00:35.490 --> 00:00:38.720 line:5%\r\n<i><font color="#ffff00">hello\r\n\r\n')
    t.end()
  }))
})

tape('two entries', function (t) {
  var convert = srt2vtt()
  convert.write('1\r\n00:00:10,500 --> 00:00:13,000\r\nthis is a test\r\n\r\n2\r\n00:00:14,500 --> 00:00:15,000\r\nthis is a test\r\n\r\n')
  convert.end()
  convert.pipe(concat(function (data) {
    t.same(data.toString(), 'WEBVTT FILE\r\n\r\n1\r\n00:00:10.500 --> 00:00:13.000\r\nthis is a test\r\n\r\n2\r\n00:00:14.500 --> 00:00:15.000\r\nthis is a test\r\n\r\n')
    t.end()
  }))
})

tape('latin1 encoding', function (t) {
  var convert = srt2vtt()
  fs.createReadStream('./test/data/latin1.srt').pipe(convert).pipe(concat(function (data) {
    t.same(data.toString(), 'WEBVTT FILE\r\n\r\n1\r\n00:01:04.440 --> 00:01:07.318\r\n<i>Todo está bien, hijo.</i>\r\n\r\n2\r\n00:01:08.611 --> 00:01:13.491\r\n<i>Ya sé que quieres\r\nque esto se acabe.</i>\r\n\r\n3\r\n00:01:19.997 --> 00:01:22.124\r\n<i>Estoy aquí contigo.</i>\r\n\r\n')
    t.end()
  }))
})

tape('missing file ending CRLF', function (t) {
  var convert = srt2vtt()
  convert.write('1\r\n00:00:10,500 --> 00:00:13,000\r\nthis is a test\r\n\r\n2\r\n00:00:14,500 --> 00:00:15,000\r\nthis is a test\r\n')
  convert.end()
  convert.pipe(concat(function (data) {
    t.same(data.toString(), 'WEBVTT FILE\r\n\r\n1\r\n00:00:10.500 --> 00:00:13.000\r\nthis is a test\r\n\r\n2\r\n00:00:14.500 --> 00:00:15.000\r\nthis is a test\r\n\r\n')
    t.end()
  }))
})
