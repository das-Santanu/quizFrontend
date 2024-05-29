
let category = [
    "General Knowledge",
    "Manga",
    "Film",
    "Music",
    "Musicals Theatres",
    "Television",
    "Video Games",
    "Board Games",
    "Nature",
    "Computers",
    "Mathematics",
    "Mythology",
    "Sports",
    "Geography",
    "History",
    "Politics",
    "Art",
    "Celebrities",
    "Animals",
    "Vehicles",
    "Comics",
    "Gadgets",
    "Anime",
    "Cartoon",
];

category.forEach((item, index) => {
    document.querySelector(".grid-container").innerHTML += `
    <div class="topic" id="${index + 9}">
        <img src="https://res.cloudinary.com/derr70tq5/image/upload/v1716888765/image/category/${item}.gif" />
        ${item}
    </div>
    `;
});
let topic = document.querySelectorAll(".topic");
topic.forEach((e) => {
    e.addEventListener("click", (e) => {
        if (e.target.nodeName == "IMG") {
            let option = e.target.parentNode.id;
            localStorage.setItem("option", option);
            console.log(option);
            window.location.href = "/quiz";
        } else {
            let option = e.target.id;
            localStorage.setItem("option", option);
            console.log(option);
            window.location.href = "/quiz";
        }
    });
});