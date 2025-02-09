
import { ExecutionContext, Injectable } from '@nestjs/common';

@Injectable()
export class isAdminGuard {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    // console.log(request.session.passport.user);
    return request.isAuthenticated();
  }
}
