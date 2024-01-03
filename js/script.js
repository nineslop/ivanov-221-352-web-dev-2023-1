// Получить список маршрутов и рабочие buttons, 10 для каждой страницы
var api_key = "feac5a33-e5b8-4b71-8a25-76eb0f1954ba";
const url = `http://exam-2023-1-api.std-900.ist.mospolytech.ru/api/routes?api_key=${api_key}`;
var tablemaster = document.getElementById("111111");
var paginationmaster = document.getElementById("pagination-buttons");
var pageUP = document.getElementById("pagePAGE");

// Функция для получения и отображения данных для определенной страницы
function fetchDataAndDisplay(pageIndex) {
  fetch(url, {
    method: "GET",
  })
    .then(resp => resp.json())
    .then(function(data) {
      
      tablemaster.innerHTML = "";

      const totalPages = Math.ceil(data.length / 10);
      const startIndex = pageIndex * 10;
      const endIndex = Math.min((pageIndex + 1) * 10, data.length);

      pageUP.innerHTML = `Страница ${pageIndex + 1} из ${totalPages}`;

      for (let index = startIndex; index < endIndex; index++) {
        const element = data[index];
        const row = document.createElement("tr");
        const truncatedMainObject = element.mainObject.slice(0, 195);
        const truncatedDescription = element.description.slice(0, 195);

        row.innerHTML = `
          <td data-bs-toggle="tooltip" data-bs-placement="top" data-bs-custom-class="custom-tooltip" data-bs-title="">${element.name}</td>
          <td data-bs-toggle="tooltip" data-bs-placement="top" data-bs-custom-class="custom-tooltip" data-bs-title="">${truncatedMainObject}${element.mainObject.length > 195 ? '...' : ''}</td>
          <td data-bs-toggle="tooltip" data-bs-placement="top" data-bs-custom-class="custom-tooltip" data-bs-title="">${truncatedDescription}${element.description.length > 195 ? '...' : ''}</td>
          <td><button type="button" class="id-2 btn btn-walking-route btn-outline-success px-5" onclick="location.href='#pagination-walking-routes';">Выбрать</button></td>
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

fetch(url, {
  method: "GET",
})
  .then(resp => resp.json())
  .then(function(data) {
    console.log(data.length);
    const totalPages = Math.ceil(data.length / 10);
    createPaginationButtons(totalPages, 0);
    fetchDataAndDisplay(0);
  })
  .catch(function(error) {
    console.log(error);
  });
