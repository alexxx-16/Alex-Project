const fs = require("fs");

fs.writeFile("messageFromAlex.txt", "Hello from the real Alex!", (err) => {
    if (err) throw err;
    console.log('The file has been saved!');
});

fs.readFile("messageFromAlex.txt", "utf8", (err, data) => {
    if (err) throw err;
    console.log(data);
}); 