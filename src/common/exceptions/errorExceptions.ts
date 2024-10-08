import { HttpException, HttpStatus } from '@nestjs/common';

export class NotFoundException extends HttpException {
  constructor(entity: string, id: string) {
    super(`${entity} with ID ${id} not found`, HttpStatus.NOT_FOUND);
  }
}

export class UserEmailExistException extends HttpException {
  constructor(entity: string) {
    super(`${entity} with email already exist`, HttpStatus.CONFLICT);
  }
}

export class UserPhoneExistException extends HttpException {
  constructor(entity: string) {
    super(`${entity} with phone number already exist`, HttpStatus.CONFLICT);
  }
}
