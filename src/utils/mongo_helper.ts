import { Types } from 'mongoose';

export function transformObjectId<T extends Record<string, unknown>>(
  query: T,
): Omit<T, 'id'> & { _id?: Types.ObjectId } {
  const newQuery = { ...query } as Omit<T, 'id'> & { _id?: Types.ObjectId };

  if ('id' in query) {
    const idValue = query.id;

    if (typeof idValue === 'string' && Types.ObjectId.isValid(idValue)) {
      newQuery._id = new Types.ObjectId(idValue);
    } else {
      throw new Error('Invalid id format');
    }

    delete newQuery.id;
  }

  return newQuery;
}
