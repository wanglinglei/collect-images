const cheerio = require("cheerio"); // 获取html文档内容
const axios = require("axios");
const fs = require("fs");
const url = require("url");
const path = require("path");
const baseUrl = "https://www.biaoqingbao8.com";

const targetUrl = "https://www.biaoqingbao8.com/bqb/14743/page/1.html";
axios.get(targetUrl).then((res) => {
  // console.log(res.data);
  // 返回html 文档内容 通过cheerio解析
  const $ = cheerio.load(res.data);
  $(".related-site a").each((index, item) => {
    const title = $(item).find("img").attr("title");
    const pageUrl = $(item).attr("href");
    fs.mkdir("./images/" + title, { recursive: true }, () => {
      parsePage(pageUrl, title);
    });
  });
});

async function parsePage(pageUrl, title) {
  const res = await axios.get(baseUrl + pageUrl);
  const $ = cheerio.load(res.data);
  $(".picture-box a").each((index, item) => {
    const imgUrl = $(item).find("img").attr("src");
    const extName = path.parse(url.parse(imgUrl).pathname).ext;
    const targetPath = `./images/${title}/${index}.${extName}`;
    const writeStream = fs.createWriteStream(targetPath);

    axios.get(imgUrl, { responseType: "stream" }).then((res) => {
      res.data.pipe(writeStream);
    });
  });
}
