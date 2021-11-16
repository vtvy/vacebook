drop database vnforum;

select * from users;
select * FROM posts;


-- call sign_up('hxpdong1','hxpdong');
-- call sign_up('hxpdong2','hxpdong');
-- call sign_up('hxpdong3','hxpdong');

call add_post("Title", "I am a hacker, give me 5$ or you will lost your data!", 1);
call add_post("Title", "I am a hacker, give me 10$ and I will hack the computer of the hacker who hack in your computer (Not including me)!", 2);
call list_cmt_of(2);

call getPostByPID(1);



call add_cmt('Đây là cmt', 2, 1);
call add_cmt('Đây là cmt test 2', 1, 2);
call add_cmt('Đây là cmt test 3', 1, 3);
call add_cmt('Đây là cmt test 4', 1, 4);

call findUser("hxpdong1");

select act_like(3,1);

call listPost(3);

call delete_post(2);