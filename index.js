import  "babel-polyfill"
import FontFaceObserver from "fontfaceobserver-es";

class FontsLoader{
    constructor(config)
    {
        this.config = config

        if(document.fonts) {
            document.fonts.ready.then(function() {
                console.warn("Font loading is done. Event is fired in both successul and failed cases.")
            })
        }
    }
    load(){
        if(document.fonts)
            return this.loadNative()
        else 
            return this.loadWithObserver()
    }

    loadNative(){
        // Check if fonts do not have source
        this.config.fonts = this.config.fonts.filter(font => {
            if(!font.source) console.error(`Font ${font.name}. No source provided.`)
            else return font
        })

        // Create FontFace
        let fontFaces = this.config.fonts
        .map(({name, source, descriptor}) => new FontFace(name, `url(${source})`, descriptor))

        fontFaces.forEach(fc => document.fonts.add(fc))

        // Get results of FontFace.load promises (fullfilled and rejected) to control asynchronous flow 
        let fontFacesPromises = fontFaces.map(async fc => {
            try {
                return Promise.resolve(await fc.load())
            } catch(err) {
                return err
            }
        })

        // Get only resolved promises from fontFace.load()
         return new Promise((resolve, reject) => {

            Promise.all(fontFacesPromises).then(fonts => {

                this.errorHandling(fonts)

                Promise.all(
                    fonts
                    .filter(fc => fc instanceof FontFace)
                    .map(fc => fc.loaded))
                .then(fonts => resolve(this.successfullMsg(fonts)))
                .catch(err => reject(err))
            })
         }) 
    }

    loadWithObserver(){
        let style = ''

        this.config.fonts.forEach( font => {
            style+=`
            @font-face {
                font-family: '${font.name}';
                font-style: ${font.descriptor ? font.descriptor.style : 'normal'},;
                font-weight: ${font.descriptor ? font.descriptor.weight : 'normal'},;
                src: url('${font.source}') format("truetype");
            }`
        })

        let head = document.head || document.getElementsByTagName('head')[0]

        let styleTag = document.createElement('style')
        styleTag.type = 'text/css'
        head.appendChild(styleTag)

        if (style.styleSheet){
            // This is required for IE8 and below.
            styleTag.styleSheet.cssText = style;
        } else {
            styleTag.appendChild(document.createTextNode(style));
        }

        let fontFacesPromises = this.config.fonts.map(async family => {
            try {
                let obs = new FontFaceObserver(family.name, family.descriptor)
                return Promise.resolve(await obs.load(null, this.config.timer || 20000))
            } catch(err) {
                return err
            }
        })

        return new Promise((resolve, reject) => {
            Promise.all(fontFacesPromises)
            .then(fonts => {
                this.errorHandling(fonts)
                resolve(this.successfullMsg(fonts.filter(f => (!(f instanceof Error)))))
            })
            .catch(err => reject(err))
        })
    }

    errorHandling(fonts){
        fonts
        .filter(fc => fc instanceof Error)
        .forEach(err => console.error(err.name, err.message))
    }

    successfullMsg(fonts){
        return `FONTS: ${fonts.map(fc => fc.family).join(', ')} loaded.`
    }
}

export { FontsLoader }
