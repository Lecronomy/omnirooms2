import postgres from "postgres";

interface PostCreate {
  userId: number;
  content: string;
}

const sql = postgres();

const create = async (postData: PostCreate) => {
  const result = await sql`
    INSERT INTO posts (user_id, content)
    VALUES (${postData.userId}, ${postData.content})
    RETURNING id, user_id, content, created_at;
  `;
  return result[0];
};

const findByUserId = async (userId: number) => {
  const result = await sql`
    SELECT id, user_id, content, created_at
    FROM posts
    WHERE user_id = ${userId}
    ORDER BY created_at DESC;
  `;
  return result;
};

const findByUsername = async (username: string) => {
  const result = await sql`
    SELECT p.id, p.user_id, p.content, p.created_at
    FROM posts p
    JOIN users u ON p.user_id = u.id
    WHERE lower(trim(u.username)) = lower(trim(${username}))
    ORDER BY p.created_at DESC;
  `;
  return result;
};

const deletePost = async (postId: number) => {
  const result = await sql`
    DELETE FROM posts WHERE id = ${postId} RETURNING id;
  `;
  return result[0];
};

export { create, findByUserId, findByUsername, deletePost };
