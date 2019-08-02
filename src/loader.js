import "babel-polyfill"
import FontFaceObserver from "fontfaceobserver-es"

class FontsLoader {

    constructor(fonts, {
        timer = 20000,
        silent = true,
        error = true
    } = {}) {
        this.timer = timer
        this.silent = silent
        this.error = error

        if(document.fonts && !this.silent)
            document.fonts.ready.then(() => 
                console.warn("Font loading is done. Event is fired in both successul and failed cases."))

        // Fonts Array|Object
        if(Array.isArray(fonts))
            this.fonts = fonts
        else this.fonts = [fonts]

        // Check if fonts do not have source
        this.fonts = this.fonts.filter(font => {
            if(!font.source && this.error)
                console.error(`Font ${font.name}. No source provided.`)
            else return font
        })

        if(document.fonts)
            this.promise = this.loadNative()
        else this.promise = this.loadWithObserver()
    }

    then(fn) {
        if (this.promise)
            this.promise.then(fn)
    }

    catch(fn) {
        if (this.promise)
            this.promise.catch(fn)
    }

    loadNative(){
        // Create FontFaces
        this.promises = this.fonts
            .map(({name, source, descriptor}) => 
                new FontFace(name, `url(${source})`, descriptor))
            .map(fc => document.fonts.add(fc) && fc)
            .map(async fc => {
                try {
                    return Promise.resolve(await fc.load())
                } catch(err) {
                    return err
                }
            })

        // Get only resolved promises from fontFace.load()
         return this.wrapIntoPromise(this.promises)
    }

    wrapIntoPromise(promises) {
        return new Promise((resolve, reject) => {

            Promise.all(promises).then(results => {

                let fonts, errors
                if(document.fonts)
                    fonts = results
                        .filter(fc => fc instanceof FontFace)
                        .map(fc => fc.loaded)
                else fonts = results
                    .filter(fc => !fc instanceof Error)

                errors = results
                    .filter(fc => fc instanceof Error)

                if (this.error)
                    this.handleErrors(errors)

                Promise.all(fonts)
                    .then(fonts => resolve(!this.silent && this.success(fonts)))
                    .catch(err => reject(err))
            })
         }) 
    }

    loadWithObserver(){
        let style = ''

        this.fonts.forEach(font => 
            style += this.createFontFaceRule(font))

        let styleTag = document.createElement('style')
        styleTag.type = 'text/css'
        styleTag.innerText = style
        document.head.appendChild(styleTag)

        this.promises = this.fonts.map(async ({name, descriptor}) => {
            try {
                let fc = new FontFaceObserver(name, descriptor)
                return Promise.resolve(await fc.load(null, this.timer))
            } catch(err) {
                return err
            }
        })

        return this.wrapIntoPromise(this.promises)
    }

    createFontFaceRule(font) {
        return `
        @font-face {
            font-family: '${font.name}';
            font-style: ${font.descriptor ? font.descriptor.style : 'normal'};
            font-weight: ${font.descriptor ? font.descriptor.weight : 'normal'};
            src: url('${font.source}') format("truetype");
        }`
    }

    handleErrors(errors){
        errors.forEach(err => 
            console.error(err.name, err.message))
    }

    success(fonts){
        return `FONTS: ${fonts.map(fc => fc.family).join(', ')} loaded.`
    }
}

export { FontsLoader }