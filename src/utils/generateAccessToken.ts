import jwt from 'jsonwebtoken';

const generateAccessToken = ({
  id,
  username,
}: {
  id: number;
  username: string;
}) => {
  return jwt.sign({ id, username }, process.env.TOKEN_SECRET as jwt.Secret, {
    expiresIn: '8h',
  });
};

export default generateAccessToken;
