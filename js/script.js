// Получить список маршрутов и рабочие buttons, 10 для каждой страницы
const api_key = "feac5a33-e5b8-4b71-8a25-76eb0f1954ba";
const url = `http://exam-2023-1-api.std-900.ist.mospolytech.ru/api/routes?api_key=${api_key}`;
const tablemaster = document.getElementById("111111");
const paginationmaster = document.getElementById("pagination-buttons");
const pageUP = document.getElementById("pagePAGE");
const guideTable = document.getElementById("guideTable");
const guidesContainer = document.getElementById("guidesContainer");
const guidesRouteName = document.getElementById("guidesRouteName");
const FIOguide = document.getElementById("FIO-guide");
const nameItinerary = document.getElementById("name-itinerary");
const startMonet = document.getElementById("stock-money");
const dataTourForm = document.getElementById("data-tour-form");
const startTimeTour = document.getElementById("start-time-tour");
const hoursNumberNumbers = document.getElementById("hours-number-numbers");
const numberOfPeople = document.getElementById("number-of-people");



// Функция для получения и отображения данных для определенной страницы
function fetchDataAndDisplay(pageIndex) {
  fetch(url, {
    method: "GET",
  })
    .then(resp => resp.json())
    .then(function(data) {
      
      tablemaster.innerHTML = "";
      // console.log(data);
      const totalPages = Math.ceil(data.length / 10);
      const startIndex = pageIndex * 10;
      const endIndex = Math.min((pageIndex + 1) * 10, data.length);

      pageUP.innerHTML = `Страница ${pageIndex + 1} из ${totalPages}`;

      for (let index = startIndex; index < endIndex; index++) {
        const element = data[index];
        const row = document.createElement("tr");
        const truncatedMainObject = element.mainObject.slice(0, 195);
        const truncatedDescription = element.description.slice(0, 195);

        // console.log(`onclick="createGuide(${element.id},${element.name});"`);

        //столбцов 10 для каждой страницы
        row.innerHTML = `
          <td data-bs-toggle="tooltip" data-bs-placement="top" data-bs-custom-class="custom-tooltip" title="${element.name}">${element.name}</td>
          <td data-bs-toggle="tooltip" data-bs-placement="top" data-bs-custom-class="custom-tooltip" title="${element.mainObject}">${truncatedMainObject}${element.mainObject.length > 195 ? '...' : ''}</td>
          <td data-bs-toggle="tooltip" data-bs-placement="top" data-bs-custom-class="custom-tooltip" title="${element.description}">${truncatedDescription}${element.description.length > 195 ? '...' : ''}</td>
          <td><button type="button" class="id-2 btn btn-walking-route btn-outline-success px-5" onclick="createGuide(${element.id},'${element.name}');">Выбрать</button></td>
        `;

        tablemaster.appendChild(row);
      }

      createPaginationButtons(totalPages, pageIndex);
    })
    .catch(function(error) {
      console.log(error);
    });
}

// Функция для создания кнопок пагинации
function createPaginationButtons(totalPages, currentPageIndex) {
  var paginationentry = "";
  const currentPage = currentPageIndex + 1;

  // Счёт страниц
  let startPage, endPage;

  if (totalPages <= 3) {
    startPage = 1;
    endPage = totalPages;
  } else if (currentPage <= 1) {
    startPage = 1;
    endPage = 3;
  }
  else if (currentPage >= totalPages - 1) {
    startPage = Math.max(1, totalPages - 2);
    endPage = totalPages;
  }
  else {
    startPage = Math.max(1, currentPage - 1);
    endPage = Math.min(currentPage + 1, totalPages);
  }
  // console.log(currentPage);
  // console.log(startPage);
  // console.log(endPage);

  // Предыдущая кнопка
  paginationentry += `<li class="page-item previous-btn"><a class="page-link page-previous" href="#walking-routes" onclick="fetchDataAndDisplay(${currentPage - 1 > 0 ? currentPageIndex - 1 : 0})">Предыдущая</a></li>`;

  // Кнопки с правильными номерами страниц
  for (let index = startPage; index <= endPage; index++) {
    paginationentry += `<li class="page-item"><a class="page-link page-${index}" href="#walking-routes" onclick="fetchDataAndDisplay(${index - 1})">${index}</a></li>`;
  }

  // Следующая кнопка
  paginationentry += `<li class="page-item next-btn"><a class="page-link page-next" href="#walking-routes" onclick="fetchDataAndDisplay(${currentPage + 1 < totalPages ? currentPageIndex + 1 : totalPages - 1})">Следующая</a></li>`;

  const PG = document.createElement("div");
  PG.innerHTML = `<ul class="pagination">${paginationentry}</ul>`;
  paginationmaster.innerHTML = "";
  paginationmaster.appendChild(PG);
}

//Распределение гидов по маршруту
function createGuide(tourId,tourName) {
  const urlGuide = `http://exam-2023-1-api.std-900.ist.mospolytech.ru/api/routes/${tourId}/guides?api_key=${api_key}`;

  fetch(urlGuide, {
    method: "GET",
  })
    .then(resp => resp.json())
    .then(function(data) {
      guideTable.innerHTML = "";
      
      guidesContainer.classList.remove(`d-none`);
      guidesRouteName.innerHTML = tourName;

      data.forEach(element => {
        const row = document.createElement("tr");
        row.innerHTML = ` <td><i class="fa-solid fa-id-badge fa-3x" aria-hidden="true"></i></td>
        <td data-bs-toggle="tooltip" data-bs-placement="top" data-bs-custom-class="custom-tooltip"
            data-bs-title="${element.name}">${element.name}</td>
        <td data-bs-toggle="tooltip" data-bs-placement="top" data-bs-custom-class="custom-tooltip"
            data-bs-title="${element.language}">${element.language}</td>
        <td data-bs-toggle="tooltip" data-bs-placement="top" data-bs-custom-class="custom-tooltip" data-bs-title="${element.workExperience}">${element.workExperience}
        </td>
        <td data-bs-toggle="tooltip" data-bs-placement="top" data-bs-custom-class="custom-tooltip" data-bs-title="${element.pricePerHour}">
        ${element.pricePerHour}</td>
        <td><button type="button" class="id-293 btn btn-guides btn-outline-success px-5" data-bs-toggle="modal"
                data-bs-target="#application-formalization-modal" onclick="OpenForm('${element.name}','${tourName}','${element.pricePerHour}');">Выбрать</button></td>`;

        guideTable.appendChild(row);
      });

      // console.log(data);
    })
}


dataTourForm.addEventListener('input', function () {
  console.log(this.value);

  let dateObject = new Date(this.value);
  let dateOfTheWeek = (dateObject.getDay()); 

  var russianHolidays = [
    new Date('2024-01-01'),   // New Year's Day
    new Date('2024-01-07'),   // Orthodox Christmas Day
    new Date('2024-03-08'),   // International Women's Day
    new Date('2024-05-01'),   // Spring and Labor Day
    new Date('2024-05-09'),   // Victory Day
    new Date('2024-06-12'),  // Russia Day
    new Date('2024-11-04')   // Unity Day
];

isHoliday = false;

for (var i = 0; i < russianHolidays.length; i++) {
  if (dateObject.getTime() === russianHolidays[i].getTime()) {
      isHoliday = true;
      break;
  }
}

if (dateOfTheWeek === 0 || dateOfTheWeek === 6 || isHoliday) {
  isThisDayOff = 1.5;
  // console.log('holiday');
} 
else {
  isThisDayOff = 1;
}
upDatePrice();

});

//работает не коректно
// startTimeTour.addEventListener('input', function () {
//   console.log(this.value);

//   let getObject = new Date(this.value);
//   let timeOfTheDay= getObject.getHours();
//   console.log(timeOfTheDay);

//   let isMorning = 0;
//   let isItEvening = 0;
//   let isThisDayOff = 1;

//   if(timeOfTheDay >= 9 && timeOfTheDay <= 12) {
//     isMorning = 400;
//   } else if(timeOfTheDay >= 20 && timeOfTheDay <= 23) {
//     isItEvening = 1000;
//   }

//   upDatePrice();
// });

hoursNumberNumbers.addEventListener('input', function () {
console.log(this.value);
});

numberOfPeople.addEventListener('input', function () {
console.log(this.value);
});

//рабочая форма
function OpenForm(GuideData,tourName,pricePerHour) {
  console.log(GuideData,tourName,pricePerHour);

  guideServiceCost = pricePerHour;
  FIOguide.innerHTML = GuideData;
  nameItinerary.innerHTML = tourName;
  startMonet.innerHTML = pricePerHour;

  upDatePrice();
}

function setLengthOfTour(length) {
  console.log(length);
}

let hoursNumber, isMorning, isItEvening, numberOfVisitors;
let isThisDayOff = 1;
let guideServiceCost;

//function update form
function upDatePrice() {
  let price = guideServiceCost * isThisDayOff //+ isMorning + isItEvening;
  startMonet.innerHTML = price;
}

 function isMorningg(hoursNumber, startHour, endHour) {
   if (isNaN(hoursNumber) || isNaN(startHour) || isNaN(endHour)) {
     throw new Error('Неверные значения аргументов');
   }

   return startHour <= 12 && endHour >= 9 ? 400 : 0;
 }

 function additionalOptions(isSchoolkid, isStudent, isInteractiveGuide, startMonet) {
   if (isSchoolkid < 0 || isStudent < 0 || isInteractiveGuide < 0) {
     throw new Error('Неверное значение аргументов');
   }

   let price = 0;

   if (isSchoolkid || isStudent) {
     price -= startMonet * 0.15;
   }

   if (isInteractiveGuide) {
     price += startMonet * 0.5;
   }

   return price;
 }


fetch(url, {
  method: "GET",
})
  .then(resp => resp.json())
  .then(function(data) {
    //console.log(data.length);
    const totalPages = Math.ceil(data.length / 10);
    createPaginationButtons(totalPages, 0);
    fetchDataAndDisplay(0);
  })
  .catch(function(error) {
    //console.log(error);
  });
