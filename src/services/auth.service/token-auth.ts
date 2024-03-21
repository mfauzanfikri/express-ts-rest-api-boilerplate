import jwt from 'jsonwebtoken';

type DecodedPayload = {
  id: number;
  username: string;
};

const accessTokenSecret = process.env.TOKEN_SECRET as string;
const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET as string;

export const generateAccessToken = ({
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

export const verifyAccessToken = (accessToken: string): DecodedPayload => {
  try {
    const decoded: any = jwt.verify(accessToken, accessTokenSecret);

    if (!decoded.id || !decoded.username) {
      throw new Error('accessToken is invalid');
    }

    return {
      id: decoded.id,
      username: decoded.username,
    };
  } catch (error) {
    throw new Error('accessTokenis invalid');
  }
};

export const verifyRefreshToken = (refreshToken: string): DecodedPayload => {
  try {
    const decoded: any = jwt.verify(refreshToken, refreshTokenSecret);

    if (!decoded.id || !decoded.username) {
      throw new Error('refreshToken is invalid');
    }

    return {
      id: decoded.id,
      username: decoded.username,
    };
  } catch (error) {
    throw new Error('refreshToken is invalid');
  }
};
