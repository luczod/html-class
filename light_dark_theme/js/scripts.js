const changeThemeBtn = document.querySelector("#change-theme");

function toggleDarkMode() {
    document.body.classList.toggle("dark");
}

function loadTheme(){
    const darkMode = localStorage.getItem('dark');

    if(darkMode){
        toggleDarkMode();
    }
}

changeThemeBtn.addEventListener("change", function() {
    toggleDarkMode()

    //save theme
    localStorage.removeItem("dark");

    if(document.body.classList.contains("dark")){
        localStorage.setItem("dark", 1);
    }
});

loadTheme();