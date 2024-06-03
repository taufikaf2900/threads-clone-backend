import bcryptjs from 'bcryptjs';

const comparePassword = (plainPassword, hashedPassword) => {
  return bcryptjs.compareSync(plainPassword, hashedPassword);
};

export default comparePassword;
