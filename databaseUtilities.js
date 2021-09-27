import bcrypt from 'bcrypt';

export async function newPassword(password) {
  try {
    return await bcrypt.hash(password, 10);
  } catch (error) {
    console.log(error);
  }
  return false;
}

export async function comparePassword(password, hash) {
  try {
    return await bcrypt.compare(password, hash);
  } catch (error) {
    console.log(error);
  }
  return false;
}
