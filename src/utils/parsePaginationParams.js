const parseNumber = (number, defaultNumber) => {
  const isNumber = typeof number === 'string';
  if (!isNumber) return defaultNumber;

  const parsedNumber = parseInt(number);
  if (Number.isNaN(parsedNumber)) return defaultNumber;
  return parsedNumber;
};

export const parsePaginationParams = (query) => {
  const { page, perPage } = query;

  const parsedPage = parseNumber(page, 1);
  const parsedPerPage = parseNumber(perPage, 10);

  return {
    page: parsedPage,
    perPage: parsedPerPage,
  };
};
