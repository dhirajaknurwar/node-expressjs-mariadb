# node-expressjs-mariadb
Nodejs with Express Js framework and Maridb as Database Sample App

Node with Express Js Framework with MariaDb


Install nodejs from https://nodejs.org/en/download/

Node version 10.16.0
Npm version 6.9.0 

To check node version on window > node  -v
To check npm version on window > npm  -v


MariaDb installation: 
https://mariadb.com/kb/en/library/installing-mariadb-msi-packages-on-windows/

Mariadb Commands:
https://mariadb.com/resources/blog/introduction-to-four-key-mariadb-client-commands/


Install UI for DB
https://www.heidisql.com/
HeidiSQL is free software, and has the aim to be easy to learn. "Heidi" lets you see and edit data and structures from computers running one of the database systems MariaDB, MySQL, Microsoft SQL or PostgreSQL.

Express project creation Steps:
mkdir projectname
cd projectname
npm init -y 
npm install express --save (installing express framework here)
mkdir controllers (creating controllers directory)
mkdir models (creating models directory)

for mariadb Access (--save will save package in package.json)
npm install mariadb --save

npm install lodash --save
npm install  --save multer
npm install body-parser --save



Npm install cors --save
CORS is a node.js package for providing a Connect/Express middleware that can be used to enable CORS with various options.

Creating Tables in MariaDb using HeidiSQL like below sample table

CREATE TABLE `customer` (
	`customer_id` INT(11) NOT NULL AUTO_INCREMENT,
	`name` VARCHAR(100) NOT NULL,
	`sex` VARCHAR(5) NOT NULL,
	`mobile` VARCHAR(15) NOT NULL,
	`idproofurl` VARCHAR(200) NOT NULL,
	`addressproofurl` VARCHAR(200) NOT NULL,
	`email` VARCHAR(100) NOT NULL,
	PRIMARY KEY (`id`)
)
COLLATE='latin1_swedish_ci'
ENGINE=InnoDB
AUTO_INCREMENT=1000;

