import { FontsLoader } from '../src/loader'

const list = [
    {
        name: 'AlegreyaSans',
        source: './AlegreyaSansSC-Light.ttf',
        descriptor: {
            style: 'normal',
            weight: 300
        }
    },
    {
        name: 'AlegreyaSans',
        source: './AlegreyaSansSC-Bold.ttf',
        descriptor: {
            style: 'normal',
            weight: 800
        }
    }
]

new FontsLoader(list)
    .then(e => {
        document.body.style.fontFamily = list[0].name
        document.body.innerHTML = 'Fonts Loading Done!'
    })
