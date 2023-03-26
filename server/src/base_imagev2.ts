import fs from 'node:fs';

const artPaths = fs.readdirSync("src/art")

export const art = artPaths.map((path) => {
   return fs.readFileSync(`src/art/${path}`, 'base64')
  
})

export const getBaseArt = () =>{
    // get random 
    const index = Math.floor(Math.random() * art.length)
    return 'data:image/jpeg;base64,'+ art[index]
}

    



// export const art = fs.readdirSync("./art")

// console.log(art)