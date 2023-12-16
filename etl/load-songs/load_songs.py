import os
from minio import Minio
from minio.error import S3Error
import os

# Configurar las credenciales de AWS
access_key_id = "N6MihZ1IE4i60WhohE91"#os.environ.get('MINIO_ACCESS_KEY')
secret_access_key = "jI1rbJPxauGG8F7P6MCWEqk5j1Izdwg0A42kof3L"#os.environ.get('MINIO_SECRET_KEY')


def get_song_info(directory):
    song_info_list = []
    for root, dirs, files in os.walk(directory):
        parts = root.split(os.sep)
        if len(parts) > 3:
            genre = parts[-3]
            artist = parts[-2]
            album = parts[-1]
            for file in files:
                if file.endswith('.mp3'):
                    song = file
                    filepath = os.path.join(root, file)
                    song_info = {'genre': genre, 'artist': artist, 'album': album, 'song': song, 'filepath': filepath}
                    song_info_list.append(song_info)
    return song_info_list


def get_cover_info(directory):
    cover_info_list = []
    for root, dirs, files in os.walk(directory):
        for file in files:
            if file == 'cover.jpg':
                cover_object = f"{root}/{file}".replace(directory, '')
                coverpath = os.path.join(root, file)
                cover_info = {'object': cover_object[1:], 'filepath': coverpath}
                cover_info_list.append(cover_info)
    return cover_info_list


files = get_cover_info("/Users/benjamin/Repositories/nullpointer-excelsior/microservices-architecture-nestjs/etl/load-songs/library")
for x in files:
    print(x)

def main():
    # Create a client with the MinIO server playground, its access key
    # and secret key.
    client = Minio(
        "localhost:9000",
        secure=False,
        access_key=access_key_id,
        secret_key=secret_access_key
    )

    # Make 'asiatrip' bucket if not exist.
    found = client.bucket_exists("music-library")
    if not found:
        client.make_bucket("music-library")
    else:
        print("Bucket 'music-library' already exists")

    for song in get_song_info("/Users/benjamin/Repositories/nullpointer-excelsior/microservices-architecture-nestjs/etl/load-songs/library"):
        client.fput_object(
            "music-library", f"{song['genre']}/{song['artist']}/{song['album']}/{song['song']}", song['filepath'],
        )
    for cover in get_cover_info("/Users/benjamin/Repositories/nullpointer-excelsior/microservices-architecture-nestjs/etl/load-songs/library"):
        client.fput_object(
            "music-library", cover['object'], cover['filepath'],
        )


if __name__ == "__main__":
    try:
        main()
    except S3Error as exc:
        print("error occurred.", exc)