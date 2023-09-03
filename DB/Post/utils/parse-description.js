const marked = require('marked')
const getDescriptionFromContent = (markdownContent) => {
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
    const bodyElement = jsonData.children.find((element) => element.tag === "body");
    const firstPTag = bodyElement.children.find((element) => element.tag === "p");

    // Get the text content of the first <p> tag

    const firstPTagContent = firstPTag.text.replace(/\n/g, '');
    // Log or use the content as needed
    // console.log('tehe first tag is',firstPTagContent);
    return firstPTagContent
}
module.exports = getDescriptionFromContent