# Crypto News Analysis
A repository built to compliment the executium [trending news](https://github.com/executium/trending-historical-cryptocurrency-news) API. This repository will concentrate on the timeline of articles released and the effect.

This project fetches JSON data about crypto-currency trends from an Executium `trending-historical-cryptocurrency-news` `endpoint`, and takes this data and displays it in a graph and in a table.

## Installation

1. Clone the repository.
2. Run `npm i` and wait for packages to install.
3. Run `npm start`.
4. Run `npm run build`

## Running in the background
If you want to run the package without having to be logged in the following method *should* work effectively.

```
nohup npm start --prefix /var/www/html/tests/trends/isha > /var/log/trending-news-log 2>&1 &
```
If you are having issues with this then try run `npm cache clean --force`

#### Port selection
If you are running something on port 3000 already it will ask you if you want to change
```bash

Something is already running on port 3000. Probably:
/usr/bin/docker-proxy -proto tcp -host-ip 0.0.0.0 -host-port 3000 -container-ip x.x.x.x -container-port 3000 (pid 9053)
Would you like to run the app on another port instead? `Yes` 

```

## Attributes

#### Effect
Please allow some time for the `effect` to compile, this will show the overall impact
![effect](https://i.imgur.com/mJWhcFW.jpg)

#### Publisher
On each given day you can use the navigation to filter the publishers
![publisher](https://i.imgur.com/gZX45fq.jpg)

## Customize the design
Everything you are looking for in terms of customization can be found in the `src/App.js` file. It can all be customized.

- For example if you are looking to chane the background color

```javascript
const GlobalStyle = createGlobalStyle`
  body {
    font: 14px Ubuntu, sans-serif;
    background: #fff8f8;
  }
```

- Changing the font
The font is loaded in the `src/indx.js` on limne 9

```javascript
WebFont.load({
  google: {
    families: ['Ubuntu|Material+Icons', 'sans-serif'],
  },
})
```
You will need to adjust your font here, and then also adjust the  `src/App.js` file where `font: 14px Ubuntu, sans-serif;` exists.

## Affiliation
I am in noway affiliated with executium or its products. For more terms and conditions you should refer to their terms and conditions.

## License

MIT License

Copyright (c) 2020 cliffordgates

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
