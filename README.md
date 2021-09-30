# beTest

Test application in Java 8, Spring boot and Angular 9

-for download application: git clone https://github.com/FrancescoPaci/beTest.git

-client root: src\main\client\pax-app

-environment variable:
      datasource.username=frankpax;
      datasource.password=FrankoPax$db12;
      datasource.url=jdbc:mysql://db4free.net:3306/frankpax_db;
      datasource.driver=com.mysql.cj.jdbc.Driver;

Instruction to run application:
  
  1) install node.js and npm
  2) launch from cmd: npm install copyfiles -g (needed only for point 5B)
  3) from CMD go in client root and launch: npm install
  4) make maven "clean install" of project
  5) choose A or B:
  
    A) for 2 server (BE e FE) (developer mode) from client root launch: "npm start"
       then launch the MAIN that is in java class TestApplication and set Enviroment variables.
       Application respond on url: http://localhost:4200/

    B) for 1 server (BE) (production mode) from client root launch: "npm run build"
       then launch the MAIN that is in java class TestApplication and set Enviroment variables.
       Application respond on url: http://localhost:8080/
  
  N.B. for send mail with gmail need to abilitate 2 step password in gmail and create the app code for mail service
      and set it like spring.mail.password in file application.properties
