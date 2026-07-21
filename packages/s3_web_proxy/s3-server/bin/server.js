#!/usr/bin/env node

const express = require("express")
const AWS = require("aws-sdk")
const argv = require("minimist")(process.argv.slice(2))
const path = require("node:path")
const fs = require("node:fs")
const http = require("http")
const https = require("https")
const Mustache = require("mustache")

// Load the list html
const listHtmlFile = path.resolve(__dirname, "../lib/list.html")
const listHtml = fs.readFileSync(listHtmlFile).toString()
Mustache.parse(listHtml)

const endpoint = argv.endpoint || process.env.S3_SERVER_ENDPOINT
const bucket = argv.bucket || process.env.S3_SERVER_BUCKET
const port = argv.p || argv.port || process.env.S3_SERVER_PORT || 3010
const securePort = argv.securePort || process.env.S3_SERVER_SECURE_PORT || 3020
const securePassphrase = argv.securePassphrase || process.env.S3_SERVER_SECURE_PASSPHRASE
const noCache = argv.noCache || process.env.NO_CACHE

var privateKey, certificate
if (process.env.S3_SERVER_SECURE_KEY_FILE || argv.secureKey) {
  privateKey = fs.readFileSync(argv.secureKey || process.env.S3_SERVER_SECURE_KEY_FILE, "utf8")
  certificate = fs.readFileSync(argv.secureCert || process.env.S3_SERVER_SECURE_CERT_FILE, "utf8")
}

const prefix = argv.prefix || process.env.S3_KEY_PREFIX || ""

console.log("Serving " + bucket + " on port " + port)

const s3 = new AWS.S3({ endpoint: endpoint })

const app = express()

function loadPrefixes(prefix, callback) {
  s3.listObjects(
    {
      Bucket: bucket,
      Delimiter: "/",
      EncodingType: "url",
      Prefix: prefix
    },
    callback
  )
}

function serve(path, res) {
  s3.getObject({ Bucket: bucket, Key: path }, function (err, data) {
    if (err) {
      res.status(err.statusCode)
      res.end()
      return
    } else {
      res.status(200)
    }

    const headers = {
      "Content-Length": data.ContentLength,
      "Last-Modified": data.LastModified,
      Expiration: data.Expiration,
      Etag: data.ETag,
      "Content-Encoding": data.ContentEncoding,
      "Content-Type": data.ContentType,
      "Timing-Allow-Origin": "*"
    }

    if (noCache) {
      headers["Cache-Control"] = "no-cache"
    }

    res.set(headers)

    res.write(data.Body)
    res.end()
  })
}

function serveList(prefixes, res) {
  res.write(
    Mustache.render(listHtml, {
      prefixes: prefixes,
      s3Bucket: bucket
    })
  )
  res.end()
}

app.use((req, res, next) => {
  if ((process.env.ALLOWED_ORIGINS || "").length === 0) {
    res.setHeader("Access-Control-Allow-Origin", "*")
  } else {
    const allowedOrigins = process.env.ALLOWED_ORIGINS.split(",")
    const origin = req.headers.origin
    const originHostname = origin ? origin.replace(/^https?:\/\//, "") : ""

    if (allowedOrigins.includes(originHostname)) {
      res.setHeader("Access-Control-Allow-Origin", origin)
    }
  }

  res.setHeader("Access-Control-Allow-Methods", "GET")
  res.setHeader("Access-Control-Allow-Headers", "Host,Content-*")
  res.setHeader("Access-Control-Max-Age", "3000")

  next()
})

app.use(function (req, res, next) {
  const path = prefix + req.path.substr(1)

  if (path === "" || path.slice(-1) === "/") {
    loadPrefixes(path, function (err, data) {
      if (err) {
        console.error(err)
        res.status(err.statusCode)
        res.write(err)
        res.end()
        return
      }

      if (data.Contents.length) {
        var indexPath
        data.Contents.some(function (obj) {
          if (obj.Key.index("index.html") !== -1) {
            indexPath = obj.Key
            return true
          }
        })

        if (indexPath) {
          serve(indexPath, res)
        } else {
          serveList(data.CommonPrefixes, res)
        }
      } else {
        serveList(data.CommonPrefixes, res)
      }
    })
  } else {
    serve(path, res)
  }
})

http.createServer(app).listen(port)

if (privateKey) {
  var credentials = { key: privateKey, cert: certificate }
  if (securePassphrase) {
    credentials.passphrase = securePassphrase
  }

  https.createServer(credentials, app).listen(securePort)
}
