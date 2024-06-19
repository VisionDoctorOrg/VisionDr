export interface IRepository<T> {
  create(data: T, id?: string, i?: string): Promise<T>;
  findById(id: string): Promise<T | null>;
}
