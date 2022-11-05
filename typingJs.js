
// -----------shortcuts------------
let getStyle = window.getComputedStyle;
let parsedStyle = (ele,attr)=> parseFloat(getStyle(ele)[attr]);

// -----------global variables---------
let textBlock = document.querySelector('#text');
let mainInput = document.querySelector('#mainInput');
let timeDiv = document.querySelector('#timer');
let animateTime = undefined;
let time = (1000)*60;
let arrayWords = undefined;
let color = {true:'#36AE7C',false:'#F32424'};
let i,r = undefined;
let [erorrObject,currentSpan] = [undefined,undefined];   //will change on fetch
let [wrongWords,correctWords,correctLetters] =[0,0,0];
let currentLineW , lineNum = undefined;
let remainS = undefined;
// -------------fatching data-------------
function fetchData(){
	fetch('https://random-word-api.herokuapp.com/word?number=200')
	.then((response)=>{return response.json()})
	.then((data)=>{
		arrayWords = data;
		init();
	})
	.catch((e)=>{networkError(e)});
};
fetchData();
// let string = "by default a div is a block element, it means its width will be 100% of its container width, and its height will expand to cover all of its children. In case its children has a larger width than the div 's container width, the div itself does not expand horizontally but its children spill outside its boundary instead".trim();
// arrayWords = string.split(" ");

function networkError(e){
	let errorDiv = document.querySelector("#error");
	errorDiv.style.display = "block";
	errorDiv.innerHTML  = `Slow network, Failed to fetch data.`;

}

function settimer(){
	animateTime =setInterval(timer,1000);
	mainInput.removeEventListener("keydown",settimer);
}

function timer(){
	remainS-=1000;
	let minutes = Math.floor(remainS/time);
	let seconds = ((remainS%time)/1000);
	timeDiv.innerHTML =`${minutes}:${seconds}`;
	if(remainS == 0){		
		mainInput.removeEventListener('keydown',testing);
		mainInput.removeEventListener('keyup',testingAfter);
		clearInterval(animateTime);
		processInfo();
	}
}


function init(){
	arrayWords.forEach((item,i)=>{
		let span = document.createElement('span');
		span.id = `span${i}`;
		span.innerHTML = `${item} `;
		textBlock.appendChild(span);
	});
	i=0;
	r=-1;
	wrongWords = 0;
	correctWords= 0;
	correctLetters = 0;
	erorrObject = {
		errorL: new Object(),
		outOfSpace:0
	};
	currentSpan = 0;	
	nextSpan(i);
	currentLineW = currentSpan.offsetWidth;
	lineNum = 1;
	remainS = time;
	mainInput.disabled = false;
	mainInput.addEventListener('keydown',testing);
	mainInput.addEventListener('keyup',testingAfter);
	mainInput.addEventListener('keydown',settimer);
}

function testing(ev){
	switch(ev.which){
		case 13: case 16: case 18:
			break;
		case 8:                                //delete
			let Inputlength = (mainInput.value.length-1>=0)?mainInput.value.length-1:0; 
			r = Math.max(-1,--r);
			if(mainInput.value.slice(0,Inputlength)==arrayWords[i].slice(0,Inputlength)){
				currentSpan.style.color = color.true;
			}
			else{
				currentSpan.style.color = color.false;
			}
			break;			
		case 32:                                //space
			let textValue = mainInput.value;
			if(textValue.trim()!=arrayWords[i]){
				wrongWords++;
				currentSpan.style.color = color.false;
			}
			else{
				correctWords++;
			}
			correctLetters += compareString(arrayWords[i],textValue);
			mainInput.value = '';
			i++;
			r = -1;
			if(changeTheI()){
				nextSpan(i);
			}
			detectLine(currentSpan);
			break;
		default:
			r++;
			let letter = ev.key;
			if(letter != arrayWords[i][r]){
				if(arrayWords[i][r] == undefined){
					erorrObject.outOfSpace+=1;
				}
				else{
				erorrObject.errorL[arrayWords[i][r]] = (erorrObject.errorL.hasOwnProperty(arrayWords[i][r]))?erorrObject.errorL[arrayWords[i][r]]+1:1;
				// currentSpan.style.color = color.false;
				}
				currentSpan.style.color = color.false;	
			}
	}
}

function changeTheI(){
	if(i>=arrayWords.length){
		mainInput.removeEventListener('keydown',testing);
		mainInput.removeEventListener('keyup',testingAfter);
		return false;	
	}
	return true;
}

function testingAfter(ev){
	switch(ev.which){
		case 32:             //space
			mainInput.value = mainInput.value.slice(1);
			break;		
	}
}

function processInfo(){
	let wpm = correctWords+wrongWords;
	// let generalAcr = (!wpm)?0:Math.round((100/wpm)*correctWords);
	let wrongletter = 0;
	for(key in erorrObject.errorL){
		wrongletter += erorrObject.errorL[key];
	}
	wrongletter+=erorrObject.outOfSpace;
	let realAcr = (!(correctLetters+wrongletter))?0:Math.round((100/(correctLetters+wrongletter))*correctLetters);
	repesentDAta(wpm,realAcr,correctWords,wrongWords,erorrObject.errorL);
}


function repesentDAta(wpm,realAcr,correctW,wrongW,erorrL){
	let result = document.querySelector('.result');
	let colum = document.querySelectorAll('.result .table1 td');
	result.style.display= "block";
	colum[0].innerHTML = `${wpm}wpm`;
	colum[1].innerHTML = `${realAcr}%`; 
	colum[2].innerHTML = `${correctW}`;
	colum[3].innerHTML = `${wrongW}`;
	let trOnTable2 = document.querySelectorAll('.table2 tr');
	for(item in erorrL){
		let th = document.createElement('th');
		th.innerHTML = `${item}`;
		trOnTable2[0].appendChild(th);
		let td = document.createElement('td')
		td.innerHTML = `${erorrL[item]}`;
		trOnTable2[1].appendChild(td);
	}
}


function compareString(orgStr,testStr){
	let num =0;
	for(let i=0;i<orgStr.length;i++){
		if(testStr[i]==orgStr[i])
			num++;
	}
	return(num);
}

function nextSpan(index){
	let previousSpan = currentSpan;
	currentSpan = document.querySelector(`#span${index}`);
	setTimeout(()=>{
		previousSpan.style = ""; 
		currentSpan.style.color = color.true;
		currentSpan.style.backgroundColor = 'rgba(0,0,0,0.1)';
	},200);
}

function detectLine(span){
	let BlockW = parsedStyle(textBlock,"width");
	if(span.offsetWidth > (BlockW-currentLineW)){
		lineNum++;
		currentLineW = span.offsetWidth;
	}else{
		currentLineW+= span.offsetWidth;
	}
	if(lineNum == 3){
		textBlock.scrollBy(0,parsedStyle(textBlock,"height"));
		lineNum =1;
	}
}

function replay(){
	currentSpan.style ="";
	clearInterval(animateTime);
	timeDiv.innerHTML =`1:00`;
	textBlock.scrollTo(0,0);
	mainInput.value="";
	document.querySelector('.result').style.display = "none";
	let trOnTable2 = document.querySelectorAll('.table2 tr');
	trOnTable2.forEach((tr)=>{
		tr.innerHTML = "";
	});
	mainInput.disabled = true;
	textBlock.innerHTML = "";
	fetchData();
}

//32: spaces , 13: enter ,8: delete;







