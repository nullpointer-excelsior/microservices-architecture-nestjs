
delete from public.song_radios_radio;
delete from public.song;
delete from public.album;
delete from public.artist;
delete from public.radio;
delete from public.genre;

 INSERT INTO public.genre
(id, "name")
values
(uuid_generate_v4(), 'Rock'),
(uuid_generate_v4(), 'Metal');

 
 INSERT INTO public.artist (id, name, photo, biography) 
 values
 ('90657e67-76ec-4457-bd3a-3a0dbf13dc43','Bon Jovi', 'https://example.com/Bonjovi.jpg', 'Bon Jovi is an American rock band formed in Sayreville, New Jersey, in 1983. The band has sold over 130 million records worldwide and is one of the best-selling bands of all time.'),
 ('e8f9eac0-2c00-4d23-ab61-8e56b86507f8','Journey', 'https://example.com/Journey.jpg','Journey is an American rock band formed in San Francisco in 1973. The band has sold over 90 million records worldwide and is one of the best-selling bands of all time.'),
 ('6df575c5-f3d5-4f9b-8714-948b036245d5', 'Slayer', 'https://example.com/Slayer.jpg', 'Slayer is an American thrash metal band formed in Huntington Park, California in 1981. The band is considered to be one of the Big Four of thrash metal, along with Metallica, Anthrax, and Megadeth. Slayer is known for their aggressive, controversial lyrics and imagery.');


 INSERT INTO public.album
(id, title, photo, "year", "artistId")
VALUES (uuid_generate_v4(), 'Frontiers', '', 1983, (SELECT id FROM public.artist WHERE name = 'Journey'));

INSERT INTO public.album
(id, title, photo, "year", "artistId")
VALUES (uuid_generate_v4(), 'Runaway', '', 1984, (SELECT id FROM public.artist WHERE name = 'Bon Jovi'));


INSERT INTO public.song
(id, title, video, plays, "albumId", "artistId", "genreId", duration)
VALUES (uuid_generate_v4(), 'Separate Ways (Worlds Apart)', '', 0, (SELECT id FROM public.album WHERE title = 'Frontiers'), (SELECT id FROM public.artist WHERE name = 'Journey'), (SELECT id FROM public.genre WHERE name = 'Rock'), 247);
INSERT INTO public.song
(id, title, video, plays, "albumId", "artistId", "genreId", duration)
VALUES (uuid_generate_v4(), 'Send Her My Love', '', 0, (SELECT id FROM public.album WHERE title = 'Frontiers'), (SELECT id FROM public.artist WHERE name = 'Journey'), (SELECT id FROM public.genre WHERE name = 'Rock'), 242);
INSERT INTO public.song
(id, title, video, plays, "albumId", "artistId", "genreId", duration)
VALUES (uuid_generate_v4(), 'Chain Reaction', '', 0, (SELECT id FROM public.album WHERE title = 'Frontiers'), (SELECT id FROM public.artist WHERE name = 'Journey'), (SELECT id FROM public.genre WHERE name = 'Rock'), 231);
INSERT INTO public.song
(id, title, video, plays, "albumId", "artistId", "genreId", duration)
VALUES (uuid_generate_v4(), 'After the Fall', '', 0, (SELECT id FROM public.album WHERE title = 'Frontiers'), (SELECT id FROM public.artist WHERE name = 'Journey'), (SELECT id FROM public.genre WHERE name = 'Rock'), 253);
INSERT INTO public.song
(id, title, video, plays, "albumId", "artistId", "genreId", duration)
VALUES (uuid_generate_v4(), 'Faithfully', '', 0, (SELECT id FROM public.album WHERE title = 'Frontiers'), (SELECT id FROM public.artist WHERE name = 'Journey'), (SELECT id FROM public.genre WHERE name = 'Rock'), 228);
INSERT INTO public.song
(id, title, video, plays, "albumId", "artistId", "genreId", duration)
VALUES (uuid_generate_v4(), 'Edge of the Blade', '', 0, (SELECT id FROM public.album WHERE title = 'Frontiers'), (SELECT id FROM public.artist WHERE name = 'Journey'), (SELECT id FROM public.genre WHERE name = 'Rock'), 265);
INSERT INTO public.song
(id, title, video, plays, "albumId", "artistId", "genreId", duration)
VALUES (uuid_generate_v4(), 'Troubled Child', '', 0, (SELECT id FROM public.album WHERE title = 'Frontiers'), (SELECT id FROM public.artist WHERE name = 'Journey'), (SELECT id FROM public.genre WHERE name = 'Rock'), 257);
INSERT INTO public.song
(id, title, video, plays, "albumId", "artistId", "genreId", duration)
VALUES (uuid_generate_v4(), 'Back Talk', '', 0, (SELECT id FROM public.album WHERE title = 'Frontiers'), (SELECT id FROM public.artist WHERE name = 'Journey'), (SELECT id FROM public.genre WHERE name = 'Rock'), 240);


INSERT INTO public.song
(id, title, video, plays, "albumId", "artistId", "genreId", duration)
VALUES (uuid_generate_v4(), 'Runaway', '', 0, (SELECT id FROM public.album WHERE title = 'Runaway'), (SELECT id FROM public.artist WHERE name = 'Bon Jovi'), (SELECT id FROM public.genre WHERE name = 'Rock'), 234);
INSERT INTO public.song
(id, title, video, plays, "albumId", "artistId", "genreId", duration)
VALUES (uuid_generate_v4(),  'She Don''t Know Me', '', 0, (SELECT id FROM public.album WHERE title = 'Runaway'), (SELECT id FROM public.artist WHERE name = 'Bon Jovi'), (SELECT id FROM public.genre WHERE name = 'Rock'), 225);
INSERT INTO public.song
(id, title, video, plays, "albumId", "artistId", "genreId", duration)
VALUES (uuid_generate_v4(), 'Roulette', '', 0, (SELECT id FROM public.album WHERE title = 'Runaway'), (SELECT id FROM public.artist WHERE name = 'Bon Jovi'), (SELECT id FROM public.genre WHERE name = 'Rock'), 232);
INSERT INTO public.song
(id, title, video, plays, "albumId", "artistId", "genreId", duration)
VALUES (uuid_generate_v4(), 'Shot Through the Heart', '', 0, (SELECT id FROM public.album WHERE title = 'Runaway'), (SELECT id FROM public.artist WHERE name = 'Bon Jovi'), (SELECT id FROM public.genre WHERE name = 'Rock'), 214);
INSERT INTO public.song
(id, title, video, plays, "albumId", "artistId", "genreId", duration)
VALUES (uuid_generate_v4(), 'In and Out of Love', '', 0, (SELECT id FROM public.album WHERE title = 'Runaway'), (SELECT id FROM public.artist WHERE name = 'Bon Jovi'), (SELECT id FROM public.genre WHERE name = 'Rock'), 230);
INSERT INTO public.song
(id, title, video, plays, "albumId", "artistId", "genreId", duration)
VALUES (uuid_generate_v4(), 'So Young, So High', '', 0, (SELECT id FROM public.album WHERE title = 'Runaway'), (SELECT id FROM public.artist WHERE name = 'Bon Jovi'), (SELECT id FROM public.genre WHERE name = 'Rock'), 237);
INSERT INTO public.song
(id, title, video, plays, "albumId", "artistId", "genreId", duration)
VALUES (uuid_generate_v4(), 'Love Lies', '', 0, (SELECT id FROM public.album WHERE title = 'Runaway'), (SELECT id FROM public.artist WHERE name = 'Bon Jovi'), (SELECT id FROM public.genre WHERE name = 'Rock'), 233);
INSERT INTO public.song
(id, title, video, plays, "albumId", "artistId", "genreId", duration)
VALUES (uuid_generate_v4(), 'Born to Be My Baby', '', 0, (SELECT id FROM public.album WHERE title = 'Runaway'), (SELECT id FROM public.artist WHERE name = 'Bon Jovi'), (SELECT id FROM public.genre WHERE name = 'Rock'), 235);




INSERT INTO public.album
(id, title, photo, "year", "artistId")
VALUES (uuid_generate_v4(), 'Raining Blood', 'https://example.com/Slayer/raining-blod.jpg', 1986, (SELECT id FROM public.artist WHERE name = 'Slayer'));

INSERT INTO public.song
(id, title, video, plays, "albumId", "artistId", "genreId", duration)
VALUES (uuid_generate_v4(), 'Angel of Death', '', 0, (SELECT id FROM public.album WHERE title = 'Raining Blood'), (SELECT id FROM public.artist WHERE name = 'Slayer'), (SELECT id FROM public.genre WHERE name = 'Metal'), 291);
INSERT INTO public.song
(id, title, video, plays, "albumId", "artistId", "genreId", duration)
VALUES (uuid_generate_v4(), 'Piece by Piece', '', 0, (SELECT id FROM public.album WHERE title = 'Raining Blood'), (SELECT id FROM public.artist WHERE name = 'Slayer'), (SELECT id FROM public.genre WHERE name = 'Metal'), 254);
INSERT INTO public.song
(id, title, video, plays, "albumId", "artistId", "genreId", duration)
VALUES (uuid_generate_v4(), 'Necrophobic', '', 0, (SELECT id FROM public.album WHERE title = 'Raining Blood'), (SELECT id FROM public.artist WHERE name = 'Slayer'), (SELECT id FROM public.genre WHERE name = 'Metal'), 116);
INSERT INTO public.song
(id, title, video, plays, "albumId", "artistId", "genreId", duration)
VALUES (uuid_generate_v4(), 'Altar of Sacrifice', '', 0, (SELECT id FROM public.album WHERE title = 'Raining Blood'), (SELECT id FROM public.artist WHERE name = 'Slayer'), (SELECT id FROM public.genre WHERE name = 'Metal'), 170);
INSERT INTO public.song
(id, title, video, plays, "albumId", "artistId", "genreId", duration)
VALUES (uuid_generate_v4(), 'Jesus Saves', '', 0, (SELECT id FROM public.album WHERE title = 'Raining Blood'), (SELECT id FROM public.artist WHERE name = 'Slayer'), (SELECT id FROM public.genre WHERE name = 'Metal'), 260);
INSERT INTO public.song
(id, title, video, plays, "albumId", "artistId", "genreId", duration)
VALUES (uuid_generate_v4(), 'Criminally Insane', '', 0, (SELECT id FROM public.album WHERE title = 'Raining Blood'), (SELECT id FROM public.artist WHERE name = 'Slayer'), (SELECT id FROM public.genre WHERE name = 'Metal'), 230);
INSERT INTO public.song
(id, title, video, plays, "albumId", "artistId", "genreId", duration)
VALUES (uuid_generate_v4(), 'Reborn', '', 0, (SELECT id FROM public.album WHERE title = 'Raining Blood'), (SELECT id FROM public.artist WHERE name = 'Slayer'), (SELECT id FROM public.genre WHERE name = 'Metal'), 252);
INSERT INTO public.song
(id, title, video, plays, "albumId", "artistId", "genreId", duration)
VALUES (uuid_generate_v4(), 'Epidemic', '', 0, (SELECT id FROM public.album WHERE title = 'Raining Blood'), (SELECT id FROM public.artist WHERE name = 'Slayer'), (SELECT id FROM public.genre WHERE name = 'Metal'), 220);
INSERT INTO public.song
(id, title, video, plays, "albumId", "artistId", "genreId", duration)
VALUES (uuid_generate_v4(), 'Postmortem', '', 0, (SELECT id FROM public.album WHERE title = 'Raining Blood'), (SELECT id FROM public.artist WHERE name = 'Slayer'), (SELECT id FROM public.genre WHERE name = 'Metal'), 206);
INSERT INTO public.song
(id, title, video, plays, "albumId", "artistId", "genreId", duration)
VALUES (uuid_generate_v4(), 'Raining Blood', '', 0, (SELECT id FROM public.album WHERE title = 'Raining Blood'), (SELECT id FROM public.artist WHERE name = 'Slayer'), (SELECT id FROM public.genre WHERE name = 'Metal'), 253);

