$(function(){

var localDB={

	init:function () {

		this.initDb();
		$('#newpage').on('click', function(){ 
			localDB.chargePage();
		});

		$('#loadpage').on('click', function(){ 
			localDB.loadPage();
		});
	},

	initDb:function () {
		try{
			if (!window.openDatabase) {
				alert('Local Databases are not supported by your browser. Please use a Webkit browser for this demo');
			}else{
				var	shortname="BDMovilSou",
					version="1.0",
					displayname="BDMovilSou Test",
					maxsize=100000;

				BDMovilSou=openDatabase(shortname,version,displayname,maxsize);
				this.createtables();
			}
		}catch(e){
			if (e==2) {
 				console.log("Invalid database version.");
			}else{
				console.log("Unknowm error"+e);
			}
			return;
		}
	},

	createtables:function(){
		var	that=this;
		BDMovilSou.transaction(
			function (transaction){
				transaction.executeSql('CREATE TABLE IF NOT EXISTS PageDataSource(id INTEGER NOT NULL PRIMARY KEY, pagesource TEXT NOT NULL);', [], that.nullDataHandler, that.errorHandler);
			}
		);
		this.prePopulate();	
	},

	prePopulate: function() {
		BDMovilSou.transaction(
		    function (transaction) {
				//Starter data when page is initialized
			var data = ['1','none'];  
		
			transaction.executeSql("INSERT INTO PageDataSource(id, pagesource) VALUES (?, ?)", [data[0], data[1]]);
			}
		);				
	},

	chargePage:function(){
		BDMovilSou.transaction(
			function (transaction){
				var txthml = $('#txtnew').val();
				console.log(txthml);
				transaction.executeSql("UPDATE PageDataSource SET pagesource=? WHERE id = 1", [txthml]);
			}
		);
	},

	loadPage:function(){
		var that =this;
		BDMovilSou.transaction(
			function (transaction){
				transaction.executeSql("SELECT * FROM PageDataSource;", [], that.dataSelectHandler, that.errorHandler);
			}
		);
	},

	dataSelectHandler:function(transaction, results){
		var i=0,
			row;
			for (i ; i<results.rows.length; i++) {
				row=results.rows.item(i);
				document.write(row['pagesource']);
        		document.close();
			}
	},

	errorHandler: function( transaction, error ) {
	    
		 	if (error.code===1){
		 		// DB Table already exists
		 	} else {
		    	// Error is a human-readable string.
			    console.log('Oops.  Error was '+error.message+' (Code '+ error.code +')');
		 	}
		    return false;		    
	    },
	
	nullDataHandler: function() {
		    console.log("SQL Query Succeeded");
	}
};

localDB.init();
});
