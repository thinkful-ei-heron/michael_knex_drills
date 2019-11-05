drop table if exists shopping_list;

drop type grocery;
create type grocery as enum ('Main', 'Snack', 'Lunch', 'Breakfast');

create table shopping_list (
  id integer primary key generated always as identity,
  name text,
  price numeric not null, --maybe numeric(something, 2)?
  date_added date default CURRENT_TIMESTAMP not null,
  checked boolean default false not null,
  category grocery not null
);