let deck = [
    "The Fool", 
    "The Magician",
    "The High Priestess",
    "The Empress",
    "The Emperor",
    "The Hierophant",
    "The Lovers",
    "The Chariot",
    "Strength",
    "The Hermit",
    "Wheel of Fortune",
    "Justice",
    "The Hanged Man",
    "Death",
    "Temperance",
    "The Devil",
    "The Tower",
    "The Star",
    "The Moon",
    "The Sun",
    "Judgement",
    "The World"
    ]
let direction = [
    "Upright",
    "Upright",
    "Upright",
    "Reversed"
]

let pullResult = []
let result = ``
let input = document.getElementById("input")
let main = document.getElementById("main")
let cardExhibit = document.getElementById("cardExhibit")
cardExhibit.style.width = `${180 + window.innerWidth/5}px`
let startPage = document.getElementById('start')
let questionPage = document.getElementById("question")
let center = document.getElementById("center")
let reading
let guide = document.getElementById("guide")
input.placeholder = "What do you want to ask?"

document.body.style.fontFamily = "Josefin Sans"

function getRandom(min, max) {
return Math.random() * (max - min) + min;
}
function degree(num){
return (num)*(Math.PI/180)
}

//This function took reference from https://stackoverflow.com/questions/78391185/how-do-i-avoid-sdk-and-use-raw-fetch-with-groq-api
//Thanks to GroqCloud for providing free chat bot api
async function callGroq() {

    let question = input.value
    if (input.value !== ""){
        question = input.value
    } else {
        question = "Tarot reading in general"
    }
    console.log(question)

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                //Got warned by github for exposed key, but since short-term and free use I think its fine
                //to expose it. I have no idea how to hide it anywys
                Authorization: `Bearer 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`
            },
            body: JSON.stringify({
                messages: [
                    {
                        role: 'system',
                        content:
                        `
                        Please return your response solely as a valid 5 object JSON array with one object per card 
                        and a object at the end a long comprehensive analysis of all cards altogether.
                        Follow the following spread: 
                        card 1 = what you need to know card 2 = what you need to embrace card 3 = what you need to release card 4 = whats next?
                        Each card object should have this structure: 
                        {"cardName": "string", "direction": "string", "meaning": "string", "implication": "string", "advice": "string"} 
                        and the analysis object should have this:
                        {"analysis": "string"}
                        and no other text other than the JSON array.
                         Make sure the advice is about a paragraph long,
                         get as specific as possible, consider the cards as a whole as see how they interact with each other
                         provide imaginary situations as examples to further explain when necessary, and give a straightforward
                         un-ambiguous solution or outcome predicted by the cards, may it be undesired and discouraging if necessary.
                         and its okay to offer negative analysis if necessary`
                    },
                    {
                        role: 'user',
                        content: `Prompt: ${question}. Tarot Deck: ${result}`
                    }
                ],
                model: 'llama3-70b-8192',
                temperature: 1,
                top_p: 1,
                stream: false,
                stop: null
            })
        });

        if (response.ok) {
            const data = await response.json();
            let dataContent = data.choices[0].message?.content
            console.log(dataContent);
//Adjustment code to fix the ending of the JSON output of AI
//Some how the outputs often lack either "] or "}]" at the end
            if(!dataContent.endsWith("]")){
                if(!dataContent.endsWith("}")){
                    if(!dataContent.endsWith(`"`)){
                        dataContent += '"}]'
                    }else{
                    dataContent += "}]"
                    }
                }else{
                    dataContent += "]"
                }
                console.log(dataContent)
            }

            return JSON.parse(dataContent);
        } else {
            console.error(await response.json());
            console.log("omg")
        }
    }

async function start(){
result = ""
for (i=0;i<4;i++){
    pullResult.push(chooseResult[i][0], chooseResult[i][1])
    result +=  ` card${i+1} name: ${chooseResult[i][0]} direction: ${chooseResult[i][1]}.`
}

console.log(result)
    reading = await callGroq()

// for(let i=0;i<4;i++){
//     let card = document.createElement("ul")
//     let name = document.createElement("li")
//     let direction = document.createElement("li")
//     let meaning = document.createElement("li")
//     let implication = document.createElement("li")
//     let advice = document.createElement("li")
//     name.innerHTML = "<strong>"+ reading[i].cardName+"</strong>"
//     direction.innerHTML = reading[i].direction
//     meaning.innerHTML = reading[i].meaning
//     implication.innerHTML = reading[i].implication
//     advice.innerHTML = reading[i].advice
//     card.append(name,direction,meaning,implication,advice)
//     main.appendChild(card)
// }
//     let general = document.createElement("p1")
//     general.innerHTML = reading[4].analysis
//     main.appendChild(general)
}

//TAROT CARD FUNCTION

let reverses = document.getElementsByClassName("cardReverse")        
let cardShow = document.getElementById("cardShow")


function tarotCard(){
let card = document.createElement("div")
card.className = "card"
let effect = document.createElement("div")
let cardReverse = document.createElement("div")
let cardFace = document.createElement("div")
cardReverse.className = "cardReverse"
let cardUpright = document.createElement("div")
cardUpright.className = "cardUpright"
let cardBack = document.createElement("div")
cardBack.className = "cardBack"
effect.className = "eff"
cardUpright.append(cardReverse)
cardUpright.append(cardBack)
cardUpright.append(cardFace)
card.append(effect,cardUpright)
return card
}



let chooseResult = []
let chosenNum = []
let chooseState = false

function chooseStart(){
setTimeout(()=>{
    questionPage.style.transform = "translate(0px,1000px)"
},1000)
setTimeout(()=>{
    chooseState = true
},2000)
}

function startGo(){
//restart//
pullResult = []
result = ``
chooseResult = []
chosenNum = []
chooseState = false
reading
//
let deckT = [...deck]
let content = []
let chose = false
let infoDisplay = false
let revealNum = 0
revealNum = 0
let displayNum = 0
let chosenArray = []
questionPage.style.transform = "translate(0px,160px)"
cardShow.innerHTML = ""
guide.innerHTML = ""

for(let i=0; i<22;i++){
    let card = tarotCard()
    cardShow.append(card)
}

for(let i=0; i<22;i++){
let card = cardShow.children[i]
let cardNum = Math.floor(Math.random()*(22-i))
let orderNum = 0
let directionNum = Math.floor(Math.random()*4)
let upright = card.children[1]
let reverse = card.children[1].children[0]
let face = card.children[1].children[2]
content.push([deckT[cardNum], direction[directionNum]])
let cardName = deckT[cardNum].split(" ").join("")
face.innerHTML = `<img src=image/${cardName}.JPG style="width: 100%">`
reverse.innerHTML = `<img src=image/${cardName+"Reversed"}.JPG style="height: 145px; position: absolute;">`
deckT.splice(cardNum,1)
let cover = card.children[1].children[1]
let effect = card.children[0]
let reverseTrigger = false
let chosenCard = false
let analysisState = false
let analysis = document.getElementById("analysis")
let analysisContent = document.getElementById("analysisContent")

let zValue = 50+i
card.style.zIndex = `${zValue}`
let height = 0
let squareNum = 0
let yOriginal = 0
let xOriginal = 0
let charT = 0


let randomNum = getRandom(0,22)
upright.style.animation = `cardAnimation 7s ease-in-out infinite`
let cardTranslationX = 0
let cardTranslationY = 0
let rotateAngle = 0 

const conditionChecker1 = setInterval(() => {
    if (chooseState === true) {
      clearInterval(conditionChecker1); 
      cardPick()
    }
  }, 100);

function cardPick(){
cardShow.style.transform = "translate(0px,110px)"
setTimeout(()=>{
    cardTranslationX = 280*Math.cos(degree(220+i*100/22))
    cardTranslationY = 50+40*Math.sin(degree(i*180/22))
    rotateAngle = 30-i*(60/22)
    yOriginal = cardTranslationY
    xOriginal = cardTranslationX
    setTimeout(()=>{
        upright.style.animationDelay = `${-randomNum*(7/22)}s`
    },200)
    setTimeout(()=>{
        upright.style.backgroundColor = `rgb(${i*(255/22)},${i*(255/22)},${i*(255/22)})`
        card.addEventListener("mouseenter",hover)
        card.addEventListener("mouseleave",dehover)
        card.addEventListener("click",choose)
    },2500)
},1000)
}


setTimeout(apply, 10)
function apply(){
    card.style.transform = `translate(${cardTranslationX}px,${cardTranslationY}px)`
    card.style.rotate = `${rotateAngle}deg`
    card.style.transformOrigin =  `${xOriginal}px ${75 + yOriginal}px`
}

setInterval(apply,100)

function hover(){
    if(chose !== true && chooseState === true){
    card.style.scale = 1.1
    if(cardTranslationY < cardTranslationY+30){
    cardTranslationY += 30
    }
    }
    if(chose === true && chosenCard === true){
        card.style.scale = 1.15
        for(let aCard of cardShow.children){
            if(aCard !== card){
                aCard.style.scale = 0.95
            }
        }
    }
}
function dehover(){
    if(chose !== true && chooseState === true){
    card.style.scale = 1
    cardTranslationY = yOriginal
    }
    if(chose === true && chosenCard === true){
    for(let i = 0; i < 4; i++){
            cardShow.children[i].style.scale = 1
    }
    }
}
function choose(){
    if(chose !== true && chooseState === true){
    chooseResult.push(content[i])
    chosenNum.push(i)
    orderNum = chosenNum.length
    chosenArray.push(card)
    chooseEnd()
    upright.style.animation = ""
    upright.style.rotate = "0deg"
//    card.style.transform = `translate(${cardTranslationX}px,${cardTranslationY}px)`
//   card.style.transform = `translate(${cardTranslationX}px,${cardTranslationY+100}px)`
   card.removeEventListener("mouseenter",hover)
   card.removeEventListener("mouseleave",dehover)
   card.removeEventListener("click",choose)
   if(chooseResult.length>=4){
    chose = true
    start()
    console.log(chooseResult)
    }
    }
}
function chooseEnd(){
    cardTranslationY = 250
    cardTranslationX = -200+(chooseResult.length-1)*(400/3)
    rotateAngle = 0
    card.style.scale = 1
    setTimeout(()=>{
        yOriginal = cardTranslationY
        xOriginal = cardTranslationX
        card.style.animation = `cardAnimation 7s ease-in-out ${-7/4}s infinite`
    },  2500)
}

const conditionChecker2 = setInterval(() => {
    if (chose === true) {
      clearInterval(conditionChecker2); 
      finishChoose();   
    }
  }, 100);
  
function finishChoose(){
  if(chose === true){
    setTimeout(startSpread,3500)
if(i !== chosenNum[0] &&  i!== chosenNum[1] &&  i!== chosenNum[2] &&  i!== chosenNum[3]){
    upright.style.animation = ""
    upright.style.rotate = "0deg"
    cardTranslationX = 0
    cardTranslationY = 0
    rotateAngle = 0
    card.style.scale = 1
    setTimeout(()=>{
        cardTranslationY = -700
        setTimeout(()=>{
            cardTranslationY = -400
            if(cardShow.children.length>4){
            cardShow.removeChild(card)
            }
        },500)
    },2500)
}else{
    chosenCard = true
}
}
}
function startSpread(){
    card.addEventListener("mouseenter",hover)
    card.addEventListener("mouseleave",dehover)
    card.style.transition = "transform 1.5s, rotate 2.5s, scale 1s"
    center.style.zIndex = 100
    if(orderNum === 2){
        cardTranslationX = -150
        cardTranslationY = 130
        xOriginal = cardTranslationX
        yOriginal = cardTranslationY
    } else if (orderNum === 3){
        cardTranslationX = 150
        cardTranslationY = 130
        xOriginal = cardTranslationX
        yOriginal = cardTranslationY
    } else if (orderNum ===1){
        cardTranslationX = 0
        cardTranslationY = 0
        xOriginal = cardTranslationX
        yOriginal = cardTranslationY
    } else {
        cardTranslationX = 0
        cardTranslationY = 260
        xOriginal = cardTranslationX
        yOriginal = cardTranslationY
    }
    revealCard()

    window.addEventListener("click",()=>{
        console.log("window")
            infoDisplay = false
            analysisState = false

        cardExhibit.style.transform = "translate(-40vw,0px)"
        cardExhibit.style.opacity = "0"
        analysis.style.transform = "translate(0vw, 500px)"
        analysis.style.opacity = "0"
        guide.style.opacity = "1"
  
        if(orderNum === 2){
            cardTranslationX = -150
            cardTranslationY = 130
            xOriginal = cardTranslationX
            yOriginal = cardTranslationY
            upright.style.scale = 1
        } else if (orderNum === 3){
            cardTranslationX = 150
            cardTranslationY = 130
            xOriginal = cardTranslationX
            yOriginal = cardTranslationY
            upright.style.scale = 1
        } else if (orderNum ===1){
            cardTranslationX = 0
            cardTranslationY = 0
            xOriginal = cardTranslationX
            yOriginal = cardTranslationY
            upright.style.scale = 1
        } else {
            cardTranslationX = 0
            cardTranslationY = 260
            xOriginal = cardTranslationX
            yOriginal = cardTranslationY
            upright.style.scale = 1
        }
    
    })
}
function revealCard(){
    guide.innerHTML = "click to flip the cards"
    card.addEventListener("click",()=>{
        card.children[1].style.animation = "cardFlip 1.8s ease-in-out"
        setTimeout(()=>{
            cover.style.opacity = "0"
        },900)
        setTimeout(()=>{
            reverseTrigger = true
        },2000)
        card.addEventListener("click",(event)=>{
            showReading()
            event.stopPropagation()
        })
        if(revealNum < 4){
            revealNum += 1
        }
        if(revealNum === 4){
            guide.innerHTML = "click on card to show card analysis <br> click on the center to see the overview <br> press r to restart"
        }
    })
}

setInterval(() => draw(effect), 80)
setInterval(() => coverAnimation(effect),10)

function coverAnimation(targetBody){
    if(reverseTrigger === true && directionNum === 3){
     if(height <= 150){
        height += 0.7
    } 
    if(squareNum <= 100 && height <90){
        squareNum += 2
    }
    if(height>=90){
        squareNum -= 0.9
    }
    
    }

    reverse.style.height = `${height}px`
    if(height<=145){
    targetBody.style.transform = `translate(0px,${height}px)`
    }
    }  
    
function draw(targetBody){
    targetBody.innerHTML = ""
    if(reverseTrigger === true){
        for(i=0;i<squareNum;i++){
            let size = 100/21
            let num1 = getRandom(-0.5,0.5)
            let num2 = getRandom(-1.6,1.6)
            let color = Math.floor(Math.random()*360)
            let square = document.createElement("div")
            square.style.backgroundColor = `hsl(${color},100%,50%)`
            square.style.position = "absolute"
            square.style.width = `${size}px`
            square.style.height = `${size}px`
            square.style.transform = `translate(${Math.floor(Math.pow(num1,3)*105)*size}px,${Math.floor(1.5+num2)*size}px)`
            targetBody.append(square)  
        }
        }
    }

function showReading(){
    if(revealNum === 4){
    addEventListener("keydown",restart)
    infoDisplay = true
    analysisState = false
    analysis.style.transform = "translate(0vw, 500px)"
    analysis.style.opacity = "0"
    card.style.scale = 1
    let name = document.getElementById("name")
    let direction = document.getElementById("direction")
    let meaning = document.getElementById("meaning")
    let implication = document.getElementById("implication")
    let advice = document.getElementById("advice")
    let num = orderNum - 1
    displayNum = orderNum
    name.innerHTML = "<strong>"+ reading[num].cardName+"</strong>"
    direction.innerHTML = reading[num].direction
    meaning.innerHTML = reading[num].meaning
    implication.innerHTML = reading[num].implication
    advice.innerHTML = reading[num].advice
    }
}

setInterval(() => {
    analysis.style.width = `${380 + window.innerWidth/8}px`
    if (infoDisplay === true) {
      if(orderNum === displayNum){
        cardTranslationX = 80+window.innerWidth/8
        cardTranslationY = 130
        xOriginal = cardTranslationX
        yOriginal = cardTranslationY
        let scaleBase = 1.2
        let scaleAdd = 0
        card.style.scale = 1
        cardExhibit.style.transform = `translate(${-130-window.innerWidth/8}px,0px)`
        cardExhibit.style.width = `${180 + window.innerWidth/5}px`
        cardExhibit.style.opacity = "1"

        if(window.innerWidth >= 600){
            scaleAdd = window.innerWidth*(0.3/1120)
        }
        
        let scaleTot = scaleBase + scaleAdd
        upright.style.scale = scaleTot
      } else {
        if(orderNum === 1){
            cardTranslationY = -1000
        }
        if(orderNum === 2){
            cardTranslationX = -1000
        }
        if(orderNum === 3){
            cardTranslationX = 1000
        }
        if(orderNum === 4){
            cardTranslationY = 1000
        }
      }


    }
  }, 100);
  
center.addEventListener("mouseenter", central)
center.addEventListener("mouseleave", decentral)
center.addEventListener("click", (event)=>{
    showAnalysis()
    event.stopPropagation()
})
function central(){
    console.log("enter")
    if(revealNum === 4 && analysisState === false && infoDisplay === false){
        if(orderNum === 1){
            cardTranslationY = -40
            card.style.scale = 1.1
        }
        if(orderNum === 2){
            cardTranslationX = -170
            card.style.scale = 1.1
        }
        if(orderNum === 3){
            cardTranslationX = 170
            card.style.scale = 1.1
        }
        if(orderNum === 4){
            cardTranslationY = 300
            card.style.scale = 1.1
        }
    }
}
function decentral(){
    if(revealNum === 4 && analysisState === false && infoDisplay === false){
        if(orderNum === 1){
            cardTranslationY = 0
            card.style.scale = 1
        }
        if(orderNum === 2){
            cardTranslationX = -150
            card.style.scale = 1
        }
        if(orderNum === 3){
            cardTranslationX = 150
            card.style.scale = 1
        }
        if(orderNum === 4){
            cardTranslationY = 260
            card.style.scale = 1
        }
    }
}
function showAnalysis(){
    if(revealNum === 4 && infoDisplay === false){
        analysisState = true
        guide.style.opacity = 0
        analysis.style.transform = "translate(0vw, 350px)"
        analysis.style.opacity = "1"
        analysisContent.innerHTML = reading[4].analysis
        if(orderNum === 1){
            cardTranslationY = -40
            cardTranslationX = -200
            xOriginal = cardTranslationX
            yOriginal = cardTranslationY
            card.style.scale = 1
        }
        if(orderNum === 2){
            cardTranslationY = -40
            cardTranslationX = -200 + 400/3
            xOriginal = cardTranslationX
            yOriginal = cardTranslationY
            card.style.scale = 1
        }
        if(orderNum === 3){
            cardTranslationY = -40
            cardTranslationX = -200 +2*400/3
            xOriginal = cardTranslationX
            yOriginal = cardTranslationY
            card.style.scale = 1
        }
        if(orderNum === 4){
            cardTranslationY = -40
            cardTranslationX = 200
            xOriginal = cardTranslationX
            yOriginal = cardTranslationY
            card.style.scale = 1
        }
    }
}
  
}
}

function restart(event){
    if(event.key === "r" || event.key === "R"){
         startGo()
         removeEventListener("keydown",restart)
    }
}

startGo()
let horizontal = window.innerWidth/200

function consoleFunction(){
}
setInterval(consoleFunction,100)
// setInterval(()=>{
//     if(charT <= reading[num].advice.length){
//         advice.innerHTML += reading[num].advice.charAt(charT)
//         charT ++
//       }
//   },500)