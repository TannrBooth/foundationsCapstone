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

let currentHex = hex1.value + hex2.value + hex3.value + hex4.value + hex5.value + hex6.value

let chars = ['0','1','2','3','4','5','6','7','8','9','A','B','C','D','E','F']


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
    // let random1 = chars[Math.floor(Math.random() * chars.length)]
    // let random2 = chars[Math.floor(Math.random() * chars.length)]
    // let random3 = chars[Math.floor(Math.random() * chars.length)]
    // let random4 = chars[Math.floor(Math.random() * chars.length)]
    // let random5 = chars[Math.floor(Math.random() * chars.length)]
    // let random6 = chars[Math.floor(Math.random() * chars.length)]
    
    // hex1.value = random1
    // hex2.value = random2
    // hex3.value = random3
    // hex4.value = random4
    // hex5.value = random5
    // hex6.value = random6

    // currentHex = hex1.value + hex2.value + hex3.value + hex4.value + hex5.value + hex6.value
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
    axios.get(`/api/colors`)
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

finalColor.addEventListener('click', randomHex)
addCard.addEventListener('click',addHandler)
randomHex()
getColors()