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


-- procedure to sign up a account
delimiter $$
create procedure sign_up(in userName varchar(30), in passwd varchar(500))
begin
	insert into users(userName, passwd) values (userName, passwd);
    select UID as id from users where users.userName = userName;
end; $$
delimiter ;

-- procedure to add a post
delimiter $$
create procedure add_post (in title varchar(50), in postText varchar(500),  in v_UID int)
begin
	insert into posts(title, postText, UID) values (title, postText, v_UID);
end; $$
delimiter ;

-- procedure to delete a post
delimiter $$
create procedure delete_post(in PID int)
begin
	delete from comments where comments.PID = PID;
    delete from likes where likes.PID = PID;
	delete from posts where posts.PID = PID;
end; $$
delimiter ;

-- procedure to show all PID, title, postText, userName, likes of post
delimiter $$
create procedure listPost(in UserId int)
begin
	select p.PID, p.title, p.postText, u.userName, count(l.PID) as numLike , 
    case 
    when p.PID = i.PID and i.UID = UserId 
		then 1
        else 0
        end	as isLike
    from posts p join users u on p.UID = u.UID left join likes l on l.PID = p.PID
    left join likes i on i.PID = p.PID 
    group by p.PID
    order by p.updatedAt desc;
end; $$
delimiter ;



-- procedure to show title, postText, userName of a PID
delimiter $$
create procedure getPostByPID(in PID int)
begin
    select title, postText, userName from posts join users where posts.PID = PID and posts.UID = users.UID;
end; $$
delimiter ;

-- procedure to show all CID, cmtText, userName of a post
delimiter $$
create procedure list_cmt_of(in PID int)
begin
	select CID, cmtText, userName from comments c join users u where c.PID=PID and c.UID = u.UID;
end; $$
delimiter ;




-- procedure to add a comment
delimiter $$
create procedure add_cmt (in cmtText varchar(500), in PID int, in v_UID int)
begin
		insert into comments(cmtText, PID, UID) values (cmtText, PID, v_UID);
end; $$
delimiter ;

-- procedure get exist username
delimiter $$
create procedure findUser(in username varchar(30))
begin
	select UID, userName, passwd FROM users u where u.userName = username;
end; $$
delimiter ;

-- procedure delete a comment
delimiter $$
create procedure delete_cmt(in CID int)
begin
	delete from comments where comments.CID=CID;
end; $$
delimiter ;

-- function to like a post
delimiter $$
create function act_like(PID int, UID int)
		returns int
begin
    -- /*not like the like*/
    if (not exists (select * from likes ls where ls.PID=PID and ls.UID=UID))
		then
			insert into likes(PID, UID) values (PID, UID);
            return 1;
	-- /*like then dislike*/
	else																		
		delete from likes where likes.PID=PID and likes.UID=UID;
         return -1;
	end if;
end; $$
delimiter ;

