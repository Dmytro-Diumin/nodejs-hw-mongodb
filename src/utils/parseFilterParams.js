const parseType = (type) => {
  const isString = typeof type === 'string';
  if (!isString) return;

  const isKnownType = ['work', 'home', 'personal'].includes(type);
  if (isKnownType) return type;
};

const parseIsFavourite = (isFavourite) => {
  const isString = typeof isFavourite === 'string';
  if (!isString) return;
  const isCorrectFavourite = ['true', 'false'].includes(isFavourite);
  if (isCorrectFavourite) return Boolean(isFavourite);
  return;
};

export const parseFilterParams = (query) => {
  const { type, isFavourite } = query;

  const parsedType = parseType(type);
  const parsedIsFavourite = parseIsFavourite(isFavourite);

  return {
    type: parsedType,
    isFavourite: parsedIsFavourite,
  };
};
