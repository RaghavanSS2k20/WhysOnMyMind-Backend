const marked = require('marked')
const getHeadingFromContent = (markdownContent) => {
    // console.log('parse decription called')
    const htmlContent = marked.parse(markdownContent);

    // console.log(htmlContent);
    const cheerio = require('cheerio');

    // Load the HTML content into cheerio
    const $ = cheerio.load(htmlContent);

    // Function to convert a cheerio element to JSON
    function elementToJson(element) {
    const result = {
        tag: element[0].name,
    };

    if (element.text().trim()) {
        result.text = element.text().trim();
    }

    if (element.children().length) {
        result.children = [];
        element.children().each((index, child) => {
        result.children.push(elementToJson($(child)));
        });
    }

    return result;
    }

    // Convert the entire HTML document to JSON
    const jsonResult = elementToJson($('html'));

    // Serialize the JSON object to a string
    // const jsonString = JSON.stringify(jsonResult, null, 2);

    const jsonData = jsonResult
    // console.log(jsonData.children)
    const bodyElement = jsonData.children.find((element) => element.tag === "body");
    const firstPTag = bodyElement.children.find((element) => element.tag === "p");
    const firstHeadingTag = bodyElement.children.find((element) => /^h[1-6]$/.test(element.tag)); // Matches any heading tag (h1, h2, h3, ...)

    let firstHeadingTagContent = "";
    if (firstHeadingTag) {
    firstHeadingTagContent = firstHeadingTag.text.replace(/\n/g, '');
    }
    // console.log("heading: ",firstHeadingTagContent)
    // Get the text content of the first <p> tag

   
    // Log or use the content as needed
    // console.log('tehe first tag is',firstPTagContent);
    return  firstHeadingTagContent
}
module.exports = getHeadingFromContent