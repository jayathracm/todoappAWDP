drop table if exists task;

drop table if exists account;

create table account (
    id serial primary key,
    email varchar(255) not null,
    password varchar(255) not null,
);

create table task (
    id serial primary key,
    description varchar(255) not null,
);

insert into task (description) values ('Task 1');

insert into task (description) values ('Task 2');