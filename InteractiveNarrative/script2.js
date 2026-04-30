let persuasionNum = 0
let narrativeText = ""
let textNum = 0
let chooseState = false
let initiate = true
let chooseNums = [5]
let btn1
let finalChoice = false
let btn2
let money = 150
let sanity = 50
let furniture = false
const choiceBox = document.querySelector('#choices');
let baseColor = "rgb(19, 19, 25)";
document.body.style.backgroundColor = baseColor;
let screenState = true
let sceneNum = 0
let scenes = ['scene1','scene2','day1','day2','day3','day4','day5','violinScene']
let currentScene = scenes[sceneNum]
let images = ['./wake.png','./livingRoom.png','./hallway.png','./door.png','./Gregor.png','./image.png']
let stopMode = false
moneyValue.style.opacity = 0
sanityValue.style.opacity = 0
let mealValues = [
    [[-30,8],[-10,5],[0,-30]],
    [[-30,5],[-10,5],[0,-8]],
    [[-30,2],[-10,3],[0,-3]],
    [[-30,-3],[-10,1],[0,0]],
    [[-30,-5],[-10,-3],[0,3]]
]
let workValues = [
    [[50,-10],[0,8]],
    [[50,-12],[0,8]],
    [[45,-14],[0,5]],
    [[40,-16],[0,2]],
    [[35,-18],[0,-3]]
]
let staticValues = [
    [-50,5],
    [-50,3],
    [-50,-2],
    [-55,-4],
    [-60,-8]
]
let richMealValue = [-30,8]
let simpleMealValue = [-10,5]
let skipMealValue = [0,-30]
let workValue = [50,-10]
let notWorkValue = [0,8]
let static = [-50,5]
let day = 0
let mealChoiceThought = [
    [    'He used to love a good meal. Maybe this will help.',
        'It is the least I can do.',
        'Just this once. He will be fine.'],
    [   'I keep telling myself he will get better.',
        'Simple, but it is something.',
        'I could not bring myself to do more today.'],
    [   'Does he even taste it anymore?',
        'I am running out of reasons to try harder.',
        'I told myself I would not do this again.'],
    [   'I do not know why I bother with the good food.',
        'This is all I have left to give.',
        'Maybe it does not matter what I bring him.'],
    [   'Out of habit, I suppose. Just out of habit.',
        'I can barely look at the door anymore.',
        'His insect body shall deal with it.']
]
let workChoiceThought = [
    [   'Someone has to keep this family going.',
        'I need the rest. Just for today.'],
    [   'Back again. At least it keeps my mind off things.',
        'One day off will not hurt.'],
    [   'I drag myself there and back. That is all it is now.',
        'I cannot face that office today.'],
    [   'I do not remember the walk home anymore.',
        'My body refused to move this morning.'],
    [   'I went. I do not remember why.',
        'There is nothing left in me to spend.']
]



const actions = {
    continuePlot: () => continuePlot(),
    goLivingRoom: () => {
        image.src = images[1]
        continuePlot()
    },
    rushOutForDoctor: () => {
        stopMode = true
        continuePlot()
        screenOff()
        setTimeout(() => {
            textNum += 1
            continuePlot()
            screenOn()
            stopMode = false
        }, 2000)
    },
    checkGregor: () => {
        continuePlot()
        setTimeout(() => { image.src = images[2] }, 2000)
        setTimeout(() => { image.src = images[3] }, 3500)
        setTimeout(() => { image.src = images[4] }, 5000)
        setTimeout(() => { screenOff()
            stopMode = true
         }, 7000)
        setTimeout(() => { 
            sceneNum = 1
            textNum = 0
            currentScene = 'scene2'
            text.innerHTML = narrativeText[currentScene][textNum].text
            stopMode = false
            text.style.opacity = 1
         }, 10000)
    },
    scene2Open: ()=>{
        image.src = images[0]
        continuePlot()
        sceneNum = 2
        currentScene = 'day1'
        textNum = 0
        text.innerHTML = narrativeText[currentScene][textNum].text
        screenOn()
    },
    richMeal: ()=>{
        money += richMealValue[0]
        sanity += richMealValue[1]
        continuePlot()
        setTimeout(() => { text.innerHTML = mealChoiceThought[day][0]}, 10)
    },
    simpleMeal: ()=>{
        money += simpleMealValue[0]
        sanity += simpleMealValue[1]
        continuePlot()
        setTimeout(() => { text.innerHTML = mealChoiceThought[day][1]}, 10)
    },
    skipMeal: ()=>{
        money += skipMealValue[0]
        sanity += skipMealValue[1]
        continuePlot()
        setTimeout(() => { text.innerHTML = mealChoiceThought[day][2]}, 10)
    },
    goWork: ()=>{
        money += workValue[0]
        sanity += workValue[1]
        continuePlot()
        setTimeout(() => { text.innerHTML = workChoiceThought[day][0]}, 10)
    },
    notWork: ()=>{
        money += notWorkValue[0]
        sanity += notWorkValue[1]
        continuePlot()
        setTimeout(() => { text.innerHTML = workChoiceThought[day][1]}, 10)
    },
    eventOne: ()=>{
        money += static[0]
        sanity += static[1]
        screenOff()
        continuePlot()
        textNum = 0
        currentScene = 'event1'
        text.style.opacity = 1
    },
    nextDay: ()=>{
        screenOff()
        text.style.opacity = 0
        continuePlot()
        stopMode = true
        if(day != 0){
        money += static[0]
        sanity += static[1]
        }else{
            sanity += 5
        }
        if (currentScene == "day5" || money <= 20 && sanity <= 10){
            setTimeout(() => {
                stopMode = false
                currentScene = 'violinScene'
                image.src = images[1]
                text.innerHTML = narrativeText[currentScene][textNum].text
                text.style.opacity = 1
                }, 1000)
        }else{
            setTimeout(() => {
            stopMode = false
            image.src = images[0]
            screenOn()
            text.innerHTML = narrativeText[currentScene][textNum].text
            text.style.opacity = 1
            }, 1000)
        }
        day += 1
        textNum = 0
        sceneNum += 1
        richMealValue = mealValues[day][0]
        simpleMealValue = mealValues[day][1]
        skipMealValue = mealValues[day][2]
        workValue = workValues[day][0]
        notWorkValue = workValues[day][1]
        static = staticValues[day]
        currentScene = scenes[sceneNum]
        console.log(day)

    },
    wakeUp: ()=>{
        continuePlot()
        image.src = images[1]
    },
    leaveFurniture: ()=>{
        furniture = true
        continuePlot()
        setTimeout(() => {text.innerHTML = "I told myself I agreed because it was kind. But standing there I kept thinking — the desk, the pictures, the wardrobe — none of it means anything to him anymore. I just didn't have the heart to say it out loud."}, 10)
    },
    removeFurniture: ()=>{
        furniture = false
        continuePlot()
        setTimeout(() => {text.innerHTML = "I thought I would feel practical about it. Efficient. Instead I stood in the middle of the empty room and could not remember why I had been so sure."}, 10)
    },
    violinEvent: ()=>{
        continuePlot()
        screenOn()
    },
    lookHallway: ()=>{
        continuePlot()
        image.src = images[5]
    },
    decisionPrepare: ()=>{
        continuePlot()
        screenOff()
        text.style.opacity = 1
        image.src = images[6]
    }
}

// console.log(mealChoiceThought[day][2])

image.src = images[0]

screenOff()

fetch('./text.json')
  .then(res => res.json())
  .then(data => {
    narrativeText = data
    // console.log(narrativeText)
    text.innerHTML = narrativeText[currentScene][textNum].text
  });

  document.addEventListener('click', () => {
    moneyValue.innerHTML = `MONEY:<br>${money}`
    sanityValue.innerHTML = `SANITY:<br>${sanity}`
    console.log(textNum, sceneNum)
    if(currentScene == "scene2" && textNum == 5){
        moneyValue.style.opacity = 1
    }
    if(currentScene == "scene2" && textNum == 7){
        sanityValue.style.opacity = 1
    }

    if(screenState == false && initiate == true){
        screenOn()
        initiate = false
    }
    if(chooseState == false && stopMode == false){
        choiceSpawn()
        textNum += 1
        console.log(textNum);
        console.log(chooseState)
        text.innerHTML = narrativeText[currentScene][textNum].text
    }

    if(text.innerHTML=="I understand that I have reached the end of something..." && finalChoice == false){
        chooseState = true
        finalChoice = true
        btn1 = document.createElement('button')
        btn1.className = 'button'
        btn1.innerHTML = "He is still my brother"
        btn2 = document.createElement('button')
        btn2.className = 'button'
        btn2.innerHTML = "I'm tired of it..."
        btn1.onclick = persuade
        btn2.onclick = 
            continuePlot
        choiceBox.appendChild(btn1)
        choiceBox.appendChild(btn2)
        setTimeout(() => {
            btn1.style.transition = "opacity 1s ease-in-out, font-size 1s ease-in-out"
            btn2.style.transition = "opacity 1s ease-in-out, font-size 1s ease-in-out"
            btn1.style.opacity = btn1.disabled ? '0.3' : '1'
            btn2.style.opacity = btn2.disabled ? '0.3' : '1'
        }, 10)
    }
  });

function continuePlot() {
    document.body.style.backgroundColor = baseColor
    choiceBox.innerHTML = ''
    text.innerHTML = narrativeText[currentScene][textNum].text
    chooseState = false
}

function screenOn(){
    if(screenState == false){
    overlay.style.opacity = 0.4
    text.style.opacity = 1
    screenLight.style.backgroundColor = "rgb(182, 202, 221)"
    setTimeout(() => {
        image.style.opacity = 1
      }, 500);
    screenState = true
    }
}

function screenOff(){
    if(screenState == true){
    image.style.opacity = 0
    text.style.opacity = 0
    setTimeout(() => {
        overlay.style.opacity = 0
        screenLight.style.backgroundColor = "rgb(15, 15, 17)"
      }, 500);

    screenState = false
    }
}

function choiceSpawn() {
    const current = narrativeText[currentScene][textNum]
    if (!current.choices) return

    chooseState = true
    
    current.choices.forEach(choice => {
        const btn = document.createElement('button')
        btn.className = 'button'
        btn.innerHTML = choice.label
    
        if (!checkCondition(choice.requires)) {
            btn.disabled = true
            btn.style.opacity = '0.3'
            btn.style.cursor = 'not-allowed'
        } else {
            btn.onclick = actions[choice.action]
        }
    
        choiceBox.appendChild(btn)
        setTimeout(() => {
            btn.style.transition = "opacity 1s ease-in-out"
            btn.style.opacity = btn.disabled ? '0.3' : '1'
        }, 10)
    })
}

function checkCondition(requires) {
    if (!requires) return true
    if (requires.money) {
        if (requires.money.gte !== undefined && money < requires.money.gte) return false
        if (requires.money.lte !== undefined && money > requires.money.lte) return false
    }
    if (requires.sanity) {
        if (requires.sanity.gte !== undefined && sanity < requires.sanity.gte) return false
        if (requires.sanity.lte !== undefined && sanity > requires.sanity.lte) return false
    }
    return true
}

async function persuade() {
    document.body.style.backgroundColor = `rgb(${19+persuasionNum*10}, ${19-persuasionNum*2}, ${25-persuasionNum*2})`;
    console.log("start")

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer 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`
            },
            body: JSON.stringify({
                messages: [
                    {
                        role: 'system',
                        content:
                        `
                        You are a voice inside of Grete Samsa, the sister of Gregor Samsa from 
                        The Metamorphosis by Kafka. Grete is making a hard decision of whether to
                        continue view his brother as her precious brother or give-up and see it as
                        merely a disturbing, pathetic, large, disgusting insect. Your role is to persuade
                        Grete to do the latter, which is to give-up, and you need to do it as if
                        your're a demon whispering beside her ear, giving out reasons to do so and 
                        protray her brother as an ugly, dehumanized insect, possible give out details
                        describing how unsettling her brother looks, sound, and behave. You will be given
                        the number of times you have tried to persuade. Start tender in lower numbers (0-3)
                        and get intense after that. Control the length within 2 sentences, start short in lower numbers (1 sentences)
                        , forexample "admit it Grete, you don't mean that". Refer to Grete as "Grete" or "You", 
                        no any additional modification needed. Be creative and could go beyond my examples, and
                        don't have to be complete sentences so that its more like fragments of sound. Shorten it
                        to a single powerful phrase when Number of persuasion is a multiple of four`
                    },
                    {
                        role: 'user',
                        content: `Number of persuasion: ${persuasionNum}`
                    }
                ],
                model: 'llama-3.3-70b-versatile',
                temperature: 1,
                top_p: 1,
                stream: false,
                stop: null
            })
        });

        persuasionNum += 1
        console.log(persuasionNum)
        btn2.style.fontSize = `${12+persuasionNum*2}px`
        btn1.style.fontSize = `${12-persuasionNum*1}px`;

        if (response.ok) {
            const data = await response.json();
            let reply = data.choices[0].message?.content
            
            text.innerHTML = reply
            
        } else {
            console.error(await response.json());
        }
    }