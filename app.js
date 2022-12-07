const express = require('express')
const cors = require('cors')
const morgan = require('morgan')

const router = require('./router')

const app = express()

// 解析客户端请求中间件
app.use(express.json())
app.use(express.urlencoded())
// 跨域
app.use(cors())
// 日志
app.use(morgan('dev'))
// 路由
app.use('/api/v1', router)
const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`)
})
