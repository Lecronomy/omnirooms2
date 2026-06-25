import postgres from "postgres";

interface UserCreate {
  username: string;
  email: string;
  passwordHash: string;
}

const sql = postgres();

const create = async (userData: UserCreate) => {
  const result = await sql`
    INSERT INTO users (username, email, password_hash)
    VALUES (${userData.username}, ${userData.email}, ${userData.passwordHash})
    RETURNING id, username, email;
  `;
  return result[0];
};

const findByUsername = async (username: string) => {
  const result = await sql`
    SELECT * FROM users WHERE lower(trim(username)) = lower(trim(${username})) LIMIT 1;
  `;
  return result[0];
};

export { create, findByUsername };
