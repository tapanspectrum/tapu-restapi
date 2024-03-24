import { PartialType } from '@nestjs/swagger';
import { CreateUserAuditDto } from './user-audit.dto';

export class UpdateUserAuditDto extends PartialType(CreateUserAuditDto) {}
