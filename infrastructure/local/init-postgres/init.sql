-- monolith app
CREATE DATABASE spotify_monolith;
CREATE USER spotify_monolith WITH PASSWORD 'abc1234';
GRANT ALL PRIVILEGES ON DATABASE spotify_monolith TO spotify_monolith;

-- music_library
CREATE DATABASE music_library;
CREATE USER music_library WITH PASSWORD 'abc1234';
GRANT ALL PRIVILEGES ON DATABASE music_library TO music_library;

-- accounts
CREATE DATABASE accounts;
CREATE USER accounts WITH PASSWORD 'abc1234';
GRANT ALL PRIVILEGES ON DATABASE accounts TO accounts;

