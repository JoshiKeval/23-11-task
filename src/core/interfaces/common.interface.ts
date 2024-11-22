export enum Status {
  Active = 'Active',
  Inactive = 'Inactive',
}

export enum TaskStatus {
  ToDo = 'ToDo',
  InProgress = 'InProgress',
  Done = 'Done',
}

export type User = {
  id: string;
  status: string;
};

export enum Order {
  ASC = 'ASC',
  DESC = 'DESC',
}
