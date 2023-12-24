import { Inject, Injectable } from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';
import { UniqueCodeService } from './unique-code.service';
import { UniqueCode } from './entities/uniqueCode';
import { ShortLongMap } from './entities/shortLongMap';

@Injectable()
export class ShortLongMapService {

	@InjectEntityManager()
	private entityManager: EntityManager;

	@Inject(UniqueCodeService)
	private uniqueCodeService: UniqueCodeService;

	async getLongUrl(shortUrl: string) {
		const shortLongMap = await this.entityManager.findOneBy(ShortLongMap, { shortUrl });
		if(!shortLongMap) {
			return null;
		}
		return shortLongMap.longUrl;
	}

	async generate(longUrl: string) {
		// 如果存在长链，就返回压缩码
		const shortLongMap = await this.entityManager.findOneBy(ShortLongMap, { longUrl });
		if(shortLongMap) {
			return shortLongMap.shortUrl;
		}
		// 寻找未使用过的压缩码
		let uniqueCode = await this.entityManager.findOneBy(UniqueCode, { status: 0 });
		// 如果库内的压缩码已用完
		if(!uniqueCode) {
			uniqueCode = await this.uniqueCodeService.generateCode();
		}

		// 装填数据
		const map = new ShortLongMap();
		map.longUrl = longUrl;
		map.shortUrl = uniqueCode.code;

		// 插入映射表中
		await this.entityManager.insert(ShortLongMap, map);
		// 将压缩码状态修改为已使用
		await this.entityManager.update(UniqueCode, { id: uniqueCode.id }, { status: 1 });

		return uniqueCode.code;
	}
}
