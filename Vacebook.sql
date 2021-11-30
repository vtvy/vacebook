drop database VNforum;
create database VNforum;
use VNforum;
SET GLOBAL log_bin_trust_function_creators = 1;

-- create users table
create table users (
	UID int AUTO_INCREMENT,
    userName varchar(30) not null unique,
    passwd varchar(500) not null,
    createdAt datetime default CURRENT_TIMESTAMP,
    updatedAt datetime default CURRENT_TIMESTAMP,
    primary key(UID)
);

-- create posts table
create table posts(
	PID int auto_increment,
    title varchar(50) not null,
    postText varchar(500) not null,
    UID int, 
    createdAt datetime default CURRENT_TIMESTAMP,
    updatedAt datetime default CURRENT_TIMESTAMP,
    primary key(PID),
    foreign key(UID) references users(UID)
);

-- create comments table
create table comments(
	CID int auto_increment,
    cmtText varchar(500) not null,
    PID int,
    UID int,
    createdAt datetime default current_timestamp,
    updatedAt datetime default current_timestamp,
    primary key (CID),
	foreign key(PID) references posts(PID),
    foreign key(UID) references users(UID)
);

-- create likes table
create table likes(
    PID int,
    UID int,
    createdAt datetime default current_timestamp,
    foreign key(PID) references posts(PID),
    foreign key(UID) references users(UID),
	primary key (PID, UID)
);

-- create table to store posts were deleted
create table posts_deleted(
	PID int references posts(PID),
    title varchar(50),
    postText varchar(500),
    UID int references users(UID), 
    date_del datetime
);

-- trigger to store posts were deleted (1) (Dong)
delimiter $$
create trigger trigg_post_del
after delete on posts for each row
begin
	insert into posts_deleted values(old.PID, old.title, old.postText, old.UID, now());
end; $$
delimiter ;

-- procedure to sign up a account	(2) (Dong)
delimiter $$
create procedure sign_up(in userName varchar(30), in passwd varchar(500))
begin
	if not exists (select userName from users where users.userName = userName)
		then
			insert into users(userName, passwd) values (userName, passwd);
			select UID as id from users where users.userName = userName;
		else	
			select 0 as id;
	end if;
end; $$
delimiter ;

-- procedure to validate a account
delimiter $$
create function validate_user(UID int, Username varchar(30))
	returns int
begin
	declare val int default 0;
    if exists (select u.UID from users u where u.UID=UID and u.userName = Username)
		then
			set val = 1;
	end if;
    return val;
end; $$
delimiter ;

-- procedure to sign in a account
delimiter $$
create procedure sign_in(in userName varchar(30))
begin
	if exists (select userName from users where users.userName = userName)
		then
			select passwd as pass, UID as id from users where users.userName = userName;
		else	
			select 0 as id;
	end if;
end; $$
delimiter ;

-- procedure to create a post
delimiter $$
create procedure add_post (in title varchar(50), in postText varchar(500),  in v_UID int)
begin
	if exists (select UID from users where users.UID = v_UID)
		then
			insert into posts(title, postText, UID) values (title, postText, v_UID);
            select PID as id from posts p where p.title = title and p.postText = postText and p.UID = v_UID;
		else	
			select 0 as id;
	end if;
end; $$
delimiter ;

-- count number like of a post
delimiter $$
create function get_like_of(PID int)
	returns int
begin
	declare cnt int default -1;
    if exists (select ps.PID from posts ps where ps.PID=PID)
		then
			select count(PID) into cnt from likes where likes.PID=PID;
	end if;
    return cnt;
end; $$
delimiter ;

-- get username of UID
delimiter $$
create function get_username_of(UID int)
	returns varchar(30)
begin
	declare uname varchar(30) default "";
    if exists (select u.UID from users u where u.UID=UID)
		then
			select userName into uname from users u where u.UID=UID;
	end if;
    return uname;
end; $$
delimiter ;

-- count number cmt of a post
delimiter $$
create function get_cmt_of(PID int)
	returns int
begin
	declare cnt int default -1;
    if exists (select ps.PID from posts ps where ps.PID=PID)
		then
			select count(PID) into cnt from comments c where c.PID=PID;
	end if;
    return cnt;
end; $$
delimiter ;

-- procedure to show all posts
delimiter $$
create procedure listPost(in UserId int)
begin
	select p.PID, p.title, p.postText as pText, p.UID as id, get_infor(p.UID) as pusername,
    get_like_of(p.PID) as numLike, get_cmt_of(p.PID) as numCmt,
    case 
		when exists (select UID from likes where UID = UserId and PID = p.PID)
			then 1
        else 0
	end	as isLike
    from posts p
    order by p.updatedAt desc;
end; $$
delimiter ;

-- procedure to show a post by PID
delimiter $$
create procedure getPostByID(in UserId int, in PID int)
begin
    select p.PID, p.title, p.postText as pText, p.UID as id, get_infor(p.UID) as pusername,
    get_like_of(p.PID) as numLike, get_cmt_of(p.PID) as numCmt,
    case 
		when exists (select UID from likes where UID = UserId and PID = p.PID)
			then 1
        else 0
	end	as isLike
    from posts p
    where p.PID = PID;
end; $$
delimiter ;

-- procedure to delete a post
delimiter $$
create procedure delete_post(in PID int, in UID int)
begin
	DECLARE EXIT HANDLER FOR SQLEXCEPTION ROLLBACK;
	if exists (select u.UID from users u where u.UID=UID)
		then
			set autocommit = 0;
			start transaction;
			delete from comments where comments.PID = PID;
			delete from likes where likes.PID = PID;
			delete from posts where posts.PID = PID and posts.UID = UID;
			commit;
            set autocommit = 1;
            select 1 as id;
		else
			select 0 as id;
	end if;
end; $$
delimiter ;

-- procedure to add a comment
delimiter $$
create procedure add_cmt (in cText varchar(500), in PID int, in v_UID int)
begin
		insert into comments(cmtText, PID, UID) values (cText, PID, v_UID);
        select CID as cmtId from comments c where c.cmtText = cText and c.PID = PID and c.UID = v_UID;
end; $$
delimiter ;

-- procedure to show all comments of a post
delimiter $$
create procedure list_cmt_of(in PID int)
begin
	select CID as cmtId, cmtText as cText, c.UID as id, get_infor(c.UID) as Username
    from comments c
    where c.PID=PID
    order by c.updatedAt;
end; $$
delimiter ;

-- procedure delete a comment
delimiter $$
create procedure delete_cmt(in CID int)
begin
	delete from comments where comments.CID=CID;
end; $$
delimiter ;

-- function to react a post
delimiter $$
create function act_like(PID int, UID int)
	returns int
begin
    if not exists (select l.PID from likes l where l.PID = PID and l.UID=UID)
		then
			insert into likes(PID, UID) values (PID, UID);
            return 1;
		else																		
			delete from likes where likes.PID=PID and likes.UID=UID;
			return -1;
	end if;
end; $$
delimiter ;

-- procedure to show all post by UID
delimiter $$
create procedure getPostByUserID(in UserId int, in v_UID int)
begin
    select p.PID, p.title, p.postText as pText, p.UID as id, get_username_of(p.UID) as pusername,
    get_like_of(p.PID) as numLike, get_cmt_of(p.PID) as numCmt,
    case 
		when exists (select UID from likes where UID = UserId and PID = p.PID)
			then 1
        else 0
	end	as isLike
    from posts p
    where p.UID = v_UID;
end; $$
delimiter ;

-- procedure to change password
delimiter $$
create procedure update_password(in UID int, in newpasswd varchar(500))
begin
    if exists (select UID from users u where u.UID=UID)
		then
			update users u set u.passwd=newpasswd, u.updatedAt=now() where u.UID=UID;
	end if; 
end; $$
delimiter ;

-- procedure to show all deleted posts of a user
delimiter $$
create procedure get_deleted_posts(in UserId int)
begin
    select d.PID, d.title, d.postText as dText
    from posts_deleted d
    where d.UID = UserId;
end; $$
delimiter ;

-- procedure to delete permanently a post from delete_log
delimiter $$
create procedure delete_post_permant(in PID int, in UID int)
begin
    delete from posts_deleted d
    where d.UID = UID and d.PID = PID;
end; $$
delimiter ;

-- procedure to edit a post
delimiter $$
create procedure update_post(in PID int, in title varchar(50), in postText varchar(500))
begin
	update posts set posts.title=title, posts.postText=postText, posts.updatedAt=now()
    where posts.PID=PID;
end; $$
delimiter ;

call sign_up('hxpdong1','hxpdong');
call add_post("Title", "I am a hacker, give me 5$ or you will lost your data!", 1);
call add_post("Title", "I am a hacker, give me 10$ and I will hack the computer of the hacker who hack in your computer (Not including me)!", 1);

call add_cmt('Đây là cmt', 2, 1);
call add_cmt('Đây là cmt test 2', 1, 2);
call add_cmt('Đây là cmt test 3', 1, 3);
call add_cmt('Đây là cmt test 4', 1, 4);