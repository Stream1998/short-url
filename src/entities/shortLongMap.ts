import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class ShortLongMap {
	
	@PrimaryGeneratedColumn()
	id: number;

	@Column({
		length: 10,
		comment: '压缩码'
	})
	shortUrl: string;

	@Column({
		comment: '原始URL'
	})
	longUrl: string;

	@CreateDateColumn()
	createTime: string;
}