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
let radioEL = document.querySelectorAll(".form-check")

//Global variables
let userFilled = {}
let unfilled = {}
let allVariables = { //to be updated by calc functions
    option: 0, //radio option picked for solve (will determine order of calc functions)
    a: 0,
    m: 0,
    mu: 0,
    theta: 0,
    f1: 0,
    alpha: 0,
    fg: 0,
    fn: 0,
    ff: 0,
}

//Add Event Listeners
tooltipEL.addEventListener("click", showTip)
formEl.addEventListener("submit", renderFBD)
addForceEl.addEventListener("click", showExtForce)
removeForceEl.addEventListener("click", removeExtForce)
Array.prototype.map.call(radioEL, item => item.addEventListener("click", showInputs))

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
    //findAcc(userFilled.mass, userFilled.slope, userFilled.muK, userFilled.f1, userFilled.f1Angle)
    findTheta(0,0,0,0,0)
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

function showInputs() {
    
    let optionID = this.childNodes[1].id
    let optionNum = optionID[optionID.length-1]
    let accEl = document.getElementById("acceleration")
    let massEl = document.getElementById("mass")
    let slopeEl = document.getElementById("slope")
    let muEl = document.getElementById("friction-coefficient")
    let f1El = document.getElementById("f1")
    let alphaEl = document.getElementById("alpha")
    console.log(optionNum)
    switch (optionNum-1) {
        case 0:
            //looking for a
            //knowns m, mu, theta
            accEl.classList.add("hidden")
            massEl.classList.remove("hidden")
            slopeEl.classList.remove("hidden")
            muEl.classList.remove("hidden")
            f1El.classList.remove("hidden")
            alphaEl.classList.remove("hidden")
            break
        case 1:
            //looking for m 
            //knowns: a, mu, theta
            accEl.classList.remove("hidden")
            massEl.classList.add("hidden")
            slopeEl.classList.remove("hidden")
            muEl.classList.remove("hidden")
            f1El.classList.remove("hidden")
            alphaEl.classList.remove("hidden")
            break
        case 2:
            //looking for mu
            //knowns: a, m, theta
            accEl.classList.remove("hidden")
            massEl.classList.remove("hidden")
            slopeEl.classList.remove("hidden")
            muEl.classList.add("hidden")
            f1El.classList.remove("hidden")
            alphaEl.classList.remove("hidden")
            break
        case 3:
            //looking for theta
            //knowns: a, m, mu
            accEl.classList.remove("hidden")
            massEl.classList.remove("hidden")
            slopeEl.classList.add("hidden")
            muEl.classList.remove("hidden")
            f1El.classList.remove("hidden")
            alphaEl.classList.remove("hidden")
            break
        case 4:
            //looking for F1 
            //knowns: a, m, mu, theta, alpha
            accEl.classList.remove("hidden")
            massEl.classList.remove("hidden")
            slopeEl.classList.remove("hidden")
            muEl.classList.remove("hidden")
            f1El.classList.add("hidden")
            alphaEl.classList.remove("hidden")
            break
        case 5:
            //looking for alpha 
            //knowns: a, m, mu, theta, F1
            accEl.classList.remove("hidden")
            massEl.classList.remove("hidden")
            slopeEl.classList.remove("hidden")
            muEl.classList.remove("hidden")
            f1El.classList.remove("hidden")
            alphaEl.classList.add("hidden")
            break

        default:
            //Also option 0
            accEl.classList.add("hidden")
            massEl.classList.remove("hidden")
            slopeEl.classList.remove("hidden")
            muEl.classList.remove("hidden")
    }
}

function getInputs() {
    let inMassEl = document.getElementById("in-mass")
    let inAccEl = document.getElementById("in-a")
    let inMuSEl = document.getElementById("in-mu-s")
    let inPlaneSlopeEl = document.getElementById("in-plane-slope")
    let inF1El = document.getElementById("in-f1")
    let inF1AngleEl = document.getElementById("in-f1-angle")
    let userInputs = {
        mass: inMassEl.value, 
        accel: inAccEl.value, 
        muS: inMuSEl.value, 
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
function findAcc(m, theta, muK, f1, alpha) {
    let radTheta = theta*Math.PI/180
    let radAlpha = alpha*Math.PI/180
    let g = 9.81
    let a = -(mu*m*g*Math.sin(radTheta)-mu*f1*Math.cos(radAlpha))/m+g*Math.cos(radTheta)+f1*Math.sin(radAlpha)/m
    console.log("a = ", a)
    allVariables.a = a
    return a
}

function findMass(a, mu, theta, f1, alpha) {
    let radTheta = theta*Math.PI/180
    let radAlpha = alpha*Math.PI/180
    let g = 9.81
    let m = (f1*Math.cos(radAlpha)-mu*f1*Math.sin(radAlpha))/(a+mu*g*Math.cos(radTheta)-g*Math.sin(radTheta))
    console.log("m = ", m)
    allVariables.m =m
    return(m)
}

function findFg(mass) {
    let fg = mass*9.81
    console.log("Fg = ", fg)
    allVariables.fg = fg
    return(fg)
}

function findFf(mass, acc, theta){
    let ff = mass*9.81*Math.sin(theta*Math.PI/180)-mass*acc
    console.log("Ff = ", ff)
    allVariables.ff = ff
    return ff
}

function findFn(mass, theta) {
    let fn = mass*9.81*Math.cos(theta*Math.PI/180)
    console.log("FN = ", fn)
    allVariables.fn = fn
    return(fn)
}

function findMu(m, a, theta, f1, alpha) {
    let radTheta = theta*Math.PI/180
    let radAlpha = alpha*Math.PI/180
    let g = 9.81
    let mu = (m*g*Math.cos(radTheta)+f1*Math.sin(radAlpha)-m*a)/(m*g*Math.sin(radTheta)-f1*Math.cos(radAlpha))
    console.log("mu = ", mu)
    allVariables.mu =mu
    return(mu)
}

function findF1(m, a, theta, mu, alpha) {
    let radTheta = theta*Math.PI/180
    let radAlpha = alpha*Math.PI/180
    let g = 9.81
    let f1 = (m*g*Math.sin(radTheta)-m*a-mu*m*g*Math.cos(radTheta))/(Math.cos(radAlpha)+mu*Math.sin(radAlpha))
    console.log("F1 = ", f1)
    allVariables.f1 = f1
    return(f1)
}

function findAlpha(m, a, theta, mu, f1) {
    let radTheta = theta*Math.PI/180
    let g = 9.81
    let alpha = 1/(Math.cos((m*g*sin(radTheta)-m*a-mu*m*g*Math.cos(radTheta))/(f1*Math.sqrt(1+mu^2))))+1/Math.tan(mu)
    console.log("alpha = ", alpha)
    allVariables.alpha = alpha
    return(alpha)
}

async function findTheta(m, a, mu, f1, alpha) {
    //This function requires simulatneous functions and calls for a better calc
    const apiID = '7V6WLQ-RHJ5XL9WTX'
    const url = `https://cors.io?api.wolframalpha.com/v2/query?appid=${apiID}&input=solve+for+tan%28theta%29+%3D+-0.6-%282%2F9.81-5%2F%283*9.81%29%29%2Fcos%28theta%29+from+-pi%2F2+to+pi%2F2&podstate=DecimalApproximation__More+digits`
    const response = await fetch(url)
    const data = await response.json()
    console.log(data)
}