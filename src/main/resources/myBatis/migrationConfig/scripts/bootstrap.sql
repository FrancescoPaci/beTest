--
--    Copyright 2010-2016 the original author or authors.
--
--    Licensed under the Apache License, Version 2.0 (the "License");
--    you may not use this file except in compliance with the License.
--    You may obtain a copy of the License at
--
--       http://www.apache.org/licenses/LICENSE-2.0
--
--    Unless required by applicable law or agreed to in writing, software
--    distributed under the License is distributed on an "AS IS" BASIS,
--    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
--    See the License for the specific language governing permissions and
--    limitations under the License.
--

-- // Bootstrap.sql

-- This is the only SQL script file that is NOT
-- a valid migration and will not be run or tracked
-- in the changelog.  There is no @UNDO section.

-- // Do I need this file?

-- New projects likely won't need this file.
-- Existing projects will likely need this file.
-- It's unlikely that this bootstrap should be run
-- in the production environment.

-- // Purpose

-- The purpose of this file is to provide a facility
-- to initialize the database to a state before MyBatis
-- SQL migrations were applied.  If you already have
-- a database in production, then you probably have
-- a script that you run on your developer machine
-- to initialize the database.  That script can now
-- be put in this bootstrap file (but does not have
-- to be if you are comfortable with your current process.

-- // Running

-- The bootstrap SQL is run with the "migrate bootstrap"
-- command.  It must be run manually, it's never run as
-- part of the regular migration process and will never
-- be undone. Variables (e.g. ${variable}) are still
-- parsed in the bootstrap SQL.

-- After the boostrap SQL has been run, you can then
-- use the migrations and the changelog for all future
-- database change management.

--CREATE DATABASE frankpax_db;

CREATE TABLE Customers (
	id int AUTO_INCREMENT ,
	name varchar (30) NOT NULL ,
	Address varchar (60) NULL ,
	City varchar (15) NULL ,
	Postal_Code varchar (10) NULL ,
	Country varchar (15) NULL ,
	Phone varchar (24) NULL ,
	PRIMARY KEY (id)
);

CREATE TABLE Products (
	id int AUTO_INCREMENT ,
	name varchar (40) NOT NULL ,
	unit_price DECIMAL(13,2) NOT NULL ,
	PRIMARY KEY (id)
);

CREATE TABLE Shippers (
	id int NOT NULL,
	name varchar (40) NOT NULL,
	phone varchar (24) NULL,
	PRIMARY KEY (id)
);

CREATE TABLE Orders (
	id int AUTO_INCREMENT ,
	Customer_ID int NULL ,
	Shipper_ID int NULL ,
	Order_Date date NULL ,
	Required_Date date NULL ,
	Shipped_Date date NULL ,
	Ship_Address varchar (60) NULL ,
	Ship_City varchar (15) NULL ,
	Ship_Postal_Code varchar (10) NULL ,
	Ship_Country varchar (15) NULL ,
	PRIMARY KEY (id),
	FOREIGN KEY (Customer_ID) REFERENCES Customers(id),
	FOREIGN KEY (Shipper_ID) REFERENCES Shippers(id)
);

CREATE TABLE Orders_Details (
	Order_ID int NOT NULL,
	Product_ID int NOT NULL,
	Quantity int  NOT NULL,
	Discount DECIMAL(5,2),
	CONSTRAINT PK_Orders_Details PRIMARY KEY (Order_ID, Product_ID),
	FOREIGN KEY (Order_ID) REFERENCES Orders(id),
	FOREIGN KEY (Product_ID) REFERENCES Products(id)
);

CREATE TABLE Users (
	username varchar (20) NOT NULL,
	password varchar (20) NOT NULL,
	role varchar (10) NOT NULL,
	CONSTRAINT PK_Users PRIMARY KEY (username, Password)
);

INSERT INTO Customers (Name,Address,City,Postal_Code,Country,phone) VALUES('Maria Anders','Obere Str. 57','Berlin','12209','Germany','030-0074321');
INSERT INTO Customers (Name,Address,City,Postal_Code,Country,Phone) VALUES('Ana Trujillo','Avda. de la Constitución 2222','México D.F.','05021','Mexico','(5) 555-4729');
INSERT INTO Customers (Name,Address,City,Postal_Code,Country,Phone) VALUES('Antonio Moreno','Mataderos  2312','México D.F.','05023','Mexico','(5) 555-3932');
INSERT INTO Customers (Name,Address,City,Postal_Code,Country,Phone) VALUES('Thomas Hardy','120 Hanover Sq.','London','WA1 1DP','UK','(171) 555-7788');
INSERT INTO Customers (Name,Address,City,Postal_Code,Country,Phone) VALUES('Christina Berglund','Berguvsvägen 8','Lule','S-958 22','Sweden','0921-12 34 65');
INSERT INTO Customers (Name,Address,City,Postal_Code,Country,Phone) VALUES('Hanna Moos','Forsterstr. 57','Mannheim','68306','Germany','0621-08460');
INSERT INTO Customers (Name,Address,City,Postal_Code,Country,Phone) VALUES('Frédérique Citeaux','24, place Kléber','Strasbourg','67000','France','88.60.15.31');
INSERT INTO Customers (Name,Address,City,Postal_Code,Country,Phone) VALUES('Martín Sommer','C/ Araquil, 67','Madrid','28023','Spain','(91) 555 22 82');
INSERT INTO Customers (Name,Address,City,Postal_Code,Country,Phone) VALUES('Laurence Lebihan','12, rue des Bouchers','Marseille','13008','France','91.24.45.40');
INSERT INTO Customers (Name,Address,City,Postal_Code,Country,Phone) VALUES('Elizabeth Lincoln','23 Tsawassen Blvd.','Tsawassen','T2F 8M4','Canada','(604) 555-4729');
INSERT INTO Customers (Name,Address,City,Postal_Code,Country,Phone) VALUES('Victoria Ashworth','Fauntleroy Circus','London','EC2 5NT','UK','(171) 555-1212');
INSERT INTO Customers (Name,Address,City,Postal_Code,Country,Phone) VALUES('Patricio Simpson','Cerrito 333','Buenos Aires','1010','Argentina','(1) 135-5555');
INSERT INTO Customers (Name,Address,City,Postal_Code,Country,Phone) VALUES('Francisco Chang','Sierras de Granada 9993','México D.F.','05022','Mexico','(5) 555-3392');

INSERT INTO Products(name,unit_price) VALUES('Aniseed Syrup', 11.52);
INSERT INTO Products(name,unit_price) VALUES('Chef Anton''s Cajun Seasoning', 9.6);
INSERT INTO Products(name,unit_price) VALUES('Chef Anton''s Gumbo Mix', 7.5);
INSERT INTO Products(name,unit_price) VALUES('Grandma''s Boysenberry Spread', 3.4);
INSERT INTO Products(name,unit_price) VALUES('Uncle Bob''s Organic Dried Pears', 2.1);
INSERT INTO Products(name,unit_price) VALUES('Northwoods Cranberry Sauce', 21.54);
INSERT INTO Products(name,unit_price) VALUES('Mishi Kobe Niku', 231.6);
INSERT INTO Products(name,unit_price) VALUES('Queso Manchego La Pastora', 43.62);
INSERT INTO Products(name,unit_price) VALUES('Konbu', 33.72);
INSERT INTO Products(name,unit_price) VALUES('Tofu', 28.02);
INSERT INTO Products(name,unit_price) VALUES('Genen Shouyu', 88.44);
INSERT INTO Products(name,unit_price) VALUES('Teatime Chocolate Biscuits', 55.44);
INSERT INTO Products(name,unit_price) VALUES('Sir Rodney''s Marmalade', 78.99);

INSERT INTO Shippers(id,name,phone) VALUES(1,'Speedy Express','(503) 555-9831');
INSERT INTO Shippers(id,name,phone) VALUES(2,'United Package','(503) 555-3199');
INSERT INTO Shippers(id,name,phone) VALUES(3,'Federal Shipping','(503) 555-9931');

INSERT INTO Orders (Customer_ID,Shipper_ID,Order_Date,Required_Date,Shipped_Date,Ship_Address,Ship_City,Ship_Postal_Code,Ship_Country)
VALUES (1,2,'1996-04-07','1996-05-06','1996-06-09','59 rue de l''Abbaye','Reims','51100','France');
INSERT INTO Orders (Customer_ID,Shipper_ID,Order_Date,Required_Date,Shipped_Date,Ship_Address,Ship_City,Ship_Postal_Code,Ship_Country)
VALUES (1,2,'1996-02-01','1996-02-02','1996-02-03','53 abbay street','London','33442','GB');
INSERT INTO Orders (Customer_ID,Shipper_ID,Order_Date,Required_Date,Shipped_Date,Ship_Address,Ship_City,Ship_Postal_Code,Ship_Country)
VALUES (1,2,'1994-04-04','1994-04-05','1994-04-02','via massena 58','Turin','10126','Italy');
INSERT INTO Orders (Customer_ID,Shipper_ID,Order_Date,Required_Date,Shipped_Date,Ship_Address,Ship_City,Ship_Postal_Code,Ship_Country)
VALUES (1,2,'1996-04-07','1996-05-06','1996-06-09','59 rue de l''Abbaye','Reims','51100','France');
INSERT INTO Orders (Customer_ID,Shipper_ID,Order_Date,Required_Date,Shipped_Date,Ship_Address,Ship_City,Ship_Postal_Code,Ship_Country)
VALUES (1,2,'1996-04-07','1996-05-06','1996-06-09','59 rue de l''Abbaye','Reims','51100','France');
INSERT INTO Orders (Customer_ID,Shipper_ID,Order_Date,Required_Date,Shipped_Date,Ship_Address,Ship_City,Ship_Postal_Code,Ship_Country)
VALUES (1,2,'1996-04-07','1996-05-06','1996-06-09','59 rue de l''Abbaye','Reims','51100','France');
INSERT INTO Orders (Customer_ID,Shipper_ID,Order_Date,Required_Date,Shipped_Date,Ship_Address,Ship_City,Ship_Postal_Code,Ship_Country)
VALUES (1,2,'1996-04-07','1996-05-06','1996-06-09','59 rue de l''Abbaye','Reims','51100','France');
INSERT INTO Orders (Customer_ID,Shipper_ID,Order_Date,Required_Date,Shipped_Date,Ship_Address,Ship_City,Ship_Postal_Code,Ship_Country)
VALUES (1,2,'1996-04-07','1996-05-06','1996-06-09','59 rue de l''Abbaye','Reims','51100','France');
INSERT INTO Orders (Customer_ID,Shipper_ID,Order_Date,Required_Date,Shipped_Date,Ship_Address,Ship_City,Ship_Postal_Code,Ship_Country)
VALUES (1,2,'1996-04-07','1996-05-06','1996-06-09','59 rue de l''Abbaye','Reims','51100','France');
INSERT INTO Orders (Customer_ID,Shipper_ID,Order_Date,Required_Date,Shipped_Date,Ship_Address,Ship_City,Ship_Postal_Code,Ship_Country)
VALUES (1,2,'1996-04-07','1996-05-06','1996-06-09','59 rue de l''Abbaye','Reims','51100','France');
INSERT INTO Orders (Customer_ID,Shipper_ID,Order_Date,Required_Date,Shipped_Date,Ship_Address,Ship_City,Ship_Postal_Code,Ship_Country)
VALUES (1,2,'1996-04-07','1996-05-06','1996-06-09','59 rue de l''Abbaye','Reims','51100','France');
INSERT INTO Orders (Customer_ID,Shipper_ID,Order_Date,Required_Date,Shipped_Date,Ship_Address,Ship_City,Ship_Postal_Code,Ship_Country)
VALUES (1,2,'1996-04-07','1996-05-06','1996-06-09','59 rue de l''Abbaye','Reims','51100','France');
INSERT INTO Orders (Customer_ID,Shipper_ID,Order_Date,Required_Date,Shipped_Date,Ship_Address,Ship_City,Ship_Postal_Code,Ship_Country)
VALUES (1,2,'1996-04-07','1996-05-06','1996-06-09','59 rue de l''Abbaye','Reims','51100','France');
INSERT INTO Orders (Customer_ID,Shipper_ID,Order_Date,Required_Date,Shipped_Date,Ship_Address,Ship_City,Ship_Postal_Code,Ship_Country)
VALUES (1,2,'1996-04-07','1996-05-06','1996-06-09','59 rue de l''Abbaye','Reims','51100','France');
INSERT INTO Orders (Customer_ID,Shipper_ID,Order_Date,Required_Date,Shipped_Date,Ship_Address,Ship_City,Ship_Postal_Code,Ship_Country)
VALUES (1,2,'1996-04-07','1996-05-06','1996-06-09','59 rue de l''Abbaye','Reims','51100','France');
INSERT INTO Orders (Customer_ID,Shipper_ID,Order_Date,Required_Date,Shipped_Date,Ship_Address,Ship_City,Ship_Postal_Code,Ship_Country)
VALUES (1,2,'1996-04-07','1996-05-06','1996-06-09','59 rue de l''Abbaye','Reims','51100','France');
INSERT INTO Orders (Customer_ID,Shipper_ID,Order_Date,Required_Date,Shipped_Date,Ship_Address,Ship_City,Ship_Postal_Code,Ship_Country)
VALUES (1,2,'1996-04-07','1996-05-06','1996-06-09','59 rue de l''Abbaye','Reims','51100','France');

INSERT INTO Orders_Details (Order_ID, Product_ID, Quantity, Discount) VALUES (1,1, 5, 11.50);
INSERT INTO Orders_Details (Order_ID, Product_ID, Quantity, Discount) VALUES (1,2, 11, 1.20);
INSERT INTO Orders_Details (Order_ID, Product_ID, Quantity, Discount) VALUES (2,1, 5, 31.70);
INSERT INTO Orders_Details (Order_ID, Product_ID, Quantity, Discount) VALUES (2,2, 3, 25.70);
INSERT INTO Orders_Details (Order_ID, Product_ID, Quantity, Discount) VALUES (2,3, 9, 23.10);
INSERT INTO Orders_Details (Order_ID, Product_ID, Quantity, Discount) VALUES (3,5, 21, 34.80);
INSERT INTO Orders_Details (Order_ID, Product_ID, Quantity, Discount) VALUES (3,6, 12, 95.10);
INSERT INTO Orders_Details (Order_ID, Product_ID, Quantity, Discount) VALUES (3,7, 1, 65.20);

INSERT INTO Users (username, password, role) VALUES ('admin','admin1','ADMIN');

