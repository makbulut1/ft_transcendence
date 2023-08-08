import { Module } from '@nestjs/common';
import { DatabaseService } from '@/modules/database/database.service';

@Module({
	imports: [],
	controllers: [],
	providers: [DatabaseService],
	exports: [DatabaseService],
})
export class DatabaseModule {}
