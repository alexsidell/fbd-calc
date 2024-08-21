/*
Step 1: Take in user inputs
Step 2: Solve for unknowns
Step 3: Show answer
Step 4: Explain answer
*/

//Cache DOMs
let tooltipEL = document.getElementById("help-icon")
let formEl = document.querySelector(".form-inputs")
let addForceEl = document.getElementById("add-force-button")
let removeForceEl = document.getElementById("remove-force-button")

//Global variables
let userFilled = {}
let unfilled = {}

//Add Event Listeners
tooltipEL.addEventListener("click", showTip)
formEl.addEventListener("submit", renderFBD)
addForceEl.addEventListener("click", showExtForce)
removeForceEl.addEventListener("click", removeExtForce)

//My Functions
function showTip(){
    let tootltipTextEl = document.querySelector(".tooltip-text")
    tootltipTextEl.classList.toggle("hidden")
}

function renderFBD(event) {
    event.preventDefault()
    getInputs()
    //Step 1 Render mass m (just HTML)
    //Step 2 render forces acting on mass m
    checkF1()
    //Check if the user defined the angle of the slope
    if ("slope" in userFilled) {
        console.log("Slope is defined by user")
        step3(userFilled.slope)
    }
    findAcc(userFilled.mass, userFilled.slope, userFilled.muK, userFilled.f1, userFilled.f1Angle)
}

function showExtForce() {
    let externalForceContainerEl = document.getElementById("external-force-container")
    externalForceContainerEl.classList.toggle("hidden")
    addForceEl.classList.toggle("hidden")
    removeForceEl.classList.toggle("hidden")
}

function removeExtForce() {
    let externalForceContainerEl = document.getElementById("external-force-container")
    let inF1El = document.getElementById("in-f1")
    let inF1AngleEl = document.getElementById("in-f1-angle")
    inF1El.value = ""
    inF1AngleEl.value = ""
    externalForceContainerEl.classList.toggle("hidden")
    addForceEl.classList.toggle("hidden")
    removeForceEl.classList.toggle("hidden")
}


function getInputs() {
    let inMassEl = document.getElementById("in-mass")
    let inAccEl = document.getElementById("in-a")
    let inMuSEl = document.getElementById("in-mu-s")
    let inMuKEl = document.getElementById("in-mu-k")
    let inFfEl = document.getElementById("in-ff")
    let inPlaneSlopeEl = document.getElementById("in-plane-slope")
    let inF1El = document.getElementById("in-f1")
    let inF1AngleEl = document.getElementById("in-f1-angle")
    let userInputs = {
        mass: inMassEl.value, 
        accel: inAccEl.value, 
        muS: inMuSEl.value, 
        muK: inMuKEl.value, 
        friction: inFfEl.value,
        slope: inPlaneSlopeEl.value, 
        f1: inF1El.value,
        f1Angle: inF1AngleEl.value
    }
    filterInputs(userInputs)
}

function checkF1() {
    if ("f1" in unfilled) {
        let f1Els = document.querySelectorAll(".f1")
        f1Els.forEach((x) => x.classList.add("hidden"))
    }
}

function rotateLabel(label, x) {
    let angle = 0
    let list = label.classList[2]
    //console.log((label.classList))
        switch (list){
            case "fg-label":
                angle = -90+x
                break
            case "ff-label":
                angle = -180
                break
            case "fn-label":
                angle = 90
                break
        }
    label.style.transform = `rotate(${(x*(-1)+angle)}deg)`
}

function step3(slope) {
    //Step 3 orient fbd so x is parallel to plane mass m is on
    let containerS3 = document.getElementById("step3-container")
    let labelsEl = document.querySelectorAll(".rotate-label")
    let fgEl = document.getElementById("step3-fg")
    //Make sure Fg doesn't rotate with everything else
    let tranFgy = 25*(Math.tan((slope)*Math.PI/180))-4
    let tranFgx = 25/(Math.cos((slope)*Math.PI/180))-4
    fgEl.style.transform = `rotate(${(slope*-1)+90}deg) translate(${tranFgx}px, ${tranFgy}px)`
    containerS3.style.transform = `rotate(${slope}deg)` //Rotate container and all children

    for (let l of labelsEl) { //rotates labels for readability
        rotateLabel(l, slope)
    }
}

function filterInputs(obj){
    for (let i in obj) {
        if (obj[i] == '') {
            unfilled[i] = obj[i]
        }
        else {
            userFilled[i] = obj[i]
        }
    }
    console.log("Unfilled inputs: ", unfilled)
    console.log("User filled inputs: ",userFilled)
}

/*
Calculate magnitude of forces and adjust length
accordingly
*/

/*
Identify forces that need to be broken down into
their x and y components
*/
function getFgXComponent(force, angle) {
    angle = angle*Math.PI/180
    let xComponent = force*Math.sin(angle)
    console.log(xComponent)
    return(xComponent)
}

function getFgYComponent(force, angle) {
    angle = angle*Math.PI/180
    let yComponent = force*Math.cos(angle)
    console.log(yComponent)
    return(yComponent)
}
function getF1XComponent(force, angle) {
    angle = angle*Math.PI/180
    let xComponent = force*Math.cos(angle)
    console.log(xComponent)
    return(xComponent)
}

function getF1YComponent(force, angle) {
    angle = angle*Math.PI/180
    let yComponent = force*Math.sin(angle)
    console.log(yComponent)
    return(yComponent)
}
/*
Identify positive and negative forces and 
color them green and red
*/

//Sum forces in x and y directions
function sumXForces() {

}

function sumYForces() {

}

//Find Unknowns
function findAcc(m, theta, muK, inf1, inf1Angle) {
    const f1 = inf1 || 0
    const f1Angle = inf1Angle || 0
    let a = 9.81*Math.sin(theta*Math.PI/180)-9.81*Math.cos(theta*Math.PI/180)*muK+f1*Math.cos(f1Angle*Math.PI/180)/m
    console.log(a)
    return a
}

function findMass(a, ff, mu, theta) {
    
}

function findFg(mass) {
    return(mass*9.81)
}