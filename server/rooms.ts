interface Room {
  user: string;
  route: string;
  password: string;
}

export const rooms: {[key: string]: Room} = {};