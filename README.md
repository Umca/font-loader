# Fonts Loader

Fonts Loader is a small package that simplifies the process of fonts loading. This package uses native CSS Font Loading API in browsers that support it. In other browsers Font Face Observer, a small @font-face loader, is used under the hood. 
  

## Installation

Use the package manager [npm](https://www.npmjs.com/get-npm) to install this package.

```bash
npm install fonts-loader
```


## Usage

Fonts can be supplied by either a font service or be self-hosted.

```
import { FontsLoader } from fonts-loader'

const loader = new FontsLoader([
        {
            name: 'Hack', 
            source: 'https://cdnjs.cloudflare.com/ajax/libs/hack-font/3.003/web/fonts/hack-regular.woff',
            descriptor: {
                family:'Hack',
                style: 'normal',
                weight: 'normal'
            }
        },
        {
            name: 'Hanalei',
            source: './fonts/Hanalei-Regular.ttf',
        }
    ]
)
```
The FontsLoader constructor takes 2 arguments. The first one is list of fonts. You can give both an array of fonts and separate font object. 

The element of the array is an object, that contains name, source and descriptor properties. Descriptor can contain next options:

These are used by font machine algorithm, have no other effect.
*   family
*   style
*   weight
*   stretch
*   unicodeRange

These turn on / off specific features in fonts that support them. Underhood package Font Face Observer does not support these.
*   variant
*   featureSettings
*   variantionsettings
*   display 

The second optional argument is config. Config can contain such properties as silent (log), error (errors), timer (the default timeout for giving up on font loading is 3 seconds). 

Newly created instance of FontsLoader class is thenable object.

  
## Browser support
* Chrome (desktop)
* Firefox
* Edge
* IE
* Opera


## License
[ISC](https://choosealicense.com/licenses/isc/)
