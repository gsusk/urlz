import jwt from 'jsonwebtoken';

export const addToken = ({
  username,
  email,
}: {
  username: string;
  email: string;
}) => {
  return jwt.sign({ sub: username, email: email }, 'k', {
    expiresIn: '2 days',
    algorithm: 'HS256',
  });
};
