
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
const PRIVATE_KEY = "3ad178cc74c0e7e4269f0d494218260c67c6be286d5de06024c4067df555dcc9";
const __key = CryptoJS.enc.Utf8.parse(PRIVATE_KEY)
const IV = '88447e9916c48e4ad0ad6c124030c01f';
const __IV = CryptoJS.enc.Hex.parse(IV);
const sign_in_btn = document.querySelector("#sign-in-btn");
const sign_up_btn = document.querySelector("#sign-up-btn");
const container = document.querySelector(".container");
const loader = document.querySelector(".loader");
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
        await fetch(`http://localhost:4000/api/user/name/${name}`)
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
        alert("user name must be 3 to 12 letters");
    }
}

async function createEmailValidate(email) {
    var regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (regex.test(email)) {
        let userData = await fetch(`http://localhost:4000/api/email/${email}`)
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
        alert("Please Enter correct email");
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
        const response = await fetch("http://localhost:4000/create", {
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
            alert("User created successfully!");
            window.location.reload();
        } else {
            alert("Error creating user");
            loader.classList.remove("loaderAnimation");
        }
    } else {
        if (checkName !== true) alert("Username already taken");
        if (checkMail !== true)
            alert("Email already used in another Account");
        if (checkPass !== true) alert("Password not strong enough");
        loader.classList.remove("loaderAnimation");
    }
});

/* ------------------- Sign Up Process End ------------------------- */

/* ------------------- Login Process Start ------------------------- */

async function findAccount(name) {
    let userData = await fetch(`http://localhost:4000/api/user/name/${name}`)
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
            alert("login SuccessFull");
            window.location.href = "/";
        } else {
            alert("Wrong Password");
            loader.classList.remove("loaderAnimation");
        }
    } else {
        alert("Username not found");
        loader.classList.remove("loaderAnimation");
    }
});
