export const getDominantColorFromBase64URL = (url: string) => {
  return new Promise<string>((resolve, reject) => {
    const img = new Image()
    img.src = url
    img.onload = () => {
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      if (ctx) {
        ctx.drawImage(img, 0, 0)
        const imageData = ctx.getImageData(0, 0, img.width, img.height)
        const data = imageData.data
        const rgb = [0, 0, 0]
        let count = 0
        for (let i = 0; i < data.length; i += 4) {
          if (data[i + 3] > 125) {
            rgb[0] += data[i]
            rgb[1] += data[i + 1]
            rgb[2] += data[i + 2]
            ++count
          }
        }
        rgb[0] = Math.floor(rgb[0] / count)
        rgb[1] = Math.floor(rgb[1] / count)
        rgb[2] = Math.floor(rgb[2] / count)
        resolve(`rgb(${rgb[0]},${rgb[1]},${rgb[2]})`)
      } else {
        reject('Error')
      }
    }
  })
}
