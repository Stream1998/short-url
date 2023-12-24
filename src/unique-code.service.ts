import { Injectable } from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';
import { generateRandomStr } from './utils';
import { UniqueCode } from './entities/uniqueCode';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class UniqueCodeService {

	@InjectEntityManager()
	private entityManager: EntityManager;

	// 定时任务：每 5s 执行一次
	@Cron(CronExpression.EVERY_5_SECONDS)
	async generateCode() {
		const str = generateRandomStr(6);
		const uniqueCode = await this.entityManager.findOneBy(UniqueCode, {
			code: str
		});
		if(!uniqueCode) {
			const code = new UniqueCode();
			code.code = str;
			code.status = 0;
			return this.entityManager.insert(UniqueCode, code);
		} else {
			return this.generateCode();
		}
	}

	// 定时任务：每天上午4点执行一次批量任务
	// 优化：每次生成都查表的话性能会不好，提前生成一批压缩码，用的时候直接取。
	@Cron(CronExpression.EVERY_DAY_AT_4AM)
	batchGenerateCode() {
		for(let i = 0; i < 10000; i++) {
			this.generateCode()
		}
	}
}

