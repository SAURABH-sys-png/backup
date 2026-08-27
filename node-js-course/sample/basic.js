const fs = require("fs");
const http = require("http");

const server = http.createServer((req, res) => {
  console.log(req.url);
  const path = req.url;

  // Set CORS headers for all incoming requests
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");

  // Handle preflight requests
  if (req.method === "OPTIONS") {
    res.writeHead(204);
    return res.end();
  }

  if (path === "/" || path === "/main") {
    res.end("This is the msg for seeing the overview");
  } else if (path === "/pages") {
    res.end("This is for viewing the pages");
  } else if (path === "/api") {
    fs.readFile("./data/deliv.json", "utf-8", (error, data) => {
      if (error) {
        res.writeHead(500, { "Content-Type": "text/html" });
        return res.end("<h1>Error reading data file</h1>");
      }
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(data);
    });
  } else {
    res.writeHead(404, { "Content-Type": "text/html" });
    res.end("<h1>page not found dear</h1>");
  }
});

server.listen(8000, "127.0.0.1", () => {
  console.log("Server is listening on port 8000...");
});
