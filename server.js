const express = require('express')
const cors = require('cors')
const { exec } = require('child_process')
const path = require('path')
const fs = require('fs')

const app = express()

app.use(cors())
app.use(express.json())
app.use(express.static('public'))

const downloadsPath = path.join(__dirname, 'downloads')

if (!fs.existsSync(downloadsPath)) {
  fs.mkdirSync(downloadsPath)
}

app.post('/download', (req, res) => {
  const { url } = req.body

  if (!url) {
    return res.json({ error: 'ضع الرابط' })
  }

  const fileName = `video_${Date.now()}.mp4`
  const output = path.join(downloadsPath, fileName)

  const command = `yt-dlp -f mp4 -o "${output}" "${url}"`

  exec(command, (error) => {
    if (error) {
      return res.json({ error: 'فشل التحميل' })
    }

    res.json({
      success: true,
      download: `/file/${fileName}`
    })
  })
})

app.get('/file/:name', (req, res) => {
  const filePath = path.join(downloadsPath, req.params.name)

  if (!fs.existsSync(filePath)) {
    return res.send('الملف غير موجود')
  }

  res.download(filePath)
})

app.listen(3000, () => {
  console.log('Server Running')
})
