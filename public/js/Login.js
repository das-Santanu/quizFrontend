
// Encryption function with fixed IV
function encryptData(data, key, iv) {
    const encrypted = CryptoJS.AES.encrypt(data, key, {
        iv: iv,
    }).toString();
    return encrypted;
}

// Decryption function with fixed IV
function decryptData(encryptedData, key, iv) {
    const decrypted = CryptoJS.AES.decrypt(encryptedData, key, {
        iv: iv,
    }).toString(CryptoJS.enc.Utf8);
    return decrypted;
}
function pop_up(text, img = 'https://res.cloudinary.com/derr70tq5/image/upload/v1716995797/image/login/wrong.png', color = 'rgb(255,0,0)') {
    colors.style.backgroundColor = color;
    image.src = img;
    popUp.innerHTML = text;
    anime({
        targets: poup,
        translateY: [
            { value: '-100%', duration: 0 },
            { value: 150, duration: 100 },
            { value: 150, duration: 700 },
            { value: '-100%', duration: 800 },
        ],
        easing: "easeInOutQuad",
        autoplay: true,
    });
    anime({
        targets: ".divpo",
        width: [
            { value: "0%", duration: 0 },
            { value: "0%", duration: 200 },
            { value: "100%", duration: 700 },
        ],
        easing: "easeInOutQuad",
        autoplay: true,
    });
}
const poup = document.querySelector(".poup");
const popUp = document.querySelector(".pop-up");
const btns = document.querySelectorAll("button");
const colors = document.querySelector(".divpo");
const image = document.querySelector(".pop");
const PRIVATE_KEY = "3ad178cc74c0e7e4269f0d494218260c67c6be286d5de06024c4067df555dcc9";
const __key = CryptoJS.enc.Utf8.parse(PRIVATE_KEY)
const IV = '88447e9916c48e4ad0ad6c124030c01f';
const __IV = CryptoJS.enc.Hex.parse(IV);
const sign_in_btn = document.querySelector("#sign-in-btn");
const sign_up_btn = document.querySelector("#sign-up-btn");
const container = document.querySelector(".container");
const loader = document.querySelector(".loader");
const correctImage = 'https://res.cloudinary.com/derr70tq5/image/upload/v1716995797/image/login/correct.png'
const correctColor = 'rgb(0,255,0)'
sign_up_btn.addEventListener("click", () => {
    container.classList.add("sign-up-mode");
});
sign_in_btn.addEventListener("click", () => {
    container.classList.remove("sign-up-mode");
});

/* ------------------- Sign Up Process Start ------------------------- */

async function createValidataName(name) {
    if (name.length >= 3 && name.length <= 12) {
        let userData;
        await fetch(`https://quizbackend-efbo.onrender.com/api/user/name/${name}`)
            .then((respnse) => {
                if (!respnse.ok) {
                    throw new Error("Network response was not ok");
                }
                return respnse.json();
            })
            .then((data) => {
                userData = data;
            })
            .catch((err) => {
                console.error(err);
            });
        if (userData.length == 0) {
            return true;
        } else {
            return {
                access: false,
                data: userData[0],
            };
        }
    } else {
        let msg = "Your username should be 3-12 characters long"
        pop_up(msg)
    }
}

async function createEmailValidate(email) {
    var regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (regex.test(email)) {
        let userData = await fetch(`https://quizbackend-efbo.onrender.com/api/email/${email}`)
            .then((res) => res.json())
            .then((data) => data)
            .catch((err) => console.error(err));
        if (userData.length == 0) {
            return true;
        } else {
            return {
                access: false,
                data: userData[0],
            };
        }
    } else {
        let msg = "Email already used in another Account"
        pop_up(msg)
    }
}

function checkPassword(password) {
    var minLength = 8;
    var hasUpperCase = /[A-Z]/.test(password);
    var hasLowerCase = /[a-z]/.test(password);
    var hasNumber = /\d/.test(password);
    var hasSpecialChar = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(
        password
    );

    // Check if password meets all criteria
    if (
        password.length >= minLength &&
        hasUpperCase &&
        hasLowerCase &&
        hasNumber &&
        hasSpecialChar
    ) {
        return true;
    } else {
        return false;
    }
}

async function createUser(data) {
    try {
        const response = await fetch("https://quizbackend-efbo.onrender.com/create", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            throw new Error(`Error creating record: ${await response.text()}`);
        }

        console.log("Record created successfully! Email:", data.UserEmail);
        return true;
    } catch (error) {
        console.error(error);
        return false;
    }
}
function encryptString(id, name, email, password) {
    let data = {
        UserId: encryptData(id, __key, __IV),
        UserName: encryptData(name, __key, __IV),
        UserEmail: encryptData(email, __key, __IV),
        UserPassword: encryptData(password, __key, __IV)
    };
    return data;
}
let sign = document.querySelector(".sign-up-form");

sign.addEventListener("submit", async (e) => {
    e.preventDefault();
    loader.classList.add("loaderAnimation");
    let userName = document.querySelector(".signUser").value;
    let email = document.querySelector(".signEmail").value;
    let pwd = document.querySelector(".signPass").value;
    let idObj = "abcdefghigklmnopqrstuvwxyz0123456789";
    let id = "";

    for (let i = 0; i < 4; i++) {
        id += idObj[Math.floor(Math.random() * idObj.length)];
    }

    let checkName = await createValidataName(userName);
    let checkMail = await createEmailValidate(email);
    let checkPass = checkPassword(pwd);

    if (checkName === true && checkMail === true && checkPass === true) {
        let data = encryptString(id, userName, email, pwd);

        let value = await createUser(data);
        if (value) {
            let msg = "Welcome!<br />Your account has been successfully created"
            pop_up(msg, correctImage, correctColor)
            setTimeout(() => {
                window.location.reload()
            }, 1500)
        } else {
            let msg = "There seems to be a temporary glitch.<br />Please refresh the page and try again"
            pop_up(msg)
            loader.classList.remove("loaderAnimation");
        }
    } else {
        if (checkName !== true) pop_up("Username unavailable");
        if (checkMail !== true)
            pop_up("Email already used in another Account");
        if (checkPass !== true) pop_up(" Please create a password<br />with at least 8 characters including capital letter<br />a number, and a special character");
        loader.classList.remove("loaderAnimation");
    }
    setTimeout(() => {
        let msg = "There seems to be a temporary glitch.<br />Please refresh the page and try again"
        pop_up(msg)
    }, 60000)
});

/* ------------------- Sign Up Process End ------------------------- */

/* ------------------- Login Process Start ------------------------- */

async function findAccount(name) {
    let userData = await fetch(`https://quizbackend-efbo.onrender.com/api/user/name/${name}`)
        .then((respnse) => {
            if (!respnse.ok) {
                throw new Error("Network response was not ok");
            }
            return respnse.json();
        })
        .then((data) => {
            return data;
        })
        .catch((err) => {
            console.error(err);
        });
    if (userData.length != 0) {
        return {
            access: true,
            data: userData[0],
        };
    } else {
        return {
            access: false,
            data: userData[0],
        };
    }
}

let login = document.querySelector(".sign-in-form");

login.addEventListener("submit", async (e) => {
    e.preventDefault();
    loader.classList.add("loaderAnimation");
    let loginName = document.querySelector(".username").value;
    let loginPass = document.querySelector(".password").value;
    let nameEnc = encodeURIComponent(encryptData(loginName, __key, __IV));
    let passEnc = encryptData(loginPass, __key, __IV);
    let checkAccount = await findAccount(nameEnc);
    console.log();
    if (checkAccount.access == true) {
        if (checkAccount.data.UserPassword === passEnc) {
            let login = true;
            localStorage.setItem("login", login);
            pop_up("Welcome back! You're successfully logged in", correctImage, correctColor);
            setInterval(() => {
                window.location.href = "/";
            }, 1500)
        } else {
            pop_up("Oops! The password you entered is incorrect");
            loader.classList.remove("loaderAnimation");
        }
    } else {
        pop_up("The username you entered could not be found");
        loader.classList.remove("loaderAnimation");
    }
    setTimeout(() => {
        let msg = "There seems to be a temporary glitch.<br />Please refresh the page and try again"
        pop_up(msg)
    }, 60000)
});
