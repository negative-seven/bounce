-- schema

CREATE SCHEMA "simulation";
SET search_path TO "simulation";



-- users

CREATE TABLE users (
    "id" SERIAL NOT NULL,
    "username" VARCHAR(64) NOT NULL,
    "password" VARCHAR(64) NOT NULL,
    CONSTRAINT "primary_key_id" PRIMARY KEY ("id")
);



-- configurations

CREATE TABLE configurations (
    "user_id" INTEGER NOT NULL,
    "name" VARCHAR(64) NOT NULL,
    "mass_ratio" BIGINT NOT NULL,
    "left_ball_color" VARCHAR(6) NOT NULL,
    "right_ball_color" VARCHAR(6) NOT NULL
);
