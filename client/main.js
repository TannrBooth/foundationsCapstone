let hex1 = document.querySelector('#char-1')
let hex2 = document.querySelector('#char-2')
let hex3 = document.querySelector('#char-3')
let hex4 = document.querySelector('#char-4')
let hex5 = document.querySelector('#char-5')
let hex6 = document.querySelector('#char-6')
let hexName = document.querySelector('#hex-name')
let addCard = document.querySelector('#add-card')
let up = document.querySelectorAll('.up')
let down = document.querySelectorAll('.down')
let finalColor = document.querySelector('#final-color')
let apply = document.querySelector('#apply-color')
let red = document.querySelector('#red-color-bar')
let green = document.querySelector('#green-color-bar')
let blue = document.querySelector('#blue-color-bar')
let rgbContainer = document.querySelector('#rgb-value-container')
let colorList = document.querySelector('#color-list')
let body = document.querySelector('body')
let inputs = document.querySelectorAll('.char')

let currentHex = hex1.value + hex2.value + hex3.value + hex4.value + hex5.value + hex6.value

let chars = ['0','1','2','3','4','5','6','7','8','9','A','B','C','D','E','F']

let badChars = ['G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z','!', '@', '#', '&', '(', ')', '-', '[', '{', '}', ']', ':', ';', `'`, ',', '?', '/', '*', '`', '~', '$', '^', '+', '=', '<', '>', '“']



let updatePage = () => {
    setColor()
    setHexName()
    hexToRGB()
}

const randomHex = () => {
        currentHex = '' 
    for(let i = 0; i < 6; i++){
        let random = chars[Math.floor(Math.random() * chars.length)]
        document.querySelector(`#char-${i + 1}`).value = random
        currentHex += random
    }

    updatePage()
}

const letterToNumber = (char) => {
    if(isNaN(char)){
        let number
        switch (char) {
            case 'A':
                number = 10;
                break;
            case 'B':
                number = 11;
                break;
            case 'C':
                number = 12;
                break;
            case 'D':
                number = 13;
                break;
            case 'E':
                number = 14;
                break;
            case 'F':
                number = 15;
                break;
        }
        return number
    } else {
        return char
    }
}

const updateChar = (num, type) => {
    let newChar = document.querySelector(`#char-${num}`)
    let currentIndex = chars.indexOf(newChar.value)
    if(type === 'up' && currentIndex < 15){
        newChar.value = chars[currentIndex + 1]
        currentHex = hex1.value + hex2.value + hex3.value + hex4.value + hex5.value + hex6.value
        updatePage()

    } else if (type === 'down' && currentIndex > 0){
        let currentIndex = chars.indexOf(newChar.value)
        newChar.value = chars[currentIndex - 1]
        currentHex = hex1.value + hex2.value + hex3.value + hex4.value + hex5.value + hex6.value
        updatePage()
    }
}

const hexToRGB = () => {
    let r = 0
    let g = 0
    let b = 0
    
    r = Number((letterToNumber(hex1.value) * 16)) + Number(letterToNumber(hex2.value))
    g = Number((letterToNumber(hex3.value) * 16)) + Number(letterToNumber(hex4.value))
    b = Number((letterToNumber(hex5.value) * 16)) + Number(letterToNumber(hex6.value))
    
    let rgb = `(${r},${g},${b})`
    rgbContainer.innerHTML = `<p id="rgb-value">RGB ${rgb}</p>`
}

let {rgb} = hexToRGB

let textColorSet = () => {
    let rgbArr = [...rgb]
    let rgbNum = ''
    rgbArr.forEach(char => {
        rgbNum.push(parseInt(char))
    })
    rgbNum = parseInt(rgbNum)
}

let colorCallback = (colors) => {
    displayColorList(colors.data)
}

let addHandler = () => {
    let bodyObj = {
        hex: currentHex
    }
    addColor(bodyObj)


}

const addColor = (body) => {
    axios.post('/api/colors', body)
    .then(colorCallback)
    .catch(err => {
        console.log(err)
    })
}

const getColors = () => {
    console.log('get colors')
    axios.get('/api/colors')
    .then(colorCallback)
    .catch(err => {
        console.log(err)
    })
}

const deleteColor = (id) => {
    axios.delete(`/api/colors/${id}`)
    .then(colorCallback)
    .catch(err => {
        console.log(err)
    })
}

const setColor = () => {
    finalColor.style.background = `#${currentHex}`
    setColorBars()
}


const setHexName = () => {
    hexName.innerHTML = `#${currentHex}`
}

const setColorBars = () => {
    red.style.background = `#${hex1.value}${hex2.value}0000`
    green.style.background = `#00${hex3.value}${hex4.value}00`
    blue.style.background = `#0000${hex5.value}${hex6.value}`
}

const copyHex = () => {
    
    let copyText = hexName
    hexName.select()
    copyText.setSelectionRange(0,6)
    navigator.clipboard.writeText(copyText.value)
    alert("Hex code copied to clipboard")

}

const displayColorList = (arr) => {
    colorList.innerHTML = ``
    for(let i = 0; i < arr.length; i++){
        createCard(arr[i])
    }
}

const createCard = (color) => {
    colorCard = document.createElement('div')
    colorCard.classList.add('color-card')
    let cardHex = color.hex
    colorCard.style.backgroundColor = `#${cardHex}`
    colorCard.innerHTML = `
        <div class="btns-container">            
        <button onclick="deleteColor(${color.id})">x</button>
        </div>
        <p>#${cardHex}</p>
    `
    colorList.appendChild(colorCard)
}



const handlePaste = evt => {
    if(evt.target.localName !== 'input') return;
    evt.preventDefault();
    let paste = (evt.clipboardData || window.clipboardData).getData('text');
    paste = paste.toUpperCase();
    console.log(paste)
    if(paste.startsWith('#')){
        paste = paste.slice(1)
    }
    if(paste.length !== inputs.length){
        alert('Incorrect formatting. Please paste codes with six characters')
        return
    };
    if(badChars.some(i => paste.includes(i))){
        alert('Incorrect formatting. Please paste codes with appropritate letter values')
        return
    }
    inputs.forEach((input) =>{
        input.value = ''})
    inputs.forEach((input, index)=>{
        input.focus()
        input.value = paste[index];
    })
    currentHex = hex1.value + hex2.value + hex3.value + hex4.value + hex5.value + hex6.value
    updatePage()
}

const hoverColor = () => {
    addCard.style.backgroundColor = `#${currentHex}`
}
const hoverColorOff = () => {
    addCard.style.backgroundColor = `gainsboro`
}

inputs.forEach((input, index, arr) => {
    input.addEventListener('input', evt => {
        arr[index + 1]?.focus();
    })
})

finalColor.addEventListener('click', randomHex)
addCard.addEventListener('click',addHandler)
document.addEventListener('paste', handlePaste)
addCard.addEventListener('mouseover', hoverColor)
addCard.addEventListener('mouseout', hoverColorOff)
hex1.addEventListener('keyup', function(e) {
    if (chars.includes(e.key.toUpperCase())){
        this.value = e.key.toUpperCase();
    }
    currentHex = hex1.value + hex2.value + hex3.value + hex4.value + hex5.value + hex6.value
    updatePage()
})
hex1.addEventListener('keyup', function(e) {
    if (chars.includes(e.key.toUpperCase())){
        this.value = e.key.toUpperCase();
    }
    currentHex = hex1.value + hex2.value + hex3.value + hex4.value + hex5.value + hex6.value
    updatePage()
})
hex2.addEventListener('keyup', function(e) {
    if (chars.includes(e.key.toUpperCase())){
        this.value = e.key.toUpperCase();
    }
    currentHex = hex1.value + hex2.value + hex3.value + hex4.value + hex5.value + hex6.value
    updatePage()
})
hex3.addEventListener('keyup', function(e) {
    if (chars.includes(e.key.toUpperCase())){
        this.value = e.key.toUpperCase();
    }
    currentHex = hex1.value + hex2.value + hex3.value + hex4.value + hex5.value + hex6.value
    updatePage()
})
hex4.addEventListener('keyup', function(e) {
    if (chars.includes(e.key.toUpperCase())){
        this.value = e.key.toUpperCase();
    }
    currentHex = hex1.value + hex2.value + hex3.value + hex4.value + hex5.value + hex6.value
    updatePage()
})
hex5.addEventListener('keyup', function(e) {
    if (chars.includes(e.key.toUpperCase())){
        this.value = e.key.toUpperCase();
    }
    currentHex = hex1.value + hex2.value + hex3.value + hex4.value + hex5.value + hex6.value
    updatePage()
})
hex6.addEventListener('keyup', function(e) {
    if (chars.includes(e.key.toUpperCase())){
        this.value = e.key.toUpperCase();
    }
    currentHex = hex1.value + hex2.value + hex3.value + hex4.value + hex5.value + hex6.value
    updatePage()
})



randomHex()
getColors()

console.log('lowercase hex: abcdef')
console.log('hex with bad letters: APG544')
console.log('too many characters: 1234567')
