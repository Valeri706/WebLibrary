## Create db
    CREATE USER weblib WITH PASSWORD 'weblib';
    GRANT ALL PRIVILEGES ON SCHEMA public TO weblib;
    CREATE DATABASE weblib;
    ALTER DATABASE weblib OWNER TO weblib;
    GRANT ALL PRIVILEGES ON DATABASE weblib to weblib;

## Tables
 ### User
    create table "user"
    (
        id            serial
        constraint user_pk
        primary key,
        email         varchar(128)            not null,
        password      varchar(128)            not null,
        name          varchar(128)            not null,
        registered_at timestamp default now() not null,
        date_of_birth timestamp,
        role          integer  default 0      not null
    );

 ### Session
    create table session
    (
        id          serial,
        created_at  timestamp default now() not null,
        user_id     integer                 not null
            constraint user_fk references "user"
                on delete cascade,
        device_name text,
        ip_address  inet
    );
    
    
    