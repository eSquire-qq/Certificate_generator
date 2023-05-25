function createCertificate() {

  var fullname = document.getElementById('fullname').value;
  var date = document.getElementById('date').value;
  var teacher = document.getElementById('teacher').value;
  var course = document.getElementById('course').value;
  var hours = document.getElementById('hours').value;

  if (fullname == '') {
    alert('Введіть ПІБ')
    return;
  }

  if (course == '') {
    alert('Введіть назву курса')
    return;
  }

  if (teacher == '') {
    alert('Введіть викладача')
    return;
  }

  if (date == '') {
    alert('Введіть дату отримання')
    return;
  }

  if (hours == '') {
    alert('Введіть кількість годин')
    return;
  }

  const regexForName = /^([А-ЯЇІЄ]{1,1})([а-яїіє]{2,15})+\s([А-ЯЇІЄ]{1,1})([а-яїіє]{1,15})+\s([А-ЯЇІЄ]{1,1})([а-яїіє]{2,15})+$/;
  if (regexForName.test(fullname)) {
    console.log("ПІБ введено правильно");
  } else {
    alert("ПІБ введено неправильно")
    return;
  }

  const regexForTeacher = /^([А-ЯЇІЄ]{1,1})([а-яїіє]{2,15})+\s([А-ЯЇІЄ]{1,1}\.)+\s([А-ЯЇІЄ]{1,1}\.)+$/;
  if (regexForTeacher.test(teacher)) {
    console.log("Викладача введено правильно");
  } else {
    alert("Викладача введено неправильно")
    return;
  }

  // Починаємо створення канвасу
  const canvasContainer = document.createElement('div');
  canvasContainer.classList.add('canvas-container')
  document.body.appendChild(canvasContainer);
  const canvas = new fabric.Canvas('canvas', {
    width: canvasContainer.clientWidth,
    height: canvasContainer.clientHeight,
  });

  // Задаємо канвасу розмір
  canvas.setWidth(1000);
  canvas.setHeight(707);

  canvasContainer.appendChild(canvas.lowerCanvasEl);

  const maxWidth = canvas.width;
  const maxHeight = canvas.height;

  // Створюємо об'єкт зображення
  fabric.Image.fromURL('images/White Green Elegant Certificate Of Appreciation (1).png', function (img) {
    var scaleFactor = Math.min(maxWidth / img.width, maxHeight / img.height);
    img.scaleToWidth(img.width * scaleFactor);
    img.scaleToHeight(img.height * scaleFactor);
    canvas.add(img);

    canvas.sendToBack(img)


    // Створюємо об'єкт текста
    var courseText = new fabric.Text(course, {
      left: 500,
      top: 500,
      fontSize: 30,
      fill: 'black'
    });
    canvas.add(courseText);

    var fullnameText = new fabric.Text(fullname, {
      left: 400,
      top: 350,
      fontSize: 30,
      fill: 'black'
    });
    canvas.add(fullnameText);

    var teacherText = new fabric.Text(teacher, {
      left: 360,
      top: 560,
      fontSize: 30,
      fill: 'black'
    });
    canvas.add(teacherText);

    var hoursText = new fabric.Text(hours, {
      left: 630,
      top: 560,
      fontSize: 30,
      fill: 'black'
    });
    canvas.add(hoursText);

    var dateText = new fabric.Text(date, {
      left: 800,
      top: 560,
      fontSize: 30,
      fill: 'black'
    });
    canvas.add(dateText);

    var uniqueCode = new fabric.Text('№' + generateUniqueCode(), {
      left: 20,
      top: 20,
      fontSize: 16,
      fill: 'white'
    });
    canvas.add(uniqueCode);

    canvas.renderAll();

    const downloadBtn = document.createElement('button');
    downloadBtn.textContent = 'Завантажити';
    downloadBtn.addEventListener('click', () => {
      // Отримуємо URL-адрес канваса у форматі PNG
      const url = canvas.toDataURL('image/png');

      // Створюємо посилання для завантаження
      const downloadLink = document.createElement('a');
      downloadLink.href = url;
      downloadLink.download = 'myCanvas.png';

      // Додаємо посилання на сторінку та емулюємо натискання на неї
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);



      // Створюємо посилання для завантаження
      const sendToDB = document.createElement('a');
      sendToDB.href = '/save';

      // Додаємо посилання на сторінку та емулюємо натискання на неї
      document.body.appendChild(sendToDB);
      sendToDB.click();
      document.body.removeChild(sendToDB);
      sendCertificateInfoToServer(url, uniqueCode.text, fullname, date, teacher, course, hours)

    });

    // Додаємо кнопку для завантаження на сторінку
    document.body.appendChild(downloadBtn);
  });

}

// Функція для створення унікального кода на основі дати та часу
function generateUniqueCode() {
  var now = new Date();
  var code = now.getFullYear().toString()
    + (now.getMonth() + 1).toString().padStart(2, '0')
    + now.getDate().toString().padStart(2, '0')
    + now.getHours().toString().padStart(2, '0')
    + now.getMinutes().toString().padStart(2, '0')
    + now.getSeconds().toString().padStart(2, '0')
    + now.getMilliseconds().toString().padStart(3, '0');
  console.log(code)
  return code;
}

// Функція для відправлення даних про сертифікат на сервер
function sendCertificateInfoToServer(url, number, fullname, date, teacher, course, hours) {
  const certificate = {
    url: url,
    number: number,
    fullname: fullname,
    date: date,
    teacher: teacher,
    course: course,
    hours: hours,
  };

  fetch('http://localhost:3000/save', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(certificate)
  })
    .then(response => {
      console.log(response);
    })
    .catch(error => {
      console.error(error);
    });
}