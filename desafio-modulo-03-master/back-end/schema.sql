create table if not exists usuarios (
    id serial primary key,
    nome text not null,
    email text not null,
    senha text not null,
    nome_loja text not null
);

create table if not exists produtos (
    id serial primary key,
    usuarios_id integer not null,
    nome text not null,
    estoque smallint not null,
    preco smallint not null,
    categoria text,
    descricao text,
    imagen text,
    foreign key (usuarios_id) references usuarios (id)
);