var split = require('split2')
var pumpify = require('pumpify')
var through = require('through2')

module.exports = function() {
  var buf = []
  var first = true

  var write = function(line, enc, cb) {
    if (line.trim()) {
      buf.push(line.trim())
      return cb()
    }

    var line = buf.join('\r\n')
      .replace(/\{\\([ibu])\}/g, '</$1>')
      .replace(/\{\\([ibu])1\}/g, '<$1>')
      .replace(/\{([ibu])\}/g, '<$1>')
      .replace(/\{\/([ibu])\}/g, '</$1>')
      .replace(/(\d\d:\d\d:\d\d),(\d\d\d)/g, '$1.$2')+'\r\n\r\n'

    buf = []
    cb(null, line)
  }

  var parse = through.obj(write)
  parse.push('WEBVTT FILE\r\n\r\n')
  return pumpify(split(), parse)
}