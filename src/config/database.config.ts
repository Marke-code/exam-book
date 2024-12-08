import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const mongodbConfig: TypeOrmModuleOptions = {
  type: 'mongodb',
  host: 'localhost',
  port: 27017,
  database: 'reading_exam_system',
  entities: [__dirname + '/../**/*.entity{.ts,.js}'],
  synchronize: true, // 生产环境请设置为false
  useUnifiedTopology: true,
};
