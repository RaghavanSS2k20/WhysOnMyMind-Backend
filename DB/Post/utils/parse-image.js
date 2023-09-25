const marked = require('marked')
const getClickUpImageFromContent = (markdownContent) => {
    // console.log('parse decription called')
    const htmlContent = marked.parse(markdownContent);

    console.log(htmlContent);
    const cheerio = require('cheerio');

    // Load the HTML content into cheerio
    const $ = cheerio.load(htmlContent);

    // Function to convert a cheerio element to JSON
    function elementToJson(element) {
        const result = {
            tag: element[0].name,
        };
    
        // Extract attributes
        console.log("welement: ",result)
        result.attributes = element[0].attribs;
    
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
    console.log("gsggsggsggsggsggsggsggsggsggsggsgggs",jsonData)
    console.log("children : ",jsonData.children[1].children)
    const bodyElement = jsonData.children.find((element) => element.tag === "body");
    const firstPTag = bodyElement.children.find((element) => element.tag === "p" && element.text);
    const firstImageTag = bodyElement.children.find((element) => element.tag === "p" && element.children && element.children[0].tag=="img");
    console.log('GGDGGDGGDGGDGGDGGDGD',firstImageTag)
    const firstHeadingTag = bodyElement.children.find((element) => /^h[1-6]$/.test(element.tag)); // Matches any heading tag (h1, h2, h3, ...)

    let firstHeadingTagContent = "";
    if (firstHeadingTag) {
    firstHeadingTagContent = firstHeadingTag.text.replace(/\n/g, '');
    }
    // console.log("heading: ",firstHeadingTagContent)
    // Get the text content of the first <p> tag

    
    // Log or use the content as needed
    console.log('tehe first tag is',firstPTag);
    // const firstImage = bodyElement.children.find((element) => element.tag === "img");
    
    // let firstImageAltText = "";
    // if (firstImage && firstImage.attributes && firstImage.attributes.alt) {
    //     firstImageAltText = firstImage.attributes.alt.trim();
    // }
    
    let firstImage = null;
let firstImageSrc = "";

if (firstImageTag.children) {
    // Find the first `img` tag within the `p` tag
    firstImage = firstImageTag.children.find((element) => element.tag === "img");
}
console.log("imaegghege: ", firstImage)
// If a `img` tag is found, get its `src` attribute
if (firstImage && firstImage.attributes && firstImage.attributes.src) {
    firstImageSrc = firstImage.attributes.src.trim();
}

    
    return firstImageSrc
}
module.exports = getClickUpImageFromContent