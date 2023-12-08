import jwt from 'jsonwebtoken';

const generateAccessToken = ({
  id,
  username,
}: {
  id: number;
  username: string;
}) => {
  const accessToken = jwt.sign(
    { id, username },
    process.env.TOKEN_SECRET as jwt.Secret,
    {
      expiresIn: '1h',
    }
  );

  const refreshToken = jwt.sign(
    { id, username },
    process.env.REFRESH_TOKEN_SECRET as jwt.Secret,
    {
      expiresIn: '8h',
    }
  );

  return { accessToken, refreshToken };
};

export default generateAccessToken;
