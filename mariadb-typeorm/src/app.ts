import 'reflect-metadata';
import { createConnection } from 'typeorm';
import { Photo } from './models/photos/photo.entity';
import { PhotoMetadata } from './models/photos-metadata/photo-metadata.entity';
import { Author } from './models/authors/author.entity';
import { Album } from './models/albums/album.entity';


createConnection({
    type: 'mariadb',
    host: 'localhost',
    port: 3306,
    username: 'root',
    password: 'mdbadmin1',
    database: 'test',
    // entities: [__dirname+'./models/**/*.js'],
    // enable for ts-node
    // entities: [__dirname + './models/**/*.ts'],
    entities: [Photo, PhotoMetadata, Author, Album],
    synchronize: true,
    logging: false // ['query']
}).then(async connection => {
    console.log('MaribaDB connnected');

    // let photo = new Photo();
    // photo.name = 'Me and Bears';
    // photo.description = 'I am near polar bears';
    // photo.filename = 'photo-with-bears.jpg';
    // photo.views = 1;
    // photo.isPublished = true;

    // let photoRepository = connection.getRepository(Photo);

    // const photo_1 = await photoRepository.save(photo);
    // console.log('Photo has been saved. Photo id is', photo_1.id);

    // let photoToUpdate = await photoRepository.findOne(1);
    // if (photoToUpdate) {
    //     photoToUpdate.name = 'Me, my friends and polar bears';
    //     await photoRepository.save(photoToUpdate);
    // }

    // let firstPhoto = await photoRepository.findOne(1);
    // console.log('First photo from the db: ', firstPhoto);

    // let meAndBearsPhoto = await photoRepository.findOne({ name: 'Me and Bears' });
    // console.log('Me and Bears photo from the db: ', meAndBearsPhoto);

    // let allViewedPhotos = await photoRepository.find({ views: 1 });
    // console.log('All viewed photos: ', allViewedPhotos);

    // let allPublishedPhotos = await photoRepository.find({ isPublished: true });
    // console.log('All published photos: ', allPublishedPhotos);

    // if (firstPhoto) {
    //     let metadata = new PhotoMetadata();
    //     metadata.height = 640;
    //     metadata.width = 480;
    //     metadata.compressed = true;
    //     metadata.comment = 'cybershoot';
    //     metadata.orientation = 'portait';
    //     metadata.photo = firstPhoto; // this way we connect them
    //     let metadataRepository = connection.getRepository(PhotoMetadata);
    //     const metadata_1 = await metadataRepository.save(metadata);

    //     // done
    //     console.log('Metadata is saved' + metadata_1.id + ', and relation between metadata and photo is created in the database too');

    // }

    // let photos = await photoRepository.createQueryBuilder('photo')
    //     .innerJoinAndSelect('photo.metadata', 'metadata')
    //     .innerJoinAndSelect('photo.author', 'author')
    //     .getMany();
    // console.log('All photos: ', photos);


    // // create photo object
    // let newphoto = new Photo();
    // newphoto.name = 'Me and Bears';
    // newphoto.description = 'I am near polar bears';
    // newphoto.filename = 'photo-with-bears.jpg';
    // newphoto.isPublished = true;

    // // create photo metadata object
    // let metadata = new PhotoMetadata();
    // metadata.height = 640;
    // metadata.width = 480;
    // metadata.compressed = true;
    // metadata.comment = 'cybershoot';
    // metadata.orientation = 'portait';

    // newphoto.metadata = metadata; // this way we connect them

    // // saving a photo also save the metadata
    // const savedPhotoAndMetadata = await photoRepository.save(newphoto);

    // console.log('Photo is saved, photo metadata is saved too.', savedPhotoAndMetadata)

    // create a few albums
    // let album1 = new Album();
    // album1.name = 'Bears';
    // await connection.manager.save(album1);

    // let album2 = new Album();
    // album2.name = 'Me';
    // await connection.manager.save(album2);

    // // create a few photos
    // let photo = new Photo();
    // photo.name = 'Me and Bears';
    // photo.description = 'I am near polar bears';
    // photo.filename = 'photo-with-bears.jpg';
    // photo.albums = [album1, album2];
    // await connection.manager.save(photo);

    // // now our photo is saved and albums are attached to it
    // // now lets load them:
    // const loadedPhoto = await connection
    //     .getRepository(Photo)
    //     .findOne(1, { relations: ['albums'] });

    let photos = await connection
        .getRepository(Photo)
        .createQueryBuilder('photo') // first argument is an alias. Alias is what you are selecting - photos. You must specify it.
        .innerJoinAndSelect('photo.metadata', 'metadata')
        .leftJoinAndSelect('photo.albums', 'album')
        .where('photo.isPublished = true')
        .andWhere('(photo.name = :photoName OR photo.name = :bearName)')
        .orderBy('photo.id', 'DESC')
        .skip(0)
        .take(10)
        .setParameters({ photoName: 'Me, my friends and polar bears', bearName: 'Me and Bears' })
        .getMany();

    console.log('All photos: ', photos);


}).catch(error => console.log(error));