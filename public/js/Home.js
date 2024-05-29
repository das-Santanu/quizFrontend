let login = localStorage.getItem("login") || "false";
let change = document.querySelector(".nav-btn span");
let click = document.querySelector(".nav-btn");
click.addEventListener("click", (e) => {
    if (change.innerHTML == "Login") {
        window.location.href = "/login";
    } else if (change.innerHTML == "Logout") {
        localStorage.clear();
        window.location.reload();
    }
});
if (login == "false") {
    change.innerHTML = "Login";
} else if (login == "true") {
    change.innerHTML = "Logout";
}
document.body.addEventListener("click", (e) => {
    if (login == false || login == "false") {
        window.location.href = "/login";
    }
});

let logbtn = document.querySelector(".nav-btn");
let amim = document.querySelector(".amim");
logbtn.addEventListener("mouseover", (e) => {
    amim.classList.add("width");
});
logbtn.addEventListener("mouseout", (e) => {
    amim.classList.remove("width");
});
if(window.innerWidth > 500){
    anime({
        targets: ".left-nav p",
        translateY: [
            { value: "-150px", duration: 0 },
            { value: "0", duration: 1000 },
        ],
        easing: "easeInOutQuad",
    });
    anime({
        targets: ".right-nav button",
        translateY: "-150px",
        duration: 1500,
        delay: 1000,
        direction: "reverse",
        easing: "easeInOutQuad",
    });
    anime({
        targets: ".dn-text",
        translateX: "-1500px",
        duration: 3000,
        delay: 4000,
        direction: "reverse",
        easing: "easeInOutQuad",
    });
    
    anime({
        targets: ".main-icon",
        translateX: "2500px",
        duration: 3500,
        delay: 6000,
        direction: "reverse",
        easing: "easeInOutQuad",
    });
    
    anime({
        targets: ".box",
        translateY: "1000px",
        duration: 3000,
        delay: anime.stagger(500, { start: 1000 }),
        direction: "reverse",
        easing: "easeInOutQuad",
    });
}


let text = document.querySelector(".up-text p");
text.innerHTML =
    "<span>I</span><span>m</span><span>p</span><span>r</span><span>o</span><span>v</span><span>e</span><span><br></span><span>y</span><span>o</span><span>u</span><span>r</span><span> </span><span>m</span><span>i</span><span>n</span><span>d</span>";

anime({
    targets: ".up-text p span",
    translateY: [
        { value: "50px", duration: 0 },
        { value: "0", duration: 800 },
    ],
    opacity: [
        { value: 0, duration: 0 },
        { value: 1, duration: 800 },
    ],
    delay: anime.stagger(100, { start: 800 }),
    easing: "easeInOutQuad",
});



let play = document.querySelectorAll(".button");
play.forEach((play) => {
    play.addEventListener("click", (e) => {
        let difficulty = e.target.id;
        localStorage.setItem("dif", difficulty);
        window.location.href = "/category";
    });
});