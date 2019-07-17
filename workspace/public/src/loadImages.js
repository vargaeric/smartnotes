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

export default loadImages;