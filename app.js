const fs = require('fs');
const readLine = require('readline');

const file = readLine.createInterface({
	input: fs.createReadStream('orders.csv'),
	output: process.stdout, 
	terminal: false
})

let lineIndex = 0;
let headers = [];
let chosenHeaders = [
	'Shipping Name', 
	'Shipping Address1', 
	'Shipping Address2', 
	'Shipping City', 
	'Shipping Zip', 
	'Shipping Province',
	'Shipping Country',
]

const makeLabelFile = (address) => {
	// console.log(address);

	const onComplete = (err) => {
		if (err) throw err;
		console.log('File Written!');
	}

	const contents = buildHtml(address);

	fs.writeFile(`${address['Shipping Name']}.html`, contents, onComplete);
}

file.on('line', (line) => {
	if (lineIndex === 0) {
		headers = line.split('","');
	} else {	
		let data = line.split('","')
		let addressInfo = {};

		headers.forEach((header,index) => {
			if(chosenHeaders.includes(header)) {
				addressInfo[header] = data[index];
			}
		});

		makeLabelFile(addressInfo);
	}
	lineIndex++;
})

const buildHtml = (address) => { 
	let content = `
		<html style="font-size: 35px;">
			<div style="height: 100vh; display:flex;align-items: center;justify-content: center;">
				<div>
	`;

	for(const property in address) {
		if(address[property] !== ''){
			content += `<div>${address[property]}</div>`;
		}
	}

	content += "</div></div></html>";

	return content;
}


