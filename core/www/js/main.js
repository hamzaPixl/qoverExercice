$(document).ready(function () {

  const URL_BASE = 'http://localhost:3000';
  hide();

  //User want to login
  $('#loginbutton').on('click', () => {
    let user_form = formToJson($('.loginform'));
    clear($('.loginform'));
    $.ajax({
      type: 'GET',
      url: `${URL_BASE}/login/${user_form.username}/${user_form.password}`,
      statusCode: {
        400: (response) => {notification(response.responseJSON.message, 'warning');},
        500: (response) => {notification(response.responseJSON.message, 'error');},
        200: (response) => {
          notification(response.message, 'success');
          sessionStorage.setItem('username', response.user.username);
          sessionStorage.setItem('token', response.user.token);
          hide();
        }
      }
    });
  });

  //User logout
  $('#logoutbutton').on('click', () => {logout();});

  //User create a quote
  $('#pricebutton').on('click', () => {
    let quotes = formToJson($('.quotesform'));
    clear($('.quotesform'));
    $.ajax({
      type: 'GET',
      url: `${URL_BASE}/quote/${quotes.name}/${quotes.car}/${quotes.value}/${sessionStorage.getItem('username')}/${sessionStorage.getItem('token')}`,
      statusCode: {
        400: (response) => {notification(response.responseJSON.message, 'warning');},
        500: (response) => {notification(response.responseJSON.message, 'error');},
        200: (response) => {
          console.log(response);
          if (response.code === 200) {
            notification(response.message, 'success');
            $('#price').text(`Price will be ${englishStyle(response.price)} €`);
          } else {
            notification(response.message, 'error');
          }
        }
      }
    });
  });

  //Add differents cars to dropdown
  function addCars (src) {
    $.ajax({
      type: 'GET',
      url: `${URL_BASE}/cars/${sessionStorage.getItem('token')}`,
      statusCode: {
        400: (response) => {notification(response.responseJSON.message, 'warning');},
        500: (response) => {notification(response.responseJSON.message, 'error');},
        200: (response) => {
          src.empty();
          Object.keys(response).forEach((index) => {
            src.append('<option name="car" value="' + response[index].name + '">' + response[index].name + '</option>');
          });
        }
      }
    });
  }

  //Logout a user, clear session
  function logout () {
    sessionStorage.clear();
    hide();
  }

  //Popup a notification
  function notification (message, code) {
    toastr.options = {
      'closeButton': false,
      'debug': false,
      'newestOnTop': false,
      'progressBar': false,
      'positionClass': 'toast-bottom-right',
      'preventDuplicates': false,
      'onclick': null,
      'showDuration': '300',
      'hideDuration': '1000',
      'timeOut': '5000',
      'extendedTimeOut': '1000',
      'showEasing': 'swing',
      'hideEasing': 'linear',
      'showMethod': 'fadeIn',
      'hideMethod': 'fadeOut'
    };
    toastr[code](message);
  }

  //Get an object from a form
  function formToJson (src) {
    let o = {};
    src.find('input').each(function () {
      o[$(this).attr('name')] = $(this).val();
    });
    src.find('select[multiple]').each(function (i, e) {
      o[$(this).attr('name')] = $(this).val();
    });
    src.find('select').each(function () {
      o['car'] = $(this).val();
    });
    return o;
  }

  //hide views
  function hide () {
    $('#loginpage').css('display', 'none');
    $('#quotespage').css('display', 'none');
    if (!sessionStorage.getItem('username') || !sessionStorage.getItem('token')) {
      $('#loginpage').css('display', 'block');
    } else {
      $('#quotespage').css('display', 'block');
      $('#price').val('');
      addCars($('#carsselect'));
    }
  }

  //Clear a form
  function clear (src) {
    src.find('input').each(function () {
      $(this).val('');
    });
  }

  //Display in English style
  function englishStyle (n) {
    return n.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,');
  }
});