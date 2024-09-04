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
    option: 1, //radio option picked for solve (will determine order of calc functions)
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
    console.log(allVariables)
    event.preventDefault()
    getInputs()
    //if (allVariables.theta<0){allVariables.mu = -1*allVariables.mu}
    //Step 1 Render mass m (just HTML)
    //Step 2 render forces acting on mass m
    checkF1()
    //Check if the user defined the angle of the slope
    findAcc()

    step3(allVariables.theta)
    
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
    allVariables.option = optionNum
    console.log(allVariables)
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
    allVariables.m = document.getElementById("in-mass").value
    allVariables.a = document.getElementById("in-a").value
    allVariables.mu = document.getElementById("in-mu-s").value
    allVariables.theta = document.getElementById("in-plane-slope").value
    allVariables.f1 = document.getElementById("in-f1").value
    allVariables.alpha = document.getElementById("in-f1-angle").value
}

function checkF1() {
    // if ("f1" in unfilled) {
    //     let f1Els = document.querySelectorAll(".f1")
    //     f1Els.forEach((x) => x.classList.add("hidden"))
    // }
    let f1Els = document.querySelectorAll(".f1")
    if ( allVariables.f1 == 0) {
        f1Els.forEach((x) => x.classList.add("hidden"))
    }
    else { f1Els.forEach((x) => x.classList.remove("hidden"))}
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

/*
Calculate magnitude of forces and adjust length
accordingly
*/

/*
Identify forces that need to be broken down into
their x and y components
*/
function getFgx() {
    let fg = allVariables.fg
    let theta = allVariables.theta*Math.PI/180
    let fgx = fg*Math.sin(theta)
    return fgx
}

function getFgy() {
    let fg = allVariables.fg
    let theta = allVariables.theta*Math.PI/180
    let fgy = fg*Math.cos(theta)
    return fgy
}

function getF1x() {
    let f1 = allVariables.f1
    let alpha = allVariables.alpha*Math.PI/180
    let f1x = f1*Math.cos(alpha)
    return f1x
}

function getF1y() {
    let f1 = allVariables.f1
    let alpha = allVariables.alpha*Math.PI/180
    let f1y = f1*Math.sin(alpha)
    return f1y
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

function findAcc() {
    let m = allVariables.m
    let theta = allVariables.theta*Math.PI/180
    let mu = allVariables.mu
    let f1 = allVariables.f1
    let fg = getFg()
    allVariables.fg = fg
    let fgx = getFgx()
    let fgy = getFgy()
    let f1x = getF1x()
    let f1y = getF1y()
    let fn = fgy+f1y
    allVariables.fn = fn
    let ff = mu*fn
    if (theta == 0 && f1 == 0) {ff = 0}
    allVariables.ff = ff
    console.log("fgy: ", fgy, "\nf1y: ", f1y)
    console.log("ff: ", ff, "\nfgx: ", fgx, "\nf1x: ", f1x)
    console.log("fn: ", fn)
    if (0 < theta && theta <= Math.PI/2) {
        console.log("Slope angled down to the right")
        let a = (-1*ff+fgx+f1x)/m
        if (a<0) {
            console.log("recalculating...")
            a = (ff+fgx+f1x)/m
        }
        allVariables.a = a
    }
    else if(-1*Math.PI/2 <= theta && theta < 0) {
        console.log("Slope angled down to the left")
        let a = (ff+fgx+f1x)/m
        if(a>0){
            console.log("recalculating...")
            a = (-1*ff+fgx+f1x)/m
        }
        allVariables.a = a
    }
    else if(theta == 0) {
        let a = (f1x-ff)/m
        if (ff>f1x) {a = 0}
        allVariables.a = a
    }
    console.log("If a if negative the mass is accelerating the left, if positive to the right.")
    console.log("a: ", allVariables.a)
    


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

function getFg() {
    let m = allVariables.m
    let g = 9.81
    allVariables.fg = m*g
    return(allVariables.fg)
}

function findFf(fgx, f1x, m, a){
    let ff = fgx+f1x-m*a
    console.log("Ff = ", ff)
    allVariables.ff = ff
    return ff
}

function findFn(mass, theta) {
    let fn = mass*9.81*Math.sin(theta*Math.PI/180)+getF1YComponent(allVariables.f1, allVariables.alpha)
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

//This doesn't work due to CORS issue
async function findTheta(m, a, mu, f1, alpha) {
    //This function requires simulatneous functions and calls for a better calc
    const apiID = '7V6WLQ-RHJ5XL9WTX'
    const url = `http://api.wolframalpha.com/v2/query?appid=7V6WLQ-RHJ5XL9WTX&input=solve+for+tan%28theta%29+%3D+-0.6-%282%2F9.81-5%2F%283*9.81%29%29%2Fcos%28theta%29+from+-pi%2F2+to+pi%2F2&podstate=DecimalApproximation__More+digits`
    const response = await fetch(url, {headers: {        'Access-Control-Allow-Origin' : '*', 
        'Access-Control-Allow-Methods' :    'GET'
}},)
    const data = await response.json()
    console.log(data)
}