# webInit
website Project initial item

# Environment
1. NodeJS v4.2.0
2. NPM 2.14.7
3. express 4.13.4

### Proecss 
  >>express --ejs webinit
  
  >>cd webinit && npm install --save
  
  >>npm install https --save
  
  >>vim bin/www
  
  		#####  SSL Certification
  		
  		>>openssl genrsa -out webkey.pem 1024
  		
  		>>openssl req -new -key webkey.pem -out webinit.csr
  		
  		>>openssl x509 -req -in webinit.csr -signkey webkey.pem -out webcert.pem
  		
  		>>vim sslLicense.js
  		
  		"
  		var fs = require('fs');
  		var keyPath = 'webkey.pem';
  		var cerPath = 'webcert.pem';
  		var hskey = fs.readFileSync(keyPath);
  		var hscer = fs.readFileSync(certPath);
  		var options = {
  			key : hskey,
  			cert : hscer
  		};
  		var ssl = {};
  		ssl.options=options;
  		module.exports = ssl;
  		"
  		
  		>>vim bin/www
  		"
  		var ssl = require('../ssl/sslLicense.js');
		var httpsport = normalizePort(process.env.PORT || 8080);
		app.set('httpsport',8080);
		var httpsServer = https.createServer(ssl.options,app).listen(app.get('httpsport'));
		httpsServer.listen(httpsport);
		httpsServer.on('error', onError);
		httpsServer.on('listening', onListening);
  		"
  	
  	>>node bin/www
  	
  		
   
  

  