/* 
1. Use the inquirer npm package to get user input.
2. Use the qr-image npm package to turn the user entered URL into a QR code image.
3. Create a txt file to save the user input using the native fs node module.
*/

import inquirer from 'inquirer';
import qr from 'qr-image';
import fs from 'fs';

inquirer
  .prompt([
    {
        type:'input',
        name: 'url',
        message: 'What is your favourite website?',
    }
])
  .then((answers) => {
    console.log(answers);
    const qrCode = qr.image(answers.url);
    qrCode.pipe(fs.createWriteStream('answer.png'));
    fs.writeFile('answers.txt', answers.url, function(){
        console.log('File saved.');
    })
})
  .catch((error) => {
     console.log(error)
  });