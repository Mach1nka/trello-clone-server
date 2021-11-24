type BulkFilter = {
  _id: string;
};

export type BulkUpdate<T> = {
  updateOne: {
    filter: BulkFilter;
    update: T;
  };
};

export type BulkPosition = {
  position: number;
};
