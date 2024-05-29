document.addEventListener("DOMContentLoaded", function () {
    const result = document.querySelector(".result");
    const dark = document.querySelector(".dark");
    result.classList.add("hide");
    dark.classList.add("hide");
    let questionCount = 0;
    let scoreCount = 0;
    let count = 11;
    let countdown;
    let check = undefined;

    const quizArray = [];

    async function fetchQuizData() {
        try {
            const difficulty = localStorage.getItem("dif");
            const category = localStorage.getItem("option");
            const response = await fetch(
                `https://opentdb.com/api.php?amount=10&category=${category}&difficulty=${difficulty}&type=multiple`
            );
            const data = await response.json();
            return data.results;
        } catch (error) {
            return null;
        }
    }

    function decodeHTMLEntities(text) {
        const textarea = document.createElement("textarea");
        textarea.innerHTML = text;
        return textarea.value;
    }

    async function initializeQuiz() {
        const quizData = await fetchQuizData();
        if (!quizData) {
            window.location.reload();
        }

        quizData.forEach((data, index) => {
            const options = [...data.incorrect_answers, data.correct_answer];
            options.sort(() => Math.random() - 0.5);
            quizArray.push({
                id: index,
                question: decodeHTMLEntities(data.question),
                options: options.map((option) => decodeHTMLEntities(option)),
                correct: decodeHTMLEntities(data.correct_answer),
            });
        });

        document.querySelector(".spiner").style.display = "none";
        start();
    }

    function resultPage(difficulty, correct) {
        const imgArray = ["1_3", "4_6", "7_9", "10"];
        let you = document.querySelector(".text-wrap h1 span");
        let rite = document.querySelector(".text-wrap p span");
        let mainImg = document.querySelector(".image img");
        let again = document.querySelector(".img-wrap");
        const easy = [
            { name: "Naruto", color: "rgb(226, 222, 70)" },
            { name: "Kakashi", color: "rgb(56, 53, 58)" },
            { name: "Itachi", color: "rgb(56, 24, 66)" },
            { name: "Madara", color: "rgb(128, 47, 54)" },
        ];
        const medium = [
            { name: "Luffy", color: "rgb(239, 169, 37)" },
            { name: "Boruto", color: "rgb(231, 103, 136)" },
            { name: "Tanjiro", color: "rgb(36, 73, 95)" },
            { name: "Yagami", color: "rgb(21, 20, 25)" },
        ];
        const hard = [
            { name: "Gojo", color: "rgb(100, 128, 147)" },
            { name: "Beerus", color: "rgb(216, 157, 216)" },
            { name: "Vegita", color: "rgb(252, 46, 251)" },
            { name: "Goku", color: "rgb(30, 51, 149)" },
        ];
        const defined = ["😔", 'Average', 'Brilliant', 'Genius:'] 
        let getPoint;
        if (correct > 0 && correct <= 3) {
            getPoint = 0;
        } else if (correct >= 4 && correct <= 6) {
            getPoint = 1;
        } else if (correct >= 7 && correct <= 9) {
            getPoint = 2;
        } else if (correct == 10) {
            getPoint = 3;
        }
        let selectedArray, imgPath;
        switch (difficulty) {
            case "easy":
                selectedArray = easy;
                imgPath = "https://res.cloudinary.com/derr70tq5/image/upload/v1716891291/image/easy/";
                break;
            case "medium":
                selectedArray = medium;
                imgPath = "https://res.cloudinary.com/derr70tq5/image/upload/v1716891646/image/midium/";
                break;
            case "hard":
                selectedArray = hard;
                imgPath = "https://res.cloudinary.com/derr70tq5/image/upload/v1716891851/image/hard/";
                break;
        }

        you.innerHTML = defined[getPoint];
        rite.innerHTML = correct;
        mainImg.src = `${imgPath}${imgArray[getPoint]}.png`;
        document.documentElement.style.setProperty(
            "--result-color",
            selectedArray[getPoint].color
        );
        if (getPoint != 3) {
            for (let i = getPoint + 1; i < imgArray.length; i++) {
                again.innerHTML += `<div class="begain"><img src="${imgPath}${imgArray[i]}.png"></div>`;
            }
        }
    }


    function timerDisplay() {
        countdown = setInterval(() => {
            count--;
            document.querySelector(".time-left").textContent = `${count}s`;
            if (count === 0) {
                clearInterval(countdown);
                displayNext();
            }
        }, 1000);
    }

    function displayNext() {
        questionCount++;
        if (questionCount === quizArray.length) {
            document.getElementById("display-container").classList.add("hide");
            let df = localStorage.getItem("dif");
            resultPage(df, scoreCount);
            result.classList.remove("hide");
            dark.classList.remove("hide");
        } else {
            document.querySelector(".number-of-question").textContent =
                questionCount + 1 + " of " + quizArray.length + " Question";
            quizDisplay(questionCount);
            count = 11;
            clearInterval(countdown);
            timerDisplay();
        }
    }

    function quizDisplay(questionCount) {
        const quizCards = document.querySelectorAll(".container-mid");
        quizCards.forEach((card) => {
            card.classList.add("hide");
        });
        // Show the current question card if it exists
        if (quizCards[questionCount]) {
            quizCards[questionCount].classList.remove("hide");
        }
    }

    function checker(userOption) {
        const userSolution = userOption.innerText;
        const question =
            document.getElementsByClassName("container-mid")[questionCount];
        const options = question.querySelectorAll(".option-div");

        if (userSolution === quizArray[questionCount].correct) {
            userOption.classList.add("correct");
            scoreCount++;
        } else {
            userOption.classList.add("incorrect");
            options.forEach((element) => {
                if (element.innerText == quizArray[questionCount].correct) {
                    element.classList.add("correct");
                }
            });
        }
        clearInterval(countdown);
        options.forEach((element) => {
            element.disabled = true;
        });
    }

    function quizCreator() {
        quizArray.sort(() => Math.random() - 0.5);

        quizArray.forEach((questionData, index) => {
            const div = document.createElement("div");
            div.classList.add("container-mid", "hide");
            document.querySelector(".number-of-question").textContent =
                index + 1 + " of " + quizArray.length + " Question";

            const questionDiv = document.createElement("p");
            questionDiv.classList.add("question");
            questionDiv.textContent = questionData.question;
            div.appendChild(questionDiv);

            questionData.options.forEach((option) => {
                const optionButton = document.createElement("button");
                optionButton.classList.add("option-div");
                optionButton.textContent = option;
                optionButton.onclick = function () {
                    checker(this);
                };
                div.appendChild(optionButton);
            });

            document.getElementById("container").appendChild(div);
        });
    }

    function start() {
        document.getElementById("display-container").classList.remove("hide");
        quizCreator();
        quizDisplay(questionCount);
        document.querySelector(".number-of-question").textContent =
            "1 of " + quizArray.length + " Question";
        timerDisplay();
    }
    document
        .getElementById("next-button")
        .addEventListener("click", displayNext);
    window.onload = initializeQuiz;
});
document.querySelector(".restart").addEventListener("click", (e) => {
    localStorage.setItem("dif", "");
    localStorage.setItem("option", "");
    window.location.href = "/";
});