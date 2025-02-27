import { CanActivate, ExecutionContext } from '@nestjs/common';
export declare class ScannerGuard implements CanActivate {
    canActivate(context: ExecutionContext): boolean;
}
