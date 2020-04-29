source config.py
sqlite3 $DB_FILE "create table if not exists triggers(
id INTEGER PRIMARY KEY AUTOINCREMENT,
cookies varchar,
url varchar,
localStorage varchar,
sessionStorage varchar,
html varchar,
canvas varchar,
useragent varchar,
ip varchar,
time timestamp,
extra varchar
);"
gunicorn -D --certfile cert.pem --keyfile key.pem -b 0.0.0.0:443 app:app
gunicorn -D -b 0.0.0.0:80 app:app