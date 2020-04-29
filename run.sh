source config.py
sqlite3 $DB_FILE "create table if not exists triggers(
			id SERIAL PRIMARY KEY,
			cookies varchar,
			url varchar,
			localStorage varchar,
			sessionStorage varchar,
			html varchar,
			canvas varchar,
			useragent varchar,
			IP varchar,
			time timestamp,
			extra varchar
			);"
gunicorn --certfile cert.pem --keyfile key.pem -b 0.0.0.0:443 app:app
