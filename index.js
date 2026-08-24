// =====================================================
// SELECT HTML ELEMENTS
// =====================================================

const inputSlider = document.querySelector("[data-length-slider]");
const lengthDisplay = document.querySelector("[data-password-length]");

const passwordDisplay = document.querySelector("[data-password-display]");

const copyBtn = document.querySelector("[data-copy-button]");
const copyMsg = document.querySelector("[data-copy-message]");

const upperCheck = document.querySelector("[data-uppercase]");
const lowerCheck = document.querySelector("[data-lowercase]");
const numbersCheck = document.querySelector("[data-numbers]");
const symbolsCheck = document.querySelector("[data-symbols]");

const indicator = document.querySelector("[data-strength-indicator]");

const generateBtn = document.querySelector("[data-generate-button]");

const allCheckBox = document.querySelectorAll(
    'input[type="checkbox"]'
);


// =====================================================
// VARIABLES
// =====================================================

let password = "";
let passwordLength = 10;
let checkCount = 0;


// Characters used for generating symbols
const symbols = `!@#$%^&*()_+-={}[]:";'<>?,./`;


// =====================================================
// INITIAL SETUP
// =====================================================

handleSlider();


// Set initial strength indicator
setIndicator("gray");


// =====================================================
// HANDLE SLIDER
// =====================================================

function handleSlider() {

    // Set slider value
    inputSlider.value = passwordLength;

    // Show password length
    lengthDisplay.innerText = passwordLength;
}


// =====================================================
// SET PASSWORD STRENGTH INDICATOR COLOR
// =====================================================

function setIndicator(color) {

    indicator.style.backgroundColor = color;
}


// =====================================================
// GENERATE RANDOM INTEGER
// =====================================================

function getRndInteger(min, max) {

    return Math.floor(Math.random() * (max - min)) + min;
}


// =====================================================
// GENERATE RANDOM NUMBER
// =====================================================

function generateRandomNumber() {

    return getRndInteger(0, 10);
}


// =====================================================
// GENERATE UPPERCASE LETTER
// =====================================================

function generateUpperCase() {

    return String.fromCharCode(
        getRndInteger(65, 91)
    );
}


// =====================================================
// GENERATE LOWERCASE LETTER
// =====================================================

function generateLowerCase() {

    return String.fromCharCode(
        getRndInteger(97, 123)
    );
}


// =====================================================
// GENERATE SYMBOL
// =====================================================

function generateSymbol() {

    const randomIndex = getRndInteger(
        0,
        symbols.length
    );

    return symbols.charAt(randomIndex);
}


// =====================================================
// CALCULATE PASSWORD STRENGTH
// =====================================================

function calcStrength() {

    let hasUpper = false;
    let hasLower = false;
    let hasNum = false;
    let hasSym = false;


    // Check which options are selected

    if (upperCheck.checked) {
        hasUpper = true;
    }

    if (lowerCheck.checked) {
        hasLower = true;
    }

    if (numbersCheck.checked) {
        hasNum = true;
    }

    if (symbolsCheck.checked) {
        hasSym = true;
    }


    // STRONG PASSWORD

    if (
        hasUpper &&
        hasLower &&
        (hasNum || hasSym) &&
        passwordLength >= 8
    ) {

        setIndicator("#0f0");
    }


    // MEDIUM PASSWORD

    else if (
        (hasLower || hasUpper) &&
        (hasNum || hasSym) &&
        passwordLength >= 6
    ) {

        setIndicator("#ff0");
    }


    // WEAK PASSWORD

    else {

        setIndicator("#f00");
    }
}


// =====================================================
// COPY PASSWORD
// =====================================================

async function copyContent() {

    try {

        await navigator.clipboard.writeText(
            passwordDisplay.value
        );

        copyMsg.innerText = "Copied!";

    }

    catch (e) {

        copyMsg.innerText = "Failed!";
    }


    // Show copy message

    copyMsg.classList.add("active");


    // Hide after 2 seconds

    setTimeout(() => {

        copyMsg.classList.remove("active");

    }, 2000);
}


// =====================================================
// SHUFFLE PASSWORD
// Fisher-Yates Algorithm
// =====================================================

function shufflePassword(array) {

    for (
        let i = array.length - 1;
        i > 0;
        i--
    ) {

        const j = Math.floor(
            Math.random() * (i + 1)
        );


        // Swap elements

        const temp = array[i];

        array[i] = array[j];

        array[j] = temp;
    }


    // Convert array back to string

    let str = "";

    array.forEach((element) => {

        str += element;

    });


    return str;
}


// =====================================================
// HANDLE CHECKBOX CHANGE
// =====================================================

function handleCheckBoxChange() {

    checkCount = 0;


    // Count selected checkboxes

    allCheckBox.forEach((checkbox) => {

        if (checkbox.checked) {

            checkCount++;
        }

    });


    // Password length cannot be smaller
    // than number of selected character types

    if (passwordLength < checkCount) {

        passwordLength = checkCount;

        handleSlider();
    }
}


// =====================================================
// CHECKBOX EVENT LISTENER
// =====================================================

allCheckBox.forEach((checkbox) => {

    checkbox.addEventListener(
        "change",
        handleCheckBoxChange
    );

});


// =====================================================
// SLIDER EVENT LISTENER
// =====================================================

inputSlider.addEventListener("input", (e) => {

    passwordLength = Number(e.target.value);

    handleSlider();

});


// =====================================================
// COPY BUTTON EVENT LISTENER
// =====================================================

copyBtn.addEventListener("click", () => {

    if (passwordDisplay.value) {

        copyContent();
    }

});


// =====================================================
// GENERATE PASSWORD
// =====================================================

generateBtn.addEventListener("click", () => {


    // ---------------------------------------------
    // STEP 1: Make sure at least one checkbox
    // is selected
    // ---------------------------------------------

    if (checkCount === 0) {

        return;
    }


    // ---------------------------------------------
    // STEP 2: Make sure password length is enough
    // for all selected character types
    // ---------------------------------------------

    if (passwordLength < checkCount) {

        passwordLength = checkCount;

        handleSlider();
    }


    // ---------------------------------------------
    // STEP 3: Remove old password
    // ---------------------------------------------

    password = "";


    // ---------------------------------------------
    // STEP 4: Create function array
    // ---------------------------------------------

    let funcArr = [];


    if (upperCheck.checked) {

        funcArr.push(generateUpperCase);
    }


    if (lowerCheck.checked) {

        funcArr.push(generateLowerCase);
    }


    if (numbersCheck.checked) {

        funcArr.push(generateRandomNumber);
    }


    if (symbolsCheck.checked) {

        funcArr.push(generateSymbol);
    }


    // ---------------------------------------------
    // STEP 5: Add at least one character
    // from every selected category
    // ---------------------------------------------

    for (let i = 0; i < funcArr.length; i++) {

        password += funcArr[i]();
    }


    // ---------------------------------------------
    // STEP 6: Fill remaining password length
    // ---------------------------------------------

    for (
        let i = 0;
        i < passwordLength - funcArr.length;
        i++
    ) {

        const randomIndex = getRndInteger(
            0,
            funcArr.length
        );

        password += funcArr[randomIndex]();
    }


    // ---------------------------------------------
    // STEP 7: Shuffle password
    // ---------------------------------------------

    password = shufflePassword(
        Array.from(password)
    );


    // ---------------------------------------------
    // STEP 8: Show password in UI
    // ---------------------------------------------

    passwordDisplay.value = password;


    // ---------------------------------------------
    // STEP 9: Calculate password strength
    // ---------------------------------------------

    calcStrength();

});