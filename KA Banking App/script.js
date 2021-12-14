'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Kristaps Atkocuns',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
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

/////////////////////////////////////////////////
/////////////////////////////////////////////////

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

const displayMovments = function (movements, sort = false) {
  //Tiek uztaisīta funkcija priekš: movments un sort tiek pievienots prieks sort pogas, kas defaulta ir fault, bet tiks nomainits uz true ar sort pogu un paliks aktivs
  containerMovements.innerHTML = ''; //Kods, kas uzliek default parametrus

  //ipmlementing sorting function in our app. Slice radija kopiju no movements array un tad talak sort metode tika izmantota lai visu saskirotu
  const movs = sort ? movements.slice().sort((a, b) => a - b) : movements;

  //Seit movements tika nomaints ar movs prieks skirosanas funkcijas
  movs.forEach(function (mov, i) {
    //Loop cauri movements un ārā dabū vērtību + index

    const type = mov > 0 ? 'deposit' : 'withdrawal'; //Ja movements vertība + vai -, attiecīgs teksts

    //Šeit tiek modificēts HTML kods izmantojot loopingu
    const html = `<div class="movements__row">
  <div class="movements__type movements__type--${type}">${i + 1} ${type}</div>
  <div class="movements__value">${mov}</div>
</div>
`;
    containerMovements.insertAdjacentHTML('afterbegin', html); //Kods kurš integrē HTML kodu to pievienojot klāt orģinālajam kodam. afterbegin - norada uz to kur kods bus japievieno starp HTML elementiem, šajā gadījumā uzteiz pēc <div class="movements"> elementa.
  });
};

// displayMovments(account1.movements); //Šeit tiek izsaukta funkcīja uz account1.movements arrayr

// ////////////////////////////IN - OUT - INTEREST - Skākumā pirms dynamic account switching
// const calcPrintBalance = function(movements) {
// const incomes = movements.filter(mov => mov > 0)
// .reduce((accumulator, mov) => accumulator + mov, 0)
// labelSumIn.textContent = `${incomes}`

// const output = movements.filter(mov => mov < 0)
// .reduce((accumulator, mov) => accumulator + mov, 0)
// labelSumOut.textContent = `${Math.abs(output)}`

// const interest = movements.filter(mov => mov > 0).map(deposit => deposit *1.2/100).filter((interest, i, arr) => {console.log(arr); return interest >= 1}).reduce((accumulator, interest) => accumulator + interest, 0)
// labelSumInterest.textContent = `${Math.abs(interest)}`
// }

////////////////////////////IN - OUT - INTEREST - beigās pēc account dynamic switching
const calcPrintBalance = function (acc) {
  const incomes = acc.movements
    .filter(mov => mov > 0)
    .reduce((accumulator, mov) => accumulator + mov, 0);
  labelSumIn.textContent = `${incomes}`;

  const output = acc.movements
    .filter(mov => mov < 0)
    .reduce((accumulator, mov) => accumulator + mov, 0);
  labelSumOut.textContent = `${Math.abs(output)}`;

  const interest = acc.movements
    .filter(mov => mov > 0)
    .map(deposit => (deposit * acc.interestRate) / 100)
    .filter((interest, i, arr) => {
      console.log(arr);
      return interest >= 1;
    })
    .reduce((accumulator, interest) => accumulator + interest, 0);
  labelSumInterest.textContent = `${Math.abs(interest)}`;
};

// calcPrintBalance(account1.movements);

////////////////////////////////////////////////Valūtas pārveidošana
const eurToUsd = 1.1; //Valūtas kurss

const movementsUSD = movements.map(function (mov) {
  //ejot cauri movements array viss tiek pareizināts ar eurToUsd
  return mov * eurToUsd;
});
// console.log(movements) //orginalais array netika pārveidots
// console.log(movementsUSD) // Tika radīts jauns array

////////////////////////////////////////////////Computing usernames
const createUsernames = function (accounts) {
  //loopos cauri katram accountam un mainis vardu uz inicialiem
  accounts.forEach(function (acc) {
    //Pārveido vārdu uz iniciāļiem
    acc.username = acc.owner
      .toLowerCase()
      .split(' ')
      .map(function (name) {
        return name[0]; //Pārveido uz LowerCace, atdala ar atstarpi, loopings ar map cauri array ar atseviskiem vardiem, return name[0], dabūn tikai pirmos burtus un beigās visu savieno ar join ''
      })
      .join('');
  });
};
createUsernames(accounts);
// console.log(accounts)

//////////////////////////////////////////////Filter method for creating deposits
const deposits = movements.filter(function (mov) {
  return mov > 0;
});
// console.log(deposits) //izfiltrēti tikai pozitīvie skaitļi

/////////////////////////////////////////////Reduce method for balance
const balance = movements.reduce(function (accumulator, cur, i, arr) {
  //accumulator ir a value that holds the value of all the array elements sum
  console.log(`iteration ${i}: ${accumulator}`);
  return accumulator + cur;
}, 0); //Šeit 0 nozīmē to, ka summācija sāksies no nulles
// console.log(balance)

const calcPrintBalanceEUR = function (acc) {
  acc.balance = acc.movements.reduce(
    (accumulator, mov) => accumulator + mov,
    0
  );
  labelBalance.textContent = `${acc.balance} EUR`;
};
// calcPrintBalanceEUR(account1.movements)

///////////////////////////////////////////////Sum in USD dollars - method chaining
const tototalDeposisUSD = movements
  .filter(mov => mov > 0)
  .map(mov => mov * eurToUsd)
  .reduce((accumulator, mov) => accumulator + mov, 0);

// console.log(tototalDeposisUSD)

//////////////////////////////////////////////////Finds Method - atgriež tikai pirmo elementu, kas izpilda nosacījumu

const firstWithdrawal = movements.find(mov => mov < 0);
console.log(movements);
console.log(firstWithdrawal);

const account = accounts.find(acc => acc.owner === 'Jessica Davis');
// console.log(account)

/////////////////////////////////////////////////Implementing login

const updateUI = function (acc) {
  //Display movements
  displayMovments(acc.movements);
  //Display balance
  calcPrintBalance(acc);
  //Display summary
  calcPrintBalanceEUR(acc);
};

let currentAccount; //iznesam vērtību ārā no objekta, funkcijas utt!!!!!!

btnLogin.addEventListener('click', function (e) {
  //e.preventDefault() ielādē, bet neatgriež uz default. Button tā vienkārši strādā (tas pats kas ja nospiestu enter)
  e.preventDefault();
  console.log('Login');

  //Šeit pārliecinās, ka iniciāļi atbilst mūsu datu bāzei
  currentAccount = accounts.find(
    acc => acc.username === inputLoginUsername.value
  );
  console.log(currentAccount);
  //Šeit implementē PIN Nr., ? ja current account existē, tad izpildīt tālāk
  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    console.log('LOGIN');
    //Display UI and message
    labelWelcome.textContent = `Welcome back, ${
      currentAccount.owner.split(' ')[0]
    }`; //Teksts
    containerApp.style.opacity = 100; //Pārveido css kodu, lai user data tiktu paraditi lapa
    //inputfieldus nodzēš uzreiz pēc apstiprinājuma
    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur(); //kursors nepaliek login input fielda vairāk

    //calling all currentAccounts.movements functions
    updateUI(currentAccount);
    // //Display movements
    // displayMovments(currentAccount.movements);
    // //Display balance
    // calcPrintBalance(currentAccount);
    // //Display summary
    // calcPrintBalanceEUR(currentAccount)

    //Tas pats kas augš izkomentēts, tikai apvienots vienā funkcija: currentAccount.movements
  }
});

///////////////////////////////////////////////////////Button for money transfer
btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = Number(inputTransferAmount.value);
  //Šeit izmanto find, lai atrastu kam parskaitit naudu un cik, lidz ko find lodzins sakrit ar kadu no accounts, ta tas tiek selectots
  const receiverAcc = accounts.find(
    acc => acc.username === inputTransferTo.value
  );
  // Pārbaude: Pārbauda vai kontā ir pozitīva nauda, vai eksiste konts ar ievadito nosaukumu, vai nevar pārskaitīt lielāku summu nekā ir kontā, un lai nevar ieskaitīt pats sev naudu
  //nodzēš aktīvos input logus
  inputTransferAmount.value = inputTransferTo.value = '';

  if (
    amount > 0 &&
    receiverAcc &&
    currentAccount.balance >= amount &&
    receiverAcc?.username !== currentAccount.username
  ) {
    //doing the transfer it self
    currentAccount.movements.push(-amount);
    receiverAcc.movements.push(amount);
    //Izsauc uz visiem kontiem + vizualais
    updateUI(currentAccount);
  }
});

///////////////////////////////////////Bank loan function (Some and Every methods)
// SOME - pārbauda visus elementus un pasaka vai kādā no tiem izpildās NOSACĪJUMS
const anyDeposits = movements.some(mov => mov > 0);
console.log(anyDeposits);

btnLoan.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = Number(inputLoanAmount.value);

  //Nosacijums aiznemumam, ja ir bijis transfers kas ir bijis lielaks par 10% no pieprasitas aizdevuma summas, tad var dabut loan
  if (amount > 0 && currentAccount.movements.some(mov => mov >= amount / 10)) {
    //Add sum to account
    currentAccount.movements.push(amount);

    updateUI(currentAccount);
  }
  //nodzēš input field
  inputLoanAmount.value = '';
});

// EVERY - pārbauda visus elementus un pasaka vai VISI no tiem izpilda NOSACĪJUMU
console.log(movements.every(mov => mov > 0));
console.log(account4.movements.every(mov => mov > 0));

//////////////////////////////////////////////////////Find index method to delete account

btnClose.addEventListener('click', function (e) {
  e.preventDefault();
  inputClosePin.value = inputCloseUsername.value = ''; //nosacijumi, ka visi input lauki aizpilditi pareizi
  if (
    inputCloseUsername.value === currentAccount.username &&
    Number(inputClosePin.value) === currentAccount.pin
  ) {
    //Seit samekle account indexu ===> JS account ir ar indexu 0
    const index = accounts.findIndex(
      acc => acc.username === currentAccount.username
    );
    //Ar splice metodi izmen no accounts array
    accounts.splice(index, 1);
    containerApp.style.opacity = 0; //Pārveido css kodu, lai user data tiktu noslepti lapa
  }
});

/////////////////////////////////////////////////////////Sort button

let sorted = false;

btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  displayMovments(currentAccount.movements, !sorted);
  sorted = !sorted; //atgriez atpakal saskirotos skaitlus
});

/*
const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

for (const [index, movement] of movements.entries()) {
  if (movement > 0) {
    console.log(`Movment ${index + 1}: You deposited ${movement}`);
  } else {
    console.log(`Movment ${index + 1}: You withdrew ${Math.abs(movement)}`);
  }
}

console.log(`----Different way to loop over array-------`);

movements.forEach(function (movement, index, array) {
  if (movement > 0) {
    console.log(`Movment ${index + 1}: You deposited ${movement}`);
  } else {
    console.log(`Movment ${index + 1}: You withdrew ${Math.abs(movement)}`);
  }
});

console.log(`....Looping trough Maps..........`);

const currencies = new Map([
  ['USD', 'United States dollar'],
  ['EUR', 'Euro'],
  ['GBP', 'Pound sterling'],
]);

currencies.forEach(function (value, key, map) {
  console.log(`${key}: ${value}`);
});

console.log(`....Looping trough Sets (setiem nav key)..........`);

const currenciesUnique = new Set(['USD', 'GBP', 'USD', 'EUR', 'EUR']);
console.log(currenciesUnique);
currenciesUnique.forEach(function (value, key, map) {
  console.log(`${key}: ${value}`);
});

// LECTURES

const currencies = new Map([
  ['USD', 'United States dollar'],
  ['EUR', 'Euro'],
  ['GBP', 'Pound sterling'],
]);

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

/////////////////////////////////////////////////

let arr = ['a', 'b', 'c', 'd', 'e'];
//SLICE method - copies origional array
console.log(arr.slice(2));
console.log(arr.slice(2, 4));
console.log(arr.slice(-1)); //Last element of any array
console.log(arr.slice(1, -1));
console.log(arr.slice()); // tas pats kas, console.log([...arr]); creates copy

//SPLICE - mutates original array
console.log(arr.splice(2)); //Ko nogriezt nost no array
console.log(arr); //Pec spilce pari paliek ['a', 'b']

//REVERSE mothod
arr = ['a', 'b', 'c', 'd', 'e'];
let arr2 = ['j', 'i', 'h', 'g', 'j'];
console.log(arr2.reverse());
console.log(arr2); //izmainija orginalo

//CONCAT method
const letters = arr.concat(arr2); //tas pats kas console.log([...arr, arr2])
console.log(letters);

//JOIN method
console.log(letters.join('-'));


//Eating too much means dog eats more then recomended proportion, eating too little means less then recomended
//Eating ok means, that portion is whiting 10% of recomended +-
//recomendedFood=weight ** 0.75 * 28 g that needs to be converted in Kg

const dogs = [
  { weight: 22, curFood: 250, owners: ['Alice', 'Bob'] },
  { weight: 8, curFood: 200, owners: ['Matilda'] },
  { weight: 13, curFood: 275, owners: ['Sarah', 'Johan'] },
  { weight: 32, curFood: 340, owners: ['Micheal'] },
];

// const recomendedFood = dogs[0].weight ** 0.75 * 28;
// console.log(recomendedFood);

for (const [i, value] of dogs.entries('x')) {
  console.log(value);
}


// Julias test data [3,5,2,12,7];
// Kates test data [4,1,15,8,3];

const julia = [3,5,2,12,7];
const kate = [4,1,15,8,3];
const juliaCopy = julia;
console.log(juliaCopy);
juliaCopy.splice(-2, 3)
juliaCopy.splice(0, 1)
console.log(juliaCopy);

const AllArrays = [...juliaCopy, ...kate];
console.log(AllArrays);



const agesOfDogs = function(mov, i) {
  if(mov >= 3) {
    console.log(`Dog number ${i + 1} is a ${mov} grown dog`)
  } else {
    console.log(`Dog number ${i + 1} is a ${mov} puppy`)
  }
}
AllArrays.forEach(agesOfDogs);
*/
