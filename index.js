import  "babel-polyfill"
import FontFaceObserver from "fontfaceobserver-es";

//descriptor example
// {
//     family,         - used by font machine algorithm, have no othwe effct
//     style,
//     weight,
//     stretch,
//     unicodeRange,
//     variant,        - turn on / off specific features in fonts that support them
//     featureSettings,
//     variantionsettings,
//     display
// }

let defaultConfig = {
    debug: true,
    timer: 3000,
    fonts : [
        {
            name: 'Hack', 
            source: 'https://cdnjs.cloudflare.com/ajax/libs/hack-font/3.003/web/fonts/hack-regular.woff',
            descriptor: {}
        },
        {
            name: 'Hanalei',
            source: './fonts/Hanalei-Regular.ttf',
            descriptor: {}
        },
        {
            name: 'NotoSans',
            source: './fonts/NotoSans-Regular.woff2',
            descriptor: {}
        }
    ]
}

class FontsLoader{
    constructor(config = defaultConfig)
    {
        this.config = config

        if(document.fonts) {
            document.fonts.ready.then(function() {
                console.warn("Font loading is done. Event is fired in both successul and failed cases.")
            })

            this.loadNative()
        }
        else this.loadWithObserver()
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
        Promise.all(fontFacesPromises).then(fontsPr => {
            Promise.all(
                fontsPr
                .filter(fc => fc instanceof FontFace)
                .map(fc => fc.loaded))
            .then(fonts => {
                this.config.debug && fonts.forEach(fc => console.info(`${fc.family} status: ${fc.status}`))

                for(let i = 0 ; i < fonts.length; i++){
                    let p = document.querySelector(`#example${i+1}`)
                    p.style.fontFamily = fonts[i].family
                }
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

        Promise.all(fontFacesPromises)
        .then(fonts => {
            fonts.forEach(f => {
                if(f instanceof Error) console.error(f.name, f.message)
                else{
                    console.info(`${f.family} status: loaded`)
                }
            })
        })
        .catch(err => {
            console.error(err.name, err.message)
        })
    }
}

const loader = new FontsLoader()

export { FontsLoader }
