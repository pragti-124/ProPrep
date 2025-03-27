/**@type { import ("drizzle-kit").Config } */
export default {
    schema: "./utils/schema.js",
    dialect: 'postgresql',
    dbCredentials: {
        url: 'postgresql://neondb_owner:npg_N9OtCZGhmbJ5@ep-soft-bread-a51wh985-pooler.us-east-2.aws.neon.tech/ai-interview-mocker?sslmode=require',
    }
};