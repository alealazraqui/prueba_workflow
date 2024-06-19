import { CustomDecorator, SetMetadata } from '@nestjs/common';
import { EPermissions } from '../enums/permissions.enum';

export const ACTIONS_KEY = 'actions';
// eslint-disable-next-line @typescript-eslint/naming-convention
export const RequirePermissions = (...actions: EPermissions[]): CustomDecorator => SetMetadata(ACTIONS_KEY, actions);
