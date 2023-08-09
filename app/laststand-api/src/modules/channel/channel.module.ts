import { ChannelController } from '@/modules/channel/channel.controller';
import { ChannelService } from '@/modules/channel/channel.service';
import { DatabaseModule } from '@/modules/database/database.module';
import { Module } from '@nestjs/common';

@Module({
	imports: [DatabaseModule],
	controllers: [ChannelController],
	providers: [ChannelService],
	exports: [ChannelService],
})
export class ChannelModule {}
