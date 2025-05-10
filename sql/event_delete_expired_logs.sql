# 스케쥴러 on/off 확인
show variables like 'event%';

# event_scheduler가 off이면, on으로 변경
set global event_scheduler = on;

# db 변경
use decibel;

# 측정일로부터 30일이 지난 noise log 자동 삭제 이벤트 생성
create event event_delete_expired_logs 
	on schedule every 1 day STARTS '2025-04-13 00:00:00'
	do DELETE FROM noise_log WHERE start_time < DATE_ADD(NOW(), INTERVAL -30 DAY);


# db에 있는 이벤트 확인
# select * from information_schema.EVENTS;
# 이벤트 삭제
# drop event delete_expired_noise_log;
# 이벤트 수정
# ALTER EVENT delete_expired_noise_log ON SCHEDULE EVERY 1 DAY STARTS '2025-04-13 00:00:00';