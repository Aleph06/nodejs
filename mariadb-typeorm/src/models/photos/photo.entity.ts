import { Entity, Column, PrimaryGeneratedColumn, OneToOne, ManyToOne, ManyToMany } from 'typeorm';
import { PhotoMetadata } from '../photos-metadata/photo-metadata.entity';
import { Author } from '../authors/author.entity';
import { Album } from '../albums/album.entity';

@Entity()
export class Photo {
    @PrimaryGeneratedColumn()
    id: number;
    @Column({ length: 100 })
    name: string;
    @Column('text')
    description: string;
    @Column()
    filename: string;
    @Column('double', { default: 1 })
    views: number;
    @Column({ default: true })
    isPublished: boolean;
    @OneToOne(type => PhotoMetadata, photoMetadata => photoMetadata.photo, { cascade: true })
    metadata: PhotoMetadata;
    @ManyToOne(type => Author, author => author.photos)
    author: Author;
    @ManyToMany(type => Album, album => album.photos)
    albums: Album[];
}