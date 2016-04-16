var split = require('split2')
var pumpify = require('pumpify')
var through = require('through2')
var utf8 = require('to-utf-8')

module.exports = function () {
  var buf = []

  var convert = function () {
    return buf.join('\r\n')
      .replace(/\{\\([ibu])\}/g, '</$1>')
      .replace(/\{\\([ibu])1\}/g, '<$1>')
      .replace(/\{([ibu])\}/g, '<$1>')
      .replace(/\{\/([ibu])\}/g, '</$1>')
      .replace(/(\d\d:\d\d:\d\d),(\d\d\d)/g, '$1.$2') + '\r\n\r\n'
  }

  var write = function (line, enc, cb) {
    if (line.trim()) {
      buf.push(line.trim())
      return cb()
    }

    line = convert()

    buf = []
    cb(null, line)
  }

  var flush = function (cb) {
    if (buf.length) this.push(convert())
    cb()
  }

  var parse = through.obj(write, flush)
  parse.push('WEBVTT FILE\r\n\r\n')
  return pumpify(utf8({newline: false, detectSize: 4095}), split(), parse)
}
