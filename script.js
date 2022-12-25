'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Nurgul Cengel',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    '2015-03-05T12:01:00Z',
    '2016-07-23T13:20:00Z',
    '2019-08-27T14:40:00Z',
    '2021-04-02T12:45:00Z',
    '2022-05-01T10:10:00Z',
    '2023-03-30T17:05:00Z',
    '2022-09-12T14:00:00Z',
    '2025-10-25T13:30:00Z',

  ],
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
  movementsDates: [
    '2015-03-05T12:01:00Z',
    '2016-07-23T13:20:00Z',
    '2019-08-27T14:40:00Z',
    '2021-04-02T12:45:00Z',
    '2022-05-01T10:10:00Z',
    '2023-03-30T17:05:00Z',
    '2022-09-12T14:00:00Z',
    '2025-10-25T13:30:00Z',

  ],
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
  movementsDates: [
    '2015-03-05T12:01:00Z',
    '2016-07-23T13:20:00Z',
    '2019-08-27T14:40:00Z',
    '2021-04-02T12:45:00Z',
    '2022-05-01T10:10:00Z',
    '2023-03-30T17:05:00Z',
    '2022-09-12T14:00:00Z',
    '2025-10-25T13:30:00Z',

  ],
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
  movementsDates: [
    '2015-03-05T12:01:00Z',
    '2016-07-23T13:20:00Z',
    '2019-08-27T14:40:00Z',
    '2021-04-02T12:45:00Z',
    '2022-05-01T10:10:00Z',
    '2023-03-30T17:05:00Z',
    '2022-09-12T14:00:00Z',
    '2025-10-25T13:30:00Z',

  ],
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');



//GLOBAL VARIABLES

let currentAccount,timer;

//CREATE USERNAME

const createUsernames = function (accs) {
  accs.forEach(function (acc) {
    acc.userName = acc.owner.toLowerCase().split(' ').map(name => name[0]).join('');
  });

};

createUsernames(accounts);
console.log(accounts);

//Date Function

const date = function (fDate) {
  const day = `${fDate.getDate()}`.padStart(2, 0);
  const month = `${fDate.getMonth() + 1}`.padStart(2, 0);
  const year = fDate.getFullYear();
  const hour = `${fDate.getHours()}`.padStart(2, 0);
  const minute = `${fDate.getMinutes()}`.padStart(2, 0);
  const fullDate = `${day}/${month}/${year}  ${hour}:${minute}`;
  return fullDate;
};

//CREATE COUNTDOWN TİMER

const startLogOutTimer = function () {

  let time = 120;
  const tick = function () {
    const min = String(Math.trunc(time / 60)).padStart(2, 0);
    const sec = String(time % 60).padStart(2, 0);

    if (time === 0) {
      clearInterval(timer);
      containerApp.style.opacity = 0;
      labelWelcome.textContent = 'Log in to get started';
    }
    labelTimer.textContent = `${min}:${sec}`
    time--;
  };

  tick();
  const timer = setInterval(tick, 1000);
  return timer;

};

//Display functions

const calcDisplayBalance = function (accs) {
  accs.balance = accs.movements.reduce((acc, mov) => acc + mov, 0);
  labelBalance.textContent = `${accs.balance.toFixed(2)}£`;
};

const calcDisplaySummary = function (account) {

  const incomes = account.movements.filter(move => move > 0).reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = `${incomes.toFixed(2)}£`;
  const out = account.movements.filter(move => move < 0).reduce((acc, mov) => acc + mov, 0);
  labelSumOut.textContent = `${Math.abs(out).toFixed(2)}£`;
  const interest = account.movements.filter(mov => mov > 0).map(deposit => (deposit * account.interestRate) / 100).filter(interest => interest >= 1).reduce((acc, interest) => acc + interest, 0);
  labelSumInterest.textContent = `${interest.toFixed(2)}£`;
};

const displayMovements = function (account, sort = false) {

  containerMovements.innerHTML = '';
  const movs = sort ? account.movements.slice().sort((a, b) => a - b) : account.movements;
  movs.forEach(function (movement, i) {
    const displayDate = date(new Date(account.movementsDates[i]));
    const type = movement > 0 ? 'deposit' : 'withdrawal';
    const html = `<div class="movements__row">
<div class="movements__type movements__type--${type}">${i + 1} ${type}</div>
<div class="movements__date">${displayDate}</div>
<div class="movements__value">${movement.toFixed(2)}£</div>
</div>`
    containerMovements.insertAdjacentHTML('afterbegin', html);
  })
};
//Update UI function
const updateUI = function (account) {
  calcDisplayBalance(account);
  calcDisplaySummary(account);
  displayMovements(account);
}

//EventListeners


btnLogin.addEventListener('click', function (e) {
  e.preventDefault();

  currentAccount = accounts.find(acc => acc.userName === inputLoginUsername.value);
  if (currentAccount.pin === Number(inputLoginPin.value)) {
    containerApp.style.opacity = 100;
    labelWelcome.textContent = `Welcome back, ${currentAccount.owner.split(' ')[0]} 😊`;
    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur();
    //timer function
    if(timer) clearInterval(timer);
    timer=startLogOutTimer();
    //Display functions use for current account's movements
    updateUI(currentAccount);
    labelDate.textContent = date(new Date());

  }


  /* accounts.forEach(function(currentAcc){
    if(currentAcc.userName && currentAcc.userName===inputLoginUsername.value && currentAcc.pin===Number(inputLoginPin.value)){
         containerApp.style.opacity=100;
         labelWelcome.textContent=`Welcome, ${currentAcc.owner.split(' ')[0]} 😊`;
         inputLoginUsername.value=inputLoginPin.value='';
         inputLoginPin.blur();}
         //Display functions use for current account's movements
         calcDisplayBalance(currentAcc.movements);
         calcDisplaySummary(currentAcc.movements);
         displayMovements(currentAcc.movements);*/
}
);


btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = Math.floor(inputTransferAmount.value);
  const receiverAcc = accounts.find(acc => acc.userName === inputTransferTo.value);
  inputTransferAmount.value = inputTransferTo.value = '';

  if (amount > 0 && currentAccount.userName !== receiverAcc.userName && currentAccount.balance >= amount) {
    currentAccount.movements.push(-amount);
    currentAccount.movementsDates.push(new Date());
    receiverAcc.movements.push(amount);
    receiverAcc.movementsDates.push(new Date());
    clearInterval(timer);
    timer=startLogOutTimer();
    updateUI(currentAccount);
  }

});

btnClose.addEventListener('click', function (e) {
  e.preventDefault();

  if (inputCloseUsername.value === currentAccount.userName && Number(inputClosePin.value) === currentAccount.pin) {

    const index = accounts.findIndex(acc => acc.userName === currentAccount.userName);
    accounts.splice(index, 1);
    containerApp.style.opacity = 0;
    labelWelcome.textContent = 'Log in to get started';
  }
  inputCloseUsername.value = inputClosePin.value = '';
});

btnLoan.addEventListener('click', function (e) {
  e.preventDefault();

  const amount = Math.floor(inputLoanAmount.value);
  //const deposite=currentAccount.movements.some(mov=>move/10)
  if (amount > 0 && currentAccount.movements.some(mov => mov >= amount / 10))
    setTimeout(function () {
      currentAccount.movements.push(amount);
      currentAccount.movementsDates.push(new Date());
      updateUI(currentAccount);
      clearInterval(timer);
    timer=startLogOutTimer();
    }, 3000)
  inputLoanAmount.value = '';
});

let sorted = false;
btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  displayMovements(currentAccount, !sorted);
  sorted = !sorted;

})


/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

const currencies = new Map([
  ['USD', 'United States dollar'],
  ['EUR', 'Euro'],
  ['GBP', 'Pound sterling'],
]);

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

/////////////////////////////////////////////////
