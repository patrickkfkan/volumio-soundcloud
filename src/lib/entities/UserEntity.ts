interface UserEntity {
  id?: number;
  username?: string | null;
  fullname?: string | null;
  thumbnail?: string | null;
  permalink?: string | null;
  location?: string | null;
}

export default UserEntity;
