enum UserRole {
  Sponsor = "Sponsor",
  Entrepreneur = "Entrepreneur",
}
interface User {
  username: string;
  email: string;
  password: string;
}

interface UserIncludedUid {
  uid: number;
  username: string;
  email: string;
  password: string;
}

interface UserProfileDefault {
  birthdate: string;
  nationality: string;
  region: string;
  tel: string;
  interests: string;
  role: UserRole;
}
interface UserProfileIncludedUid {
  uid: number;
  birthdate: string;
  nationality: string;
  region: string;
  tel: string;
  interests: string;
  role: UserRole;
}
interface UserPayload {
  uid: number;
  username: string;
  email: string;
}

interface UserAndUserProfile {
  uid: number;
  username: string;
  email: string;
  joindate: string;
  birthdate: string;
  nationality: string;
  region: string;
  tel: string;
  interests: string;
  role: UserRole;
}

export {
  User,
  UserIncludedUid,
  UserProfileDefault,
  UserAndUserProfile,
  UserProfileIncludedUid,
  UserPayload,
};
