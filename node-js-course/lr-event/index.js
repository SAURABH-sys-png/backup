const fs = require('fs');


setTimeout(() => {
  console.log("This is msg from thew timout execurted after 5 secondsa")
}, 5000);

setImmediate(() => {
  console.log("this was executed immeiatyely");
})

console.log("This is from the top level");

