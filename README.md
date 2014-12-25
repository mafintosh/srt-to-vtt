# srt-to-vtt

Transform stream that converts srt files to vtt files.
vtt files are used to provide subtitles in html5 video

```
npm install srt-to-vtt
```

[![build status](http://img.shields.io/travis/mafintosh/srt-to-vtt.svg?style=flat)](http://travis-ci.org/mafintosh/srt-to-vtt)

## Usage

``` js
var srt2vtt = require('srt-to-vtt')
var fs = require('fs')

fs.createReadStream('some-subtitle-file.srt')
  .pipe(srt2vtt())
  .pipe(fs.createWriteStream('some-html5-video-subtitle.vtt'))
```

## Command line usage

There is also a command line tool available

```
npm install -g srt-to-vtt
srt-to-vtt --help
```

## License

MIT
