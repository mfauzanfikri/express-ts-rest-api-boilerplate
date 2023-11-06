import bcrypt from 'bcryptjs';

const validateUser = (password: string, hash: string) => {
  return bcrypt.compareSync(password, hash);
};

export default validateUser;
