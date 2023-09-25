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
    console.log("elelelelelellelllele : ", result)
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
    console.log("children : ",jsonData.children[1])
    const bodyElement = jsonData.children.find((element) => element.tag === "body");
    const firstPTag = bodyElement.children.find((element) => element.tag === "p" && element.text);
    const firstHeadingTag = bodyElement.children.find((element) => /^h[1-6]$/.test(element.tag)); // Matches any heading tag (h1, h2, h3, ...)

    let firstHeadingTagContent = "";
    if (firstHeadingTag) {
    firstHeadingTagContent = firstHeadingTag.text.replace(/\n/g, '');
    }
    // console.log("heading: ",firstHeadingTagContent)
    // Get the text content of the first <p> tag

    const firstPTagContent = firstPTag.text.replace(/\n/g, '');
    // Log or use the content as needed
    // console.log('tehe first tag is',firstPTagContent);
    const firstImage = bodyElement.children.find((element) => element.tag === "img");
    
    let firstImageAltText = "";
    if (firstImage && firstImage.attributes && firstImage.attributes.alt) {
        firstImageAltText = firstImage.attributes.alt.trim();
    }
    
    let firstImageSrc = "";
    if (firstImage) {
        firstImageSrc = firstImage.attr("src");
        if (firstImageSrc) {
            firstImageSrc = firstImageSrc.trim();
        }
    }
    
    return firstPTagContent
}
module.exports = getDescriptionFromContent