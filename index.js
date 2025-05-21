const app = require('./app')
const PORT = 3000

app.listen(PORT, () => {
    console.info(`Server is running on http://localhost:${PORT}`)
})
