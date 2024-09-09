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
    recalculated: false,
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
    //Step 1 Render mass m (just HTML)
    //Step 2 render forces acting on mass m
    checkF1()
    //Check if the user defined the angle of the slope
    // switch(allVariables.option) { //commented out until all radio button options work
    //     case 1:
    //         findAcc()
    //         showWorkAcc()
    // }
    findAcc()
    showWorkAcc()
    step3(allVariables.theta)
    step4()
    step5()
    
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
    allVariables.m = parseFloat(document.getElementById("in-mass").value)
    allVariables.a = parseFloat(document.getElementById("in-a").value)
    allVariables.mu = parseFloat(document.getElementById("in-mu-s").value)
    allVariables.theta = parseFloat(document.getElementById("in-plane-slope").value)
    allVariables.f1 = parseFloat(document.getElementById("in-f1").value)
    allVariables.alpha = parseFloat(document.getElementById("in-f1-angle").value)
    let externalForceContainerEl = document.getElementById("external-force-container")
    if (externalForceContainerEl.classList.contains("hidden")){
        allVariables.f1=0
        allVariables.alpha=0
    }
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
            case "f1-label":
                angle = allVariables.alpha
                break
            case "fgx-label":
                angle = 0
                if (allVariables.theta<0){
                    angle = 180
                }
                break
            case "fgy-label":
                angle = -90
                break
            default:
                angle = 0
                break
        }
    label.style.transform = `rotate(${(x*(-1)+angle)}deg)`
}

function step3() {
    //Use global variables
    let slope = parseFloat(allVariables.theta)
    let alpha = parseFloat(allVariables.alpha)
    //Step 3 orient fbd so x is parallel to plane mass m is on
    let containerS3 = document.getElementById("step3-container")
    let labelsEl = document.querySelectorAll(".rotate-label")
    let fgEl = document.getElementById("step3-fg")
    let f1El = document.getElementById("step3-f1")
    let containerS4 = document.getElementById("step4-container")
    let containerS5 = document.getElementById("step5-container")
    //Make sure Fg doesn't rotate with everything else
    let tranFgy = 25*(Math.tan((slope)*Math.PI/180))-4
    let tranFgx = 25/(Math.cos((slope)*Math.PI/180))-4
    fgEl.style.transform = `rotate(${(slope*-1)+90}deg) translate(${tranFgx}px, ${tranFgy}px)`
    containerS3.style.transform = `rotate(${slope}deg)` //Rotate container and all children
    containerS4.style.transform = `rotate(${slope}deg)` //Rotate container and all children
    containerS5.style.transform = `rotate(${slope}deg)` //Rotate container and all children
    for (let l of labelsEl) { //rotates labels for readability
        rotateLabel(l, slope)
    }
    f1El.style.transform = `rotate(${-1*alpha}deg)`
    // let f1BodyEl = document.getElementById("f1-body")
    // f1BodyEl.style.width = "100px"
    // f1BodyEl.style.transform = "translateX(-50px)"
    //Rotate Ff if slope is down to the left
    if (allVariables.theta<0){
        let ffEl = document.getElementById("step3-ff")
        let ffLabelEl = document.getElementById("step3-ff-label")
        let ff4El = document.getElementById("step4-ff")
        let ffLabel4El = document.getElementById("step4-ff-label")
        let ff5El = document.getElementById("step5-ff")
        let ffLabel5El = document.getElementById("step5-ff-label")
        console.log(ffEl)
        ffEl.style.transform = "rotate(0deg) translateX(50px)"
        ffLabelEl.style.transform = `rotate(${(-1)*slope}deg)`
        ff4El.style.transform = "rotate(0deg) translateX(50px)"
        ffLabel4El.style.transform = `rotate(${(-1)*slope}deg)`
        ff5El.style.transform = "rotate(0deg) translateX(50px)"
        ffLabel5El.style.transform = `rotate(${(-1)*slope}deg)`
        if (allVariables.f1!=0){
            ffEl.style.transform = "rotate(0deg) translateX(50px) translateY(15px)"
            ff4El.style.transform = "rotate(0deg) translateX(50px) translateY(15px)"
            ff5El.style.transform = "rotate(0deg) translateX(50px) translateY(15px)"
            f1El.style.transform = `rotate(${-1*alpha}deg) translateX(${50*Math.cos(alpha*Math.PI/180)}px) translateY(${-25*Math.sin(alpha*Math.PI/180)+10}px)`
        }
    }
    
    
}

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
            allVariables.recalculated = true
            a = (ff+fgx+f1x)/m
        }
        allVariables.a = a
    }
    else if(-1*Math.PI/2 <= theta && theta < 0) {
        console.log("Slope angled down to the left")
        let a = (ff+fgx+f1x)/m
        if(a>0){
            console.log("recalculating...")
            allVariables.recalculated = true
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

function showWorkAcc() {
    let showWorkAccEl = document.getElementById('show-work')
    for (c of showWorkAccEl.childNodes){
       showWorkAccEl.removeChild(c)
    }
    let f1y =''
    let f1x =''
    let fillF1x = ''
    let fillF1y = ''
    if (allVariables.f1 != 0){
        
        if (allVariables.alpha == 0) {
            f1y = "+F1"
            fillF1y = `+${getF1y().toFixed(2)}`
        }
        else if (allVariables.alpha == 90){
            f1x = "+F1"
            fillF1x = `+${getF1x().toFixed(2)}`
        }
        else if (allVariables.alpha == 180){
            f1y = "-F1"
            fillF1y = `${getF1y().toFixed(2)}`
        }
        else if (allVariables.alpha == 270){
            f1x = "-F1"
            fillF1x = `${getF1x().toFixed(2)}`
        }
        else if (allVariables.alpha>0 && allVariables.alpha<90) {
            f1x = "+F1x"
            f1y = "+F1y"
            fillF1x = `+${getF1x().toFixed(2)}`
            fillF1y = `+${getF1y().toFixed(2)}`
        }
        else if (allVariables.alpha>90 && allVariables.alpha<180) {
            f1x = "-F1x"
            f1y = "+F1y"
            fillF1x = `${getF1x().toFixed(2)}`
            fillF1y = `+${getF1y().toFixed(2)}`
        }
        else if (allVariables.alpha>180 && allVariables.alpha<270) {
            f1x = "-F1x"
            f1y = "-F1y"
            fillF1x = `${getF1x().toFixed(2)}`
            fillF1y = `${getF1y().toFixed(2)}`
        }
        else if (allVariables.alpha>270 && allVariables.alpha<360) {
            f1x = "+F1x"
            f1y = "-F1y"
            fillF1x = `+${getF1x().toFixed(2)}`
            fillF1y = `${getF1y().toFixed(2)}`
        }
    }
    
    if (allVariables.theta>=0){
        str1 = `ΣFx=ma=-Ff+Fgx${f1x}`
        str2 = `ΣFy=0=FN-Fgy${f1y}`
        str3 = `FN=Fgy${f1y}`
        str4 = `Ff=μFN`
        str5 = `ma=-μ(Fgy${f1y})+Fgx${f1x}`
        str6 = `a=(-μ(Fgy${f1y})+Fgx${f1x})/m`
        str7 = `a=(${parseFloat(allVariables.mu).toFixed(2)}(${getFgy().toFixed(2)}${fillF1y})+${getFgx().toFixed(2)})/${parseFloat(allVariables.m).toFixed(2)}`
    }
    else {
        str1 = `ΣFx=ma=Ff-Fgx${f1x}`
        str2 = `ΣFy=0=FN-Fgy${f1y}`
        str3 = `FN=Fgy${f1y}`
        str4 = `Ff=μFN`
        str5 = `ma=μ(Fgy${f1y})-Fgx${f1x}`
        str6 = `a=(μ(Fgy${f1y})-Fgx${f1x})/m`
        str7 = `a=(${parseFloat(allVariables.mu).toFixed(2)}(${getFgy().toFixed(2)}${fillF1y})-${getFgx().toFixed(2)})/${parseFloat(allVariables.m).toFixed(2)}`
    }
    let str8 = `a=${parseFloat(allVariables.a).toFixed(2)}m/s2`
    let str9 = `Fg=${parseFloat(allVariables.fg).toFixed(2)}N, FN=${parseFloat(allVariables.fn).toFixed(2)}N, Ff=${parseFloat(allVariables.ff).toFixed(2)}N`
    let myStrings = [str1, str2, str3, str4, str5, str6, str7, str8, str9]
    for (let s of myStrings) {
        let para = document.createElement('p')
        let node = document.createTextNode(s)
        para.appendChild(node)
        showWorkAccEl.appendChild(para)
    }
}

function step4() {
    let f1yEl = document.getElementById("f1y")
    let f1xEl = document.getElementById("f1x")
    let f1yLabelEl = document.getElementById("f1y-label")
    let f1xLabelEl = document.getElementById("f1x-label")
    let fgxEl = document.getElementById("fgx")
    let fgyEl = document.getElementById("fgy")
    let fnEl = document.getElementById("step4-fn")
    let ffEl = document.getElementById("step4-ff")
    let alpha = allVariables.alpha
    let theta = allVariables.theta
    if (theta>0){
        fgxEl.style.transform = "translateX(50px)"
    }
    else if (theta<0) {
        fgxEl.style.transform = "rotate(180deg) translateX(50px)"
    }
    else {
        fgxEl.classList.add("hidden")
    }
    if (allVariables.f1!=0){
        
        if (alpha < 90) {
            f1yEl.style.transform = "rotate(-90deg) translateY(25px) translateX(25px)"
            f1xEl.style.transform = "translateY(15px) translateX(50px)"
            fnEl.style.transform = "rotate(-90deg) translateY(-25px) translateX(25px)"
            if (theta>0){
                fgxEl.style.transform = "translateX(50px) translateY(-15px)"
            }
            else if (theta<0){
                ffEl.style.transform = "translateX(50px) translateY(-15px)"
            }
            f1yLabelEl.style.transform = `rotate(${-1*theta+90}deg)`
        }
        else if (alpha >= 90 && alpha < 180) {
            f1yEl.style.transform = "rotate(-90deg) translateY(25px) translateX(25px)"
            f1xEl.style.transform = "rotate(180deg) translateY(-15px) translateX(50px)"
            fnEl.style.transform = "rotate(-90deg) translateY(-25px) translateX(25px)"
            f1yLabelEl.style.transform = `rotate(${-1*theta+90}deg)`
            f1xLabelEl.style.transform = `rotate(${-1*theta+180}deg)`
            if (theta>0) {
                ffEl.style.transform = "rotate(180deg) translateY(15px) translateX(50px)"
            }
            else if (theta<0){
                fgxEl.style.transform = "rotate(180deg) translateX(50px) translateY(15px)"
            }
        }
        else if (alpha >= 180 && alpha < 270) {
            f1yEl.style.transform = "rotate(90deg) translateY(25px) translateX(25px)"
            f1xEl.style.transform = "rotate(180deg) translateY(-15px) translateX(50px)"
            fgyEl.style.transform = "rotate(90deg) translateY(-25px) translateX(25px)"
            if (theta>0) {
                ffEl.style.transform = "rotate(180deg) translateY(15px) translateX(50px)"
            }
            else if (theta<0){
                ffEl.style.transform = "rotate(0deg) translateX(50px)"
                fgxEl.style.transform = "rotate(180deg) translateX(50px) translateY(15px)"
            }
            f1yLabelEl.style.transform = `rotate(${-1*theta+270}deg)`
            f1xLabelEl.style.transform = `rotate(${-1*theta+180}deg)`
        }
        else if (alpha >= 270 && alpha < 360){
            f1xEl.style.transform = "translateY(15px) translateX(50px)"
            f1yEl.style.transform = "rotate(90deg) translateY(25px) translateX(25px)"
            if (theta>0){
                fgxEl.style.transform = "translateX(50px) translateY(-15px)"
            }
            else if (theta<0){
                ffEl.style.transform = "translateX(50px) translateY(-15px)"
            }
            fgyEl.style.transform = "rotate(90deg) translateY(-25px) translateX(25px)"
            f1yLabelEl.style.transform = `rotate(${-1*theta+270}deg)`
        }
    }

    let f1yEl5 = document.getElementById("step5-f1y")
    let f1xEl5 = document.getElementById("step5-f1x")
    let f1yLabelEl5 = document.getElementById("step5-f1y-label")
    let f1xLabelEl5 = document.getElementById("step5-f1x-label")
    let fgxEl5 = document.getElementById("step5-fgx")
    let fgyEl5 = document.getElementById("step5-fgy")
    let fnEl5 = document.getElementById("step5-fn")
    let ffEl5 = document.getElementById("step5-ff")
    if (theta>0){
        fgxEl5.style.transform = "translateX(50px)"
    }
    else if (theta<0) {
        fgxEl5.style.transform = "rotate(180deg) translateX(50px)"
    }
    else {
        fgxEl5.classList.add("hidden")
    }
    if (allVariables.f1!=0){
        
        if (alpha < 90) {
            f1yEl5.style.transform = "rotate(-90deg) translateY(25px) translateX(25px)"
            f1xEl5.style.transform = "translateY(15px) translateX(50px)"
            fnEl5.style.transform = "rotate(-90deg) translateY(-25px) translateX(25px)"
            if (theta>0){
                fgxEl5.style.transform = "translateX(50px) translateY(-15px)"
            }
            else if (theta<0){
                ffEl5.style.transform = "translateX(50px) translateY(-15px)"
            }
            f1yLabelEl5.style.transform = `rotate(${-1*theta+90}deg)`
        }
        else if (alpha >= 90 && alpha < 180) {
            f1yEl5.style.transform = "rotate(-90deg) translateY(25px) translateX(25px)"
            f1xEl5.style.transform = "rotate(180deg) translateY(-15px) translateX(50px)"
            fnEl5.style.transform = "rotate(-90deg) translateY(-25px) translateX(25px)"
            f1yLabelEl5.style.transform = `rotate(${-1*theta+90}deg)`
            f1xLabelEl5.style.transform = `rotate(${-1*theta+180}deg)`
            if (theta>0) {
                ffEl5.style.transform = "rotate(180deg) translateY(15px) translateX(50px)"
            }
            else if (theta<0){
                fgxEl5.style.transform = "rotate(180deg) translateX(50px) translateY(15px)"
            }
        }
        else if (alpha >= 180 && alpha < 270) {
            f1yEl5.style.transform = "rotate(90deg) translateY(25px) translateX(25px)"
            f1xEl5.style.transform = "rotate(180deg) translateY(-15px) translateX(50px)"
            fgyEl5.style.transform = "rotate(90deg) translateY(-25px) translateX(25px)"
            if (theta>0) {
                ffEl5.style.transform = "rotate(180deg) translateY(15px) translateX(50px)"
            }
            else if (theta<0){
                ffEl5.style.transform = "rotate(0deg) translateX(50px)"
                fgxEl5.style.transform = "rotate(180deg) translateX(50px) translateY(15px)"
            }
            f1yLabelEl5.style.transform = `rotate(${-1*theta+270}deg)`
            f1xLabelEl5.style.transform = `rotate(${-1*theta+180}deg)`
        }
        else if (alpha >= 270 && alpha < 360){
            f1xEl5.style.transform = "translateY(15px) translateX(50px)"
            f1yEl5.style.transform = "rotate(90deg) translateY(25px) translateX(25px)"
            if (theta>0){
                fgxEl5.style.transform = "translateX(50px) translateY(-15px)"
            }
            else if (theta<0){
                ffEl5.style.transform = "translateX(50px) translateY(-15px)"
            }
            fgyEl5.style.transform = "rotate(90deg) translateY(-25px) translateX(25px)"
            f1yLabelEl5.style.transform = `rotate(${-1*theta+270}deg)`
        }
    }
    
}

function step5() {
    let f1x = document.getElementById("step5-f1x")
    let f1y = document.getElementById("step5-f1y")
    let fgx = document.getElementById("step5-fgx")
    let fgy = document.getElementById("step5-fgy")
    let ff = document.getElementById("step5-ff")
    let fn = document.getElementById("step5-fn")

    let alpha = allVariables.alpha
    let theta = allVariables.theta

    let positive = []
    let negative = []

    if (theta>=0) {
        if (alpha<=90){
            negative = [ff, fgy]
            positive = [f1x, fgx, fn, f1y]
        }
        else if (alpha>90 && alpha <=180){
            negative = [fgy,ff,f1x]
            positive = [fn, f1y, fgx]
        }
        else if (alpha>180 && alpha<=270){
            negative = [ff, fgy,f1x,f1y]
            postive = [fgx,fn]
        }
        else if (alpha>270 && alpha<=360) {
            negative = [ff, f1y, fgy]
            positive = [fn, fgx, f1x]
        }
    }
    else {
        if (alpha<=90){
            negative = [fgx,fgy]
            positive = [f1x, ff, fn, f1y]
        }
        else if (alpha>90 && alpha <=180){
            negative = [fgx,f1x,fgy]
            positive = [ff, fn, f1y]
        }
        else if (alpha>180 && alpha<=270){
            negative = [fgx, f1x, fgy, f1y]
            postive = [fn, ff]
        }
        else if (alpha>270 && alpha<=360) {
            negative = [fgx, fgy, f1y]
            positive = [fn, ff, f1x]
        }
    }
    for(let x of positive) {
        //console.log(x.childNodes)
        for (let y of x.childNodes){
            console.log(y.hasChildNodes())
            if(!y.hasChildNodes()){
                try {
                    y.style.backgroundColor = "#469556"
                    y.style.height = "2px"
                }
                catch (e) {}
            }
        }
    }
    for(let x of negative) {
        //console.log(x.childNodes)
        for (let y of x.childNodes){
            console.log(y.hasChildNodes())
            if(!y.hasChildNodes()){
                try {
                    y.style.backgroundColor = "#D33C3C"
                    y.style.height = "2px"
                }
                catch (e) {}
            }
        }
    }

}