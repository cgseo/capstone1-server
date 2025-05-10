use decibel;
select * from noise_log;

# noise_log 테이블에 user_id(+외래키지정), start_time, end_time 추가 및 avg_db 삭제
alter table noise_log add column user_id int;
alter table noise_log add foreign key(user_id) references users(id) on delete cascade;
alter table noise_log add column start_time timestamp after log_time;
alter table noise_log add column end_time timestamp after start_time;
alter table noise_log drop column avg_db;

# log_time은 측정한 시간이므로 밀리초 저장 > BIGINT로 타입 변경
alter table noise_log modify column log_time bigint;