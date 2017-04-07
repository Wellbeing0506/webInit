# Passport Setup
Create SQLite3 db and table

### Proecss 
1. Create table 
>$sqlite3 db/mysqlite.db
"
create table t1( 
	id integer primary key autoincrement, 
	uid wibblewibble default (
		lower(hex(randomblob(4))) || '-' || 
		lower(hex(randomblob(2))) || '-4' || 
		substr(lower(hex(randomblob(2))),2) || '-' || 
		substr('89ab',abs(random()) % 4 + 1, 1) || 
		substr(lower(hex(randomblob(2))),2) || '-' || 
		lower(hex(randomblob(6)))
	),
	ename text,
	name text, 
	createdTime datetime default current_timestamp,
	modifiedtime datetime default current_timestamp
);
"

2. drop table 
>$drop table t1;

3. select table 
>select * from t1;


