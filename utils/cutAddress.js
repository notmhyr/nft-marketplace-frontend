//cut the user's address to readable format in frontend
// eg: 0x03...5j19
export const cutAddress = (address) => {
  if (address) {
    return `${address.slice(0, 5)}...${address.slice(address.length - 4)}`;
  }
};
