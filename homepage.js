const daySelect = document.getElementById("day");
const monthSelect = document.getElementById("month");
const yearSelect = document.getElementById("year");

// Populate months
const months = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

months.forEach((month, index) => {
  const option = document.createElement("option");
  option.value = index + 1;
  option.text = month;
  monthSelect.appendChild(option);
});

// Populate years (e.g., 1950 to current year)
const currentYear = new Date().getFullYear();
for (let year = currentYear; year >= 1950; year--) {
  const option = document.createElement("option");
  option.value = year;
  option.text = year;
  yearSelect.appendChild(option);
}

// Populate days based on month and year
function populateDays() {
  daySelect.innerHTML = "";

  const month = parseInt(monthSelect.value);
  const year = parseInt(yearSelect.value);

  const daysInMonth = new Date(year, month, 0).getDate();

  for (let day = 1; day <= daysInMonth; day++) {
    const option = document.createElement("option");
    option.value = day;
    option.text = day;
    daySelect.appendChild(option);
  }
}

// Initialize days
populateDays();

// Update days when month or year changes
monthSelect.addEventListener("change", populateDays);
yearSelect.addEventListener("change", populateDays);


const sec8= document.querySelector(".sec-8");
const sec9 = document.querySelector(".sec-9");
const signUpBtn = document.querySelector(".thick");
const logInBtn= document.querySelector(".black");

const cancelBtns = document.querySelectorAll(".cancel");
const cancel2 = cancelBtns[0]
const cancel3 = cancelBtns[1]

signUpBtn.addEventListener("click", function(e){
  e.preventDefault()
  sec8.classList.remove("none")
})

cancel2.addEventListener("click",function(){
  sec8.classList.add("none")
})

logInBtn.addEventListener('click', function (e) {
  e.preventDefault()
  sec9.classList.remove("none")
})

cancel3.addEventListener("click",function(){
  sec9.classList.add("none")
})
