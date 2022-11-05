
//---------------------general functions for the page.------------//

function displayContact(){
	let body = document.querySelector('body');
	let contactBackground = document.createElement('div');
	contactBackground.classList.add('contact-background');
	contactBackground.innerHTML = `
	<div class="contact-block">
			<div class="contact-header">
				<canvas class="cross-cav" width="20px" height="20px" onClick="removeContact()"></canvas>	
			</div>
			<form>
				<h4>your email:</h4>
				<input type="email">
				<h4> your message:</h4>
				<input type="message" placeholder="type here">
				<button name="send">send</button>
			</form>
		</div>
	`;
	body.appendChild(contactBackground);
	let classes = ['.main-header','.main-content','.main-footer'];
	for(i in classes){
		document.querySelector(`${classes[i]}`).classList.add('blur');
	}
	let canvas1 = document.querySelector('.cross-cav');
	let pattern = drawCross(parsedStyle(canvas1,'width'),parsedStyle(canvas1,'height'),'white');
	drawPattrenIncanv(pattern,canvas1);	
	body.style.overflow = 'hidden';
}

function removeContact(){
	let contactBackground = document.querySelector('.contact-background');
	let body = document.querySelector('body');
	contactBackground.remove();
	let classes = ['.main-header','.main-content','.main-footer'];
	for(i in classes){
		document.querySelector(`${classes[i]}`).classList.remove('blur');
	}
	body.style.overflow = 'scroll';
}


//***create a canvas background;


function drawCross(width,height,color){
	let canvas = document.createElement('canvas');
	let ctx = canvas.getContext('2d');
	let space = 5; 
	canvas.width = width;
	canvas.height = height;
	ctx.beginPath();
	ctx.moveTo(space,space);
	ctx.lineTo(canvas.width-space,canvas.height-space);
	ctx.moveTo(canvas.width-space,space);
	ctx.lineTo(space,canvas.height-space);
	ctx.strokeStyle = color;
	ctx.lineWidth = 3;
	ctx.lineCap = 'round';
	ctx.stroke();
	let pattern = ctx.createPattern(canvas,"no-repeat");
	return(pattern);
}

function drawPattrenIncanv(pattern,ele){
	let eleWidth = parsedStyle(ele,'width');
	let eleHeight = parsedStyle(ele,'height');
	let ctx = ele.getContext('2d');
	ctx.fillStyle = pattern;
	ctx.fillRect(0,0,eleWidth,eleHeight);
}
// contactBlock.appendChild(canvas1);