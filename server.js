const http = require("http");
const PORT = process.env.PORT || 3000;

const server = http.createServer((req, res) => {
    res.end("CI/CD Pipeline Deployed Successfully!");
});

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
