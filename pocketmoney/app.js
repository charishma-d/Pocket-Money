var budgetController=(function(){
	var Expense=function(id,description,value){
		this.id=id;
		this.description=description;
		this.value=value;
		this.percentage=-1;
	};
	Expense.prototype.calcPercentage = function(totalInc) {
		if(totalInc>0){
		this.percentage=Math.round((this.value/totalInc)*100);
		}
	else {
		this.percentage=-1;
		}
	};
	Expense.prototype.getPercentage=function(){
		return this.percentage;
	};
	var Income=function(id,description,value){
		this.id=id;
		this.description=description;
		this.value=value;
	};

	var data={
		allItems:{
			exp:[],
			inc:[]
		},
		totals:{
			exp:0,
			inc:0
		},
		budget:0,
		percentage:-1,
		percent:-1
	};
	var calculateTotal=function(type){
		var sum=0;
		data.allItems[type].forEach(function(current){
			sum+=current.value;
		});
		
		data.totals[type]=sum;
	};

	return {
		addItem:function(type,des,val){
			var newItem,ID;
			//create new id
			if(data.allItems[type].length>0){
			ID=data.allItems[type][data.allItems[type].length-1].id+1;
			}
			else{
			ID=0;
			}
			//create new item based on if exp or inc
			if(type==='exp'){
			newItem=new Expense(ID,des,val);
			}
			else if(type==='inc'){
				newItem=new Income(ID,des,val);
			}
			//push into array
			data.allItems[type].push(newItem);
			//returning new item 
			return newItem; 

		},
		deleteItem:function(type,id){
			var ids,index;

			ids=data.allItems[type].map(function(current){
				return current.id;
			});
			index=ids.indexOf(id);
			if(index!=-1){
				data.allItems[type].splice(index,1);
			}



		},
		calculateBudget:function(){
			//calculate total income and total expense
			calculateTotal('exp');
			calculateTotal('inc');
			//calculate total budget
			data.budget=data.totals.inc-data.totals.exp;
			//calcuate the percent of income
			if(data.totals.inc>0){
			/*data.percent=data.allItems[type].forEach(function(current){
				return Math.round((current/totalInc)*100);
			});*/
			data.percentage=Math.round((data.totals.exp/data.totals.inc)*100);}
			else{
				data.percentage=-1;
			}
		},
		calculatePercentage:function(){
			data.allItems.exp.forEach(function(current){
				current.calcPercentage(data.totals.inc);
			});
		},
		getPercentage:function(){
			var allpercentages=data.allItems.exp.map(function(current){
				return current.getPercentage();
			});
			return allpercentages;
		},
	
		getBudget:function(){
		return {
			budget:data.budget,
			totalInc:data.totals.inc,
			totalExp:data.totals.exp,
			percentage:data.percentage,
			//percent:data.percent
		}

	}
}
	
})();

var UIController=(function(){
	var DOMStrings={
		inputType:'.add__type',
		inputDesc:'.add__description',
		inputVal:'.add__value',
		inputbtn:'.add__btn',
		incomeContainer:'.income__list',
		expenseContainer:'.expenses__list',
		budgetlabel:'.budget__value',
		incomelabel:'.budget__income--value',
		expenseslabel:'.budget__expenses--value',
		percentagelabel:'.budget__expenses--percentage',
		container:'.container',
		percent:'.item__percentage',
		month:'.budget__title--month'
	};
	var d = new Date();
var month = new Array();
month[0] = "January";
month[1] = "February";
month[2] = "March";
month[3] = "April";
month[4] = "May";
month[5] = "June";
month[6] = "July";
month[7] = "August";
month[8] = "September";
month[9] = "October";
month[10] = "November";
month[11] = "December";
var n = month[d.getMonth()]+' '+d.getFullYear();
	var formatNumber=function(number){
			var numbersplit,int,dec;
			number=Math.abs(number);
			number=number.toFixed(2);
			numbersplit=number.split('.');
			int=numbersplit[0];
			if(int.length>3){
				int=int.substr(0,int.length-3)+','+int.substr(int.length-3,int.length);
			}
			dec=numbersplit[1];
			return int+'.'+dec;

		};
		var nodeListForEach=function(list,callback){
				for(var i=0;i<list.length;i++){
					callback(list[i],i);
				}
			};

	return {
		n:n,
		getinput:function(){
			return {
				type:document.querySelector(DOMStrings.inputType).value,
				description:document.querySelector(DOMStrings.inputDesc).value,
				value:parseFloat(document.querySelector(DOMStrings.inputVal).value)
			}
		},
		changeType:function(){
			var fields=document.querySelectorAll(DOMStrings.inputType+','+DOMStrings.inputDesc+','+DOMStrings.inputVal);
			nodeListForEach(fields,function(current){
				current.classList.toggle('red-focus');
			});
			document.querySelector(DOMStrings.inputbtn).classList.toggle('red');
		},
		addListItem:function(obj,type){
			var html,newhtml;
			//create html string with place holder text
			if(type==="inc"){
				element=DOMStrings.incomeContainer;
				html='<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">+ %value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
			}
			else if(type==="exp"){
				element=DOMStrings.expenseContainer;
				html='<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">- %value%</div><div class="item__percentage">%percentage%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
			}
			//replace place holder with actual data
			newhtml=html.replace('%id%',obj.id);
			newhtml=newhtml.replace('%description%',obj.description);
			newhtml=newhtml.replace('%value%',formatNumber(obj.value));
			newhtml=newhtml.replace('%percentage%',obj.percentage);

			//insert html to dom
			document.querySelector(element).insertAdjacentHTML('beforeend',newhtml);
		},
		
		deleteListItem:function(selectorid){
			var el=document.getElementById(selectorid);
			el.parentNode.removeChild(el);


		},
		getDOMStrings:function(){
			return DOMStrings;
		},
		clearFields:function(){
			var fields,fieldsArr;
			fields=document.querySelectorAll(DOMStrings.inputDesc+', '+DOMStrings.inputVal);
			fieldsArr=Array.prototype.slice.call(fields);
			fieldsArr.forEach(function(current,index,Array){
				current.value=""; 
			});
			fieldsArr[0].focus();
		},
		
		displayBudget:function(obj){
			document.querySelector(DOMStrings.month).textContent=n;			
			document.querySelector(DOMStrings.budgetlabel).textContent=(obj.budget<0?'-':'+')+formatNumber(obj.budget)+' $';
			document.querySelector(DOMStrings.incomelabel).textContent=formatNumber(obj.totalInc);
			document.querySelector(DOMStrings.expenseslabel).textContent='-' +formatNumber(obj.totalExp);
			//document.querySelector(DOMStrings.percent).textContent=obj.percent;
			if(obj.percentage>0){
			document.querySelector(DOMStrings.percentagelabel).textContent=obj.percentage;
			}
			else{
			document.querySelector(DOMStrings.percentagelabel).textContent='---';
			}

		},
		displayPercentage:function(arr){
			var fields=document.querySelectorAll(DOMStrings.percent);
			
			nodeListForEach(fields,function(current,index){
				if(arr[index]>0){
				current.textContent=arr[index]+"%";
			}
			else{
				current.textContent="---";
			}
			});



		}

	}

})();



var controller=(function(budgetController,UIController){
var DOMStrings=UIController.getDOMStrings();
	var setupEventListeners=function(){		
		document.querySelector(DOMStrings.inputbtn).addEventListener("click",cntrlAddItem);

		document.addEventListener("keypress",function(e){
			if(e.keycode===13||event.which===13){
			cntrlAddItem();
			}
		});
		document.querySelector(DOMStrings.container).addEventListener("click",cntrlDeleteItem);
		document.querySelector(DOMStrings.inputType).addEventListener("change",UIController.changeType);
	};

	var updateBudget=function(){
		//calculate budget
		budgetController.calculateBudget();
		//return budget
		var Budget=budgetController.getBudget();
		//display in ui
		console.log(Budget);
		UIController.displayBudget(Budget);
		};

	var updatePercentage=function(){
		//calculate percent
		budgetController.calculatePercentage();
		//return percentage 
		var percent=budgetController.getPercentage();
		//update ui 
		UIController.displayPercentage(percent);
		

	};

		var cntrlAddItem=function(){
		var input,newItem;
		//get input from fields
		input=UIController.getinput();
		if(input.description!=""&&!isNaN(input.value)&&input.value>0){
		//add item to budget controller
		newItem=budgetController.addItem(input.type,input.description,input.value);
		//add item to UI
		UIController.addListItem(newItem,input.type);
		//clear fields after getting input values
		UIController.clearFields();	
		//calculate and update budget values
		updateBudget();
		//calculate and update percent
		updatePercentage();
		}
	};
	var cntrlDeleteItem=function(e){
		var itemID,splitID;
		itemID=event.target.parentNode.parentNode.parentNode.parentNode.id;
		if(itemID){
			splitID=itemID.split('-');
			type=splitID[0];
			ID=parseInt(splitID[1]);
			//delete the item from ds
			budgetController.deleteItem(type,ID);
			//delete the item from ui
			UIController.deleteListItem(itemID);
			//update and display the new budget
			updateBudget();
			//calculate and update percent
			updatePercentage();
		}
	};

return{
	init:function(){
		console.log('started');
		document.querySelector(DOMStrings.month).textContent=UIController.n;	
		UIController.displayBudget({
			budget:0,
			totalInc:0,
			totalExp:0,
			percentage:0
		});
		setupEventListeners();

	}
	
};

})(budgetController,UIController);

controller.init();