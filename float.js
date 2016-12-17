var MAX_MFLOAT_MANT = 9999999999;//Мантисса должна иметь столько цифр, сколько макс. длина
var MAX_MFLOAT_EXP = 10;	
var MAX_MFLOAT_LENGTH = 10;		


var mFloat = function(sign, mant, exp, val){
	this.sign = sign;
	this.mant = mant;
	this.exp  = exp;
	this.val  = val;
}

var pINF  = new mFloat(0, MAX_MFLOAT_MANT, 0, "pINF");
var mINF  = new mFloat(1, -MAX_MFLOAT_MANT, 0, "mINF");
var pZero = new mFloat(0, 0, 0, "pZero");
var mZero = new mFloat(1, 0, 0, "mZero");
var fNaN  = new mFloat(1, MAX_MFLOAT_MANT, MAX_MFLOAT_LENGTH, "fNaN");

var arrSpecialNum = [];
arrSpecialNum.push(pINF);
arrSpecialNum.push(mINF);
arrSpecialNum.push(pZero);
arrSpecialNum.push(mZero);
arrSpecialNum.push(fNaN);

var a = new mFloat(1, 1, 1, "");
var b = new mFloat(1, 1, 1, "");


mFloat.prototype.checkNumber = function()
{
	console.log("Checking: mant : " + this.mant + " exp: " +this.exp);
	if(this.mant == fNaN.mant && this.exp == fNaN.exp){
		console.log("Checking; its fNaN");
		this.assign(fNaN);
		return fNaN;
	}
	if(this.mant >= MAX_MFLOAT_MANT){
		console.log("Check: mant > MaxMant -> its INF");
		this.assign(pINF);
		return this;
	}
	if(this.mant <= -MAX_MFLOAT_MANT){
		console.log("Check: mant > MaxMant -> its INF");
		this.assign(mINF);
		return;
	}
	if(this.mant == 0.0){
		console.log("Check number, is Zero");
		if(this.sign == 1)
			this.assign(mZero);
		else
			this.assign(pZero);
		return;
	}
	console.log("Check number: default return - its number");
}

mFloat.prototype.assign = function(number)
{
	this.sign = number.sign;
	this.mant = number.mant;
	this.exp = number.exp;
	this.val = number.val;
}

mFloat.prototype.checkEqual = function(number)
{
	return ((this.sign == number.sign && this.mant == number.mant && this.exp == number.exp) || this.val == number.val);
}

mFloat.prototype.isSpecial = function()
{
	for (var i = 0; i < arrSpecialNum.length; i++) {
		if(this.checkEqual(arrSpecialNum[i])){
		console.log("Its SPECIAL Exp: " + this.exp + " mant: " + this.mant + " value: " + this.val);
			return true;
		}
	}
	return false;
}

mFloat.prototype.convertNum =  function(arrNum)
{
	//var regExMant = /-*[0-9]{6}/;
	this.sign = arrNum[0];
	this.mant = Number(arrNum[1]);
	this.exp  = Number(arrNum[2]);
}

mFloat.prototype.updateValue =  function()
{
	this.checkNumber();

	if(this.isSpecial()){
		console.log("IN UPD THIS NUMBER IS SPECIAL Exp: " + this.exp + " mant: " + this.mant + " value: " + this.val);
		return;
	}
	var expVal = Math.pow(10, Number(this.exp));

	//Выделение значащей точной части мантиссы
	var strMant = this.mant.toString();
	this.mant = Number(strMant.substring(0,MAX_MFLOAT_LENGTH+1));

	//Полное значение числа, обрезается до занчащего 
	var fullNum = this.mant * expVal;
	//Вернет округленное значение числа длины MAX_MFLOAT_LENGTH+1
	var strNum = fullNum.toPrecision(MAX_MFLOAT_LENGTH+1);
	console.log("Test str = "+ this.mant);
	this.val = strNum.substring(0,MAX_MFLOAT_LENGTH+1);
	
	console.log("In UPD value Exp: " + this.exp + " mant: " + this.mant + " value: " + this.val);
}

//Приведение порядка объекта к порядку exp
mFloat.prototype.ToExp = function(exp)
{
	if(this.exp >= exp){
		var difference =  this.exp - exp;
		for (var i = 0; i < difference; i++) {
			this.mant *= 10;
			this.exp--;
		}
		return;
	}

	if(this.exp < exp){
		var difference =  exp - this.exp;
		for (var i = 0; i < difference; i++) {
			this.mant /= 10;
			this.exp++;
		}
		return;
	}
}

function additiveOp()
{

	console.log("a "+ a.isSpecial() +" b " +b.isSpecial());
	if(!(a.isSpecial() || b.isSpecial())){
		console.log("additiveOp its both just numbers!");
		return false;
	}

	var Acpy = a;
	var Bcpy = b;

	if(Bcpy.checkEqual(fNaN) || Acpy.checkEqual(fNaN)){
		console.log("additiveOp its NAN!");
		return fNaN;
	}
	if((Acpy.checkEqual(pINF) || Acpy.checkEqual(mINF)) && (Bcpy.checkEqual(pINF) || Bcpy.checkEqual(mINF))){
		if(Acpy.sign != Bcpy.sign){
			console.log("additiveOp is INF with different signs so its fNaN");
			return fNaN;	
		}
		return a;
	}
		
	if(Acpy.checkEqual(pINF) || Acpy.checkEqual(mINF)){
		console.log("additiveOp its INF");
		return Acpy;
	} 
		
	if(Bcpy.checkEqual(pINF) || Bcpy.checkEqual(mINF)){
		console.log("additiveOp its INF");
		if(Bcpy.sign == 1)
			return mINF;
		return Bcpy;
	}

	if(Acpy.checkEqual(mZero) || Acpy.checkEqual(pZero) || Bcpy.checkEqual(mZero) || Bcpy.checkEqual(pZero)){
		console.log("additiveOp result is number, because one of op-s is zero");
		//В случае когда одно из чисел ноль возвращаем то, которое не ноль
		if(a.isSpecial())
			return Bcpy;
		else
			return Acpy;
	}
	return fNaN;	
}

function multiplicatOp()
{

	console.log("a "+ a.isSpecial() +" b " +b.isSpecial());
	if(!(a.isSpecial() || b.isSpecial())){
		console.log("mulriplicatOp its both just numbers!");
		return false;
	}

	var Acpy = a;
	var Bcpy = b;

	if(Bcpy.checkEqual(fNaN) || Acpy.checkEqual(fNaN)){
		console.log("mulriplicatOp its NAN!");
		return fNaN;
	}
	if((Acpy.checkEqual(pINF) || Acpy.checkEqual(mINF)) || (Bcpy.checkEqual(pINF) || Bcpy.checkEqual(mINF))){
		if(!a.isSpecial() || !b.isSpecial()){
			console.log("mulriplicatOp one of numbers is INF so result is INF!");
			return pINF;
		}
		console.log("mulriplicatOp its both INF so result is NAN!");
		return fNaN;		
	}
	if(Acpy.checkEqual(mZero) || Acpy.checkEqual(pZero) || Bcpy.checkEqual(mZero) || Bcpy.checkEqual(pZero)){
		console.log("mulriplicatOp result is zero, because one of op-s is zero");
		//В случае когда одно из чисел ноль возвращаем ноль
		return pZero
	}
		
	console.log("mulriplicatOp returns default fNaN	");
	return fNaN;	
}

function printResult(result)
{
	var resultArea = document.getElementById("resultArea");
	resultArea.value= result;
}

function checkInput(mant, exp)
{
	//Удаляется одна точка
	var formatMant = mant.replace(/\./,'');
	var mantRegEx = /^-?\d+$/;
	var expRegEx = /^-?[0-9]{1,2}$/;
	if(!mantRegEx.test(formatMant)){
		alert("Incorrect mant!");
		return false;
	}
	if(!expRegEx.test(exp)){
		alert("Incorrect exp!");
		return false;
	}
	return true;
}

function confirmInput()
{
	var sign1, sign2;
	var mantArea1 = document.getElementById('mantArea1');
	var expArea1 = document.getElementById('expArea1');
	var mantArea2 = document.getElementById('mantArea2');
	var expArea2 = document.getElementById('expArea2');
	
	if(!checkInput(mantArea1.value, expArea1.value) && !checkInput(mantArea2.value, expArea2.value))
		return;

	if(mantArea1.value.charAt(1) == "-")
		sign1 = 1;
	else 
		sign1 = 0;
	if(mantArea2.value.charAt(1) == "-")
		sign2 = 1;
	else 
		sign2 = 0;
	var aTmp = new mFloat(sign1, mantArea1.value, expArea1.value, ""); 
	a.assign(aTmp);
	a.updateValue();
	var bTmp = new mFloat(sign2, mantArea2.value, expArea2.value, ""); 
	b.assign(bTmp);
	b.updateValue();
}

function add()
{
	var resSpecCheck = additiveOp();
	if(resSpecCheck){
		console.log("Result of operation: " + a.val  + " + " + b.val + " Exp: " + resSpecCheck.exp + " mant: " + resSpecCheck.mant + " value: " + resSpecCheck.val + " sign: " + resSpecCheck.sign);
		printResult("Result of operation: " + a.val  + " + " + b.val + " Exp: " + resSpecCheck.exp + " mant: " + resSpecCheck.mant + " value: " + resSpecCheck.val + " sign: " + resSpecCheck.sign);
		return;
	}
	if(!a.isSpecial()){
		a.ToExp(b.exp);
	}
	console.log("passed res check with result: " + resSpecCheck);
	var sum = Number(a.val) + Number(b.val);
	var ten = Math.pow(10, a.exp);
	sum /= ten;
	var sign;
	if(sum > 0)
		sign = 0;
	else 
		sign = 1;

	var result = new mFloat(sign, sum, a.exp, "");
	result.updateValue();
	console.log("Result of operation: " + a.val  + " + " + b.val + " Exp: " + result.exp + " mant: " + result.mant + " value: " + result.val + " sign: " + result.sign);
	printResult("Result of operation: " + a.val  + " + " + b.val + " Exp: " + result.exp + " mant: " + result.mant + " value: " + result.val + " sign: " + result.sign);
	
}

function sub()
{

	b.sign = (b.sign + 1) % 2;
	//b.val = -b.val;
	b.mant = -b.mant;

	var resSpecCheck = additiveOp();
	if(resSpecCheck){
		console.log("Result of operation: " + a.val  + " - " + b.val + " Exp: " + resSpecCheck.exp + " mant: " + resSpecCheck.mant + " value: " + resSpecCheck.val + " sign: " + resSpecCheck.sign);
		printResult("Result of operation: " + a.val  + " - " + b.val + " Exp: " + resSpecCheck.exp + " mant: " + resSpecCheck.mant + " value: " + resSpecCheck.val + " sign: " + resSpecCheck.sign);
		return;
	}
	if(!a.isSpecial()){
		a.ToExp(b.exp);
	}

	var res = Number(a.val) - Number(b.val);
	var ten = Math.pow(10, a.exp);
	res /= ten;

	var sign;
	if(res > 0)
		sign = 0;
	else 
		sign = 1;

	var result = new mFloat(sign, res, a.exp, "");
	result.updateValue();
	console.log("Result of operation: " + a.val  + " - " + b.val + " Exp: " + result.exp + " mant: " + result.mant + " value: " + result.val + " sign: " + result.sign);

	printResult("Result of operation: " + a.val  + " - " + b.val + " Exp: " + result.exp + " mant: " + result.mant + " value: " + result.val + " sign: " + result.sign);
}
function mul()
{
	var resSpecCheck = multiplicatOp();
	if(resSpecCheck){
		console.log("Result of operation: " + a.val  + " * " + b.val + " Exp: " + resSpecCheck.exp + " mant: " + resSpecCheck.mant + " value: " + resSpecCheck.val + " sign: " + resSpecCheck.sign);
		printResult("Result of operation: " + a.val  + " * " + b.val + " Exp: " + resSpecCheck.exp + " mant: " + resSpecCheck.mant + " value: " + resSpecCheck.val + " sign: " + resSpecCheck.sign);
		return;
	}

	console.log("passed res check with result: " + resSpecCheck);

	var prodMant = Number(a.mant) * Number(b.mant);
	var prodExp = Number(a.exp) + Number(b.exp);

	var sign;
	if(prodMant > 0)
		sign = 0;
	else 
		sign = 1;

	var result = new mFloat(sign, prodMant, prodExp, "");
	result.updateValue();
	console.log("Result of operation: " + a.val + " * " + b.val + " Exp: " + result.exp + " mant: " + result.mant + " value: " + result.val + " sign: " + result.sign);

	printResult("Result of operation: " + a.val  + " * " + b.val + " Exp: " + result.exp + " mant: " + result.mant + " value: " + result.val + " sign: " + result.sign);
	
}
function div()
{
	if(b.checkEqual(mZero) || b.checkEqual(pZero)){
		alert("Division by zero");
		console.log("Result of operation: " + a.val + " / " + b.val + " Is Exp: " + fNaN.exp + " mant: " + fNaN.mant + " value: " + fNaN.val + " sign: " + fNaN.sign);
		printResult("Result of operation: " + a.val + " / " + b.val + " Is Exp: " + fNaN.exp + " mant: " + fNaN.mant + " value: " + fNaN.val + " sign: " + fNaN.sign);
		return;
	}

	//При делении обычного числа на бесконечность получим ноль
	if(!a.isSpecial()){
		if(b.checkEqual(pINF) || b.checkEqual(mINF)){
		printResult("Result of operation: " + a.val + " / " + b.val + " Is Exp: " + pZero.exp + " mant: " + pZero.mant + " value: " + pZero.val + " sign: " + pZero.sign);

		}
	}

	var resSpecCheck = multiplicatOp();
	if(resSpecCheck){
		console.log("Result of operation: " + a.val  + " / " + b.val + " Exp: " + resSpecCheck.exp + " mant: " + resSpecCheck.mant + " value: " + resSpecCheck.val + " sign: " + resSpecCheck.sign);
		printResult("Result of operation: " + a.val  + " / " + b.val + " Exp: " + resSpecCheck.exp + " mant: " + resSpecCheck.mant + " value: " + resSpecCheck.val + " sign: " + resSpecCheck.sign);
		return;
	}

	console.log("passed res check with result: " + resSpecCheck);

	var quotMant = Number(a.mant) / Number(b.mant);
	var quotExp = Number(a.exp) - Number(b.exp);

	var sign;
	if(quotMant > 0)
		sign = 0;
	else 
		sign = 1;

	var result = new mFloat(sign, quotMant, quotExp, "");
	result.updateValue();
	console.log("Result of operation: " + a.val + " / " + b.val + " Exp: " + result.exp + " mant: " + result.mant + " value: " + result.val + " sign: " + result.sign);

	printResult("Result of operation: " + a.val  + " / " + b.val + " Exp: " + result.exp + " mant: " + result.mant + " value: " + result.val + " sign: " + result.sign);
	
}

function eql()
{
	if(a.checkEqual(fNaN) || b.checkEqual(fNaN)){
		printResult("Result of operation: " + a.val + " == " + b.val + " is false");
		return;
	}
	printResult("Result of operation: " + a.val + " == " + b.val + " is " + a.checkEqual(b));
}

function insertpINF1()
{
 var mantArea1 = document.getElementById("mantArea1");
 mantArea1.value = pINF.mant;
 var expArea1 = document.getElementById("expArea1");
 expArea1.value = pINF.exp;
}
function insertmINF1()
{
 var mantArea1 = document.getElementById("mantArea1");
 mantArea1.value = mINF.mant;
 var expArea1 = document.getElementById("expArea1");
 expArea1.value = mINF.exp;
}
function insertpZero1()
{
 var mantArea1 = document.getElementById("mantArea1");
 mantArea1.value = pZero.mant;
 var expArea1 = document.getElementById("expArea1");
 expArea1.value = pZero.exp;
}
function insertmZero1()
{
 var mantArea1 = document.getElementById("mantArea1");
 mantArea1.value = mZero.mant;
 var expArea1 = document.getElementById("expArea1");
 expArea1.value = mZero.exp;
}
function insertNaN1()
{
 var mantArea1 = document.getElementById("mantArea1");
 mantArea1.value = fNaN.mant;
 a.val = fNaN.val;
 var expArea1 = document.getElementById("expArea1");
 expArea1.value = fNaN.exp;
}
function insertpINF2()
{
 var mantArea2 = document.getElementById("mantArea2");
 mantArea2.value = pINF.mant;
 var expArea2 = document.getElementById("expArea2");
 expArea2.value = pINF.exp;
}
function insertmINF2()
{
 var mantArea2 = document.getElementById("mantArea2");
 mantArea2.value = mINF.mant;
 var expArea2 = document.getElementById("expArea2");
 expArea2.value = mINF.exp;
}
function insertpZero2()
{
 var mantArea2 = document.getElementById("mantArea2");
 mantArea2.value = pZero.mant;
 var expArea2 = document.getElementById("expArea2");
 expArea2.value = pZero.exp;
}
function insertmZero2()
{
 var mantArea2 = document.getElementById("mantArea2");
 mantArea2.value = mZero.mant;
 var expArea2 = document.getElementById("expArea2");
 expArea2.value = mZero.exp;
}
function insertNaN2()
{
 var mantArea2 = document.getElementById("mantArea2");
 mantArea2.value = fNaN.mant;
 b.val = fNaN.val;
 var expArea2 = document.getElementById("expArea2");
 expArea2.value = fNaN.exp;
}