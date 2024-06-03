import bcryptjs from 'bcryptjs';

const encryptPassword = (plainPassword) => {
  return bcryptjs.hashSync(plainPassword, 10);
};

export default encryptPassword;
