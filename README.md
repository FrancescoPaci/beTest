# beTest

Test application for a company in Java 8, Spring boot and Angular 9

The application to work need an SQL SERVER DB (the sql file is under src/main/resource)

for download application: git clone https://github.com/FrancescoPaci/beTest.git

client root: src\main\client\be-digitech-test

Instruction to run application:
  
  1) install node.js e npm
  2) launch from cmd: npm install copyfiles -g (questo serve solo per il punto 4b)
  3) from CMD go in client root and launch: npm install
  
  4a) for 2 server (BE e FE) (developer mode) from client root launch: npm start 
      then launch the MAIN that is in java class TestApplication.
      Application respond on url: http://localhost:4200/
      
  4b) for 1 server (BE) (production mode) from client root launch: npm run build 
      then launch the MAIN that is in java class TestApplication.
      Application respond on url: http://localhost:8080/
  
  N.B.) for send mail with gmail need to abilitate 2 step password in gmail and create the app code for mail service
      and set it like spring.mail.password in file application.properties
