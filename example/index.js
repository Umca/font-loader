import { FontsLoader } from '../src/index'

const list = [
    { name: 'AlegreyaSans-Light', source: './AlegreyaSansSC-Light.ttf', metadata: { 
        family: 'AlegreyaSans',
        style: 'normal',
        weight: 300
    }},
    { name: 'AlegreyaSans-Bold', source: './AlegreyaSansSC-Bold.ttf', metadata: {
        family: 'AlegreyaSans',
        style: 'normal',
        weight: 800
    }},
    { name: 'SairaStencilOne-Regular', source: './SairaStencilOne-Regular.ttf', metadata: {
        family: 'SairaStencilOne',
        style: 'normal',
        weight: 'normal'
    }},
]

const loader = new FontsLoader() 

loader
.load(list)
.then(e => {
    console.log(e)
    for(let i = 0 ; i < list.length; i++)
    {
        let p = document.createElement('p')
        p.innerHTML = 'Some example text.'
        p.style.fontFamily = list[i].name
        p.style.fontWeight = list[i].metadata.weight
        document.body.appendChild(p)
    }
})