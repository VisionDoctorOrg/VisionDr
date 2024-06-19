export interface IService<T> {
    create(data: T): Promise<T>;
    findAll(): Promise<T[]>;
    findOne(id: number): Promise<T | null>;
    findByEmailOrPhone(email: string, phone: string): Promise<T | null>;
  }


  