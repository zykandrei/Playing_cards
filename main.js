(function () {
  let interval
  // Этап 1. Создайте функцию, генерирующую массив парных чисел. Пример массива, который должна возвратить функция: [1,1,2,2,3,3,4,4,5,5,6,6,7,7,8,8].count - количество пар.

  function createNumbersArray(count) {
    let result = [];
    for (let i = 1; i <= count; i++) {
      result.push(i, i);
    }
    return result;
  }

  // Этап 2. Создайте функцию перемешивания массива.Функция принимает в аргументе исходный массив и возвращает перемешанный массив. arr - массив чисел

  function shuffle(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  // Этап 3. Используйте две созданные функции для создания массива перемешанными номерами. На основе этого массива вы можете создать DOM-элементы карточек. У каждой карточки будет свой номер из массива произвольных чисел. Вы также можете создать для этого специальную функцию. count - количество пар.

  function startGame() {
    const countInput = document.getElementById("count-input");
    const count = parseInt(countInput.value);

    // Проверяем, допустимо ли введенное значение
    if (!count || count % 2 !== 0 || count < 2 || count > 10) {
      countInput.value = 4; // Сброс к значению по умолчанию
    }

    const numbersArray = createNumbersArray(countInput.value);
    const shuffledArray = shuffle(numbersArray);

    // Создаём DOM-элементы для карточек на основе перетасованного массива
    const gameContainer = document.getElementById("game-container");

    gameContainer.innerHTML = ""; // Очистить предыдущие карты

    shuffledArray.forEach((number) => {
      const card = document.createElement("div");
      card.classList.add("card", "closed");
      card.textContent = number;
      gameContainer.appendChild(card);

      // Добавляем прослушиватель событий клика к каждой карточке
      card.addEventListener('click', () => {
        // Проверяем, можно ли открыть карту
        if (!card.classList.contains('open') && !card.classList.contains('match')) {
          // Открыть карту
          card.classList.remove('closed');
          card.classList.add('open');

          // Проверяем количество открытых карт на поле
          const openCards = gameContainer.querySelectorAll('.card.open');
          if (openCards.length === 2) {
            // Получаем значения открытых карт
            const firstCardValue = openCards[0].textContent;
            const secondCardValue = openCards[1].textContent;

            // Проверяем, совпадают ли значения
            if (firstCardValue === secondCardValue) {
              // Добавляем класс соответствия и удаляем открытый класс, если значения совпадают
              openCards.forEach(card => {
                card.classList.remove('open');
                card.classList.add('match');
              });

            } else {
              // Если значения не совпадают, закрываем карты после задержки
              setTimeout(() => {
                openCards.forEach(card => {
                  card.classList.remove('open');
                  card.classList.add('closed');
                });
              }, 300);
            }
            // проверка равенство открытых карточек, конец игры
            const matchCards = gameContainer.querySelectorAll(".match");
            if (matchCards.length === numbersArray.length) return endGame()
          }
        }
      });
    });
  }

  // Функция для запуска игры при отправке формы
  function setupGame() {
    const form = document.getElementById("game-setup");
    form.addEventListener('submit', (event) => {
      event.preventDefault(); // Запретить отправку формы
      startGame()
      startTimer()
    });
  }

  // Вызов функции setupGame при загрузке страницы
  window.addEventListener('load', setupGame);

  // Добавляем таймер для завершения игры через одну минуту
  function startTimer() {
    clearInterval(interval)
    let timeLeft = 60;
    const timerElement = document.getElementById('timer');
    interval = setInterval(() => {
      timerElement.textContent = `Оставшееся время: ${timeLeft} секунд`;
      timeLeft--;

      // Проверяем, истекло ли время
      if (timeLeft < 0) {
        clearInterval(interval);
        endGame("endTime");
      }
    }, 1000);
  }
  // логика окончания игры
  function endGame(type) {
    let gameContainer = document.getElementById("game-container");
    let timerElement = document.getElementById("timer").textContent;
    let seconds = parseInt(timerElement.match(/\d+/gm))
    let cards = gameContainer.querySelectorAll(".card.match")

    cards.forEach(r => {
      r.remove()
    })
    //если время не закончилось и все карточки открыты.....😜
    if (type !== "endTime") {
      gameContainer.textContent = `Поздравляю, вы открыли все карты за ${60 - seconds} секунд!`
      clearInterval(interval)
      return
    }
    gameContainer.textContent = `Вы проиграли. И это печально.` //иначе.....🤬

  }

  window.setupGame = setupGame;

})();
