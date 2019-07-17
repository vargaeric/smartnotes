// import loadImages from "./loadImages";
console.log(__dirname);
const loadImages = url => {
    return new Promise((resolve, reject) => {
      const image = new Image();  
      
      image.onload = function() {
          resolve(image);
      }
      
      image.onerror = function(e) {
          reject(new Error(`Erroare${e}`));
      }
      
      image.src = url;
      
    }).catch(error => {
        throw Error(error);
    })
}
const renderImageInDom = image => {
    const content = document.createElement("img");
    content.src = image.src;
    document.body.appendChild(content);
}

loadImages(`${__dirname}/1.png`).then(img => {
    renderImageInDom(img);
});

// Promise.all([
//     loadImages(`${__dirname}/1.png`),
//     loadImages(`${__dirname}/2.png`),
//     loadImages(`${__dirname}/3.png`),
// ], images => {
//     console.log(images);
// });