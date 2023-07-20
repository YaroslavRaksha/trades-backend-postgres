const app = require('./app');
const port = process.env.PORT || 3001;
const host =  process.env.HOST || '192.168.1.131';

app.listen(port, host, () => {
    console.log(`server running on ${host}:${port}`)
})