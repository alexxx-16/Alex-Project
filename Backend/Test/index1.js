import express from "express";

const app = express();
const port = 3000;

const numbers = [1, 2, 3, 4, 5, 6];
const users = [
  { id: 1, fName: "John", lName: "Doe" },
  { id: 2, fName: "Jane", lName: "Smith" },
  { id: 3, fName: "Michael", lName: "Brown" },
  { id: 4, fName: "Emily", lName: "Davis" },
  { id: 5, fName: "Chris", lName: "Wilson" },
];

app.get("/", (req, res) => {
  numbers.forEach((number) =>
    console.log(`I have ${number} ${number > 1 ? "apples" : "apple"}.`),
  );
  // function itself doesn't actually return anything

  const newNumbers1 = numbers.map((n) => n * n);
  const newNumbers2 = numbers.filter((n) => n > 3);
  const newNumbers3 = numbers.pop();
  const newNumbers4 = numbers.push(7);
  const sortedNumbers = numbers.sort((a, b) => b - a);
  const sortedUsersById = users.sort((a, b) => b.id - a.id);
  const sortedUsersByFirstName = users.sort((a, b) =>
    a.fName.localeCompare(b.fName),
  );
  // returns new array

  const numberTotal = numbers.reduce((sum, number) => sum + number, 0);
  const numberIndex = numbers.findIndex((number) => number === 3);
  // single value

  const user = users.find((user) => user.id === 2);
  // one item

  const has5 = numbers.includes(5);
  const allPassed = numbers.every((number) => number > 1);
  const isAnyBigger = numbers.some((number) => number > 4);
  // boolean

  console.log(
    newNumbers1,
    newNumbers2,
    newNumbers3,
    newNumbers4,
    sortedNumbers,
    sortedUsersById,
    numberTotal,
    numberIndex,
    //index shows 3 because i've sorted the array above backwards
    user,
    has5,
    allPassed,
    isAnyBigger,
    sortedUsersByFirstName,
  );

  // res.send(
  //   `<h2> Hello, today is ${new Date().toLocaleDateString("en-GB")} </h2>
  //   <h1>Answer: ${JSON.stringify(user)}</h1>`,
  // );
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
